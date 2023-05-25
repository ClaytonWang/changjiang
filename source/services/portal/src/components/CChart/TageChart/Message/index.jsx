import { useMemo, useState, useEffect } from 'react';
import { map, get, isEmpty } from 'lodash';
import { transformTime } from '@/utils';
import './index.less';

const getColor = (status) => {
  return get(
    {
      目标更改: '#5ABA47',
      异常停靠: '#FF5858',
      路线受阻: '#E57120',
      采矿中: '#F4AC05',
      卸矿中: '#F4AC05',
    },
    status,
    '#ffffff'
  );
};

const RowItem = ({ number, state, changeTime, current, destination }) => {
  const color = getColor(state);

  return (
    <tr
      style={{
        color,
      }}
    >
      <td width="60px">{number}</td>
      <td width="80px">{state}</td>
      <td width="80px">{transformTime(changeTime, 'HH:mm:ss')}</td>
      <td width="80px">{current}</td>
      <td width="80px">{destination}</td>
    </tr>
  );
};

const Message = ({ items }) => {
  if (isEmpty(items)) return null;
  return (
    <div className="tag-message-zone">
      <div className="message-wrapper card">
        <table>
          <thead>
            <tr>
              <th width="60px">矿车编号</th>
              <th width="80px">车辆状态</th>
              <th width="80px">状态更新时间</th>
              <th width="80px">当前道路</th>
              <th width="80px">目的地</th>
            </tr>
          </thead>
          <tbody>
            {map(items, ({ board: item }, index) => {
              return <RowItem key={index} {...item} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Message;
