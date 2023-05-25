import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import "../map/china.js";
import getOption from "./option";

const NetMapChart = ({ value }) => {
  const mapOption = useMemo(() => {
    return getOption(value);
  }, [value]);
  return (
    <div>
      <ReactECharts style={{ height: 500 }} option={{ ...mapOption }} />
    </div>
  );
};

export default NetMapChart;
