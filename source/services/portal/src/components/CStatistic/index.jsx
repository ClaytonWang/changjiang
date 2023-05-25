import { Statistic } from "antd";
import { get, map } from "lodash";
import CountUp from "react-countup";
import "./index.less";

const formatter = (value) => <CountUp end={value} separator="," />;

const CStatistic = ({ model, value }) => {
  const view = get(model, "run.view");
  const data = get(value, "statistics");

  if (!view || !data) {
    return null;
  }
  return (
    <div className="cstatistic-zone">
      {map(view, ({ title, dataIndex, ...props }) => {
        return (
          <div className="cstatistic-item" key={dataIndex}>
            <Statistic
              title={title}
              value={get(data, dataIndex)}
              {...props}
              formatter={formatter}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CStatistic;
