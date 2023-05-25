import { useState } from "react";
import { Row, Col, Card, Statistic } from "antd";
import { get, map } from "lodash";
import CChart from "@/components/CChart";
import "./index.less";

const DATA_List = [
  {
    title: "总时效达成占比",
    dataIndex: "slaRate",
    precision: 2,
    suffix: "%",
  },
  {
    title: "运输总成本",
    dataIndex: "transCost",
    precision: 2,
  },
  {
    title: "配送总成本",
    dataIndex: "deliveryCost",
    precision: 2,
  },
  {
    title: "仓库存储总成本",
    dataIndex: "storageCost",
    precision: 2,
  },
  {
    title: "逆向物流总成本",
    dataIndex: "reverseTransCost",
    precision: 2,
  },
  {
    title: "库存资金占用成本",
    dataIndex: "capitalCost",
    precision: 2,
  },
  {
    title: "入仓成本",
    dataIndex: "enrollCost",
    precision: 2,
  },
];

const NetEffect = ({ model, data }) => {
  const [city, setCity] = useState("北京市");
  return (
    <div className="net-effect-zone">
      <Row gutter={48}>
        <Col span={17}>
          <div className="run-result">
            <CChart model={model} value={data} />
          </div>
        </Col>
        <Col span={7}>
          <Card className="net-effect-result">
            <div className="title">规划结果</div>
            {map(DATA_List, ({ title, dataIndex, ...props }) => {
              const v = get(data, ["result", dataIndex]);
              const value = props.suffix === "%" ? v * 100 : v;
              return (
                <div className="item" key={dataIndex}>
                  <Statistic title={title} value={value} {...props} />
                </div>
              );
            })}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NetEffect;
