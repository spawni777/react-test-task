import { RouterType } from '@/types/router';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Topics from '@/pages/Home/Topics';
import Chat from '@/pages/Home/Chat';
import NotFound from '@/pages/NotFound/NotFound';

const pagesData: RouterType[] = [
  {
    path: '',
    element: <Home/>,
    title: 'home',
    secured: true,
    children: [
      {
        path: '',
        element: <Topics/>,
        title: 'topics',
      },
      {
        path: ':id',
        element: <Chat/>,
        title: 'chat',
      },
    ],
  },
  {
    path: '/login',
    element: <Login/>,
    title: 'login',
    secured: false,
  },
  {
    path: '*',
    element: <NotFound/>,
    title: 'notFound',
    secured: true,
  }
];

export default pagesData;
