import "./index.less";

const Title = ({ size = 40, children }) => {
  return (
    <span className="brain-title" style={{ fontSize: size }}>
      {children}
    </span>
  );
};

export default Title;
