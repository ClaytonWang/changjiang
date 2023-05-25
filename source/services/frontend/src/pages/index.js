import { Route, Routes } from 'react-router-dom';
import ProtectedLayout from '@/common/components/ProtectedLayout';
import SysmtemMng from '@/pages/sysmtem';
import ContentMng from '@/pages/content';
import './index.less';

const Pages = () => (
  <Routes>
    <Route path="/*" element={<ProtectedLayout />}>
      <Route path="system/*" element={<SysmtemMng />} />
      <Route path="content/*" element={<ContentMng />} />
    </Route>
  </Routes>
);

export default Pages;
