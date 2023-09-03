import { ReactNode } from 'react';

export interface RouteType {
  title: string;
  path: string;
  element: ReactNode;
  secured?: boolean;
}

export interface RouterType extends RouteType{
  children?: RouteType[];
}
