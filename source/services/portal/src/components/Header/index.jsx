import { useCallback, useMemo } from "react";
import { Menu, Avatar, Dropdown } from "antd";
import { Link, matchRoutes, useLocation, useNavigate } from "react-router-dom";
import { get, each } from "lodash";
import { useScrolled } from "@/utils";
import { userInfo } from "@/services/user";
import "./index.less";

const Header = ({ routes }) => {
  const location = useLocation();
  const selectedKeys = useMemo(() => {
    const [{ route }] = matchRoutes(routes, location);
    return route ? [route.menuKey || route.path] : [];
  }, [routes, location]);
  const scrolled = useScrolled();
  const navigate = useNavigate();
  const user = useMemo(() => {
    return userInfo.get();
  }, []);
  const handleAvatarClick = useCallback(
    (e) => {
      if (e.key === "logout") {
        userInfo.remove();
        navigate("/user/login", { replace: true });
      }
    },
    [navigate]
  );
  const menus = useMemo(() => {
    const res = [];
    each(routes, (item) => {
      if (item.title) {
        res.push({
          key: item.path,
          label: (
            <Link to={item.path}>
              {item.menuRender ? item.menuRender(item) : item.title}
            </Link>
          ),
        });
      }
    });
    return res;
  }, [routes]);
  const headerScrollClass = useMemo(() => {
    return scrolled ? "brain-header-scrolled" : "brain-header-fixed";
  }, [scrolled]);

  return (
    <div className={`brain-header ${headerScrollClass}`}>
      <div className="navbar brain-wrapper">
        <div className="navbar-logo">
          <Link to="/">
            <img src="/logo_cj.png" alt="logo" />
            <span className="title">决策智能开放平台</span>
          </Link>
        </div>
        <Menu mode="horizontal" items={menus} selectedKeys={selectedKeys} />
        <Dropdown
          menu={{
            items: [
              {
                key: "logout",
                label: "登出",
              },
            ],
            onClick: handleAvatarClick,
          }}
        >
          <Avatar
            style={{
              cursor: "pointer",
              backgroundColor: "#7B68EE",
            }}
            size={20}
          >
            {get(user, ["name", 0])}
          </Avatar>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
