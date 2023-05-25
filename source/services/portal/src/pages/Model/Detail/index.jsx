import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
} from 'react';
import { each, get, set, has, map, find, toNumber, isString } from 'lodash';
import { useParams } from 'react-router-dom';
import { Row, Col, Tabs, Button, Space, Form, message } from 'antd';
import { Section, CTag, CIcon, ModelForm, ModelData } from '@/components';
import modelService from '@/services/model';
import { Detail, Result } from '../components/ModelDetail';
import { ModelRun } from '../components/ModelRun';
import { data } from '../data';
import '../index.less';

const DemoDataContext = createContext();

const formatValues = (v, config) => {
  try {
    const fields = get(config, 'run.form');
    const formatList = (() => {
      const res = [];
      each(fields, (section, skey) => {
        each(section, (field) => {
          if (field.name && field.format) {
            res.push({
              path: `${skey}.${field.name}`,
              format: field.format,
            });
          }
        });
      });
      return res;
    })();
    each(formatList, (item) => {
      if (has(v, item.path)) {
        const fv = (() => {
          const currentv = get(v, item.path);
          if (item.format === 'toArray|toNumber' && isString(currentv)) {
            return map((currentv || '').split(','), (itemv) => toNumber(itemv));
          }
          return currentv;
        })();
        set(v, item.path, fv);
      }
    });
    return v;
  } catch (error) {
    return v;
  }
};

const ModelDetail = () => {
  const { id } = useParams();
  const [tab, setTab] = useState('detail');
  // const [tab, setTab] = useState('run');
  const [modelResult, setModelResult] = useState({});
  const [deftData, setDeftData] = useState({});
  const [dataForm] = Form.useForm();
  const [syncDataParams, setSyncDataParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [modelExtra, setModelExtra] = useState({});

  const mdata = useMemo(() => {
    return find(data, { id: id - 0 }) || {};
  }, [id]);

  const handleFormChange = useCallback(
    (params) => {
      if (mdata.category === 'tsptw' && params?.scence.graph_size) {
        setSyncDataParams({
          patch: true,
          graph_size: params?.scence.graph_size,
        });
      }
    },
    [mdata.category, setSyncDataParams]
  );

  useMemo(() => {
    if (mdata.category) {
      modelService.previewModel(mdata.category).then((res) => {
        if (res.data?.kwargs) {
          dataForm.setFieldsValue(res.data.kwargs);
          setDeftData(res.data.kwargs);
        }
        if (res.data?.result) {
          setModelResult(res.data.result);
        }
      });
    }
    if (mdata.category === 'tage') {
      dataForm.setFieldsValue({ scence: { truck: 10 } });
      setLoading(true);
      modelService.tage.getMap().then((res) => {
        setModelExtra({
          map: res.map_data,
          metrics: res.metrics,
        });
        setLoading(false);
      });
    }
  }, [mdata.category]);

  const handleRun = useCallback(async () => {
    try {
      setLoading(true);
      const values = dataForm.getFieldValue();
      const fvalues = formatValues(values, mdata);
      if (mdata.category === 'tage') {
        const truck_num = fvalues?.scence?.truck || 10;
        modelService.tage.predict({
          truck_num,
          onData: (res) => {
            setLoading(false);
            setModelResult(res);
          },
        });
      } else {
        const resultData = await modelService
          .runModel(mdata.category, fvalues)
          .then((res) => {
            setLoading(false);
            return get(res, 'data.result');
          });
        setModelResult(resultData);
      }

      message.success('模型计算成功');
    } catch (error) {
      setLoading(false);
      message.error('模型计算失败，请稍后尝试');
    }
  }, [mdata.category, mdata]);
  useEffect(() => {
    return () => {
      modelService.tage.clearEventSource();
    };
  }, [mdata.category]);

  return (
    <div className="page page-model-detail">
      <div className="model-detail-header">
        <Section>
          <div className="brain-wrapper">
            <div className="title">{mdata.title}</div>
            <div className="tags">
              {map(mdata.tags, (item) => {
                return (
                  <CTag size="small" key={item}>
                    {item}
                  </CTag>
                );
              })}
            </div>
            <div className="operators">
              <Row>
                <Col span={12}>
                  <Tabs
                    activeKey={tab}
                    onChange={setTab}
                    items={[
                      {
                        key: 'detail',
                        label: (
                          <>
                            <CIcon type="icon-model" />
                            <span>模型介绍</span>
                          </>
                        ),
                      },
                      {
                        key: 'run',
                        label: (
                          <>
                            <CIcon type="icon-model-run" />
                            <span>试运行</span>
                          </>
                        ),
                      },
                    ]}
                  />
                </Col>
                <Col span={12} className="button-zone">
                  <Button size="small">
                    <Space>
                      <CIcon type="icon-tools" />
                      <span>Notebook</span>
                    </Space>
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </Section>
      </div>
      <div className="brain-wrapper model-detail-zone">
        {tab === 'detail' && (
          <Row gutter={64}>
            <Col xs={24} sm={12}>
              <Detail data={mdata} />
            </Col>
            <Col xs={24} sm={12}>
              <div className="detail-card">
                <div className="model-section-title model-title">模型结果</div>
                <Result data={mdata} />
              </div>
            </Col>
          </Row>
        )}
        {tab === 'run' && (
          <DemoDataContext.Provider value={{ deftData, setDeftData, dataForm }}>
            <div className="model-detail-run">
              <ModelForm
                data={mdata}
                form={dataForm}
                onValuesChange={handleFormChange}
              />
              {mdata.category !== 'tage' && (
                <ModelData data={mdata} syncParams={syncDataParams} />
              )}
              <ModelRun
                loading={loading}
                data={{
                  ...mdata,
                  ...modelExtra,
                }}
                onRun={handleRun}
                modelResult={modelResult}
              />
            </div>
          </DemoDataContext.Provider>
        )}
      </div>
    </div>
  );
};

export default ModelDetail;

export const useDemoData = () => useContext(DemoDataContext);
