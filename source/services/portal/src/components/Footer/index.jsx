import { Row, Col, Space } from "antd";
import { Link } from "react-router-dom";
import "./index.less";

const Footer = () => {
  return (
    <div className="brain-footer">
      <div className="content">
        <div className="brain-wrapper brain-footer-wrapper">
          <Row className="brain-footer-row">
            <Col xs={24} sm={24} md={12}>
              <div className="logo">
                <Link to="/">
                  <img height={34} src="/logo.png" alt="logo" />
                </Link>
              </div>
              <div className="text">
                <Space size={24}>
                  <span><a href="/html/user-agreement.html" target="_blank" rel="noopener noreferrer">用户协议</a></span>
                  <span><a href="/html/privacy.html" target="_blank" rel="noopener noreferrer">隐私政策</a></span>
                  <span>沪ICP备2022019708号</span>
                </Space>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <div className="title">
                地址
              </div>
              <div className="text">上海：静安区灵石路718号 & 闵行区剑川路951号零号湾</div>
              <div className="text">北京：海淀区双清路33号学研大厦</div>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <div className="title">联系我们</div>
              <div className="text">联系邮箱：info@digitalbrain.cn</div>
              <div className="text">公众号：数字大脑研究院</div>
            </Col>
            <Col xs={24} sm={24} md={12} className="brain-footer-icon">
              <div className="icon">
                <img width={73} height={73} src="/images/footer/account.png" alt="公众号：数字大脑研究院" />
              </div>
              <div className="text">公众号二维码</div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Footer;
