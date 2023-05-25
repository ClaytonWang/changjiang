import { useSearchParams } from 'react-router-dom';
import { Table, Space, Badge, Dropdown } from 'antd';
import qs from 'qs';
import PERMISSION_MAP from '@/common/utils/permissions';
import AuthButton from '@/common/components/AuthButton';
import { transformTime } from '@/common/utils/helper';
import { STATUS } from '@/common/constants';
import { EllipsisOutlined } from '@ant-design/icons';

const ModelTable = ({
  tableData = {},
  loading = false,
  onEdit = () => {},
  onDelete = () => {},
  onPublish = () => {},
  onPageNoChange = () => {},
}) => {
  const columns = [
    {
      title: '顺序',
      width: '10%',
      dataIndex: 'index',
    },
    {
      title: '状态',
      width: '20%',
      dataIndex: 'state',
      render(value) {
        return (
          <Badge
            color={value === 'success' ? 'green' : 'red'}
            text={STATUS[value]}
          />
        );
      },
    },
    {
      title: '模型名称',
      width: '30%',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: '更新时间',
      width: '25%',
      dataIndex: 'updated_at',
      ellipsis: true,
      render(value) {
        return transformTime(value, 'YYYY-MM-DD HH:mm:ss') || '-';
      },
    },
    {
      title: '操作',
      width: '15%',
      render(_value, record) {
        const items = [
          {
            key: '1',
            label: (
              <AuthButton
                type="text"
                required={PERMISSION_MAP.CONTENT_MODEL_EDIT}
                onClick={() => {
                  handleDeleteClicked(record);
                }}
              >
                删除
              </AuthButton>
            ),
          },
        ];
        return (
          <Space>
            <AuthButton
              type="link"
              required={PERMISSION_MAP.CONTENT_MODEL_EDIT}
              onClick={() => {
                handleEditClicked(record);
              }}
            >
              编辑
            </AuthButton>
            <AuthButton
              type="link"
              required={PERMISSION_MAP.CONTENT_MODEL_EDIT}
              onClick={() => {
                handlePublishClicked(record);
              }}
            >
              发布
            </AuthButton>
            <Dropdown menu={{ items }} placement="bottom">
              <a>
                <EllipsisOutlined style={{ fontSize: 24 }} />
              </a>
            </Dropdown>
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

  const handlePublishClicked = (record) => {
    onPublish(record);
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
export default ModelTable;
