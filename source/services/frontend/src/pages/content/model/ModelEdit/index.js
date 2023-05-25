import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  message,
  Select,
  Tooltip,
  Space,
  Card,
  Row,
  Col,
  Upload,
  Modal,
  Dropdown,
} from 'antd';
import api from '@/common/api';
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { CREATE, EDIT } from '@/common/constants';
import { useContextProps } from '@/common/hooks/RoutesProvider';
import { AuthButton } from '@/common/components';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import PERMISSION_MAP from '@/common/utils/permissions';
import { fileSizeCheck, getBase64 } from '@/common/utils/util';
import { useAuth } from '@/common/hooks/useAuth';
import './index.less';

const { TextArea } = Input;

const ModelEdit = () => {
  const [mdDesc, setMdDesc] = useState('');
  const [tagDataSource, setTagDataSource] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const setContextProps = useContextProps();
  const [type, setType] = useState(CREATE);
  const navigate = useNavigate();
  const urlParams = useParams();
  const [form] = Form.useForm();
  const { token } = useAuth();

  const requestTags = async () => {
    try {
      const { result } = await api.tagListAll();
      setTagDataSource(result);
    } catch (error) {
      console.log(error);
    }
  };

  const requestModel = async (params) => {
    try {
      console.log(params);
      const { result } = await api.modelDetail({ ...params });
      const { description = '', img = '', title = '' } = result;
      setMdDesc(description);
      setFileList([{ uid: '-1', name: title, status: 'done', url: img }]);
      const data = { ...result, tag: result.tag.map((v) => v.id) };
      form.setFieldsValue(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createModel = async (values) => {
    try {
      await api.modelCreate(values);
      message.success('创建成功！');
      backToList();
    } catch (error) {
      console.log(error);
    }
  };

  const updateModel = async (values) => {
    try {
      await api.modelUpdate(values);
      message.success('保存成功!');
      backToList();
    } catch (error) {
      console.log(error);
    }
  };

  const backToList = () => {
    navigate('/content/model', { state: null });
  };

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    const { id = null, action = CREATE } = urlParams;

    const data = { ...values, description: mdDesc };
    if (action === EDIT && id) {
      updateModel({ id, ...data });
    } else {
      createModel(data);
    }
  };

  const handleSubmitFailed = ({ errorFields }) => {
    message.error(errorFields[0].errors[0]);
    console.log(errorFields);
  };

  const handleCancelClicked = () => {
    backToList();
  };

  // eslint-disable-next-line no-unused-vars
  const handleCreateTagClicked = () => {
    navigate('/content/tag', {
      state: {
        params: { showCreate: true },
      },
    });
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    requestTags();
    setContextProps({
      onCancel: handleCancelClicked,
      onSubmit: () => {
        form.submit();
      },
      onPublish: ({ key }) => {
        message.success('发布成功!');
        backToList();
        console.log(key);
      },
    });
  }, []);

  useEffect(() => {
    const { id = null, action = CREATE } = urlParams;
    if (action === EDIT) {
      requestModel({ id });
    }
    setType(type);
  }, [urlParams]);

  const beforeUpload = (file) => {
    fileSizeCheck(file, message);
  };

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

  return (
    <>
      <Card className="model-update" title="基本信息">
        <Row>
          <Col span={12}>
            <Form
              className="model-update-form"
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              onFinishFailed={handleSubmitFailed}
              onCancel={handleCancelClicked}
            >
              <Form.Item
                name="index"
                label="顺序"
                rules={[
                  { required: true, message: '请输入显示的顺序!' },
                  {
                    pattern: /^[0-9]*$/,
                    message: '必须是数字!',
                  },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item
                name="title"
                label="模型名称"
                rules={[
                  { required: true },
                  { max: 20, message: '长度不超过20字符' },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item
                name="sub_title"
                label="副标题"
                rules={[
                  { required: true },
                  { max: 80, message: '长度不超过80字符' },
                ]}
              >
                <TextArea rows={4} placeholder="请输入" />
              </Form.Item>
              <Form.Item name="tag" label="标签">
                <Select
                  mode="multiple"
                  placeholder="请选择标签"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children ?? '').includes(input)
                  }
                  notFoundContent={
                    <div className="select-notfound">
                      <span>暂无标签</span>,
                      <AuthButton
                        required={PERMISSION_MAP.CONTENT_TAG_EIDT}
                        type="link"
                        onClick={handleCreateTagClicked}
                      >
                        点击新建
                      </AuthButton>
                    </div>
                  }
                  options={tagDataSource.map(({ id, tag = '-' }) => ({
                    label: <Tooltip title={tag}>{tag}</Tooltip>,
                    value: id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                name="img"
                label="展示图片"
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
            </Form>
          </Col>
        </Row>
      </Card>

      <Card className="model-update" title="模型说明">
        <Row>
          <Col span={24}>
            <MDEditor
              height={400}
              value={mdDesc}
              onChange={setMdDesc}
              previewOptions={{
                rehypePlugins: [[rehypeSanitize]],
              }}
              textareaProps={{
                placeholder: '请输入Markdown文本...',
              }}
            />
          </Col>
        </Row>
      </Card>
      <Modal open={previewOpen} footer={null} onCancel={handleCancelPreview}>
        <img
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};
ModelEdit.context = ({ onCancel, onSubmit, onPublish }) => {
  const items = [
    {
      key: 'PUB',
      label: '发布',
    },
  ];

  return (
    <Space>
      <Dropdown.Button
        menu={{
          items,
          onClick: onPublish,
        }}
        onClick={onCancel}
      >
        取消
      </Dropdown.Button>
      <AuthButton
        required={PERMISSION_MAP.CONTENT_MODEL_EDIT}
        type="primary"
        onClick={onSubmit}
      >
        保存
      </AuthButton>
    </Space>
  );
};

ModelEdit.path = ['/content/model/edit/:id', '/content/model/create'];

export default ModelEdit;
