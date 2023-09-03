import { useNavigate, useParams } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import Socket from '@/utils/chat';
import { ChatMessage } from '@/types/chat';
import ButtonUI from '@/components/UI/ButtonUI';
import styles from '@/styles/pages/chat.module.scss';
import InputUI from '@/components/UI/InputUI';
import Message from '@/components/Chat/Message';
import { InactivityTimer } from '@/utils/inactivityTimer';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';

let inactivityTimer: InactivityTimer;

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /////////////////////////////////////////////////////////////////////////////
  // WebSockets logic
  /////////////////////////////////////////////////////////////////////////////

  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const socket = new Socket(Number(id));
        const initialMessages = await socket.connect();

        setSocket(socket);
        setMessages(initialMessages);

        socket.subscribe('message', (chatMessage) => {
          setMessages((prevMessages) => [...prevMessages, chatMessage]);
        })
      } catch (err) {
        alert(err.message);
        navigate('/');
      }
    })()

    return () => {
      if (socket instanceof Socket) {
        socket.close();
      }
    }
  }, []);

  const sendMessage = () => {
    if (!socket) return;
    if (!message) return;

    const chatMessage = socket!.sendMessage(message);

    setMessages((prevMessages) => [...prevMessages, chatMessage]);
    setMessage(() => '');
  }


  /////////////////////////////////////////////////////////////////////////////
  // scroll to bottom
  /////////////////////////////////////////////////////////////////////////////

  const [chatElement, setChatElement] = useState<HTMLDivElement>();

  useEffect(() => {
    if (chatElement) {
      chatElement.scrollToItem(messages.length);
    }
  }, [messages, chatElement])


  /////////////////////////////////////////////////////////////////////////////
  // inactivity timer
  /////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    inactivityTimer = new InactivityTimer(() => {
      navigate('/');
    });

    inactivityTimer.start();

    return () => {
      inactivityTimer.stop();
    }
  }, [])

  /////////////////////////////////////////////////////////////////////////////

  return (
    <div className={ styles.container }>
      <h1>{ socket?.data.topicName }</h1>

      <div className={ styles.chat }>
        {!!messages.length && (
          <AutoSizer>
            {({height, width}) => (
              <List
                itemSize={90}
                height={height}
                itemCount={messages.length}
                width={width}
                ref={newRef => setChatElement(newRef) }
              >
                {({index, style}) => (
                  <div
                    style={{ ...style, display: 'flex', flexDirection: 'column', }}
                    key={ messages[index].id + index }
                  >
                    <Message
                      text={ messages[index].message }
                      login={ messages[index].login }
                      myLogin={ socket!.data.login! }
                    />
                  </div>

                )}
              </List>
            )}
          </AutoSizer>
        )}

        { (!messages.length && socket !== undefined) && (
          <div className={ styles.chatPlaceholder }>
            <div>There is no messages yet...</div>
          </div>
        ) }
      </div>

      <div className={ styles.footer }>
        <InputUI
          name="message"
          onChange={ (event: ChangeEvent<HTMLInputElement>) => setMessage(event.target.value) }
          placeholder="Pass your message here"
          className={ styles.input }
          onEnterPress={ sendMessage }
        />

        <ButtonUI
          onClick={ sendMessage }
          className={ styles.button }
        >
          Send Message
        </ButtonUI>
      </div>
    </div>
  );
};

export default Chat;
