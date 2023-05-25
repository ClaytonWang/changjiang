import { useCallback, useMemo, useState } from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import { Section } from "@/components";
import { data, industry, algorithm } from "./data";
import Selector from "./components/Selector";
import ModelItem from "./components/ModelItem";
import { includes, filter, isEmpty, map } from "lodash";
import "./index.less";

const Model = () => {
  const [filters, setFilters] = useState({});
  const onFilter = useCallback((value) => {
    setFilters(value);
  }, []);
  const list = useMemo(() => {
    if (isEmpty(filters)) {
      return data;
    }
    return filter(data, (item) => {
      return (
        (filters.industry ? includes(item.industry, filters.industry) : true) &&
        (filters.algorithm ? includes(item.algorithm, filters.algorithm) : true)
      );
    });
  }, [filters]);

  return (
    <div className="page page-model">
      <div className="model-header">
        <Section>
          <div className="brain-wrapper">
            <div className="title">模型</div>
            <Selector
              value={filters}
              onChange={onFilter}
              data={{
                industry,
                algorithm,
              }}
            />
          </div>
        </Section>
        <div className="model-content brain-wrapper">
          <Row gutter={48}>
            {map(list, (item) => {
              return (
                <Col xs={24} sm={12} md={8} lg={8} key={item.id}>
                  <Link to={`/model/${item.id}`}>
                    <ModelItem data={item} />
                  </Link>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Model;
