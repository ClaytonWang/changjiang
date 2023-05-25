import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/common/api';
import { useLocalStorage } from './useLocalStorage';
import { message } from 'antd';
import { populatePmsList } from '@/common/utils/util';
import { get } from 'lodash';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user', null);
  const [token, setToken] = useLocalStorage('token', null);
  const navigate = useNavigate();
  const localToken = JSON.parse(window.localStorage.getItem('token'));
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // 手动比较context中的token与实际localStorage的token是否一致，覆盖手动清理localStorage信息的情况。
    if (localToken !== token) {
      setToken(localToken);
    }
  }, [token, localToken]);

  const updateUser = useCallback((user) => {
    let sourcePms = get(user, 'permissions', []);
    const popPmsRslt = populatePmsList(sourcePms);
    const selectedValuse = popPmsRslt.map(({ pmsValues }) => ({
      pms: pmsValues.map(({ name }) => name),
    }));
    let permissions = [];
    for (const item of selectedValuse) {
      permissions = [...permissions, ...item.pms];
    }
    setUser({ ...user, permissions });
  }, []);

  const requestAccount = useCallback(async () => {
    try {
      const data = await api.settingsAccount();
      updateUser(data.result);
      return Promise.resolve();
    } catch (error) {
      console.log(error);
      if (error === 401) {
        // token过期
        setToken(null);
        message.error('用户登录失效，请重新登录！');
      }
      return Promise.reject(error);
    }
  }, [updateUser]);

  // 登陆
  const login = async (data) => {
    try {
      const { result } = await api.login(data);
      const { token } = result;
      if (token) {
        setToken(token);
      }
      // 登陆成功后，跳转到首页
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  // 登出
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const hasPermission = useCallback(
    (required) => {
      const permissions = get(user, 'permissions', []);
      return permissions.indexOf(required) > -1 ? children : null;
    },
    [user]
  );

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      requestAccount,
      hasPermission,
    }),
    [token, user, login, logout, requestAccount]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
