import React, { useCallback, useMemo, useState, memo, useEffect } from 'react';
import {
  Form,
  InputNumber,
  Input,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  Row,
  Col,
  Tooltip,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import cls from 'classnames';
import { get, map, isNil, isArray } from 'lodash';
import { useDemoData } from '@/pages/Model/Detail';
import './index.less';

const CForm = (props) => {
  return <Form {...props} />;
};

const CheckItem = ({ checked, onCheck }) => {
  return (
    <label
      onClick={() => {
        onCheck(!checked);
      }}
      className={
        checked
          ? 'brain-checkbox-wrapper brain-checkbox-wrapper-checked'
          : 'brain-checkbox-wrapper'
      }
    >
      <span className={checked ? 'brain-checkbox-checked' : 'brain-checkbox'}>
        <span className="brain-checkbox-inner"></span>
      </span>
    </label>
  );
};

const ModelFormItem = memo(
  ({ title, label, type, options, children, value, onChange, ...rest }) => {
    const [showError, setShowError] = useState(false);
    const [checked, setChecked] = useState(false);
    const { must, tip, comment, check, uncheck, hasCheck, boolName, name } =
      rest;

    const { deftData, dataForm } = useDemoData();

    useEffect(() => {
      let _name = boolName === undefined ? name : boolName;
      setChecked(get(deftData, `restrict.${_name}`));
    }, [deftData]);

    const handleChecked = useCallback((e) => {
      let _name = boolName === undefined ? name : boolName;
      setChecked(e);
      dataForm.setFieldValue(['restrict', _name], e);
    }, []);

    const handleChange = useCallback(
      (e) => {
        const v = e && e.target ? e.target.value : e;
        setShowError(must && !v);
        onChange?.(v);
      },
      [value]
    );

    const Child = useMemo(() => {
      if (children) {
        return React.Children.map(children, (child, index) => {
          if (index === 0) {
            return React.cloneElement(child, {
              value,
              onChange: handleChange,
            });
          }
          return child;
        });
      }
      return null;
    }, [children, value]);

    const placeholder = useMemo(() => {
      if (type === 'Radio' && !options) {
        return checked ? <span>{check}</span> : <span>{uncheck}</span>;
      } else {
        return checked || !hasCheck ? (
          <>
            {label && (
              <span className={cls({ must: must })}>{`${label}:`}</span>
            )}
            <Tooltip trigger={['hover']} title={tip}>
              {Child}
            </Tooltip>
          </>
        ) : (
          uncheck
        );
      }
    }, [type, checked, options, value]);

    return (
      <div
        className={cls(
          'model-form-item',
          { error: showError },
          { active: checked }
        )}
      >
        <div className="title-zone">
          <div>
            <span className="title">{title}</span>
            {comment ? (
              <Tooltip title={comment}>
                <QuestionCircleOutlined
                  style={{ cursor: 'pointer', marginLeft: 5 }}
                />
              </Tooltip>
            ) : null}
          </div>
          {hasCheck ? (
            <div className="check">
              <CheckItem checked={checked} onCheck={handleChecked} />
            </div>
          ) : null}
        </div>
        <div className="content-zone">{placeholder}</div>
      </div>
    );
  }
);

Object.assign(CForm, {
  Select: (props) => {
    return (
      <ModelFormItem {...props}>
        <Select
          options={props.options}
          style={{ width: 120 }}
          size="small"
          suffixIcon={props.unit}
        />
      </ModelFormItem>
    );
  },
  Input: (props) => {
    return (
      <ModelFormItem {...props}>
        <Input
          style={{ width: 110 }}
          size="small"
          addonAfter={props.unit}
          placeholder={props.tip}
        />
      </ModelFormItem>
    );
  },
  InputNumber: (props) => {
    return (
      <ModelFormItem {...props}>
        <InputNumber
          style={{ width: 120 }}
          size="small"
          addonAfter={props.unit}
        />
      </ModelFormItem>
    );
  },
  Radio: (props) => {
    if (props.options) {
      return (
        <ModelFormItem {...props}>
          <Radio.Group
            optionType="button"
            size="small"
            options={props.options}
          />
        </ModelFormItem>
      );
    }
    return <ModelFormItem {...props} />;
  },
  DatePicker: (props) => {
    return (
      <ModelFormItem {...props}>
        <DatePicker size="small" placeholder="请选择" />
      </ModelFormItem>
    );
  },
});

const FORM_SECTION = [
  {
    key: 'scence',
    title: '业务场景参数配置',
  },
  {
    key: 'restrict',
    title: '业务约束配置',
  },
  {
    key: 'objective',
    title: '优化目标',
  },
];

const ModelForm = ({ data, form, onValuesChange }) => {
  const formData = get(data, 'run.form');
  const handleValuesChange = useCallback((...params) => {
    onValuesChange?.(...params);
  }, []);
  return (
    <div className="brain-model-form">
      <Form form={form} onValuesChange={handleValuesChange}>
        {map(FORM_SECTION, (section) => {
          const sectionData = get(formData, section.key);
          if (!sectionData) {
            return null;
          }
          const list = isArray(sectionData?.data)
            ? sectionData.data
            : sectionData;
          const sectionTitle = get(sectionData, 'title', section.title);
          return (
            <div className="form-section" key={section.key}>
              <div className="model-section-title">{sectionTitle}</div>
              <div className="content">
                <Row gutter={40}>
                  {map(list, (item) => {
                    const Comp = get(CForm, item.type);
                    if (Comp) {
                      return (
                        <Col span={6} key={item.name}>
                          <Form.Item noStyle name={[section.key, item.name]}>
                            <Comp {...item} />
                          </Form.Item>
                        </Col>
                      );
                    }
                    return null;
                  })}
                </Row>
              </div>
            </div>
          );
        })}
      </Form>
    </div>
  );
};

export default ModelForm;
