import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { App } from 'antd';
import qs from 'qs';
import { get, cloneDeep } from 'lodash';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { purifyDeep } from '@/common/utils/helper';
import { AuthButton } from '@/common/components';
import api from '@/common/api';
import RoleTable from '../RoleTable';
import PERMISSION_MAP from '@/common/utils/permissions';

const RoleList = () => {
  const defaultFilters = useMemo(
    () => ({
      pageno: 1,
      pagesize: 10,
      sort: 'id:desc',
      filter: {},
    }),
    []
  );
  const [tableData, setTableData] = useState();
  const [isCreating, setIsCreateing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { message, modal } = App.useApp();
  const location = useLocation();

  const getFilters = useCallback(
    () => ({ ...defaultFilters, ...qs.parse(searchParams.toString()) }),
    [defaultFilters, searchParams]
  );

  const requestList = useCallback(
    async (args) => {
      const params = purifyDeep({ ...getFilters(), ...args });
      setLoading(true);
      try {
        const { result } = await api.roleList(params);
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

  const createRole = async (values) => {
    try {
      await api.roleCreate(values);
      message.success('角色新建成功!');
      reload();
    } catch (error) {
      console.log(error);
    }
  };
  const updateRole = async (values) => {
    try {
      await api.roleUpdate(values);
      message.success('角色更新成功!');
      reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateClicked = () => {
    const newData = {
      created_at: new Date(),
      name: '',
      value: '',
      id: '',
    };

    const _tmp = tableData;
    _tmp.data = [newData, ..._tmp.data];
    setTableData(_tmp);
    setIsCreateing(true);
  };

  const handleSaveClicked = async (record) => {
    const { id } = record;
    setIsCreateing(false);
    if (!id) {
      await createRole(record);
    } else {
      await updateRole(record);
    }
  };

  const handleCancelClicked = () => {
    const _tmp = cloneDeep(tableData);
    const newData = _tmp.data.filter((item) => item.id !== '');
    _tmp.data = newData;
    setTableData(_tmp);
    setIsCreateing(false);
  };

  const handleEditClicked = () => {
    setIsCreateing(true);
  };

  const handleDelete = (record) => {
    const { id } = record;
    modal.confirm({
      title: '确定要删除该角色吗？',
      content: '删除后将不可恢复',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await api.roleDelete({ id });
          message.success('角色删除成功！');
          reload();
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  useEffect(() => {
    const { showCreate = null } = get(location, 'state.params', {});
    if (showCreate === true) {
      handleCreateClicked();
    }
  }, [handleCreateClicked, location]);

  return (
    <div className="users-list">
      <div className="dbr-table-container">
        <div className="batch-command">
          <AuthButton
            required={PERMISSION_MAP.SYSTEM_ROLE_EDIT}
            disabled={isCreating || loading}
            style={{ float: 'left' }}
            type="primary"
            onClick={handleCreateClicked}
          >
            <PlusOutlined />
            新建角色
          </AuthButton>
        </div>
        <RoleTable
          isCreating={isCreating}
          tableData={tableData}
          reload={reload}
          loading={loading}
          onSave={handleSaveClicked}
          onCancel={handleCancelClicked}
          onEdit={handleEditClicked}
          onDelete={handleDelete}
          onPageNoChange={onPageNoChange}
        />
      </div>
    </div>
  );
};
export default RoleList;
