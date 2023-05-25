import { useMemo, Suspense } from "react";
import { matchRoutes, useLocation, Navigate } from "react-router-dom";
import { get } from "lodash";
import { Header, CFooter, Content } from "@/components";
import { userInfo } from "@/services/user";

const BLANK_LIST = ["/user/login", "~dev"];
const NO_AUTH_LIST = ["/user/login"];

const Layout = ({ routes, children }) => {
  const location = useLocation();
  const route = get(matchRoutes(routes, location), [0, "route"]);
  const isBlank = useMemo(() => {
    return route && BLANK_LIST.includes(route.path);
  }, [route]);
  const isAuth = useMemo(() => {
    return route && !NO_AUTH_LIST.includes(route.path);
  }, [route]);

  // 检测用户登录状态
  if (isAuth) {
    const user = userInfo.get();
    window.DBCJ_USER = user;
    if (!user) {
      return <Navigate to="/user/login" replace />;
    }
  }
  // 未匹配路由，默认跳转首页
  if (!route) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      {!isBlank && <Header routes={routes} />}
      <Suspense fallback={null}>
        <Content>{children}</Content>
      </Suspense>
      {!isBlank && <CFooter />}
    </>
  );
};

export default Layout;
