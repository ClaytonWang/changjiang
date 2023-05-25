import cls from "classnames";
import { Tag } from "antd";
import "./index.less";

const CTag = (props) => {
  const { size, light, type, ...oprops } = props;
  return (
    <Tag
      className={cls("brain-ctag", {
        light,
        [`brain-ctag-${type}`]: !!type,
        [`brain-ctag-${size}`]: !!size,
      })}
      {...oprops}
    />
  );
};

export default CTag;
