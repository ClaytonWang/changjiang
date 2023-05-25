import { useCallback, useEffect, useMemo, useState, memo } from "react";
import { Radio, Space, Badge, Alert } from "antd";
import { last, map, keys, get, without, uniq, pick } from "lodash";
import modelService from "@/services/model";
import { CUpload } from "@/components";
import {
  CheckCircleOutlined,
  VerticalAlignBottomOutlined,
  UploadOutlined,
  RedoOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { EditableProTable } from "@ant-design/pro-components";
import "./index.less";

const CTable = memo(({ data, tab, editing, onChange }) => {
  const [ds, setDs] = useState([]);
  const [columns, setColumns] = useState([]);
  const [readonly, setReadonly] = useState(false);

  const currentData = useMemo(() => {
    return data?.[tab] || {};
  }, [data, tab]);
  const handleChange = useCallback(
    (v) => {
      onChange({
        [tab]: {
          ...currentData,
          data: v,
        },
      });
    },
    [onChange, currentData]
  );
  useEffect(() => {
    setDs(currentData?.data || []);
  }, [currentData]);
  useEffect(() => {
    setReadonly(ds && ds.length > 100);
  }, [ds]);
  useMemo(() => {
    const headers = map(without(keys(last(ds)), "id", "index"), (item) => {
      return {
        title: item,
        dataIndex: item,
      };
    });
    headers.unshift({
      title: "ID",
      dataIndex: "id",
      width: 50,
      editable: false,
    });
    if (!readonly && editing) {
      headers.push({
        title: "操作",
        valueType: "option",
        width: 80,
        render: (text, record, _, action) => [
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            <EditOutlined />
          </a>,
          <a
            key="delete"
            onClick={() => {
              handleChange(ds.filter((item) => item.id !== record.id));
            }}
          >
            <DeleteOutlined />
          </a>,
        ],
      });
    }
    setColumns(headers);
  }, [ds, readonly, editing, handleChange]);
  const getNewId = useCallback(() => {
    return get(last(ds), "id", 999) - 0 + 1;
  }, [ds]);

  return (
    <EditableProTable
      bordered
      size="small"
      columns={columns}
      onChange={handleChange}
      value={ds}
      search={false}
      options={false}
      rowKey="id"
      pagination={false}
      scroll={{ y: 450 }}
      headerTitle={
        readonly && editing ? (
          <Alert
            type="info"
            message="该模版数据量较大，不支持在线编辑，请使用下载上传功能"
            banner
            closable
          />
        ) : undefined
      }
      editable={{
        actionRender: (row, config, defaultDom) => {
          return [defaultDom.save, defaultDom.cancel];
        },
        saveText: <SaveOutlined />,
        cancelText: <CloseOutlined />,
      }}
      recordCreatorProps={
        !readonly && editing
          ? {
              position: "top",
              record: () => ({ id: getNewId() }),
            }
          : false
      }
    />
  );
});

const ONLY_VIEW_LIST = ["tsptw"];

const ModelData = ({ data, syncParams = {} }) => {
  const [fileData, setFileData] = useState();
  const [tab, setTab] = useState();
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dataChanged, setDataChanged] = useState([]);

  const onlyView = useMemo(() => {
    return ONLY_VIEW_LIST.indexOf(data.category) >= 0;
  }, [data.category]);

  // 同步文件数据
  const syncFileData = useCallback(async () => {
    const v = await modelService.getFileData(data.category, syncParams);
    setFileData(v);
  }, [data.category, syncParams]);
  useEffect(() => {
    if (!tab && fileData) {
      setTab(keys(fileData)?.[0]);
    }
  }, [tab, fileData]);
  const fileOptions = useMemo(() => {
    return keys(fileData);
  }, [fileData]);

  // 保存文件数据
  const saveFileData = useCallback(async () => {
    if (dataChanged) {
      await modelService.saveFileData(
        data.category,
        pick(fileData, dataChanged)
      );
      // 保存完数据，进行更新
      syncFileData();
    }
  }, [data.category, fileData, syncFileData, dataChanged]);
  const downloadFileData = useCallback(() => {
    modelService.getFileDownloadUrl(data.category, `${data.category}-data.zip`);
  }, [data.category]);
  // 重置文件
  const recoverFileData = useCallback(async () => {
    await modelService.recover(data.category);
  }, [data.category]);
  const handleOperator = useCallback(
    async (e) => {
      const key = e.target.value;
      if (key === "editOrSave") {
        if (!editing) {
          // 编辑
          setEditing(true);
        } else {
          saveFileData();
          // 保存
          setEditing(false);
        }
      } else if (key === "recover") {
        setEditing(false);
        await recoverFileData();
        syncFileData();
      } else if (key === "download") {
        downloadFileData();
      } else if (key === "upload") {
        setUploading(true);
      }
    },
    [editing, saveFileData, syncFileData, downloadFileData]
  );
  const handleDataChange = useCallback((v) => {
    setDataChanged((list) => {
      return uniq([...list, ...keys(v)]);
    });
    setFileData((prev) => ({
      ...prev,
      ...v,
    }));
  }, []);
  useEffect(() => {
    syncFileData();
  }, [syncFileData]);

  return (
    <div className="brain-model-data">
      <div className="model-section-title">样本数据</div>
      <div className="header-zone">
        <div className="tabs">
          <Radio.Group
            value={tab}
            onChange={(e) => setTab(e.target.value)}
            options={fileOptions}
            optionType="button"
          />
        </div>
        <div className="buttons">
          <Radio.Group value={""} onChange={handleOperator}>
            <Radio.Button value="editOrSave" disabled={onlyView}>
              {editing ? (
                <Space size={4}>
                  <CheckCircleOutlined />
                  <Badge style={{ color: "unset" }} dot={!!dataChanged.length}>
                    保存
                  </Badge>
                </Space>
              ) : (
                <Space size={4}>
                  <EditOutlined />
                  编辑
                </Space>
              )}
            </Radio.Button>
            <Radio.Button value="download">
              <Space size={4}>
                <VerticalAlignBottomOutlined />
                下载
              </Space>
            </Radio.Button>
            <Radio.Button value="upload" className="upload" disabled={onlyView}>
              <Space size={4}>
                <UploadOutlined />
                上传
              </Space>
            </Radio.Button>
            <Radio.Button value="recover"  className="recover" disabled={onlyView}>
              <Space size={4}>
                <RedoOutlined />
                恢复
              </Space>
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <div className="content-zone">
        <CTable
          data={fileData}
          tab={tab}
          editing={editing}
          onChange={handleDataChange}
        />
      </div>
      <CUpload model={data} open={uploading} setOpen={setUploading} />
    </div>
  );
};

export default ModelData;
