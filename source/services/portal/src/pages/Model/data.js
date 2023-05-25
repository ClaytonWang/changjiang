// 行业
const industry = [
  {
    label: "制造",
    value: "manufacturing",
  },
  {
    label: "建筑",
    value: "architecture",
  },
  {
    label: "自动驾驶",
    value: "autopilot",
  },
  {
    label: "3C电子",
    value: "3c",
  },
  {
    label: "零售",
    value: "retail",
  },
];

// 算法类
const algorithm = [
  {
    label: "运筹优化",
    value: "oro",
  },
  {
    label: "决策大模型",
    value: "decision",
  },
  {
    label: "强化学习",
    value: "rl",
  },
  {
    label: "预测",
    value: "forecast",
  },
  {
    label: "序贯决策",
    value: "sequential",
  },
];

// 模型试运行数据
const model = {
  vrp: {
    form: {
      scene: [
        {
          type: "InputNumber",
          title: "最大可用车辆",
          label: "最大车辆数",
          unit: "辆",
          name: "MaxVehicleNum",
        },
        {
          type: "Radio",
          title: "是否多始发点",
          name: "MultipleDepot",
        },
        {
          type: "Radio",
          title: "返回始发点",
          name: "IsReturnDepot",
        },
        {
          type: "Radio",
          title: "时空距离对称",
          name: "Issymmetric",
        },
        {
          type: "Radio",
          title: "物品计量单位",
          name: "Unit",
          options: [
            {
              label: "体积",
              value: "volume",
            },
            {
              label: "重量",
              value: "weight",
            },
            {
              label: "个数",
              value: "quantity",
            },
          ],
        },
      ],
      restrict: [
        {
          type: "Radio",
          title: "时间窗约束",
          name: "TimeWindowsCons",
        },
        {
          type: "Radio",
          title: "是否多车型",
          name: "MultiVehicleType",
        },
        {
          type: "InputNumber",
          title: "装载能力约束",
          label: "计量对应数据",
          name: "CapacityCons",
          available: "restrict.MultiVehicleType",
        },
        {
          type: "Radio",
          title: "有先后服务顺序",
          name: "ServiceTimeDepCons",
        },
        {
          type: "Radio",
          title: "是否装载互斥",
          name: "ServiceExcludeCons",
        },
        {
          type: "DatePicker",
          title: "出发时间限制",
          name: "EarliestDeptimeCons",
          available: ["!scene.MultipleDepot", "!restrict.MultiVehicleType"],
        },
      ],
      target: [
        {
          type: "Radio",
          title: "优化目标设置",
          name: "Objective",
          options: [
            {
              label: "资源最少",
              value: "a",
            },
            {
              label: "成本最低",
              value: "b",
            },
            {
              label: "距离最短",
              value: "c",
            },
          ],
        },
      ],
    },
  },
  net: {
    form: {
      scence: [
        {
          type: "InputNumber",
          title: "仓库周转时长",
          label: "周转天数",
          unit: "天",
          name: "turnoverDays",
          must: true,
          tip: '填写大于0的整数',
          hasCheck: false,
        },
        {
          type: "InputNumber",
          title: "供货服务效率",
          label: "服务效率",
          name: "serviceLevel",
          must: false,
          tip: '填写0-1的两位小数',
          hasCheck: false,
        },
        {
          type: "Input",
          title: "整车零担比",
          label: "整车零担比",
          name: "ratio",
          format: "toArray|toNumber",
          must: true,
          tip: '填写大于或等于0的数字，整车体积与零担体积请用逗号隔开',
          hasCheck: false,
        },
      ],
      restrict: [
        {
          type: "Radio",
          title: "有必选仓库",
          name: "haveMustUserWarehouse",
          uncheck: "未勾选，无必选仓库",
          check: "需在仓库模板中用“1”标明必选仓",
          hasCheck: true,
          tip: '',
          must: false,
        },
        {
          type: "Input",
          title: "有仓库数量限制",
          label: "仓库下界和上界",
          boolName: "useFixedWarehouseNum",
          name: "numberWarehouseRange",
          format: "toArray|toNumber",
          uncheck: "未勾选，无仓库数量限制",
          check: "",
          tip: '填写整数，上界与下界用逗号隔开',
          hasCheck: true,
          must: true,
        },
        {
          type: "Radio",
          title: "有仓库面积限制",
          name: "considerWarehouseAreaLimit",
          uncheck: "未勾选，无仓库面积限制",
          check: "需在仓库表填写每个候选仓库面积",
          tip: '',
          hasCheck: true,
          must: false,
        },
        {
          type: "InputNumber",
          title: "有时效达成率限制",
          label: "达成率",
          boolName: "haveTimelinesRate",
          name: "timelinesRate",
          uncheck: "未勾选， 无时效达成率限制",
          check: "",
          tip: '填写0-1的两位小数',
          hasCheck: true,
          must: true,
        },
        {
          type: "InputNumber",
          title: "安全库存",
          label: "补货提前期",
          boolName: "considerSafeStock",
          name: "leadDays",
          uncheck: "未勾选，无安全库存",
          check: "",
          tip: '填写大于0的整数',
          comment: '如勾选需填写每个产品日均需求标准差',
          hasCheck: true,
          must: true,
        },
        {
          type: "Radio",
          title: "库存资金占用成本",
          name: "considerOccupyCost",
          uncheck: "未勾选，无库存资金占用成本",
          check: "需在列表中填写每个产品单价",
          tip: '',
          hasCheck: true,
          must: false,
        },
        {
          type: "InputNumber",
          title: "逆向物流成本",
          label: "逆向物流占比",
          boolName: "considerReverseLogistics",
          name: "reverseLogisticsRate",
          uncheck: "未勾选，无逆向物流成本",
          check: "",
          tip: '填写0-1的两位小数',
          hasCheck: true,
          must: true,
        },
      ],
      objective: [
        {
          type: "Radio",
          title: "优化目标设置",
          name: "Objective",
          options: [
            {
              label: "仓数最少",
              value: "a",
            },
            {
              label: "成本最优",
              value: "b",
            },
            {
              label: "时效最优",
              value: "c",
            },
          ],
        },
      ],
    },
    view: [
      {
        title: "仓库数",
        dataIndex: "warehouse",
        suffix: "个",
      },
      {
        title: "年均需求总量",
        dataIndex: "avgDemandCount",
        suffix: "个",
      },
      {
        title: "需求点城市数量",
        dataIndex: "cityCount",
        suffix: "个",
      },
      {
        title: "总成本",
        dataIndex: "totoalCost",
        precision: 0,
        suffix: "元",
      },
      {
        title: "仓储总面积",
        dataIndex: "storageArea",
        precision: 2,
      },
    ],
  },
  tsptw: {
    form: {
      scence: {
        title: "问题规模选择",
        data: [
          {
            type: "Select",
            title: "城市数量",
            label: "城市数量",
            unit: "个",
            name: "graph_size",
            options: [
              {
                label: "20",
                value: 20,
              },
              {
                label: "30",
                value: 30,
              },
              {
                label: "40",
                value: 40,
              },
              {
                label: "50",
                value: 50,
              },
            ],
          },
        ],
      },
    },
  },
  tage: {
    form: {
      scence: {
        title: "实时调度信息",
        data: [
          {
            type: "InputNumber",
            title: "矿车总数",
            label: "数量",
            unit: "辆",
            name: "truck",
            must: true,
            tip: '填写大于0的整数',
            hasCheck: false,
          },
        ]
      }
    }
  }
};

// 列表数据
const data = [
  {
    id: 0,
    category: "vrp",
    title: "车辆路径规划模型",
    enTitle: "Vehicle Routing Problem",
    tags: ["交通", "VRP", "供应链"],
    desc: "车辆路径规划模型是基于数研院OptFlow开发，提供简易的业务编辑模板，普遍适用于货物运输调度的典型决策类组合优化问题。",
    owner: "数字大脑研究院",
    date: "6天前",
    feature: ["体验", "训练", "可调"],
    industry: ["manufacturing", "architecture"],
    algorithm: ["oro", "decision"],
    image: "model_0.png",
    resultImage: "model_result_0.png",
    detail:
      "本模型面向车辆路径规划问题(VRP)，该问题是典型决策类组合优化问题，指一定数量的客户各自有不同的货物运输需求，配送中心向客户提供货物，车队做货物分发，需要组合适当的行车路线其目标使得客户的需求得到满足，并在此基础上基于一定的条件约束，达到诸如路程最短、成本最少、消耗时间最小等决策优化目标。",
    content: [
      ["image", "model_0.png"],
      [
        "text",
        "车辆路径规划问题(VRP)对于很多涉及多个运输地点的运输调度、配送服务的用户或服务提供商都是很核心的问题，例如：",
      ],
      [
        "list",
        [
          "生产关键物料的运输调度",
          "租赁机器的调度计划",
          "O2O服务的作业编排",
          "仓储物流的作业计划",
          "等等",
        ],
      ],
    ],
    code: `from transformers import BertTokenizer, TFBertModel
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = TFBertModel.from_pretrained("bert-base-uncased")
text = "Replace me by any text you'd like."
encoded_input = tokenizer(text, return_tensors='tf')
output = model (encoded_input)`,
    case: ["上汽实验车辆调度", "筑城建筑机器人调度"],
    run: model.vrp,
  },
  {
    id: 1,
    category: "tsptw",
    title: "支持旅行商问题的决策大模型",
    enTitle: "BD1 for TSP-TW",
    tags: ["交通", "VRP", "供应链"],
    desc: "基于数研院OptFlow+大模型组合适用于TSP-TW的标准应用领域，决策结果秒级输出。",
    owner: "数字大脑研究院",
    date: "6天前",
    feature: ["体验", "训练", "可调"],
    industry: ["manufacturing", "architecture"],
    algorithm: ["oro", "decision"],
    image: "model_1.png",
    resultImage: "model_result_1.png",
    detail:
      "本模型面向车辆路径规划问题(VRP)，该问题是典型决策类组合优化问题，指一定数量的客户各自有不同的货物运输需求，配送中心向客户提供货物，车队做货物分发，需要组合适当的行车路线其目标使得客户的需求得到满足，并在此基础上基于一定的条件约束，达到诸如路程最短、成本最少、消耗时间最小等决策优化目标。",
    content: [
      ["image", "model_0.png"],
      [
        "text",
        "车辆路径规划问题(VRP)对于很多涉及多个运输地点的运输调度、配送服务的用户或服务提供商都是很核心的问题，例如：",
      ],
      [
        "list",
        [
          "生产关键物料的运输调度",
          "租赁机器的调度计划",
          "O2O服务的作业编排",
          "仓储物流的作业计划",
          "等等",
        ],
      ],
    ],
    code: `from transformers import BertTokenizer, TFBertModel
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = TFBertModel.from_pretrained("bert-base-uncased")
text = "Replace me by any text you'd like."
encoded_input = tokenizer(text, return_tensors='tf')
output = model (encoded_input)`,
    case: ["上汽实验车辆调度", "筑城建筑机器人调度"],
    run: model.tsptw,
  },
  {
    id: 2,
    title: "装箱优化模型",
    category: "packing",
    enTitle: "Vehicle dynamic real-time scheduling",
    tags: ["交通", "VRP", "供应链"],
    desc: "基于数研院OptFlow+强化学习，对无人驾驶车辆进行实时任务分析与决策，是一套远超于传统优化的灵活应对真实场景变化的模型方法。",
    owner: "数字大脑研究院",
    date: "6天前",
    feature: ["体验", "训练", "可调"],
    industry: ["architecture", "autopilot"],
    algorithm: ["decision", "rl"],
    image: "model_2.png",
  },
  {
    id: 3,
    title: "仓储网络规划模型",
    category: "net",
    enTitle: "Storage network planning model",
    tags: ["运筹", "物流", "3C", "零售"],
    desc: "仓储网络规划模型是基于数研院OptFlow开发，普遍适用于对全网仓储的线路设计、覆盖关系、路由设置、实效性进行分析和规划。",
    owner: "数字大脑研究院",
    date: "6天前",
    feature: ["体验", "训练", "可调"],
    industry: ["autopilot", "3c"],
    algorithm: ["rl", "forecast"],
    image: "model_3.png",
    resultImage: "/images/model/model_result_3.png",
    detail:
      "本模型面向车辆路径规划问题(VRP)，该问题是典型决策类组合优化问题，指一定数量的客户各自有不同的货物运输需求，配送中心向客户提供货物，车队做货物分发，需要组合适当的行车路线其目标使得客户的需求得到满足，并在此基础上基于一定的条件约束，达到诸如路程最短、成本最少、消耗时间最小等决策优化目标。",
    content: [
      ["image", "model_3.png"],
      [
        "text",
        "车辆路径规划问题(VRP)对于很多涉及多个运输地点的运输调度、配送服务的用户或服务提供商都是很核心的问题，例如：",
      ],
      [
        "list",
        [
          "生产关键物料的运输调度",
          "租赁机器的调度计划",
          "O2O服务的作业编排",
          "仓储物流的作业计划",
          "等等",
        ],
      ],
    ],
    code: `from transformers import BertTokenizer, TFBertModel
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = TFBertModel.from_pretrained("bert-base-uncased")
text = "Replace me by any text you'd like."
encoded_input = tokenizer(text, return_tensors='tf')
output = model (encoded_input)`,
    case: ["上汽实验车辆调度", "筑城建筑机器人调度"],
    run: model.net,
  },
  {
    id: 4,
    title: "无人车智能调度系统",
    category: "tage",
    enTitle: "Vehicle dynamic real-time scheduling",
    tags: ["交通", "物流", "供应链"],
    desc: "基于数研院OptFlow+强化学习，对无人驾驶车辆进行实时任务分析与决策，是一套远超于传统优化的灵活应对真实场景变化的模型方法。",
    owner: "数字大脑研究院",
    date: "6天前",
    feature: ["体验", "训练", "可调"],
    industry: ["architecture", "autopilot"],
    algorithm: ["decision", "rl"],
    image: "tage.jpeg",
    resultImage: "/images/model/tage.jpeg",
    detail:
      "本模型面向车辆路径规划问题(VRP)，该问题是典型决策类组合优化问题，指一定数量的客户各自有不同的货物运输需求，配送中心向客户提供货物，车队做货物分发，需要组合适当的行车路线其目标使得客户的需求得到满足，并在此基础上基于一定的条件约束，达到诸如路程最短、成本最少、消耗时间最小等决策优化目标。",
    content: [
      ["image", "tage.jpeg"],
      [
        "text",
        "车辆路径规划问题(VRP)对于很多涉及多个运输地点的运输调度、配送服务的用户或服务提供商都是很核心的问题，例如：",
      ],
      [
        "list",
        [
          "生产关键物料的运输调度",
          "租赁机器的调度计划",
          "O2O服务的作业编排",
          "仓储物流的作业计划",
          "等等",
        ],
      ],
    ],
    code: `from transformers import BertTokenizer, TFBertModel
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = TFBertModel.from_pretrained("bert-base-uncased")
text = "Replace me by any text you'd like."
encoded_input = tokenizer(text, return_tensors='tf')
output = model (encoded_input)`,
    case: ["上汽实验车辆调度", "筑城建筑机器人调度"],
    run: model.tage,
  },
];

export { data, industry, algorithm };
