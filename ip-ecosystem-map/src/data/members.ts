import { Member } from '../types';

// 成员数据
export const members: Member[] = [
  {
    id: "1",
    nickname: "苏菲",
    location: "北京",
    introduction: "张美吉IP商务负责人，主要是对接、运营公司的商务渠道。混沌大学、小饭桌、蚂上创业营等主流投资机构以及商学院，和商业垂直媒体。",
    type: "manager",
    resources: [
      { id: 1, content: "AI社群，创始人业务助理社群。", tags: ["AI", "社群", "创业"] },
      { id: 2, content: "AI领域求职：优秀的AI领域人才找工作，都可以戳我。", tags: ["AI", "招聘", "人才"] },
      { id: 3, content: "B- E轮创业公司老板，B端商务资源。", tags: ["B轮", "E轮", "创业", "B端", "商务"] },
      { id: 4, content: "目前也在独自主理一个跨行跨界的商务社群～里面都是创业者及头部机构的商务负责人。", tags: ["商务", "社群", "创业", "跨界"] },
      { id: 5, content: "25年的目标是把「创业者商务资源联盟」这件非标的事情做成标准化。", tags: ["创业", "资源", "联盟", "标准化"] }
    ],
    needs: [
      { id: 1, content: "认识B- E轮的创业者；", tags: ["B轮", "E轮", "创业"] },
      { id: 2, content: "认识年轻的AI领域创业者/从业者/求职者。", tags: ["AI", "创业", "从业者", "年轻人"] }
    ],
    tags: ["商务", "社群", "AI", "创业资源", "B端"]
  },
  {
    id: "2",
    nickname: "jason",
    location: "深圳",
    introduction: "web3数权创业者，在做AI范式下的数据撮合协议，也是一家crypto量化基金合伙人和web3华语区最大的从业者社区发起之一。bento: bento.me/chooong",
    type: "current",
    resources: [
      { id: 1, content: "真实有用而非炒作的web3创业讯息和机会。", tags: ["web3", "创业", "机会"] },
      { id: 2, content: "web3从业者资源勾兑。", tags: ["web3", "从业者", "资源"] },
      { id: 3, content: "高频量化相关的工作机会。", tags: ["量化", "工作", "机会"] }
    ],
    needs: [
      { id: 1, content: "认识创业者，有意思的人，对未来有憧憬的年轻人；", tags: ["创业", "年轻人", "未来"] },
      { id: 2, content: "认识更多优秀的ToB业务提供商。", tags: ["ToB", "业务", "提供商"] },
      { id: 3, content: "高质量的交流。", tags: ["交流", "高质量"] }
    ],
    tags: ["web3", "量化", "数据", "创业", "社区"]
  },
  {
    id: "3",
    nickname: "42",
    location: "杭州",
    introduction: "均瑶健康/吉祥航空/上海世外杭州负责人，主要负责新渠道拓展和增长。42space社群发起人，同时也是一位社群投资人。",
    type: "manager",
    resources: [
      { id: 1, content: "体轻松产品线资源(达播近1亿,私域渠道百万/月)", tags: ["健康", "私域", "渠道"] },
      { id: 2, content: "吉祥航空私域渠道资源", tags: ["航空", "私域", "渠道"] },
      { id: 3, content: "42space社群(成员为各渠道内容创作者,合计粉丝过亿)", tags: ["社群", "内容创作", "粉丝"] },
      { id: 4, content: "AI社群资源(3w+成员)", tags: ["AI", "社群", "成员"] }
    ],
    needs: [
      { id: 1, content: "寻找体轻松经销商合作伙伴", tags: ["健康", "经销", "合作"] },
      { id: 2, content: "招聘吉祥航空私域负责人", tags: ["航空", "私域", "招聘"] },
      { id: 3, content: "寻找优质内容创作者加入42space社群", tags: ["内容创作", "社群", "优质"] }
    ],
    tags: ["社群", "渠道", "健康", "航空", "内容创作"]
  },
  {
    id: "4",
    nickname: "Iris/伊培",
    location: "北京",
    introduction: "前AFFiNE的cofounder & COO。2022年8月开始做出海业务。目前在字节飞书",
    type: "current",
    resources: [
      { id: 1, content: "Github项目运营经验(7天6000 star，1年半33k star)", tags: ["Github", "运营", "项目"] },
      { id: 2, content: "产品出海经验(覆盖数百个国家和地区)", tags: ["产品", "出海", "国际化"] },
      { id: 3, content: "Product Hunt运营经验(日榜第一、周榜第三、月榜第一)", tags: ["产品", "运营", "Product Hunt"] }
    ],
    needs: [],
    tags: ["出海", "产品运营", "Github", "国际化"]
  },
  {
    id: "5",
    nickname: "大康/熙康",
    location: "上海/长沙",
    introduction: "NYU Shanghai & 华东师范的神经科学研究所，目前在休学做些流量小生意，在小红书上卖假发和情感咨询。",
    type: "current",
    resources: [
      { id: 1, content: "小红书矩阵号自然流能力", tags: ["小红书", "流量", "社媒"] },
      { id: 2, content: "略懂LLM Workflow、组织流程梳理、神经科学；其他相关前沿问题都可以甩给我", tags: ["LLM", "流程", "神经科学"] }
    ],
    needs: [],
    tags: ["小红书", "LLM", "神经科学", "流量"]
  },
  {
    id: "6",
    nickname: "清酒",
    location: "深圳",
    introduction: "前腾讯高级产品经理、前虾皮资深产品策划。纽约大学营销专业毕业，目前在深圳创业做AI电商研习社，专注于AI赋能电商卖家提效增收，主营AI数字员工定制和AI图视频生成业务。",
    type: "current",
    resources: [
      { id: 1, content: "AI电商应用开发与落地经验", tags: ["AI", "电商", "应用开发"] },
      { id: 2, content: "跨境电商市场运营策略", tags: ["跨境", "电商", "运营"] },
      { id: 3, content: "AI产品经理，有不少垂直方向的优秀产品经理朋友。", tags: ["AI", "产品经理", "人脉"] },
      { id: 4, content: "部分高校实验室资源和活动资源，重要事项可与其协作。", tags: ["高校", "实验室", "活动资源"] }
    ],
    needs: [
      { id: 1, content: "寻找AI电商领域的合作伙伴", tags: ["AI", "电商", "合作"] },
      { id: 2, content: "对接有电商业务需求的企业客户", tags: ["电商", "企业客户", "业务"] },
      { id: 3, content: "招募对AI电商感兴趣的技术人才", tags: ["AI", "电商", "技术", "人才"] }
    ],
    tags: ["AI", "电商", "产品", "跨境", "创业"]
  },
  {
    id: "7",
    nickname: "甄淇深",
    location: "未知",
    introduction: "目前在Jadevalue孵化器 ，专注AI 领域的投资与孵化。法国全法科协孵化器负责人。计算机本+金融硕",
    type: "current",
    resources: [
      { id: 1, content: "种子轮与天使轮融资支持，投资额度50-100万", tags: ["投资", "融资", "天使轮"] },
      { id: 2, content: "法国科研机构与高校合作资源", tags: ["法国", "科研", "高校", "合作"] },
      { id: 3, content: "跨境金融科技解决方案，连接中日市场", tags: ["跨境", "金融科技", "中日市场"] },
      { id: 4, content: "AI协同认知框架", tags: ["AI", "协同", "认知"] }
    ],
    needs: [
      { id: 1, content: "寻找AI金融领域的技术合作伙伴，共同开发股票内容产品", tags: ["AI", "金融", "技术", "股票"] },
      { id: 2, content: "对接有AI技术商业化需求的项目", tags: ["AI", "技术", "商业化"] },
      { id: 3, content: "寻找早期AI项目进行孵化合作", tags: ["AI", "早期项目", "孵化"] }
    ],
    tags: ["AI", "投资", "金融科技", "孵化", "跨境"]
  }
]; 