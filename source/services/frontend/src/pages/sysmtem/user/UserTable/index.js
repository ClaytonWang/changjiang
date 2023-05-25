import { useSearchParams } from 'react-router-dom';
import { Table, Space } from 'antd';
import qs from 'qs';
import PERMISSION_MAP from '@/common/utils/permissions';
import AuthButton from '@/common/components/AuthButton';

const UsersTable = ({
  tableData = {},
  loading = false,
  onEdit = () => {},
  onDelete = () => {},
  onPageNoChange = () => {},
}) => {
  const columns = [
    {
      title: '姓名',
      width: '20%',
      dataIndex: 'username',
    },
    {
      title: '账户',
      width: '30%',
      dataIndex: 'email',
    },
    {
      title: '角色',
      width: '40%',
      dataIndex: 'role',
      ellipsis: true,
      render(value) {
        return value?.map((v) => v.value).join('、');
      },
    },
    {
      title: '操作',
      width: '10%',
      render(_value, record) {
        return (
          <Space>
            <AuthButton
              type="link"
              required={PERMISSION_MAP.SYSTEM_USER_EDIT}
              onClick={() => {
                handleEditClicked(record);
              }}
            >
              编辑
            </AuthButton>
            <AuthButton
              type="link"
              required={PERMISSION_MAP.SYSTEM_USER_EDIT}
              onClick={() => {
                handleDeleteClicked(record);
              }}
            >
              删除
            </AuthButton>
          </Space>
        );
      },
    },
  ];
  const [searchParams] = useSearchParams();
  const { pageno = 1, pagesize = 10 } = {
    ...qs.parse(searchParams.toString()),
  };

  const { total = 0, data = [] } = tableData;
  const pagination = {
    current: Number(pageno),
    pageSize: Number(pagesize),
    total,
    onChange: onPageNoChange,
    showSizeChanger: false,
  };
  const handleEditClicked = (record) => {
    onEdit(record);
  };
  const handleDeleteClicked = (record) => {
    onDelete(record);
  };
  const genTableData = (data) => data;

  return (
    <Table
      className="dbr-table"
      rowKey="id"
      size="small"
      columns={columns}
      loading={loading}
      dataSource={genTableData(data)}
      pagination={pagination}
      tableLayout="auto"
    />
  );
};
export default UsersTable;
