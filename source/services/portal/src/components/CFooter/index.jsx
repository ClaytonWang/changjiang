import { Space } from "antd";
import "./index.less";

const CFooter = () => {
  return (
    <div className="brain-cfooter">
      <div className="brain-wrapper">
        <div className="copy">
          <Space>
            <span>@2022-2023</span>
            <span>决策职能开放平台</span>
            <span>版权所有</span>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default CFooter;
