import Cookies from 'js-cookie';
import cfg from '@/cfg';
import { postAuth } from '@/api';
import { PostAuthBody } from '@/types/api';
import { AuthCookies } from '@/types/auth';

const { authJWTCookieName, authLoginCookieName } = cfg;

export const getAuthCookies = (): AuthCookies => {
  return {
    jwt: Cookies.get(authJWTCookieName) || '',
    login: atob(Cookies.get(authLoginCookieName) || ''),
  };
}

export const checkAuthCookies = () => {
  const cookies = getAuthCookies();

  return !!cookies.jwt && !!cookies.login;
}

export const authenticate = async ({login, password}: PostAuthBody) => {
  const [
    encryptedLogin,
    encryptedPassword,
  ] = [
    btoa(login),
    btoa(password),
  ]

  const jwt = await postAuth({ login: encryptedLogin, password: encryptedPassword });

  Cookies.set(authJWTCookieName, jwt, {
    // secure: true,
    sameSite: 'strict',
    expires: 7,
  });

  Cookies.set(authLoginCookieName, btoa(login), {
    // secure: true,
    sameSite: 'strict',
    expires: 7,
  });
}

export const deauthenticate = () => {
  Cookies.remove(authJWTCookieName);
  Cookies.remove(authLoginCookieName);
}
