import cfg from '@/cfg';
import {
  PostAuthBody,
  GetTopicsParams,
  GetTopicsParamsResponse,
  PostAuthResponse,
} from '@/types/api';

const { frontTestServiceBaseURL } = cfg;

export const postAuth = async (body: PostAuthBody): Promise<PostAuthResponse> => {
  const response = await fetch(`http://${frontTestServiceBaseURL}/auth`, {
    method: 'post',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Пользователь с таким логином не зарегистрирован, проверьте правильность логина');
  }

  return response.text()
}

export const getTopics = async ({ jwt, login }: GetTopicsParams): Promise<GetTopicsParamsResponse> => {
  const response = await fetch(`http://${frontTestServiceBaseURL}/topics?${new URLSearchParams({token: jwt, login})}`);

  if (!response.ok) {
    throw Error(response.statusText);
  }

  return response.json();
}
