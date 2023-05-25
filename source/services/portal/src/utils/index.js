import { Grid } from "antd";
import randomColor from "randomcolor";
import useScrollPosition from "@react-hook/window-scroll";
import moment from 'moment';

const useScreenSize = () => {
  const screens = Grid.useBreakpoint();
  const testList = ["xxl", "xl", "lg", "md", "sm", "xs"];
  for (const item of testList) {
    if (screens[item]) {
      return item;
    }
  }
  return "xs";
};

const useScrolled = () => {
  const scrollY = useScrollPosition(30);
  return scrollY >= 10;
};

// 计算坐标的显示区域
const calculateGeoZone = (nodes = [], geoMap = {}) => {
  const res = {
    x: [73.66, 135.05],
    y: [3.86, 53.55],
  };
  for (const item of nodes) {
    const [x, y] = geoMap[item];
    res.x = [Math.max(x, res.x[0]), Math.min(x, res.x[1])];
    res.y = [Math.max(y, res.y[0]), Math.min(y, res.y[1])];
  }
  return [
    [res.x[0], res.y[0]],
    [res.x[1], res.y[1]],
  ];
};

// 获取颜色列表 for charts
const DEFAULT_COLOR_LIST = ["#C5BDF6", "#FCE38D", "#FFBFBB", "#BFDDFF"];
const getColors = (len = 20) => {
  return [
    ...DEFAULT_COLOR_LIST,
    ...randomColor({
      count: len - DEFAULT_COLOR_LIST.length,
    }),
  ];
};

const transformTime = (value, format = 'YYYY/MM/DD HH:mm:ss') => {
  if (!value) {
    return '';
  }
  return moment(value).format(format);
};

export { useScreenSize, useScrolled, calculateGeoZone, getColors, transformTime };
