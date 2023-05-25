import { Section, Jumbotron } from "@/components";
import Feature from "./components/Feature";
import Achievement from "./components/Achievement";
import "./index.less";

const Home = () => {
  return (
    <div className="page page-home">
      <Jumbotron
        type="carousel"
        carousel={[
          {
            title: "决策智能平台的使命",
            desc: "我们致力于在数字化基础上，基于自研全球首个决策大模型和下一代决策智能技术框架OptFlow， 构建服务于广泛业务、适用业务持续变化的决策智能体平台，逐渐贯穿业务细枝末节，推荐产业智能向下一个阶段演进",
          },
          {
            title: "决策智能平台的使命",
            desc: "我们致力于在数字化基础上，基于自研全球首个决策大模型和下一代决策智能技术框架OptFlow， 构建服务于广泛业务、适用业务持续变化的决策智能体平台，逐渐贯穿业务细枝末节，推荐产业智能向下一个阶段演进",
          },
          {
            title: "决策智能平台的使命",
            desc: "我们致力于在数字化基础上，基于自研全球首个决策大模型和下一代决策智能技术框架OptFlow， 构建服务于广泛业务、适用业务持续变化的决策智能体平台，逐渐贯穿业务细枝末节，推荐产业智能向下一个阶段演进",
          },
          {
            title: "决策智能平台的使命",
            desc: "我们致力于在数字化基础上，基于自研全球首个决策大模型和下一代决策智能技术框架OptFlow， 构建服务于广泛业务、适用业务持续变化的决策智能体平台，逐渐贯穿业务细枝末节，推荐产业智能向下一个阶段演进",
          },
        ]}
      />
      <Section title="平台特点">
        <Feature />
        <Achievement />
      </Section>
    </div>
  );
};

export default Home;
