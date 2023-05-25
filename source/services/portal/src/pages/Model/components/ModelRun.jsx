import { Row, Col, Button, Spin } from 'antd';
import { CEffect, CStatistic } from '@/components';
import PageVisibility from 'react-page-visibility';
import { useCallback, useState } from 'react';

const ModelRun = ({ loading, data, onRun, modelResult = {} }) => {
  const [isVisible, setIsVisible] = useState(false);
  const handleVisibilityChange = useCallback((visible) => {
    setTimeout(() => {
      setIsVisible(!visible);
    }, 1000);
  }, []);

  return (
    <PageVisibility onChange={handleVisibilityChange}>
      <div className="form-section model-detail-run">
        <div className="model-section-title">规划结果</div>
        <div className="content">
          <div className="run-header">
            <Row gutter={48}>
              <Col span={17}>
                <CStatistic model={data} value={modelResult} />
              </Col>
              <Col span={7}>
                <div className="run-operators">
                  <Button onClick={onRun} loading={loading}>
                    运行
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
          <div className="run-content">
            <Spin tip="数据加载中" size="large" spinning={loading || isVisible}>
              <CEffect model={data} data={modelResult} />
            </Spin>
          </div>
        </div>
      </div>
    </PageVisibility>
  );
};

export { ModelRun };
