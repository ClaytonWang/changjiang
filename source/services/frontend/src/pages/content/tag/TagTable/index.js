import { useSearchParams } from 'react-router-dom';
import { Table, Space, Popconfirm, Form, Input, Tag } from 'antd';
import { transformDate, isColor } from '@/common/utils/helper';
import qs from 'qs';
import React, { useState, useEffect, useRef } from 'react';
import AuthButton from '@/common/components/AuthButton';
import PERMISSION_MAP from '@/common/utils/permissions';

const EditableCell = ({
  record,
  editing,
  dataIndex,
  title,
  children,
  save,
  ...restProps
}) => {
  const inputRef = useRef(null);
  useEffect(() => {
    if (editing && dataIndex === 'tag') {
      inputRef.current.focus();
    }
  }, [editing, dataIndex]);
  let rules = [
    {
      required: true,
      message: `请输入${title}!`,
    },
  ];
  if (dataIndex === 'color') {
    rules = [
      () => ({
        validator(_, value) {
          if (!value) {
            return Promise.reject(new Error(`请输入${title}!`));
          }
          if (!isColor(value)) {
            return Promise.reject(new Error('请输入正确的颜色值！'));
          }
          return Promise.resolve();
        },
      }),
    ];
  }
  const childNode = editing ? (
    <Form.Item
      name={dataIndex}
      style={{
        margin: 0,
        width: 200,
      }}
      rules={rules}
    >
      <Input
        ref={inputRef}
        onPressEnter={() => {
          save(record);
        }}
      />
    </Form.Item>
  ) : (
    children
  );
  return <td {...restProps}>{childNode} </td>;
};

const TagTable = ({
  tableData = {},
  loading = false,
  isCreating = false,
  onDelete = () => {},
  onSave = () => {},
  onEdit = () => {},
  onCancel = () => {},
  onPageNoChange = () => {},
}) => {
  const columns = [
    {
      title: '标签',
      width: '30%',
      dataIndex: 'tag',
      editable: true,
    },
    {
      title: '颜色',
      width: '30%',
      dataIndex: 'color',
      editable: true,
      render: (value) => (
        <>
          <Tag
            color={value}
            style={{
              width: 20,
              height: 20,
              verticalAlign: 'middle',
              border: '1px solid #ccc',
            }}
          />
          {value}
        </>
      ),
    },
    {
      title: '创建时间',
      width: '30%',
      dataIndex: 'created_at',
      render(value) {
        return transformDate(value) || '-';
      },
    },
    {
      title: '操作',
      width: '10%',
      render(_value, record) {
        const editable = isEditing(record);

        return editable ? (
          <Space>
            <AuthButton
              type="link"
              required={PERMISSION_MAP.CONTENT_TAG_EIDT}
              onClick={() => handleSaveClicked(record)}
            >
              保存
            </AuthButton>
            <Popconfirm
              title="确定取消吗？"
              onConfirm={() => handleCreateCancel(record)}
            >
              <AuthButton type="link">取消</AuthButton>
            </Popconfirm>
          </Space>
        ) : (
          <Space>
            <AuthButton
              required={PERMISSION_MAP.CONTENT_TAG_EIDT}
              type="link"
              disabled={editingKey !== '' || isCreating}
              onClick={() => {
                handleEditClicked(record);
              }}
            >
              编辑
            </AuthButton>
            <AuthButton
              required={PERMISSION_MAP.CONTENT_TAG_EIDT}
              disabled={editingKey !== '' || isCreating}
              type="link"
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
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.id === editingKey;

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
    form.setFieldsValue({
      tag: '',
      color: '',
      ...record,
    });
    setEditingKey(record.id);
    onEdit();
  };

  const handleSaveClicked = async (record) => {
    const { tag, color } = await form.validateFields();
    await onSave({ ...record, tag, color });
    handleCreateCancel();
  };

  const handleCreateCancel = () => {
    form.setFieldsValue({
      tag: '',
      color: '',
    });
    setEditingKey('');
    onCancel();
  };

  const handleDeleteClicked = (record) => {
    onDelete(record);
  };
  const genTableData = (data) => data;

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        save: handleSaveClicked,
      }),
    };
  });

  const components = {
    body: {
      cell: EditableCell,
    },
  };

  return (
    <Form form={form} component={false}>
      <Table
        className="dbr-table"
        rowKey="id"
        size="small"
        columns={mergedColumns}
        loading={loading}
        dataSource={genTableData(data)}
        pagination={pagination}
        tableLayout="auto"
        components={components}
      />
    </Form>
  );
};
export default TagTable;
