import { useEffect, useState, useCallback } from 'react';
import { Button, Space, Card, message } from 'antd';
import api from '@/common/api';
import BannerList from './banner/BannerList';
import FeatureList from './feature/FeatureList';
import SpecialList from './special/SpecialList';
import { useContextProps } from '@/common/hooks/RoutesProvider';
import { InfoCircleOutlined } from '@ant-design/icons';
import { UNDEPLOY } from '@/common/constants';

const PortalList = () => {
  const setContextProps = useContextProps();
  const [bannerData, setBannerData] = useState([]);
  const [featureData, setFeatureData] = useState([]);
  const [specialData, setSpecialData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNeedPub, setIsNeedPub] = useState(false);

  const populateData = (list = []) => {
    setBannerData(list.filter((v) => v.category === 'banner'));
    setFeatureData(list.filter((v) => v.category === 'feature'));
    setSpecialData(list.filter((v) => v.category === 'beautiful'));
    return list.some((v) => v.state === UNDEPLOY);
  };

  const requestList = useCallback(async () => {
    setLoading(true);
    try {
      const { result } = await api.portalList({ pagesize: 100 });
      const _isNeedPub = populateData(result?.data);
      setIsNeedPub(_isNeedPub);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  const publishPortal = useCallback(async () => {
    setLoading(true);
    try {
      await api.publishPortal();
      requestList();
      setLoading(false);
      message.success('发布成功!');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [requestList]);

  const handlePreviewClicked = () => {};

  useEffect(() => {
    requestList();
    setContextProps({
      onPreview: handlePreviewClicked,
      onSubmit: publishPortal,
      isNeedPub,
    });
  }, [isNeedPub, publishPortal, requestList, setContextProps]);

  return (
    <>
      <Card title="Banner" hoverable style={{ cursor: 'default' }}>
        <BannerList tableData={bannerData} loading={loading} />
      </Card>
      <br />
      <Card title="平台特点" hoverable style={{ cursor: 'default' }}>
        <FeatureList tableData={featureData} loading={loading} />
      </Card>
      <br />
      <Card title="亮点说明" hoverable style={{ cursor: 'default' }}>
        <SpecialList tableData={specialData} loading={loading} />
      </Card>
    </>
  );
};

PortalList.context = ({ onPreview, onSubmit, isNeedPub }) => (
  <Space>
    {isNeedPub ? (
      <span style={{ color: '#bbb' }}>
        <InfoCircleOutlined />
        有新内容未发布
      </span>
    ) : null}

    <Button onClick={onPreview}>预览</Button>
    <Button type="primary" onClick={onSubmit} disabled={!isNeedPub}>
      发布
    </Button>
  </Space>
);

PortalList.path = '/content/portal';

export default PortalList;
