import { useSearchParams } from 'react-router-dom';
import { Table, Space, Popconfirm, Form, Input } from 'antd';
import { transformDate } from '@/common/utils/helper';
import PermissionTree from '../PermissionTree';
import qs from 'qs';
import api from '@/common/api';
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const childNode = editing ? (
    <Form.Item
      name={dataIndex}
      style={{
        margin: 0,
        width: 200,
      }}
      rules={[
        {
          required: true,
          message: `请输入${title}!`,
        },
      ]}
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

const RoleTable = ({
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
      title: '角色',
      width: '30%',
      dataIndex: 'value',
      editable: true,
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
      render(_value, record) {
        const editable = isEditing(record);

        return editable ? (
          <Space>
            <AuthButton
              type="link"
              required={PERMISSION_MAP.SYSTEM_ROLE_EDIT}
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
              required={PERMISSION_MAP.SYSTEM_ROLE_EDIT}
              type="link"
              disabled={editingKey !== '' || isCreating}
              onClick={() => {
                handleEditClicked(record);
              }}
            >
              编辑
            </AuthButton>
            <AuthButton
              required={PERMISSION_MAP.SYSTEM_ROLE_EDIT}
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
  const [pmsSource, setPmsSource] = useState([]);
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
      value: '',
      ...record,
    });
    setEditingKey(record.id);
    onEdit();
  };

  const handleSaveClicked = async (record) => {
    const { value } = await form.validateFields();
    await onSave({ ...record, value });
    handleCreateCancel();
  };

  const handleCreateCancel = () => {
    form.setFieldsValue({
      value: '',
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

  const requestPsmList = useCallback(async () => {
    try {
      const { result } = await api.pmsList();
      setPmsSource(result);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    requestPsmList();
  }, [requestPsmList]);

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
        columns={mergedColumns}
        loading={loading}
        dataSource={genTableData(data)}
        pagination={pagination}
        tableLayout="auto"
        components={components}
        expandable={{
          expandedRowRender: ({ id }) => {
            if (!id) return null;
            return <PermissionTree source={pmsSource} id={id} />;
          },
        }}
      />
    </Form>
  );
};
export default RoleTable;
