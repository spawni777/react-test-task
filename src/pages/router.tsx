import { Route, Routes } from 'react-router-dom';
import { RouterType } from '@/types/router';
import pagesData from '@/pages/pagesData';
import AuthMiddleware from '@/middlewares/AuthMiddleware';

const Router = () => {
  const pageRoutes = pagesData.map(({ path, title, element, secured, children }: RouterType) => {

    return (
      <Route
        key={title}
        path={`/${path}`}
        Component={() => (
          <AuthMiddleware
            element={element}
            secured={!!secured}
            path={path}
          />
        )}
      >
        {children && children.map(({path, title, element}) => (
          <Route
            key={title}
            path={`/${path}`}
            element={element}
          />
        ))}
      </Route>
    )
  });

  return <Routes>{pageRoutes}</Routes>;
};

export default Router;
