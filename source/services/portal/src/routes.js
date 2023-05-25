import { lazy, useMemo } from "react";
import { Route, useLocation } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Model = lazy(() => import("./pages/Model"));
const ModelDetail = lazy(() => import("./pages/Model/Detail"));
const Login = lazy(() => import("./pages/User/Login"));

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    title: "模型",
    path: "/model",
    component: Model,
  },
  {
    path: "/model/:id",
    component: ModelDetail,
    menuKey: "/model",
  },
  {
    path: "/user/login",
    component: Login,
  },
];

const getRoutes = (config) => {
  const list = [];
  for (const item of config) {
    const Comp = item.component;
    list.push(<Route key={item.path} path={item.path} element={<Comp />} />);
  }
  return list;
};

const ReactRouterScroll = () => {
  const location = useLocation();
  useMemo(() => {
    if (location.hash) {
      window.setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({
            behavior: "auto",
          });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);
};

export { routes, getRoutes, ReactRouterScroll };
