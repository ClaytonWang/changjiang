/*
 * @Author: junshi clayton.wang@digitalbrain.cn
 * @Date: 2023-02-17 17:36:49
 * @LastEditors: junshi clayton.wang@digitalbrain.cn
 * @LastEditTime: 2023-02-20 10:53:37
 * @FilePath: /changjiang/source/services/frontend/src/pages/login/index.js
 * @Description: 登陆
 */
import { Form, Input, Button } from 'antd';
import Icon, { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '@/common/hooks/useAuth';
import { name } from '@/common/utils/config';
import Icons from '@/common/components/Icon';
import bg from '@/common/images/carousel_0.png';
import './index.less';

const LoginForm = () => {
  const { login } = useAuth();
  const onFinish = (values) => {
    login({
      ...values,
    });
  };
  return (
    <>
      <Form
        title="登录"
        name="normal_login"
        className="login-form"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: '请输入注册邮箱!',
            },
            {
              pattern: /^[\w.]+@[\w]+(\.[\w]+)+$/,
              message: '请输入有效邮箱！',
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="login-form-item-icon" />}
            placeholder="邮箱"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: '请输入登录密码!',
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="login-form-item-icon" />}
            placeholder="密码"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登陆
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
const Login = () => (
  <div className="login">
    <img className="bg-image" src={bg} />
    <div className="title">
      <Icon
        component={Icons.develop}
        style={{ fontSize: '20em', margin: 'auto -10px auto 10%' }}
      />
      <span>{name}</span>
    </div>
    <LoginForm />
  </div>
);
export default Login;
