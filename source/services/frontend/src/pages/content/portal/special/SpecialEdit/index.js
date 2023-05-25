import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import { Form, message, Space, Button } from 'antd';
import api from '@/common/api';
import { get } from 'lodash';
import { useContextProps } from '@/common/hooks/RoutesProvider';
import { PlusOutlined } from '@ant-design/icons';
import { AuthButton } from '@/common/components';
import PERMISSION_MAP from '@/common/utils/permissions';
import PortalContentItem from '@/common/components/PortalContentItem';
import { PORTALITEM } from '@/common/constants';

const SpecialEdit = () => {
  const [dataList, setDataList] = useState([]);
  const setContextProps = useContextProps();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const updateBanners = async (values) => {
    try {
      await api.specialCreate(values);
      message.success('保存成功!');
      backToList();
    } catch (error) {
      console.log(error);
    }
  };

  const backToList = () => {
    navigate('/content/portal', { state: null });
  };

  const handleCancelClicked = () => {
    backToList();
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setContextProps({
      onCancel: handleCancelClicked,
      onSubmit: () => {
        form.submit();
      },
    });
  }, []);

  useEffect(() => {
    const { data = [] } = get(location, 'state', {});
    setDataList(data);
  }, [location]);

  const handleAddBannerItem = useCallback(() => {
    const item = {
      category: PORTALITEM.SPECIAL,
      color: null,
      created_at: new Date(),
      id: Math.random().toString(36).slice(-8),
      img: null,
      index: dataList.length + 1,
      link: '',
      state: 'undeploy',
      sub_title: '',
      title: '',
      updated_at: new Date(),
    };

    setDataList([...dataList, item]);
  }, [dataList]);

  const onRemoveItem = (name) => {
    dataList.splice(
      dataList.findIndex((v) => `form_${v.id}` === name),
      1
    );

    const list = dataList.map((v, index) => ({ ...v, index: index + 1 }));
    setDataList([...list]);
  };

  const onFormFinish = async (_, { forms }) => {
    const validateList = Object.values(forms).map(async (v) => {
      try {
        return await v.validateFields();
      } catch (e) {
        const path = e.errorFields[0].name[0];
        const msg = e.errorFields[0].errors[0];
        v.scrollToField(path, { behavior: 'smooth' });
        message.error(msg);
        return false;
      }
    });
    const result = await Promise.all(validateList);
    const isChecked = result.every((v) => v);
    if (isChecked) {
      updateBanners(result);
    }
  };

  return (
    <Form.Provider onFormFinish={onFormFinish}>
      <QueueAnim type={['top', 'bottom']}>
        {dataList.map((vaule) => (
          <div key={vaule.id}>
            <PortalContentItem
              type={PORTALITEM.SPECIAL}
              data={vaule}
              name={`form_${vaule.id}`}
              index={vaule.index}
              onRemove={onRemoveItem}
            />
          </div>
        ))}
      </QueueAnim>

      {dataList.length < 4 ? (
        <AuthButton
          required={PERMISSION_MAP.CONTENT_PORTAL_EDIT}
          style={{ float: 'left', width: 200 }}
          onClick={handleAddBannerItem}
        >
          <PlusOutlined />
          新建平台亮点
        </AuthButton>
      ) : null}
      <Form form={form}></Form>
    </Form.Provider>
  );
};

SpecialEdit.context = ({ onCancel, onSubmit }) => (
  <Space>
    <Button onClick={onCancel}>取消</Button>
    <AuthButton
      required={PERMISSION_MAP.CONTENT_PORTAL_EDIT}
      type="primary"
      onClick={onSubmit}
    >
      保存
    </AuthButton>
  </Space>
);

SpecialEdit.path = '/content/portal/special/edit';

export default SpecialEdit;
