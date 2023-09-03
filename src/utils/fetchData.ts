import { getTopics } from '@/api';
import { getAuthCookies, checkAuthCookies } from '@/utils/auth';

export const fetchTopics = () => {
  const cookiesExists = checkAuthCookies();

  if (!cookiesExists) throw Error('No authentication data');
  const cookies = getAuthCookies();

  return getTopics(cookies);
}
