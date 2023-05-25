import { useCallback, useState } from "react";
import { Modal, Button, Upload, Card } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import modelService from "@/services/model";
import { SESSION_ID } from "@/services/request";
import "./index.less";

const CUpload = ({ model, open, setOpen }) => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleOk = useCallback(() => {
    if (fileList.length === 0) {
      setOpen(false);
      return;
    }
    setLoading(true);
    modelService
      .confirmFileUpload(model.category)
      .then(() => {
        setOpen(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setOpen, fileList]);
  const handleCancel = useCallback(() => {
    setOpen(false);
  }, [setOpen]);
  const handleUploadChange = useCallback((v) => {
    setFileList(v.fileList);
  }, []);

  return (
    <Modal
      destroyOnClose
      title="上传本地数据"
      className="cupload-zone"
      open={open}
      okText="完成"
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={loading}
    >
      <div className="header-desc">上传本地数据后将会覆盖原本数据。</div>
      <Upload.Dragger
        name="file"
        multiple
        accept=".csv,.zip,.rar,.7zip"
        action={modelService.UPLOAD_URL}
        headers={{
          user_id: window.DBCJ_USER?.name,
        }}
        onChange={handleUploadChange}
        data={{
          session_id: SESSION_ID,
          category: model.category,
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或推拽至此区域完成上传</p>
        <p className="ant-upload-hint">
          支持压缩包或单个csv文件，文件大小不超过10M
        </p>
      </Upload.Dragger>
      <Card className="content-desc">
        <div>备注说明：</div>
        <div>1. 请确保上传的数据无误，上传成功的数据将会覆盖原本的数据；</div>
        <div>
          2.
          若数据上传失败，页面表格中的数据仍保持原有数据，请按照提示修改相应内容；
        </div>
        <div>3. 如您希望下载原始数据，请点击恢复按钮将数据恢复至初始状态；</div>
      </Card>
    </Modal>
  );
};

export default CUpload;
