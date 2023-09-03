import styles from '@/styles/components/message.module.scss'
import { CSSProperties } from 'react';

interface Props {
  text: string;
  login: string;
  myLogin: string;
  style?: CSSProperties;
}

const Message = ({text, login, myLogin, style}: Props) => {
  const isMyMessage = login === myLogin;

  return (
    <div
      className={`${styles.message} ${isMyMessage ? styles.myMessage : ''}`}
      style={style}
    >
      <div className={ styles.login }>{ login }</div>
      <div className={ styles.text }>{ text }</div>
    </div>
  );
}

export default Message;
