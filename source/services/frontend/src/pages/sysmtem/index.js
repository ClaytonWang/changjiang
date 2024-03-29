import { Layout } from 'antd';
import BreadcrumbNav from '@/common/components/BreadcrumbNav';
import Routes from './routes';

const SysmtemMng = () => (
  <Layout className="dbr-main-layout">
    <BreadcrumbNav />
    <Routes />
  </Layout>
);
export default SysmtemMng;
