import { Row, Col, Card } from "antd";
import CChart from "@/components/CChart";
import "./index.less";

const PackingEffect = ({ model, data }) => {
  return (
    <div className="packing-effect-zone">
      <Row gutter={48}>
        <Col span={17}>
          <div className="run-result">
            <CChart model={model} value={data} />
          </div>
        </Col>
        <Col span={7}>
          <Card className="packing-effect-result"></Card>
        </Col>
      </Row>
    </div>
  );
};

export default PackingEffect;
