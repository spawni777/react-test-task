import { ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthCookies } from '@/utils/auth';

interface Props {
  element: ReactElement,
  secured: boolean,
  path: string,
}

const AuthMiddleware = ({ element, secured, path }: Props) => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(!secured);

  useEffect(() => {
    const isAuthenticated = checkAuthCookies()
    setAuthenticated(isAuthenticated);

    if (!isAuthenticated && secured) {
      navigate('/login');
    }

    if (isAuthenticated && path === '/login') {
      navigate('/');
    }
  }, [navigate, path, secured]);

  if (secured) {
    return authenticated ? element : null;
  }
  if (path === '/login') {
    return authenticated ? null : element;
  }

  return element;
}

export default AuthMiddleware;
