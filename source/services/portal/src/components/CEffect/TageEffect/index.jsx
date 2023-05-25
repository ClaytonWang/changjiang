import { memo } from 'react';
import { Row, Col, Skeleton } from 'antd';
import CChart from '@/components/CChart';
import TageInfo from './TageInfo';
import './index.less';

const DATA_List = [
  {
    title: '车辆总数',
    dataIndex: 'slaRate',
    precision: 2,
  },
  {
    title: '采矿点',
    dataIndex: 'transCost',
    precision: 2,
  },
  {
    title: '卸矿点',
    dataIndex: 'deliveryCost',
    precision: 2,
  },
  {
    title: '平均车速',
    dataIndex: 'storageCost',
    precision: 2,
  },
];

const TageEffect = memo(({ model, data }) => {
  if (!model?.metrics) {
    return <Skeleton />;
  }
  const _tmp = model?.metrics;
  if (data && data.length > 0) {
    _tmp.overall = data[0].curr_amount / 10000;
    _tmp.truck_num = data[0].truck_num;
  }
  return (
    <div className="tage-effect-zone">
      <Row gutter={48}>
        <Col span={24}>
          <div className="run-result">
            <CChart model={model} value={data} />
            <TageInfo data={_tmp} />
          </div>
        </Col>
      </Row>
    </div>
  );
});

export default TageEffect;
