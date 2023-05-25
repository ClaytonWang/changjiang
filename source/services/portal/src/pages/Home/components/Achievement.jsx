import { Row, Col } from "antd";

const DATA = [
  {
    title: "OptFlow",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
    icon: "https://digitalbrain.cn/images/achievements/malib_icon.png",
  },
  {
    title: "决策大模型",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
    icon: "https://digitalbrain.cn/images/achievements/malib_icon.png",
  },
  {
    title: "低门工具槛",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
    icon: "https://digitalbrain.cn/images/achievements/malib_icon.png",
  },
  {
    title: "快速试验",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
    icon: "https://digitalbrain.cn/images/achievements/malib_icon.png",
  },
];

const Achievement = () => {
  return (
    <div className="achievement">
      <div className="brain-wrapper">
        <div className="achievement-wrapper">
          {DATA.map((item, index) => {
            return (
              <div className="achievement-item" key={item.title}>
                <Row
                  gutter={32}
                  style={{
                    flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                  }}
                >
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <div className="content">
                      <div className="title">{item.title}</div>
                      <div className="desc">{item.desc}</div>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <div className="icon">
                      <img src={item.icon} alt={item.title} />
                    </div>
                  </Col>
                </Row>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Achievement;
