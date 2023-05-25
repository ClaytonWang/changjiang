/*
 * @Author: junshi clayton.wang@digitalbrain.cn
 * @Date: 2023-02-17 17:36:49
 * @LastEditors: junshi clayton.wang@digitalbrain.cn
 * @LastEditTime: 2023-02-20 19:01:51
 * @Description:
 */
import { Navigate, Route, Routes } from 'react-router-dom';
import UserList from './user/UserList';
import RoleList from './role/RoleList';

const BamRoutes = () => (
  <Routes>
    <Route path="" element={<Navigate to="user" />} />
    <Route path="user" element={<UserList />} />
    <Route path="role" element={<RoleList />} />
  </Routes>
);
export default BamRoutes;
