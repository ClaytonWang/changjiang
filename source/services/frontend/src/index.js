/*
 * @Author: junshi clayton.wang@digitalbrain.cn
 * @Date: 2023-02-17 17:36:49
 * @LastEditors: junshi clayton.wang@digitalbrain.cn
 * @LastEditTime: 2023-02-20 11:27:32
 * @FilePath: /changjiang/source/services/frontend/src/index.js
 * @Description:
 */
import { createRoot } from 'react-dom/client';
import Router from '@/app/Router';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './common/api';
import './common/css/index.less';

moment.locale('zh-cn');
window.moment = moment;
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Router />);
