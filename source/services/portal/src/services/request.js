import { ConfigContext } from "antd/lib/config-provider";
import axios from "axios";

const request = axios.create({
  baseURL: "/api/v1",
  timeout: 120 * 1000,
});

const SESSION_ID = new Date().getTime() + "";

request.interceptors.request.use(function (config) {
  config.headers.user_id = window.DBCJ_USER?.name;
  if (config.method === "get") {
    config.params.session_id = SESSION_ID;
  } else if (config.data) {
    config.data.session_id = SESSION_ID;
  }
  return config;
});

export default request;
export { SESSION_ID };
