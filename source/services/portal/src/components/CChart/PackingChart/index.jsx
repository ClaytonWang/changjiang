import("raw-loader!./js/jquery.min.js").then((rawModule) =>
  eval.call(null, rawModule.default)
);
import THREE from "./js/three.min.js";
window.THREE = THREE;
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => () => {};
import("raw-loader!./js/threex.domevents.js").then((rawModule) =>
  eval.call(null, rawModule.default)
);
import("raw-loader!./js/OrbitControls.js").then((rawModule) =>
  eval.call(null, rawModule.default)
);

import("raw-loader!./js/common-utilities.js").then((rawModule) =>
  eval.call(null, rawModule.default)
);
import("raw-loader!./js/packwidget.js").then((rawModule) =>
  eval.call(null, rawModule.default)
);
import("raw-loader!./js/packWidgetUtils.js").then((rawModule) =>
  eval.call(null, rawModule.default)
);
import("raw-loader!./js/mapping.js").then((rawModule) =>
  eval.call(null, rawModule.default)
);
import { run } from "./js/index";
import "./index.less";
import { useEffect } from "react";

const PackingChart = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      run();
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div style={{ width: "100%", height: "100%" }} id="packing-wrapper"></div>
  );
};

export default PackingChart;
