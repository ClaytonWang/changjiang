import { Statistic } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { map, get, isEmpty } from 'lodash';
import titleSvg from './Title.svg';
import listCarPng from './list-car.png';
import listMining from './list-mining.png';
import listUnloading from './list-unloading.png';
import listSpeed from './list-speed.png';
import { useState } from 'react';
import './index.less';

const TageInfo = ({ data }) => {
  const hasData = !isEmpty(data);
  const { overall, speed, load, unload, truck_num } = data;
  const [full, setFull] = useState(false);

  const listInfo = [
    {
      icon: listCarPng,
      label: '车辆总数',
      value: truck_num || 0,
      unit: '辆',
      status: 'error',
    },
    {
      icon: listSpeed,
      label: '平均车速',
      value: speed,
      unit: 'km/h',
      status: 'success',
    },
    {
      icon: listMining,
      label: '采矿点',
      value: load,
      unit: '个',
      status: 'success',
    },
    {
      icon: listUnloading,
      label: '卸矿点',
      value: unload,
      unit: '个',
      status: 'success',
    },
  ];

  const getStatus = (status) => {
    return get(
      {
        success: '正常',
        error: '异常',
      },
      status,
      status
    );
  };

  const handelFullPage = () => {
    const fulldiv = document.getElementsByClassName('run-result')[0];
    fulldiv?.requestFullscreen();
    if (fulldiv.RequestFullScreen) {
      fulldiv.RequestFullScreen();
      //兼容Firefox
    } else if (fulldiv.mozRequestFullScreen) {
      fulldiv.mozRequestFullScreen();
      //兼容Chrome, Safari and Opera等
    } else if (fulldiv.webkitRequestFullScreen) {
      fulldiv.webkitRequestFullScreen();
      //兼容IE/Edge
    } else if (fulldiv.msRequestFullscreen) {
      fulldiv.msRequestFullscreen();
    }
    setFull(true);
  };

  const handelExtFull = () => {
    if (document.exitFullScreen) {
      document.exitFullScreen();
      //兼容Firefox
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
      //兼容Chrome, Safari and Opera等
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
      //兼容IE/Edge
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setFull(false);
  };

  return (
    <div className="tageinfo-zone">
      <div className="title">
        <img src={titleSvg} alt="title" />
        {full ? (
          <FullscreenExitOutlined onClick={handelExtFull} />
        ) : (
          <FullscreenOutlined onClick={handelFullPage} />
        )}
      </div>
      <div className="card statistics">
        <div className="statistics-title">总任务量</div>
        <div className="statistics-wrapper">
          {hasData ? (
            <>
              <div className="statistics-content">
                <Statistic
                  value={parseFloat(overall ?? 0).toFixed(2)}
                  suffix="万吨"
                />
                {/* <span className="statistics-rate">
                  <Statistic
                    value={11.28}
                    precision={2}
                    prefix={<CaretUpOutlined />}
                    // prefix={<CaretDownOutlined />}
                    valueStyle={{ color: '#FF5858' }}
                    // valueStyle={{ color: '#5ABA47' }}
                    suffix="%"
                  />
                </span> */}
              </div>
              <div className="card info">
                {map(listInfo, (item) => {
                  return (
                    <div className="info-item" key={item.label}>
                      <span className="img-wrapper">
                        <img height={14} src={item.icon} alt="img" />
                      </span>
                      <span className="info-label">{item.label}</span>
                      <span className="info-value">
                        {hasData ? (
                          <>
                            <b>{item.value}</b> {item.unit || ''}
                          </>
                        ) : (
                          ''
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={{ height: 48 }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TageInfo;
