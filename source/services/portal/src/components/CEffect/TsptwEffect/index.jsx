import CChart from "@/components/CChart";
import { Table, Typography } from "antd";
import { get, map } from "lodash";
import { useMemo } from "react";
import "./index.less";

const formatTime = (time) => {
  return (time - 0).toFixed(1) + "h";
};

const TsptwEffect = ({ model, data }) => {
  const talbeData = useMemo(() => {
    return map(data?.result, (item) => {
      const res = {
        id: item["顺序"],
        city: item["城市"],
        time: item["到达时间"],
        afterMinTime: item["距最早时间"],
        beforeMaxTime: item["距最晚时间"],
      };
      res.status = (() => {
        if (res.afterMinTime < 0) {
          return "before";
        }
        if (res.beforeMaxTime < 0) {
          return "after";
        }
        return "intime";
      })();
      return res;
    });
  }, [data]);
  return (
    <div className="tsptw-effect-zone">
      <div className="run-result">
        <CChart model={model} value={data} />
      </div>
      <div className="run-data">
        <div className="title">路线信息</div>
        <div className="content">
          <Table
            rowKey="id"
            bordered
            size="small"
            dataSource={talbeData}
            pagination={false}
            scroll={{
              y: 500,
            }}
            columns={[
              {
                title: "顺序",
                dataIndex: "id",
              },
              {
                title: "城市",
                dataIndex: "city",
              },
              {
                title: "到达时间",
                dataIndex: "time",
                render: (v) => formatTime(v),
              },
              {
                title: "距最早时间",
                dataIndex: "afterMinTime",
                render: (v) => formatTime(v),
              },
              {
                title: "距最晚时间",
                dataIndex: "beforeMaxTime",
                render: (v) => formatTime(v),
              },
              {
                title: "状态",
                dataIndex: "status",
                render: (v) => {
                  return get(
                    {
                      before: (
                        <Typography.Text type="secondary">提前</Typography.Text>
                      ),
                      after: (
                        <Typography.Text type="warning">晚点</Typography.Text>
                      ),
                      intime: (
                        <Typography.Text type="success">准时</Typography.Text>
                      ),
                    },
                    v,
                    v
                  );
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default TsptwEffect;
