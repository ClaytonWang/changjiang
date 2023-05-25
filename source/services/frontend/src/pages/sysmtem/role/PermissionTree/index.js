import { List, Checkbox, Row, Col, App } from 'antd';
import api from '@/common/api';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { flattenDeep } from 'lodash';
import { populatePmsList } from '@/common/utils/util';
import { useAuth } from '@/common/hooks/useAuth';
import PERMISSION_MAP from '@/common/utils/permissions';

let _tmpRolePms = {};

const PermissionTree = ({ id, source }) => {
  const [rolePms, setRolePms] = useState([]);
  const [pmsSource, setPmsSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const { hasPermission } = useAuth();
  const { message } = App.useApp();

  const getCheckedPms = useCallback(
    (pmsPathIds, checkedValues) => {
      for (const item of pmsSource) {
        if (item.pmsPathIds.toString() === pmsPathIds.toString()) {
          const pms = item.pmsValues;
          const _ids = pms.map((p) => {
            if (p.label === '编辑' || p.label === '发布') {
              return p.value;
            }
            return '';
          });

          const shouldDisable = checkedValues.some((p) => _ids.indexOf(p) > -1);
          for (const p of pms) {
            if (p.label === '查看') {
              p.disabled = shouldDisable;
              if (shouldDisable && checkedValues.indexOf(p.value) === -1) {
                // 编辑和发布被选中后，查看应该被勾上
                checkedValues.push(p.value);
              }
              break;
            }
          }
        }
      }
      return [pmsPathIds.toString(), [...checkedValues]];
    },
    [pmsSource]
  );

  const requestPmsDetail = useCallback(async () => {
    try {
      setLoading(true);
      const { result } = await api.roleDetail({ id });
      const popPmsRslt = populatePmsList(result);
      const selectedValuse = popPmsRslt.map(
        ({ pmsValues, pmsPathIds, pmsPath }) => ({
          pmsValues: pmsValues.map(({ value }) => value),
          pmsPathIds,
          pmsPath,
        })
      );

      for (const item of selectedValuse) {
        const [_path, _ckvalue] = getCheckedPms(
          item.pmsPathIds,
          item.pmsValues
        );
        _tmpRolePms[_path] = _ckvalue;
      }

      setRolePms(flattenDeep(Object.values(_tmpRolePms)));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [getCheckedPms, id]);

  const updatePms = async (values) => {
    const params = { ...values, id };
    try {
      setLoading(true);
      await api.pmsUpdate(params);
      message.success('权限修改成功！');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    _tmpRolePms = {};
    requestPmsDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMemo(() => {
    setPmsSource(populatePmsList(source));
  }, [source]);

  const onChange = (pmsPathIds, checkedValues) => {
    const [, _ckvalue] = getCheckedPms(pmsPathIds, checkedValues);
    _tmpRolePms[pmsPathIds] = _ckvalue;

    setRolePms(flattenDeep(Object.values(_tmpRolePms)));
    updatePms({ pms_id: [...pmsPathIds, ..._ckvalue] });
  };
  return (
    <List
      size="small"
      loading={loading}
      dataSource={pmsSource}
      renderItem={(item) => (
        <List.Item>
          <Row style={{ width: '100%' }}>
            <Col span={5}>{item.pmsPath.join('/')}</Col>
            <Col span={12}>
              <Checkbox.Group
                disabled={!hasPermission(PERMISSION_MAP.SYSTEM_ROLE_EDIT)}
                options={item.pmsValues}
                value={rolePms}
                onChange={(values) => {
                  onChange(item.pmsPathIds, values);
                }}
              />
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );
};
export default PermissionTree;
