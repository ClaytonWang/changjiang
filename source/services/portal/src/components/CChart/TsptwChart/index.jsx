import { useMemo } from "react";
import { isEmpty } from "lodash";
import ReactECharts from "echarts-for-react";
import "../map/china.js";
import getOption from "./option";

const TsptwChart = ({ value }) => {
  const mapOption = useMemo(() => {
    return getOption(value);
  }, [value]);
  if (isEmpty(value)) {
    return null;
  }
  return (
    <div key={value?.statistics}>
      <ReactECharts style={{ height: 500 }} option={{ ...mapOption }} />
    </div>
  );
};

export default TsptwChart;
