import { getAuthCookies } from '@/utils/auth';
import cfg from '@/cfg';
import {
  ChatInitialRequest,
  ChatMessage, ChatMessageRequest,
  ChatObservers, ChatObserversMap,
  InitialChatData,
  ObserversEventName, SocketData
} from '@/types/chat';


const { frontTestServiceBaseURL } = cfg;

export default class Socket {
  url = `ws://${frontTestServiceBaseURL}/chat`;
  socket: WebSocket | null;
  data: SocketData;
  observers: ChatObservers;

  constructor(topicId: number, url: string = `ws://${frontTestServiceBaseURL}/chat`) {
    this.url = url;
    this.socket = null;
    this.data = {
      topicId,
      login: getAuthCookies().login,
    };
    this.observers = {
      close: [],
      error: [],
      message: [],
    };
  }

  requestInitialData() {
    const initialMessage: ChatInitialRequest = {
      topics: this.data.topicId!,
      login: this.data.login!,
    };

    this.socket!.send(JSON.stringify(initialMessage));
  }

  close() {
    this.socket!.close();
  }

  handleInitialMessage(data: string, resolve: (initialData: ChatMessage[]) => void) {
    const initialData:InitialChatData = JSON.parse(data);
    const chatMessages = initialData.result.sort((msgA, msgB) => msgA.id - msgB.id);

    this.data.topicName = initialData.topics;

    this.initListeners();
    resolve(chatMessages);
  }

  // connect to socket and get initial messages
  async connect() {
    return new Promise((resolve: (initialData: ChatMessage[]) => void, reject) => {
      try {
        this.socket = new WebSocket(this.url);

        ///////////////////////////////////////////////////////////////////
        /////////////////// close socket on error/close ///////////////////
        ///////////////////////////////////////////////////////////////////

        const initialRejectionListener = () => {
          reject(new Error('WebSocket connection error'))
        }

        this.socket.addEventListener('error', initialRejectionListener);
        this.socket.addEventListener('close', initialRejectionListener);

        ///////////////////////////////////////////////////////////////////
        ///////////////////// get initial Messages ////////////////////////
        ///////////////////////////////////////////////////////////////////

        const initialMessageListener = (event) => {
          this.handleInitialMessage(event.data, resolve);
          // Remove after first usage
          this.socket!.removeEventListener('message', initialMessageListener);
          this.socket!.removeEventListener('error', initialRejectionListener);
          this.socket!.removeEventListener('close', initialRejectionListener);
        };

        this.socket.addEventListener('message', initialMessageListener);

        this.socket.addEventListener('open', () => {
          console.log('Socket connected');
          this.requestInitialData();
        });
      } catch (err) {
        reject(new Error('WebSocket connection error'));
      }
    });
  }

  initListeners() {
    if (this.socket === null) return;

    this.socket.addEventListener('message', this.onMessageListener);
    this.socket.addEventListener('error', this.onErrorListener);
    this.socket.addEventListener('close', this.onCloseListener);
  }

  removeEventListeners() {
    if (this.socket === null) return;

    this.socket.removeEventListener('message', this.onMessageListener);
    this.socket.removeEventListener('error', this.onErrorListener);
    this.socket.removeEventListener('close', this.onCloseListener);
  }

  clearObservers() {
    Object.keys(this.observers).forEach((eventName: ObserversEventName) => {
      this.observers[eventName] = [];
    })
  }

  onMessageListener = (event) => {
    this.observers['message'].forEach(cb => {
      cb(JSON.parse(event.data) as ChatMessage);
    })
  }

  onCloseListener = () => {
    console.log('socket closed');

    this.observers['close'].forEach(cb => {
      cb();
    })

    this.removeEventListeners();
    this.clearObservers();
  }

  onErrorListener = (err) => {
    console.log(err);

    this.observers['error'].forEach(cb => {
      cb(err.message);
    })
  }

  subscribe<EventName extends ObserversEventName>(eventName: EventName, cb: ChatObserversMap[EventName]) {
    this.observers[eventName].push(cb);
  }

  sendMessage(message: string): ChatMessage {
    const chatMessageRequest: ChatMessageRequest = {
      login: this.data.login!,
      topics: this.data.topicId!,
      message,
    };

    this.socket!.send(JSON.stringify(chatMessageRequest));

    return {
      id: Date.now(),
      login: this.data.login!,
      message,
    };
  }
}
