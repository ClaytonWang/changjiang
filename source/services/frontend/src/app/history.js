/*
 * @Author: junshi clayton.wang@digitalbrain.cn
 * @Date: 2023-02-17 17:36:49
 * @LastEditors: junshi clayton.wang@digitalbrain.cn
 * @LastEditTime: 2023-02-20 16:55:16
 * @FilePath: /changjiang/source/services/frontend/src/app/history.js
 * @Description:
 */
import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';

const baseURL = new URL(location.origin);

export const history = createBrowserHistory({
  basename: baseURL.pathname || '/',
});

export const HistoryRouter = ({ history, children }) => {
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  React.useLayoutEffect(() => {
    history.listen(setState);
  }, [history]);

  return React.createElement(
    Router,
    Object.assign({ children, navigator: history }, state)
  );
};
