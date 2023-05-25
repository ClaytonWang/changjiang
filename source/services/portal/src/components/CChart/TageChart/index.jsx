import { useEffect, useMemo, useState, useCallback } from 'react';
import { SyncOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom/client';
import AMapLoader from '@amap/amap-jsapi-loader';
import modelService from '@/services/model';
import Notify from './Notify';
import Message from './Message';
import _ from 'lodash';
import './index.less';
import truck from './image/truck.png';
import gs_truck from './image/gs_truck.gif';
import rs_truck from './image/rs_truck.gif';
import { useLocation } from 'react-router-dom';
import { usePageVisibility } from 'react-page-visibility';

const cars = {};
const barrierLines = [];

const Card = ({ title, text = '立即优化', onClick }) => {
  const [loading, setLoading] = useState(false);

  const btnClick = useCallback(async () => {
    setLoading(true);
    onClick?.(async ({ type, node }) => {
      if (type === 'road') {
        await modelService.tage.barrier(node);
      }
      if (type === 'car') {
        cars[node].marker.stop = true;
      }
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    });
  }, []);

  return (
    <>
      <p>{title}</p>
      {!loading && <button onClick={btnClick}>{text}</button>}
      {loading && (
        <div style={{ width: 88, height: 29 }}>
          <SyncOutlined spin /> 优化中...
        </div>
      )}
    </>
  );
};

const TageChart = ({ map: mapData, value: predicRst }) => {
  const [map, setMap] = useState(null);
  const [amap, setAMap] = useState(null);
  const [notifies, setNotifies] = useState([]);
  const [messages, setMessages] = useState([]);
  const isPageVisible = usePageVisibility();

  const { search } = useLocation();
  const isDebug = search?.indexOf('debug') != -1;

  const paths = useMemo(() => {
    const { paths: _paths } = mapData;
    if (!_paths?.forEach) {
      return [];
    }
    const _tempPath = [];
    _paths.forEach((p) => {
      p.forEach((r) => {
        r.paths.forEach((v) => {
          _tempPath.push(v);
        });
      });
    });

    const allCoordinates = [];
    const highligthNodes = [];

    const notBarrieRoad = [10, 538, 532];
    _tempPath.forEach((v) => {
      const nodes = v.coordinates;
      nodes.forEach((n) => {
        if (n.value.length > 15 && !notBarrieRoad.includes(n.node_name)) {
          highligthNodes.push(n);
        }
        allCoordinates.push(n.value);
      });
    });

    return [allCoordinates, highligthNodes];
  }, [mapData]);

  const getCardInfo = useCallback((title, onClick) => {
    const div = document.createElement('div');
    div.className = 'card';
    const root = ReactDOM.createRoot(div);
    const el = <Card title={title} onClick={onClick} />;
    root.render(el);
    return div;
  }, []);

  // 绘制路线
  useEffect(() => {
    if (!map || !amap || paths.length === 0) return;
    const AMap = amap;

    var hoverPolyline = new AMap.Polyline({
      map,
      cursor: 'pointer',
      strokeColor: 'red',
      strokeOpacity: 1, //线透明度
      strokeWeight: 8,
      showDir: true,
      zIndex: 20,
    });

    const lines = [];
    const [allCoordinates, nodes] = paths;

    lines.push(
      new AMap.Polyline({
        path: allCoordinates,
        showDir: true,
        draggable: false,
        geodesic: false,
        strokeColor: '#2b9244', //线颜色
        strokeOpacity: 0.7,
        strokeWeight: 3,
      })
    );

    //高亮路线节点
    nodes.forEach(({ node_name, value }) => {
      lines.push(
        new AMap.Polyline({
          path: value,
          showDir: true,
          draggable: false,
          extData: { node_name },
          geodesic: false,
          cursor: 'pointer',
          strokeColor: '#2b9244', //线颜色
          strokeOpacity: 0.7,
          strokeWeight: 3,
        })
          .on('mouseover', (e) => {
            hoverPolyline.setPath(value);
            hoverPolyline.show();
          })
          .on('mouseout', (e) => {
            hoverPolyline.hide();
          })
          .on('click', (e) => {
            const line = e.target;
            line.setOptions({
              strokeColor: 'red',
              strokeWeight: 4,
              strokeOpacity: 1,
            });

            const { node_name } = line.getExtData();
            const _wind = new AMap.InfoWindow({
              offset: new AMap.Pixel(-37, -65),
              closeWhenClickMap: false,
              showShadow: true,
              retainWhenClose: false,
            });

            _wind.on('close', () => {
              line.remove();
            });

            _wind.setContent(
              getCardInfo('道路异常', async (callback) => {
                setNotifies([
                  {
                    status: 'running',
                    content: '智能调度规划中，请稍后...',
                    process: true,
                    onClose: () => {
                      setNotifies([]);
                      setTimeout(() => {
                        const [_highlightCars, notifyContent] =
                          randomHighlightCars(AMap);
                        setNotifies([
                          {
                            status: 'success',
                            onClose: () => {
                              setNotifies([]);
                            },
                            duration: 5000,
                            process: false,
                            content: `规划完成，车辆${notifyContent}路线与目标更改至采矿点2703`,
                          },
                        ]);
                      }, 500);
                    },
                    duration: 3000,
                  },
                ]);
                await callback({ type: 'road', node: node_name });

                setTimeout(() => {
                  //remove old road
                  barrierLines.forEach((v) => {
                    v.remove();
                  });

                  //add new road
                  barrierLines.push(line);
                  _wind.hide();
                }, 1000);
              })
            );
            _wind.open(map, e.lnglat);
          })
      );

      // const _marker = new AMap.Marker({
      //   map,
      //   zIndex: 15,
      //   opacity: 0.8,
      //   position: value[0],
      //   cursor: 'pointer',
      //   clickable: true,
      //   draggable: false,
      //   visible: true,
      //   extData: {},
      //   icon: new AMap.Icon({
      //     size: new AMap.Size(17, 25),
      //     image: `${truck}`,
      //     imageSize: new AMap.Size(17, 25),
      //   }),
      //   offset: new AMap.Pixel(-10, -15),
      // });
      // _marker.on('click', (e) => {
      //   const _car = e.target;
      //   const icon = _car.getIcon();
      //   icon.setImageSize(new AMap.Size(20, 25));
      //   icon.setSize(new AMap.Size(20, 25));
      //   icon.setImage(rs_truck);
      //   _car.setIcon(icon);

      //   const _wind = new AMap.InfoWindow({
      //     offset: new AMap.Pixel(-40, -70),
      //     closeWhenClickMap: false,
      //     showShadow: true,
      //     retainWhenClose: false,
      //   });

      //   _wind.on('close', () => {
      //     icon.setImage(truck);
      //     icon.setImageSize(new AMap.Size(17, 25));
      //     icon.setSize(new AMap.Size(17, 25));
      //     _car.setIcon(icon);
      //   });

      //   _wind.setContent(
      //     getCardInfo('车辆异常', async (callback) => {
      //       setTimeout(() => {
      //         setNotifies([
      //           {
      //             status: 'success',
      //             title: '智能调度',
      //             content: '重新规划完成。',
      //           },
      //         ]);
      //         // setTimeout(() => {
      //         //   setNotifies([]);
      //         // }, 2000);
      //         _wind.hide();
      //       }, 2000);
      //     })
      //   );
      //   _wind.open(map, e.target.getPosition());
      // });
    });

    map.add(new AMap.OverlayGroup(lines));
  }, [paths, map, amap]);

  const randomHighlightCars = (AMap, carid) => {
    //随机高亮其他卡车
    const arrCars = Object.values(cars);
    let _num = 3;
    let _highlightCars = [];
    if (arrCars.length > 20) {
      _num = 6;
    }
    _highlightCars = _.sampleSize(arrCars, _num);

    _highlightCars.forEach(({ marker: v, board }) => {
      const { car_id: id } = v.getExtData();

      if (id !== carid) {
        const _icon = v.getIcon();
        _icon.setImageSize(new AMap.Size(20, 26));
        _icon.setSize(new AMap.Size(20, 26));
        _icon.setImage(gs_truck);
        v.setIcon(_icon);
        console.log(carid);
        if (!carid) {
          //道路损坏的自动调度车辆，用同一个变量barrier表示
          v.barrier = true;
          if (typeof board.changeTime === 'number') {
            board.changeTime = new Date();
          }
          board.state = '路线受阻';
        } else {
          //车辆损坏的自动调度车辆，用同一个变量barrier表示
          v.barrier = true;
          board.changeTime = new Date();
          board.state = '目标更改';
          board.destination = '2703';
        }
      }
    });

    setTimeout(() => {
      _highlightCars.forEach(({ marker: v, board }) => {
        const { car_id: id } = v.getExtData();
        if (id !== carid) {
          const _icon = v.getIcon();
          _icon.setImageSize(new AMap.Size(17, 25));
          _icon.setSize(new AMap.Size(17, 25));
          _icon.setImage(truck);
          v.setIcon(_icon);

          //15s后恢复
          v.barrier = false;
          board.changeTime = new Date();
          board.state = '行驶中';
        }
      });
    }, 15000);

    const notifyContent = _highlightCars
      // .sort((a, b) => {
      //   const { car_id: a_id } = a.getExtData();
      //   const { car_id: b_id } = b.getExtData();
      //   return parseInt(a_id) - parseInt(b_id);
      // })
      .map(({ marker: v }) => {
        const { car_num } = v.getExtData();
        return car_num;
      })
      .join(',');

    return [_highlightCars, notifyContent];
  };

  // 矿车
  useEffect(() => {
    if (!map || !amap || predicRst.length === 0) return;
    const AMap = amap;

    for (const rst of predicRst) {
      let _marker;
      const { car_id, position, curr_node } = rst?.map_data;
      const { number: car_num } = rst?.board;
      if (_.has(cars, car_id)) {
        let { marker: _marker, board: _board } = cars[car_id];

        if (!isPageVisible) {
          _marker.hide();
        } else {
          setTimeout(() => {
            _marker.show();
          }, 2000);
        }

        if (!_marker.stop) {
          // 如果是道路受阻的车辆，保持原来的状态
          if (!_marker.barrier) {
            _board = rst.board;
          }

          _marker.moveTo(position, {
            duration: 800,
            autoRotation: true,
          });
        } else {
          if (typeof _board.changeTime === 'number') {
            _board.changeTime = new Date();
          }

          _board.state = '异常停靠';
        }

        cars[car_id] = { marker: _marker, board: _board };
      } else {
        _marker = new AMap.Marker({
          map,
          zIndex: 15,
          opacity: 0.8,
          position: position,
          cursor: 'pointer',
          clickable: true,
          draggable: false,
          visible: true,
          extData: { car_id, curr_node, car_num },
          icon: new AMap.Icon({
            size: new AMap.Size(17, 25),
            image: `${truck}`,
            imageSize: new AMap.Size(17, 25),
          }),
          offset: new AMap.Pixel(-10, -15),
        });

        if (isDebug) {
          _marker.setLabel({
            content: car_id,
            direction: 'bottom',
          });
        }

        const _wind = new AMap.InfoWindow({
          offset: new AMap.Pixel(-40, -70),
          closeWhenClickMap: false,
          showShadow: true,
          retainWhenClose: false,
        });

        _marker.on('click', (e) => {
          const _car = e.target;
          const { car_id, curr_node } = _car.getExtData();
          const icon = _car.getIcon();

          icon.setImageSize(new AMap.Size(20, 25));
          icon.setSize(new AMap.Size(20, 25));
          icon.setImage(rs_truck);
          _car.setIcon(icon);

          _wind.on('close', () => {
            icon.setImage(truck);
            icon.setImageSize(new AMap.Size(17, 25));
            icon.setSize(new AMap.Size(17, 25));
            _car.setIcon(icon);
          });

          _wind.setContent(
            getCardInfo('车辆异常', async (callback) => {
              setNotifies([
                {
                  status: 'error',
                  title: '车辆损坏',
                  content: `车辆损坏：车辆V0${car_id}损坏，停靠位置R${curr_node}`,
                  onClose: () => {
                    setNotifies([]);
                    setTimeout(() => {
                      setNotifies([
                        {
                          status: 'running',
                          content: '智能调度规划中，请稍后...',
                          process: true,
                          onClose: () => {
                            setNotifies([]);
                            const [, notifyContent] = randomHighlightCars(
                              AMap,
                              car_id
                            );

                            setTimeout(() => {
                              setNotifies([
                                {
                                  status: 'success',
                                  onClose: () => {
                                    setNotifies([]);
                                  },
                                  duration: 5000,
                                  process: false,
                                  content: `智能调度完成，车辆${notifyContent}分担损坏车辆任务`,
                                },
                              ]);
                            }, 500);
                          },
                          duration: 3000,
                        },
                      ]);
                    }, 500);
                  },
                  duration: 3000,
                },
              ]);
              await callback({ type: 'car', node: car_id });

              setTimeout(() => {
                _wind.hide();
              }, 2000);
            })
          );
          _wind.open(map, _car.getPosition());
        });

        _marker.on('moving', (e) => {
          const _car = e.target;
          _wind.setPosition(_car.getPosition());
        });
        cars[car_id] = { marker: _marker, board: rst.board };
      }
    }
    const arrCars = Object.values(cars);
    setMessages([...arrCars]);
  }, [predicRst, map, amap]);

  //采、卸矿点。
  useEffect(() => {
    if (!map || !amap) return;
    const AMap = amap;

    const { mineral } = mapData;
    const mins = [];
    mineral.forEach(({ data, type, name }) => {
      if (name.indexOf('沿帮') != -1) return;

      mins.push(
        new AMap.Polygon({
          extData: { name },
          path: data,
          strokeColor: type === 'unload' ? '#7963EC' : '#55ADFF',
          fillColor: type === 'unload' ? '#7963EC' : '#55ADFF',
          fillOpacity: 0.7,
          strokeWeight: 1,
          strokeStyle: 'solid',
          strokeColor: type === 'unload' ? '#7963EC' : '#55ADFF',
        })
      );
    });

    map.add(new AMap.OverlayGroup(mins));
  }, [map, amap]);

  useEffect(() => {
    AMapLoader.load({
      key: 'b9ac6c84cd9e0937e56a6b1a7b815e3b',
      version: '2.0',
      plugins: ['AMap.MoveAnimation'],
    }).then((AMap) => {
      const _map = new AMap.Map('mapcontainer', {
        resizeEnable: true,
        zoomEnable: true,
        center: [119.595998, 45.486103],
        zoom: 14,
        showLabel: false,
        layers: [new AMap.TileLayer.Satellite({ opacity: 0.7 })],
      });

      // 暗遮罩效果
      new AMap.TileLayer.Flexible({
        map: _map,
        cacheSize: 300,
        zIndex: 9,
        createTile: function (x, y, z, success, fail) {
          var c = document.createElement('canvas');
          const { width, height } = _map.getSize();
          c.width = width;
          c.height = height;
          var cxt = c.getContext('2d');
          cxt.globalAlpha = 0.5;
          cxt.fillStyle = '#000';
          cxt.fillRect(0, 0, width, height);
          success(c);
        },
      });

      setMap(_map);
      setAMap(AMap);
    });

    window.setNotifies = setNotifies;
  }, []);

  return (
    <>
      <div
        style={{
          width: '100%',
          height: 800,
          padding: 0,
          margin: 0,
          background: '#222',
        }}
        id="mapcontainer"
      />
      <Notify items={notifies} />
      <Message items={messages} />
    </>
  );
};

export default TageChart;
