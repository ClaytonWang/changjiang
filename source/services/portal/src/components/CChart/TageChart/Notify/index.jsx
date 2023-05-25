import { useMemo, useState, useEffect } from 'react';
import { Space } from 'antd';
import { map, get, isEmpty } from 'lodash';
import {
  CheckCircleFilled,
  SyncOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useTransition, animated } from '@react-spring/web';
import './index.less';

const getColor = (status) => {
  return get(
    {
      success: '#5ABA47',
      running: '#5ABA47',
      error: '#FF5858',
      warning: '#E57120',
    },
    status,
    '#ffffff'
  );
};
const getStatusIcon = (status) => {
  return get(
    {
      success: <CheckCircleFilled style={{ fontSize: 18 }} />,
      running: <SyncOutlined spin style={{ fontSize: 18 }} />,
      error: <WarningOutlined style={{ fontSize: 18 }} />,
      warning: <WarningOutlined style={{ fontSize: 18 }} />,
    },
    status,
    null
  );
};

const NotifyItem = ({ title, content, status = 'success' }) => {
  const color = getColor(status);
  const formatContent = useMemo(() => {
    try {
      return content
        .replaceAll(/([\w\d]+)/g, '`$1`')
        .split('`')
        .map((item, index) => {
          if (/^[\w\d]+$/.test(item)) {
            return (
              <span
                style={{
                  color,
                }}
                key={index}
              >
                {item}
              </span>
            );
          }
          return <span key={index}>{item}</span>;
        });
    } catch (error) {
      return content;
    }
  }, [content]);

  return (
    <div className={`card notify-item notify-item-${status}`}>
      <div
        style={{
          color,
        }}
        className="notify-title"
      >
        <Space>
          {getStatusIcon(status)}
          <span>{formatContent}</span>
        </Space>
      </div>
    </div>
  );
};

const Notify = ({ items }) => {
  const transitions = useTransition(items, {
    from: { opacity: 0, height: 0, life: '99%' },
    keys: (item) => item.status,
    enter: (item) => async (next, cancel) => {
      await next({ opacity: 1 });
      await next({ life: '0%' });
    },
    leave: [{ opacity: 0 }, { height: 0 }],
    onRest: (result, ctrl, item) => {
      item.onClose?.(item);
    },
    config: (item, index, phase) => (key) =>
      phase === 'enter' && key === 'life'
        ? { duration: item.duration }
        : { tension: 125, friction: 30, precision: 0.1 },
  });

  return (
    <div className="tag-notify-zone">
      {transitions(({ life, ...style }, item) => {
        return (
          <animated.div style={{ position: 'relative', ...style }}>
            <NotifyItem {...item} />
            {item.process ? (
              <animated.div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 'auto',
                  backgroundImage: 'linear-gradient(130deg, #00b4e6, #00f0e0)',
                  height: 3,
                  right: life,
                }}
              ></animated.div>
            ) : null}
          </animated.div>
        );
      })}
    </div>
  );
};

export default Notify;
