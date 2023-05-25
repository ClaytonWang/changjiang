/*
 * @Author: junshi clayton.wang@digitalbrain.cn
 * @Date: 2023-01-31 15:07:28
 * @LastEditors: junshi clayton.wang@digitalbrain.cn
 * @LastEditTime: 2023-02-20 14:08:43
 * @FilePath: /huanghe/source/services/frontend/src/app/Router.js
 * @Description: Router Entry
 */
import { AuthProvider } from '@/common/hooks/useAuth';
import { MultiProvider } from '@/common/hooks/MultiProvider';
import { RoutesProvider } from '@/common/hooks/RoutesProvider';
import { App as AntApp, ConfigProvider } from 'antd';
import App from '@/app';
import { HistoryRouter, history } from './history';
import locale from 'antd/es/locale/zh_CN';
import { theme1 } from '../common/utils/theme';
import './index.less';

const Router = () => (
  <HistoryRouter history={history}>
    <MultiProvider
      providers={[
        <ConfigProvider locale={locale} theme={theme1} key="config" />,
        <AuthProvider history={history} key="auth" />,
        <RoutesProvider key="routes" />,
      ]}
    >
      <AntApp>
        <App />
      </AntApp>
    </MultiProvider>
  </HistoryRouter>
);
export default Router;
