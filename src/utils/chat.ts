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
  socket: WebSocket;
  data: SocketData = {};
  observers: ChatObservers = {
    close: [],
    error: [],
    message: [],
  };


  constructor(topicId: number, url: string = `ws://${frontTestServiceBaseURL}/chat`) {
    this.data.topicId = topicId;
    this.url = url;

    const { login } = getAuthCookies();

    if (!login) return;
    this.data.login = login;
  }

  requestInitialData() {
    const initialMessage: ChatInitialRequest = {
      topics: this.data.topicId!,
      login: this.data.login!,
    };

    this.socket.send(JSON.stringify(initialMessage));
  }

  close() {
    this.socket.close();
  }

  async connect() {
    return new Promise((resolve: (initialData: ChatMessage[]) => void, reject) => {
      try {
        this.socket = new WebSocket(this.url);

        const initialRejectionListener = () => {
          reject(new Error('WebSocket connection error'))
        }

        this.socket.addEventListener('error', initialRejectionListener);
        this.socket.addEventListener('close', initialRejectionListener);

        ///////////////////////////////////////////////////////////////////
        ///////////////////// get initial Messages ////////////////////////
        ///////////////////////////////////////////////////////////////////

        const initialMessageListener = (event) => {
          this.socket.removeEventListener('message', initialMessageListener);
          this.socket.removeEventListener('error', initialRejectionListener);
          this.socket.removeEventListener('close', initialRejectionListener);

          const data = JSON.parse(event.data) as InitialChatData;
          const chatMessages = data.result.sort((msgA, msgB) => msgA.id - msgB.id);

          this.data.topicName = data.topics;

          this.initListeners();
          resolve(chatMessages);
        }

        this.socket.addEventListener('message', initialMessageListener);

        this.socket.addEventListener('open', () => {
          console.log('socket connected');
          this.requestInitialData();
        });

      } catch (err) {
        reject(new Error('WebSocket connection error'));
      }
    })
  }

  initListeners() {
    this.socket.addEventListener('message', this.onMessageListener);
    this.socket.addEventListener('error', this.onErrorListener);
    this.socket.addEventListener('close', this.onCloseListener);
  }

  removeEventListeners() {
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

  // unsubscribe<EventName extends ObserversEventName>(eventName: EventName, cb: ChatObserversMap[EventName]) {
  //   this.observers[eventName] = this.observers[eventName]
  //     .filter((observer: ChatObserversMap[EventName]) => {
  //       return observer !== cb;
  //     });
  // }

  sendMessage(message: string): ChatMessage {
    const chatMessageRequest: ChatMessageRequest = {
      login: this.data.login!,
      topics: this.data.topicId!,
      message,
    };

    this.socket.send(JSON.stringify(chatMessageRequest));

    return {
      id: Date.now(),
      login: this.data.login!,
      message,
    };
  }
}
