import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { get, find } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import Icon from '@ant-design/icons';
import HeaderNav from '@/common/components/HeaderNav';
import { useAuth } from '@/common/hooks/useAuth';
import { tranverseTree, isLeafNode } from '@/common/utils/helper';
import { menuItemsConfig } from '@/common/utils/config';
import Icons from '@/common/components/Icon';
import useLocationChange from '@/common/hooks/useLocationChange';
import './index.less';

const { Sider, Content } = Layout;

const ProtectedLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState([]);

  const permissions = useMemo(() => get(user, 'permissions', []), [user]);

  const getMenuItems = useCallback(
    (menus) => {
      const result = [];
      menus.forEach((menu) => {
        const item = { ...menu };
        if (item.children) {
          item.children = getMenuItems(item.children);
        }
        const hasPms = permissions.findIndex(
          (v) => v.indexOf(item.permission) > -1
        );
        if (!item.permission || hasPms > -1) {
          const path = item.key.split('.').join('/');
          item.label =
            (!item.children && <Link to={path}>{item.label}</Link>) ||
            item.label;
          if (item.icon) {
            item.icon = <Icon component={Icons[item.icon]} />;
          }
          result.push(item);
        }
      });
      return result;
    },
    [permissions]
  );

  const items = getMenuItems(menuItemsConfig);

  const defaultOpenKeys = useMemo(() => {
    const result = [];
    if (items.length > 0) {
      tranverseTree(items, (item) => {
        const { key } = item;
        if (!isLeafNode(item)) {
          result.push(key);
        }
      });
    }
    return result;
  }, [items]);

  const defaultSelectedKeys = useMemo(() => {
    const result = [];
    if (items.length > 0 && defaultOpenKeys.length > 0) {
      const firstMenu = defaultOpenKeys[0];
      const item = find(items, ['key', firstMenu]);
      const pathname = item.children[0].key;
      result.push(pathname);
    }
    return result;
  }, [defaultOpenKeys, items]);

  const getSelectedKeys = (pathname) => {
    let relativeKey = pathname;
    if (!pathname) {
      return [];
    }
    tranverseTree(items, (item) => {
      const { key: menuKey } = item;
      if (isLeafNode(item) && pathname.includes(menuKey)) {
        relativeKey = menuKey;
      }
    });
    return [relativeKey];
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useLocationChange((location, prevLocation) => {
    if (location.pathname === '/') {
      const pathname =
        (defaultSelectedKeys.length > 0 && defaultSelectedKeys[0]) || '';
      const path = pathname.split('.').join('/');
      navigate(path);
    }
    if (!prevLocation || prevLocation.pathname !== location.pathname) {
      const key = location.pathname
        .split('/')
        .filter((value) => value)
        .join('.');
      setSelectedKeys(getSelectedKeys(key));
    }
  });

  return (
    <Layout className="protected-layout">
      <HeaderNav />
      <Layout>
        <Sider>
          <Menu
            defaultOpenKeys={defaultOpenKeys}
            mode="inline"
            selectedKeys={selectedKeys}
            items={items}
            className="dbr-sider-menu"
          />
        </Sider>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default ProtectedLayout;
