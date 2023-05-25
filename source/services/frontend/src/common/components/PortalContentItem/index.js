import { useState, useEffect } from 'react';
import { Form, Input, message, Upload, Modal, Card, Button } from 'antd';
import {
  PlusOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { fileSizeCheck, getBase64 } from '@/common/utils/util';
import { useAuth } from '@/common/hooks/useAuth';
import { isColor } from '@/common/utils/helper';
import { PORTALITEM } from '@/common/constants';

import './index.less';

const { TextArea } = Input;

const PortalContentItem = ({
  type,
  data,
  name,
  index,
  onRemove = () => {},
}) => {
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const [form] = Form.useForm();
  const { token } = useAuth();
  const _color = Form.useWatch('color', form);

  let _title = '';
  // eslint-disable-next-line default-case
  switch (type) {
    case PORTALITEM.BANNER:
      _title = `Banner ${index}`;
      break;
    case PORTALITEM.FEATURE:
      _title = `平台特点 ${index}`;
      break;
    case PORTALITEM.SPECIAL:
      _title = `平台亮点 ${index}`;
      break;
  }

  const beforeUpload = (file) => {
    fileSizeCheck(file, message);
  };

  useEffect(() => {
    form.setFieldsValue(data);
    const { title, img } = data;
    if (img) {
      setFileList([{ uid: '-1', name: title, status: 'done', url: img }]);
    }
  }, [data, form]);

  const handleCancelPreview = () => setPreviewOpen(false);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传图片
      </div>
    </div>
  );

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ file, fileList: newFileList }) => {
    const { status, response } = file;
    if (status === 'done' && response) {
      form.setFieldValue('img', response.result.url);
    }
    setFileList(newFileList);
  };

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 12,
    },
  };

  return (
    <Card className="content-update-form" title={`${_title}`} hoverable>
      {index !== 1 ? (
        <Button
          style={{ float: 'right' }}
          icon={<DeleteOutlined />}
          onClick={() => {
            onRemove(name);
          }}
        >
          删除
        </Button>
      ) : null}
      <Form {...layout} form={form} layout="vertical" name={name}>
        <Form.Item name="index" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="title"
          label="主标题"
          rules={[{ required: true }, { max: 20, message: '长度不超过20字符' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="sub_title"
          label="副标题"
          rules={[{ required: true }, { max: 80, message: '长度不超过80字符' }]}
        >
          <TextArea rows={4} placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="img"
          label="图片"
          rules={[{ required: true, message: '请上传图片' }]}
          tooltip={{
            title: '大小不超过20M，图片仅支持JPG、JPEG、PNG格式。',
            icon: <InfoCircleOutlined />,
          }}
        >
          <Upload
            accept="image/png,image/jpeg"
            multiple={false}
            action="/api/v1/content/upload/obs"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            headers={{
              Authorization: `Bearer ${token}`,
            }}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>
        {type === PORTALITEM.BANNER ? (
          <Form.Item
            name="link"
            label="链接"
            rules={[
              { required: false },
              {
                pattern:
                  /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/,
                message: '必须是链接!',
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
        ) : null}
        {type === PORTALITEM.FEATURE ? (
          <Form.Item
            name="color"
            label="背景颜色"
            placeholder="请输入"
            wrapperCol={{
              span: 4,
            }}
            rules={[
              { required: true },
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject(new Error(`请输入背景颜色!`));
                  }
                  if (!isColor(value)) {
                    return Promise.reject(new Error('请输入正确的颜色值！'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              prefix={
                <label
                  style={{
                    background: _color,
                    width: 20,
                    height: 20,
                    marginRight: 10,
                    border: '1px solid #ccc',
                  }}
                />
              }
            />
          </Form.Item>
        ) : null}
      </Form>

      <Modal open={previewOpen} footer={null} onCancel={handleCancelPreview}>
        <img
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </Card>
  );
};

export default PortalContentItem;
