import React from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { ConfigProvider } from "antd";
import { Layout } from "./components";
import { routes, getRoutes, ReactRouterScroll } from "./routes";
import { useScreenSize } from "@/utils";

ConfigProvider.config({
  prefixCls: "brain",
});

const App = () => {
  const screen = useScreenSize();

  return (
    <ConfigProvider prefixCls="brain">
      <div className={`brain-app brain-screen-${screen}`}>
        <Router>
          <Layout routes={routes}>
            <Routes>{getRoutes(routes)}</Routes>
          </Layout>
          <ReactRouterScroll />
        </Router>
      </div>
    </ConfigProvider>
  );
};

export default App;
