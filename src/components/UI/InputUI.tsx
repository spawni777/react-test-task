import { HTMLInputTypeAttribute, CSSProperties, ChangeEvent, useRef } from 'react';
import '@/styles/ui/input-ui.module.scss';

interface Props {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  name: string,
  style?: CSSProperties,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  className?: string;
  onEnterPress: () => void;
}

const InputUI = ({
  type = 'text',
  placeholder = 'Username',
  name,
  style = {},
  onChange,
  className = '',
  onEnterPress = () => {},
}: Props) => {
  const input = useRef(null);

  const onKeyDown = ((event) => {
    if (event.key !== 'Enter') return;
    input.current.value = '';

    onEnterPress();
  });

  return (
    <input
      ref={input}
      type={type}
      placeholder={placeholder}
      name={name}
      onChange={onChange}
      style={style}
      className={className}
      autoComplete="off"
      onKeyDown={onKeyDown}
    />
  )
}

export default InputUI;
