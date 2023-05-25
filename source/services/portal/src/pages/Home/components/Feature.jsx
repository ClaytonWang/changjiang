import { Row, Col } from "antd";

const DATA = [
  {
    title: "低门槛",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has ...",
    icon: "https://digitalbrain.cn/images/home/ai_7.png",
  },
  {
    title: "广覆盖",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has ...",
    icon: "https://digitalbrain.cn/images/home/ai_9.png",
  },
  {
    title: "高效率",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has ...",
    icon: "https://digitalbrain.cn/images/home/ai_6.png",
  },
];

const Feature = () => {
  return (
    <div className="feature">
      <div className="brain-wrapper">
        <div className="feautre-wrapper">
          <Row gutter={32}>
            {DATA.map((item, index) => {
              return (
                <Col xs={24} sm={12} md={8} lg={8} key={item.title}>
                  <div className="card hover-card">
                    <div className="content">
                      <div className="icon">
                        <img height={38} src={item.icon} alt={item.title} />
                      </div>
                      <div className="title">{item.title}</div>
                      <div className="desc">{item.desc}</div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Feature;
