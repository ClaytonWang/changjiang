import { get, each, map, mapValues, includes } from "lodash";
import tinycolor from "tinycolor2";
import { calculateGeoZone, getColors } from "@/utils";

const getOption = (value) => {
  const geoMap = mapValues(value.geoMap, (item) => {
    return item.split(",");
  });
  const seriesData = (() => {
    return map(value.nodes, (line) => {
      return [
        line,
        map(line.to, (city) => {
          return [
            {
              name: city,
              from: line.from,
              id: line.id,
            },
          ];
        }),
      ];
    });
  })();
  const boundingCoords = (() => {
    const cities = (() => {
      let list = [];
      each(value.nodes, (item) => {
        list = list.concat(item.from);
        list = list.concat(item.to);
      });
      return [...new Set(list)];
    })();
    const res = calculateGeoZone(cities, geoMap);
    return res;
  })();
  const colors = getColors();

  const convertData = function ([fromCity, data]) {
    var res = [];
    const fromCoord = geoMap[fromCity.from];
    for (let i = 0; i < data.length; i++) {
      const dataItem = data[i];
      const toCoord = geoMap[dataItem[0].name];
      if (fromCoord && toCoord) {
        res.push([
          {
            coord: fromCoord,
            value: dataItem[0].value,
          },
          {
            coord: toCoord,
            dataItem: dataItem,
          },
        ]);
      }
    }
    return res;
  };

  const getCityData = (item) => {
    const cityName = item[0].from;
    const stores = (() => {
      const res = [];
      each(seriesData, (series, key) => {
        const d = series[0];
        if (cityName === d.from) {
          res.push({
            id: d.id,
            color: colors[key],
            self: includes(d.to, cityName),
          });
        }
      });
      return res;
    })();
    return [
      {
        name: `${item[0].from}`,
        value: geoMap[item[0].from].concat([10]),
        stores,
      },
    ];
  };

  const series = [];
  seriesData.forEach(function (item, i) {
    series.push(
      // 线路
      {
        type: "lines",
        zlevel: 2,
        effect: {
          show: true,
          period: 4, //箭头指向速度，值越小速度越快
          trailLength: 0.1, //特效尾迹长度[0,1]值越大，尾迹越长重
          symbol: "circle", //箭头图标
          symbolSize: 3, //图标大小
          color: "#fff",
        },

        lineStyle: {
          normal: {
            width: 2, //尾迹线条宽度
            opacity: 0.7, //尾迹线条透明度
            curveness: 0.1, //尾迹线条曲直度
            color: (params) => {
              return colors[i];
            },
          },
          color: "red",
        },
        tooltip: {
          show: false,
          trigger: "item",
          backgroundColor: "rgba(8, 18, 42, 0.85)",
          borderColor: "#040616",
          showDelay: 0,
          hideDelay: 0,
          enterable: true,
          transitionDuration: 0,
          extraCssText: "z-index:100",
          textStyle: {
            color: "#fff",
          },
          formatter: function (params, ticket, callback) {
            const v = get(params, ["data", "dataItem", 0]);
            const res = `
              <div>
                <div>线路：</div>
                <div>${v.from}(${v.id}) --> ${v.name}</div>
              </div>
            `;
            return res;
          },
        },
        data: convertData(item),
      },
      // 分仓
      {
        type: "effectScatter",
        coordinateSystem: "geo",
        zlevel: 2,
        symbol: "circle",
        symbolSize: function (val) {
          return 6; //圆环大小
        },
        itemStyle: {
          normal: {
            show: false,
            color: (params) => {
              return tinycolor(colors[i]).darken().toString();
            },
            borderWidth: 0,
          },
        },
        label: {
          show: true,
          color: "#5F5867",
          offset: [0, 16],
          formatter: (params) => {
            return params?.data?.name;
          },
        },
        tooltip: {
          show: false,
          trigger: "item",
          backgroundColor: "rgba(8, 18, 42, 0.85)",
          borderColor: "#040616",
          showDelay: 0,
          hideDelay: 0,
          enterable: true,
          transitionDuration: 0,
          extraCssText: "z-index:100",
          textStyle: {
            color: "#fff",
          },
          formatter: function (params, ticket, callback) {
            const v = get(params, ["data", "dataItem", 0], {});
            const res = `
              <div>
                <div>分仓：</div>
                <div>${v.name}</div>
              </div>
            `;
            return res;
          },
        },
        data: item[1].map(function (dataItem) {
          return {
            dataItem: dataItem,
            name: dataItem[0].name,
            value: geoMap[dataItem[0].name].concat([dataItem[0].value]),
          };
        }),
      },
      // 主仓
      {
        type: "scatter",
        coordinateSystem: "geo",
        zlevel: 1,
        rippleEffect: {
          period: 4,
          brushType: "stroke",
          scale: 4,
        },
        tooltip: {
          show:true,
          trigger: "item",
          backgroundColor: "rgba(8, 18, 42, 0.85)",
          borderColor: "#040616",
          showDelay: 0,
          hideDelay: 0,
          enterable: true,
          transitionDuration: 0,
          extraCssText: "z-index:100",
          textStyle: {
            color: "#fff",
          },
          formatter: function (params, ticket, callback) {
            const v = get(params, ["data"], {});
            const storeHtml = map(v.stores, (item) => {
              return `<div>
                  <div>仓库(${item.id})</div>
                </div>`;
            }).join("");
            const res = `
              <div>
                <div>${v.name}</div>
                ${storeHtml}
              </div>
            `;
            return res;
          },
        },
        symbol: "circle",
        symbolSize: function (val) {
          return 17; //圆环大小
        },
        itemStyle: {
          normal: {
            show: false,
            color: (params) => {
              return tinycolor(colors[i]).darken().toString();
            },
            borderWidth: 1,
          },
        },
        data: getCityData(item, i),
      }
    );
  });

  const option = {
    tooltip: {
      show:false,
      trigger: "item",
      backgroundColor: "rgba(37, 43, 61, .3)",
      showDelay: 0,
      hideDelay: 0,
      enterable: true,
      transitionDuration: 0,
      extraCssText: "z-index:100",
    },
    backgroundColor: "#E6EBF5",
    geo: {
      map: "china",
      zoom: 1,
      label: {
        emphasis: {
          show: false,
        },
      },
      boundingCoords,
      roam: true, //是否允许缩放
      emphasis: {
        disabled: true,
      },
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
    series: series,
  };
  return option;
};

export default getOption;
