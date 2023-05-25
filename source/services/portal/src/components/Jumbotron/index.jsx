import { Carousel } from "antd";
import Title from "@/components/Title";
import "./index.less";

const Jumbotron = ({
  type = "default",
  height = 400,
  carousel = [],
  curtain = {},
}) => {
  return (
    <div className={`jumbotron jumbotron-${type}`}>
      {type === "curtain" && (
        <div className="brain-wrapper">
          <div
            className="jumbotron-curtain-content"
            style={{
              height,
              backgroundImage: curtain.bgImg ? `url(${curtain.bgImg})` : "none",
            }}
          >
            <div className="title">
              <Title>{curtain.title}</Title>
            </div>
            <div className="desc">{curtain.desc}</div>
            {curtain?.operator}
          </div>
        </div>
      )}
      {type === "carousel" && (
        <Carousel autoplay autoplaySpeed={5000}>
          {carousel.map((item, index) => {
            return (
              <div key={index}>
                <div
                  className="carousel-item"
                  style={{
                    height,
                    backgroundImage: item.bgImg ? `url(${item.bgImg})` : "none",
                    ...(item.style || {}),
                  }}
                >
                  {[].concat(item.title).map((t, tIndex) => (
                    <span key={tIndex} className="carousel-item-title">
                      <Title>{t}</Title>
                    </span>
                  ))}
                  <div className="carousel-item-desc">{item.desc}</div>
                </div>
              </div>
            );
          })}
        </Carousel>
      )}
    </div>
  );
};

export default Jumbotron;
