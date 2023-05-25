import fileDownload from 'js-file-download';
import { each, map, mapValues, omit } from 'lodash';
import request from './request';

const addKeyToTableData = (data, key = 'id') => {
  each(data, (file) => {
    let index = 0;
    each(file?.data, (item) => {
      item[key] = ++index;
    });
  });
  return data;
};
const removeKeyFromTableData = (data, key = 'id') => {
  return mapValues(data, (file) => {
    return {
      ...file,
      data: map(file.data, (item) => {
        return omit(item, [key, 'index']);
      }),
    };
  });
};

const model = {
  // GET 获取模型文件数据
  async getFileData(modelType, params = {}) {
    const res = await request.get('file/view', {
      params: {
        category: modelType,
        ...params,
      },
    });
    return addKeyToTableData(res?.data?.data);
  },
  // POST 保存模型文件数据
  async saveFileData(modelType, data) {
    const res = await request.post('file/save', {
      category: modelType,
      data: removeKeyFromTableData(data),
    });
    await model.confirmFileUpload(modelType);
    return res.data;
  },
  // GET 确认文件上传
  async confirmFileUpload(modelType) {
    const res = await request.get('file/confirm', {
      params: {
        category: modelType,
      },
    });
    return res.data;
  },
  // POST 下载文件
  async getFileDownloadUrl(modelType, filename) {
    const res = await request
      .post(
        'file/download',
        {
          category: modelType,
        },
        {
          responseType: 'blob',
        }
      )
      .then((res) => {
        fileDownload(res.data, filename);
      });
  },
  // POST 开启模型计算
  async runModel(...params) {
    const [modelType, data] = params;
    const res = await request.post('model/predict', {
      category: modelType,
      data,
    });
    return res.data;
  },
  // GET 预览模型默认数据
  async previewModel(...params) {
    const [modelType] = params;
    if (modelType === 'tage') {
      return {
        data: {
          result: [],
        },
      };
    }
    const res = await request.get('demo', {
      params: {
        category: modelType,
      },
    });
    return res.data;
  },
  // GET 重制数据
  async recover(modelType) {
    const res = await request.get('reset', {
      params: {
        category: modelType,
      },
    });
    return res.data;
  },
  UPLOAD_URL: '/api/v1/file/upload',
};

// 踏歌自有API
model.tage = {
  async getMap(freq = 150) {

    const res = await request.get('tg/map', {
      params: {
        freq,
        user_id: window.DBCJ_USER?.name,
      },
    });
    return res.data;
  },

  _eventSource: null,
  clearEventSource: () => {
    if (model.tage._eventSource) {
      model.tage._eventSource.close();
      model.tage._eventSource = null;
    }
  },

  async predict({ interval = 1, truck_num = 5, env = "1", onData } = {}) {
    model.tage.clearEventSource();
    const urlParams = new URLSearchParams({
      user_id: window.DBCJ_USER?.name,
      interval: interval.toString(),
      truck_num: truck_num.toString(),
      env: env.toString()//秒
    });
    const url = `/api/v1/tg/predict?${urlParams.toString()}`;
    const eventSource = new EventSource(url);
    eventSource.onmessage = (event) => {
      const data = (() => {
        try {
          return JSON.parse(event.data);
        } catch (error) {
          console.log('🚀 ~ file: model.js:138 ~ data ~ error:', error);
          return [];
        }
      })();
      onData?.(data);
    };
    eventSource.onerror = (event) => {
      console.log('predict:', event)
    };
    model.tage._eventSource = eventSource;
  },

  async barrier(lane_id) {
    const url = `tg/barrier`;
    const res = await request.post(url, {
      user_id: window.DBCJ_USER?.name,
      lane_id
    });
    return res.data;
  }
};

export default model;
