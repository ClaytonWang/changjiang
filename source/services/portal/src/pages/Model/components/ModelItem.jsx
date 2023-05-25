import { Row, Col } from "antd";
import { map } from "lodash";
import { CTag } from "@/components";

const ModelItem = ({ data }) => {
  return (
    <div className="model-item">
      <div className="card hover-card">
        <div
          className="img-zone"
          style={{
            backgroundImage: `url(images/model/${data.image})`,
          }}
        ></div>
        <div className="model-item-content">
          <div className="title">{data.title}</div>
          <div className="en-title">{data.enTitle}</div>
          <div className="tags">
            {map(data.tags, (item) => {
              return (
                <CTag size="small" key={item}>
                  {item}
                </CTag>
              );
            })}
          </div>
          <div className="desc">{data.desc}</div>
          <div className="footer">
            <Row>
              <Col span={12}>
                <span className="owner">{`${data.owner} | ${data.date}`}</span>
              </Col>
              <Col span={12}>
                <span className="feature">{`特性：${data.feature}`}</span>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelItem;
