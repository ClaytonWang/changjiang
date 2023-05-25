import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Input, Form, Select, App } from 'antd';
import qs from 'qs';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { purifyDeep } from '@/common/utils/helper';
import { AuthButton, FormModal } from '@/common/components';
import api from '@/common/api';
import { EDIT, EMAIL_REG } from '@/common/constants';
import PERMISSION_MAP from '@/common/utils/permissions';
import UsersTable from '../UserTable';
import './index.less';

const UsersList = () => {
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
  const [roleListAll, setRoleListAll] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState(null);
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
        const { result } = await api.bamUsersList(params);
        setTableData(result);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    },
    [getFilters]
  );

  const requestRoleList = useCallback(async (args) => {
    const params = purifyDeep({ ...args });
    setLoading(true);
    try {
      const { result } = await api.roleListAll(params);
      setRoleListAll(result);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    requestList();
    const filters = getFilters();
    setSearchParams(qs.stringify(filters));
    requestRoleList();
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

  const createUser = async (values) => {
    const params = { ...values };
    try {
      await api.bamUsersCreate(params);
      message.success('用户新建成功!');
      reload();
      handleCreateCancel();
    } catch (error) {
      console.log(error);
      handleCreateCancel();
    }
  };
  const updateUser = async (values) => {
    const { id } = initialFormValues;
    const params = {
      ...values,
      id,
    };
    try {
      await api.bamUsersUpdate(params);
      message.success('用户更新成功!');
      reload();
      handleEditCancel();
    } catch (error) {
      console.log(error);
      handleEditCancel();
    }
  };
  const handleCreateClicked = () => {
    setShowCreateModal(true);
  };
  const handleCreateCancel = () => {
    setShowCreateModal(false);
  };
  const handleEditClicked = (record) => {
    setShowEditModal(true);
    setInitialFormValues({
      ...record,
      role: record?.role?.map(({ id }) => id),
    });
  };
  const handleEditCancel = () => {
    setShowEditModal(false);
    setInitialFormValues(null);
  };
  const handleDelete = (record) => {
    const { id } = record;
    modal.confirm({
      title: '确定要删除该用户吗？',
      content: '将用户使用资源清空后，该用户可被删除。',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await api.bamUsersDelete({ id });
          message.success('用户删除成功！');
          reload();
        } catch (error) {
          console.log(error);
        }
      },
    });
  };
  const handleCreateSubmit = (values) => {
    createUser(values);
  };
  const handleEditSubmit = (values) => {
    updateUser(values);
  };
  const handleCreateRoleClicked = () => {
    navigate('/system/role', {
      state: {
        params: { showCreate: true },
      },
    });
  };

  const FormChildren = ({ type }) => (
    <>
      <Form.Item
        label="姓名"
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        label="账户"
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { pattern: EMAIL_REG, message: '请输入有效邮箱' },
        ]}
      >
        <Input placeholder="请输入邮箱" disabled={type === EDIT} />
      </Form.Item>
      <Form.Item
        name="role"
        label="角色"
        rules={[{ required: true, message: '请选择用户角色' }]}
      >
        <Select
          mode="multiple"
          placeholder="请选择用户角色"
          notFoundContent={
            <div className="select-notfound">
              <span>暂无角色</span>,
              <AuthButton
                required={PERMISSION_MAP.SYSTEM_ROLE_EDIT}
                type="link"
                onClick={handleCreateRoleClicked}
              >
                点击新建
              </AuthButton>
            </div>
          }
          options={roleListAll.map(({ id, value = '-' }) => ({
            label: value,
            value: id,
          }))}
        />
      </Form.Item>
      {type === 'edit' && (
        <Form.Item label="旧密码" name="old_password">
          <Input.Password placeholder="请输入旧密码" />
        </Form.Item>
      )}
      <Form.Item
        label={(type === 'edit' && '新密码') || '密码'}
        name="password"
        rules={
          (type === 'edit' && [{ len: 8, message: '请输入8位密码' }]) || [
            { required: true, message: '请输入密码' },
            { len: 8, message: '请输入8位密码' },
          ]
        }
      >
        <Input.Password placeholder="请输入8位密码" />
      </Form.Item>
    </>
  );
  const CreateModal = () => (
    <FormModal
      title="新建用户"
      okText="新建"
      cancelText="取消"
      onSubmit={handleCreateSubmit}
      onCancel={handleCreateCancel}
    >
      <FormChildren type="create" />
    </FormModal>
  );

  const EditModal = () => (
    <FormModal
      title="编辑用户"
      okText="保存"
      cancelText="取消"
      initialValues={initialFormValues}
      onSubmit={handleEditSubmit}
      onCancel={handleEditCancel}
    >
      <FormChildren type="edit" />
    </FormModal>
  );
  return (
    <div className="users-list">
      <div className="dbr-table-container">
        <div className="batch-command">
          <AuthButton
            required={PERMISSION_MAP.SYSTEM_USER_EDIT}
            style={{ float: 'left' }}
            type="primary"
            onClick={handleCreateClicked}
            disabled={loading}
          >
            <PlusOutlined />
            新建用户
          </AuthButton>
        </div>
        <UsersTable
          tableData={tableData}
          reload={reload}
          loading={loading}
          onEdit={handleEditClicked}
          onDelete={handleDelete}
          onPageNoChange={onPageNoChange}
        />
      </div>
      {showCreateModal && <CreateModal />}
      {showEditModal && <EditModal />}
    </div>
  );
};
export default UsersList;
