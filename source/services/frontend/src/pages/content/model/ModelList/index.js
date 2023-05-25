import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { App } from 'antd';
import qs from 'qs';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { purifyDeep } from '@/common/utils/helper';
import { AuthButton } from '@/common/components';
import api from '@/common/api';
import { CREATE, EDIT } from '@/common/constants';
import PERMISSION_MAP from '@/common/utils/permissions';
import ModelTable from '../ModelTable';
import './index.less';

const ModelList = () => {
  const defaultFilters = useMemo(
    () => ({
      pageno: 1,
      pagesize: 20,
      sort: 'id:desc',
      filter: {},
    }),
    []
  );
  const [tableData, setTableData] = useState();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { message, modal } = App.useApp();
  const navigate = useNavigate();

  const getFilters = useCallback(
    () => ({ ...defaultFilters, ...qs.parse(searchParams.toString()) }),
    [defaultFilters, searchParams]
  );

  const requestList = useCallback(
    async (args) => {
      const params = purifyDeep({ ...getFilters(), ...args });
      setLoading(true);
      try {
        const { result } = await api.modelList(params);
        setTableData(result);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    },
    [getFilters]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    requestList();
    const filters = getFilters();
    setSearchParams(qs.stringify(filters));
  }, []);

  const reload = (args) => {
    const filters = getFilters();
    const params = purifyDeep({ ...filters, ...args });
    // 手动同步Url
    setSearchParams(qs.stringify(params));
    requestList(params);
  };

  const onPageNoChange = (pageno, pagesize) => {
    reload({ pageno, pagesize });
  };

  const handleCreateClicked = () => {
    navigate(CREATE, {
      state: {
        type: CREATE,
      },
    });
  };

  const handleEditClicked = (record) => {
    navigate(`${EDIT}/${record.id}`, {
      state: {
        type: EDIT,
      },
    });
  };

  const handleDelete = (record) => {
    const { id } = record;
    modal.confirm({
      title: '确定要删除该模型吗？',
      content: '该模型被删除后不可被恢复。',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await api.modelDelete({ id });
          message.success('模型删除成功！');
          reload();
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  const handlePublishClicked = (record) => {
    const { id } = record;
    modal.confirm({
      title: '确定发布该模型吗？',
      content: '该模型被发布后，前台将可见。',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await api.modelPublish({ id });
          message.success('模型发布成功！');
          reload();
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  return (
    <div className="model-list">
      <div className="dbr-table-container">
        <div className="batch-command">
          <AuthButton
            required={PERMISSION_MAP.CONTENT_MODEL_EDIT}
            style={{ float: 'left' }}
            type="primary"
            onClick={handleCreateClicked}
            disabled={loading}
          >
            <PlusOutlined />
            新建模型
          </AuthButton>
        </div>
        <ModelTable
          tableData={tableData}
          reload={reload}
          loading={loading}
          onEdit={handleEditClicked}
          onDelete={handleDelete}
          onPublish={handlePublishClicked}
          onPageNoChange={onPageNoChange}
        />
      </div>
    </div>
  );
};
export default ModelList;
