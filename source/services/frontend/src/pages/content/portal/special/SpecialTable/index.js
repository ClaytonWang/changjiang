import { useState } from 'react';
import { Table, Tooltip, Modal, Badge } from 'antd';
import { transformTime } from '@/common/utils/helper';
import { STATUS } from '@/common/constants';

const SpecialTable = ({ data = {}, loading = false }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const columns = [
    {
      title: '顺序',
      width: '5%',
      dataIndex: 'index',
    },
    {
      title: '主标题',
      width: '20%',
      dataIndex: 'title',
      ellipsis: true,
      render(value) {
        return <Tooltip title={value}>{value}</Tooltip>;
      },
    },
    {
      title: '副标题',
      width: '30%',
      dataIndex: 'sub_title',
      ellipsis: true,
      render(value) {
        return <Tooltip title={value}>{value}</Tooltip>;
      },
    },
    {
      title: '图片',
      width: '10%',
      dataIndex: 'img',
      className: 'img-cell',
      render(value) {
        return (
          <img
            onClick={() => {
              handlePreview(value);
            }}
            src={value}
          />
        );
      },
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
      title: '更新时间',
      width: '15%',
      dataIndex: 'updated_at',
      ellipsis: true,
      render(value) {
        return transformTime(value, 'YYYY-MM-DD') || '-';
      },
    },
  ];

  const handleCancelPreview = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    setPreviewImage(file);
    setPreviewOpen(true);
  };

  return (
    <>
      <Table
        className="dbr-table"
        rowKey="id"
        size="small"
        columns={columns}
        loading={loading}
        dataSource={data}
        pagination={false}
        tableLayout="auto"
      />
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
export default SpecialTable;
