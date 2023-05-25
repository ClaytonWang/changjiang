import { get, map, mapValues } from "lodash";
import { calculateGeoZone } from "@/utils";

const getOption = (value, { animationPeriod = 200 } = {}) => {
  const { nodes } = value;

  const geoMap = mapValues(value.geoMap, (item) => {
    return item.split(",");
  });
  const boundingCoords = (() => {
    const cities = [...new Set(nodes)];
    const res = calculateGeoZone(cities, geoMap);
    return res;
  })();

  const getGeo = (cityName) => {
    return get(geoMap, cityName, "");
  };

  const getLineData = () => {
    return map(nodes, (node, index) => {
      const next = index === nodes.length - 1 ? nodes[0] : nodes[index + 1];
      return {
        fromName: node,
        toName: next,
        coords: [getGeo(node), getGeo(next)],
      };
    });
  };

  const getScatterData = () => {
    return map(nodes, (node) => {
      return {
        name: node,
        value: getGeo(node),
      };
    });
  };

  return {
    tooltip: {
      trigger: "item",
    },
    backgroundColor: "#E6EBF5",
    legend: {
      orient: "vertical",
      top: "bottom",
      left: "right",
      data: ["北京 Top10"],
      textStyle: {
        color: "#fff",
      },
      selectedMode: "single",
    },
    geo: {
      map: "china",
      label: {
        show: false,
      },
      roam: false, //是否允许缩放
      emphasis: {
        label: {
          show: true,
        },
      },
      // boundingCoords,
      itemStyle: {
        normal: {
          color: "#FAFAFA", //地图背景色
          borderColor: "#E2E6E9", //省市边界线00fcff 516a89
          borderWidth: 1,
        },
        emphasis: {
          color: "rgba(37, 43, 61, .3)", //悬浮背景
        },
      },
    },
    series: [
      {
        type: "lines",
        zlevel: 2,
        symbol: ["none", "arrow"],
        symbolSize: 6,
        lineStyle: {
          color: "#a6c84c",
          width: 1,
          opacity: 1,
          curveness: 0.1,
        },
        tooltip: {},
        animation: true,
        animationDuration: animationPeriod,
        animationEasing: "cubicOut",
        animationDelay: (index) => {
          return (index + 2) * animationPeriod;
        },
        animationDurationUpdate: animationPeriod,
        animationEasingUpdate: "cubicOut",
        animationDelayUpdate: (index) => {
          return (index + 2) * animationPeriod;
        },
        data: getLineData(),
      },
      {
        type: "scatter",
        coordinateSystem: "geo",
        zlevel: 2,
        label: {
          show: false,
          position: "right",
          formatter: "{b}",
        },
        tooltip: {},
        markPoint: {
          data: [
            {
              coord: ["116.405285", "39.904989"],
            },
          ],
          symbol: "pin",
          symbolSize: 20,
          itemStyle: {
            color: "#fff",
            borderColor: "red",
            borderJoin: "round",
            borderWidth: 4,
          },
        },
        symbolSize: 5,
        itemStyle: {
          color: "#a6c84c",
        },
        animation: true,
        animationEasing: "cubicOut",
        data: getScatterData(),
      },
    ],
  };
};

export default getOption;
