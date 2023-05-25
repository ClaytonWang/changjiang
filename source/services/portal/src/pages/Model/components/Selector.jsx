import { useCallback } from "react";
import { Space } from "antd";
import { CTag } from "@/components";
import { map } from "lodash";

const Selector = ({ data, value, onChange }) => {
  const onClick = useCallback(
    (v, type) => {
      onChange({
        ...value,
        [type]: v.value,
      });
    },
    [value, onChange]
  );

  return (
    <div className="selector">
      <div className="filter-item">
        <Space>
          <div className="title">行业：</div>
          <div className="filter-tags">
            {map(data?.industry, (item) => {
              const light = value.industry && item.value !== value.industry;
              return (
                <CTag
                  type="industry"
                  light={light}
                  key={item.value}
                  onClick={() => onClick(item, "industry")}
                >
                  {item.label}
                </CTag>
              );
            })}
          </div>
          {value.industry && (
            <div
              className="clear"
              onClick={() => {
                onClick({}, "industry");
              }}
            >
              Clear
            </div>
          )}
        </Space>
      </div>
      <div className="filter-item filter-algorithm">
        <Space>
          <div className="title">算法类：</div>
          <div className="filter-tags">
            {map(data?.algorithm, (item) => {
              const light = value.algorithm && item.value !== value.algorithm;
              return (
                <CTag
                  type="algorithm"
                  light={light}
                  key={item.value}
                  onClick={() => onClick(item, "algorithm")}
                >
                  {item.label}
                </CTag>
              );
            })}
          </div>
          {value.algorithm && (
            <div
              className="clear"
              onClick={() => {
                onClick({}, "algorithm");
              }}
            >
              Clear
            </div>
          )}
        </Space>
      </div>
    </div>
  );
};

export default Selector;
