import { type FC, Children, useMemo, useState, useEffect, isValidElement } from 'react';
import type { RoutesProps, RouteProps } from './types';
import { getCurrentPath } from './utils';
import { Route } from './route';
import { Link } from './Link';

const useCurrentPath = () => {
  const [currentPath, setCurrentPath] = useState(getCurrentPath());

  useEffect(() => {
    const handlePopState = () => setCurrentPath(getCurrentPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return currentPath;
};

const isRouteElement = (child: unknown): child is React.ReactElement<RouteProps> => {
  return isValidElement(child) && child.type === Route;
};

export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();

  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return routes.find((route) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return null;

  const { component: Component } = activeRoute.props;

  return <Component />;
};

export { Route, Link };
