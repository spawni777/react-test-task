import InputUI from '@/components/UI/InputUI';
import styles from '@/styles/pages/login.module.scss';
import ButtonUI from '@/components/UI/ButtonUI';
import { ChangeEvent, useState } from 'react';
import { authenticate } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    try {
      await authenticate({ login, password })

      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className={ styles.login }>
      <h1>Login</h1>
      <form method="post">
        <InputUI
          type="text"
          name="login"
          placeholder="Login"
          style={ { maxWidth: '600px' } }
          onChange={ (event: ChangeEvent<HTMLInputElement>) => setLogin(event.target.value) }
          onEnterPress={signIn}
        />
        <InputUI
          type="password"
          name="password"
          placeholder="Password"
          style={ { maxWidth: '600px' } }
          onChange={ (event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value) }
          onEnterPress={signIn}
        />
        <ButtonUI
          style={ { maxWidth: '600px' } }
          onClick={ signIn }
        >
          Login
        </ButtonUI>
      </form>
    </div>
  )
}

export default Login;
