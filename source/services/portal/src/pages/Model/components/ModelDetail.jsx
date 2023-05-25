import { useEffect } from "react";
import { Table, Typography } from "antd";
import { map } from "lodash";
import ReactECharts from "echarts-for-react";
import mapOption from "./echarts";
import hljs from "highlight.js";
import "highlight.js/styles/vs.css";

const Title = (props) => {
  return <div className="model-section-title" {...props} />;
};

const Detail = ({ data }) => {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  if (!data) {
    return null;
  }
  return (
    <div className="model-detail-detail">
      <Typography>
        <Title>{data.title}</Title>
        <Typography.Paragraph>{data.detail}</Typography.Paragraph>

        <Title>适用场景</Title>
        <Typography.Paragraph>
          {data.content?.map(([type, value]) => {
            if (type === "image") {
              return (
                <div key={type}>
                  <center>
                    <p>
                      <img
                        style={{
                          maxWidth: 400,
                          marginBottom: 16,
                        }}
                        src={`/images/model/${value}`}
                        alt="算法"
                      />
                    </p>
                  </center>
                </div>
              );
            } else if (type === "text") {
              return <span key={type}>{value}</span>;
            } else if (type === "list") {
              return (
                <ul key={type}>
                  {map(value, (item, index) => {
                    return <li key={index}>{item}</li>;
                  })}
                </ul>
              );
            }
            return null;
          })}
        </Typography.Paragraph>

        <Title>试运行操作说明</Title>
        <div className="sub-title">试运行操作说明</div>
        <pre>
          <code className="language-python">{data.code}</code>
        </pre>

        <Title>相关案例</Title>
        <Typography.Paragraph>
          {map(data.case, (item) => {
            return <div key={item}>{item}</div>;
          })}
        </Typography.Paragraph>
      </Typography>
    </div>
  );
};

const Result = ({ data }) => {
  return (
    <div>
      <img src={data.resultImage} height={340} alt="" />
    </div>
  );
};

const DataTable = () => {
  const data = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sidney No. 1 Lake Park",
    },
  ];
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
  ];

  return (
    <Table
      bordered
      pagination={false}
      size="small"
      dataSource={data}
      columns={columns}
    />
  );
};

export { Detail, Result, DataTable };
