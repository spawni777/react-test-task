import { CSSProperties, ReactNode } from 'react';
import styles from '@/styles/ui/button-ui.module.scss';

interface Props {
  children: ReactNode;
  onClick: () => void;
  type?: 'submit' | 'reset' | 'button',
  style?: CSSProperties,
  className?: string;
}

const ButtonUI = ({
  children,
  onClick,
  type = 'button',
  style = {},
  className = '',
}: Props) => {
  return (
    <button
      className={ `${styles.btn} ${className}` }
      onClick={ onClick }
      style={ style }
      type={ type }
    >
      { children }
    </button>
  )
}

export default ButtonUI;
