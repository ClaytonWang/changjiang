import { Link } from "react-router-dom";
import Title from "@/components/Title";
import { ArrowRightOutlined } from "@ant-design/icons";
import "./index.less";

const Section = ({
  bg = false,
  left,
  desc,
  title,
  subtitle,
  link,
  children,
  ...props
}) => {
  return (
    <div className={`brain-section brain-section-bg-${bg}`} {...props}>
      <div className="brain-section-header">
        {desc && <div className="brain-section-desc">{desc}</div>}
        {title && (
          <div className="brain-section-title">
            <Title>{title}</Title>
          </div>
        )}
        {subtitle &&
          [].concat(subtitle).map((item, index) => (
            <div key={index} className="brain-section-subtitle">
              {item}
            </div>
          ))}
        {link && (
          <div className="brain-section-link">
            <Link to={link}>
              了解更多 <ArrowRightOutlined />
            </Link>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

Section.Title = ({ type = "subtitle", children }) => {
  if (type === "subtitle") {
    return <span className="brain-section-desc">{children}</span>;
  }
  return <span className="brain-section-title">{children}</span>;
};

export default Section;
