import peopleYamlRaw from "../../../community/people.yaml?raw";
import type { Locale } from "./i18n";

type Text = Record<Locale, string>;

export type QuestStatus = "open" | "in_progress" | "completed";
export type QuestDomainId = "benchmark" | "evaluation" | "rsi-algorithm" | "penguin-harness";

/**
 * Helper for bilingual fields where English is the default language.
 * If the requested locale's string is empty, falls back to the other language.
 */
export function resolveText(value: { en?: string; zh?: string } | string, locale: Locale): string {
  if (typeof value === "string") return value;
  const primary = locale === "zh" ? value.zh : value.en;
  const fallback = locale === "zh" ? value.en : value.zh;
  return (primary && primary.trim()) || (fallback && fallback.trim()) || "";
}

export interface QuestDomainMeta {
  id: QuestDomainId;
  label: Text;
}

export const QUEST_DOMAINS: QuestDomainMeta[] = [
  { id: "benchmark", label: { en: "Benchmark", zh: "Benchmark" } },
  { id: "evaluation", label: { en: "Evaluation", zh: "Evaluation" } },
  { id: "rsi-algorithm", label: { en: "RSI Algorithm", zh: "RSI 算法" } },
  { id: "penguin-harness", label: { en: "PenguinHarness", zh: "PenguinHarness" } },
];

export const TARGET_REPOSITORIES = [
  "https://github.com/Prism-Shadow/penguin-harness",
  "https://github.com/Prism-Shadow/penguin-harness-community",
  "https://github.com/Prism-Shadow/penguin-harness-benchmark",
  "https://github.com/Prism-Shadow/penguin-harness-plugins",
] as const;

export type TargetRepositoryUrl = (typeof TARGET_REPOSITORIES)[number];

export interface QuestReference {
  url: string;
}

export interface QuestItem {
  id: string;
  issueNumber: number;
  prNumber?: number;
  publishedAt: string;
  status: QuestStatus;
  domain: QuestDomainId;
  exp: number;
  targetRepository: TargetRepositoryUrl;
  relatedIssue?: string;
  linkedPr?: string;
  title: { en?: string; zh?: string };
  description: { en?: string; zh?: string };
  references: QuestReference[];
  issueUrl: string;
  assignee?: string;
}

export const QUESTS: QuestItem[] = [
  {
    id: "RSI-Q001",
    issueNumber: 30,
    publishedAt: "2026-11-10T10:00:00Z",
    status: "in_progress",
    domain: "benchmark",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
    assignee: "ussumer",
    title: {
      en: "Integrate SWE-bench",
      zh: "集成 SWE-bench",
    },
    description: {
      en: "Integrate the SWE-bench software engineering benchmark into penguin-harness-benchmark with standardized container environments and grading scripts (per RFC-0001).",
      zh: "将真实 GitHub 软件工程评测基准 SWE-bench 接入 penguin-harness-benchmark，封装标准化容器评测环境与自动评分脚本（遵循 RFC-0001 规范）。",
    },
    references: [
      { url: "https://github.com/SWE-bench/SWE-bench" },
      { url: "https://arxiv.org/abs/2310.06770" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/30",
  },
  {
    id: "RSI-Q002",
    issueNumber: 31,
    publishedAt: "2026-11-10T10:05:00Z",
    status: "open",
    domain: "benchmark",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
    title: {
      en: "Integrate FDE-gym",
      zh: "集成 FDE-gym",
    },
    description: {
      en: "Integrate FDE-Gym (arXiv:2610.22350 — 95 end-to-end Forward-Deployed Engineer customer delivery tasks across 20 scenarios and 18 sectors evaluating ambiguous requirement clarification, unstated constraint discovery, and live system delivery) into penguin-harness-benchmark following RFC-0001.",
      zh: "将前沿驻场工程师（Forward-Deployed Engineer）真实客户交付基准 FDE-Gym（涵盖 18 个行业、20 个客户场景的 95 个端到端交付任务，评测 Agent 在拟真生产系统中澄清模糊需求、发掘隐式约束并完成系统交付的能力）集成至 penguin-harness-benchmark（遵循 RFC-0001 规范）。",
    },
    references: [
      { url: "https://arxiv.org/abs/2610.22350" },
      { url: "https://fde-gym.com" },
      { url: "https://github.com/deeplethe/fde-gym" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/31",
  },
  {
    id: "RSI-Q009",
    issueNumber: 39,
    prNumber: 3,
    publishedAt: "2026-10-10T17:57:44Z",
    status: "completed",
    domain: "benchmark",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
    linkedPr: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/3",
    assignee: "hiyouga",
    title: {
      en: "Build 50 Multi-Domain Benchmark Tasks",
      zh: "构建 50 个多领域基准任务",
    },
    description: {
      en: "Build 50 standardized benchmark tasks across five domains (PenguinHarness Benchmark Sec A–E) with unified package manifests and grading rubrics (per RFC-0001).",
      zh: "构建涵盖 Sec A–E 五大领域的 50 个标准化基准评测任务包（penguinharness-benchmark-sec-a..e），提供统一配置清单与评分细则（遵循 RFC-0001 规范）。",
    },
    references: [],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/39",
  },
  {
    id: "RSI-Q010",
    issueNumber: 40,
    prNumber: 5,
    publishedAt: "2026-10-19T10:56:52Z",
    status: "completed",
    domain: "benchmark",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
    linkedPr: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/5",
    assignee: "rank-Yu",
    title: {
      en: "Integrate 60-Task GDPevo Essential Dataset",
      zh: "集成 60 道 GDPevo essential 数据集",
    },
    description: {
      en: "Integrate the 60-task GDPevo Essential dataset (30 continuous task-group training tasks and 30 independent test tasks across 6 business scenarios) into penguin-harness-benchmark (per RFC-0001).",
      zh: "将 GDPevo Essential 六大业务场景共 60 道评测任务（30 道连续训练任务与 30 道独立测试任务）集成至 penguin-harness-benchmark（遵循 RFC-0001 规范）。",
    },
    references: [
      { url: "https://arxiv.org/abs/2608.03764" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/40",
  },
  {
    id: "RSI-Q011",
    issueNumber: 41,
    prNumber: 15,
    publishedAt: "2026-11-04T08:17:44Z",
    status: "completed",
    domain: "benchmark",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
    linkedPr: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/15",
    assignee: "Hoyant-Su",
    title: {
      en: "Build Biomedical Repeated-Measure Analysis Benchmark Tasks",
      zh: "构建生物医学重复测量分析基准任务",
    },
    description: {
      en: "Build biomedical repeated-measure prediction benchmark tasks evaluating patient-level holdout validation, acoustic feature predictive uplift, and conditional uncertainty intervals (per RFC-0001).",
      zh: "构建基于帕金森病语音重复测量数据的生物医学预测基准任务包，评测跨患者留出验证、声学特征增量预测价值与条件不确定性区间估计（遵循 RFC-0001 规范）。",
    },
    references: [],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/41",
  },
  {
    id: "RSI-Q003",
    issueNumber: 32,
    publishedAt: "2026-11-10T10:10:00Z",
    status: "open",
    domain: "evaluation",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
    title: {
      en: "Codex Self-Evolution Comparison",
      zh: "Codex 的自进化效果对比",
    },
    description: {
      en: "Evaluate Codex before and after Recursive Self-Improvement (RSI) across the six GDPEVO Essential scenarios, submitting full execution traces to the GDPEVO Essential leaderboard (per RFC-0002).",
      zh: "在 GDPEVO Essential 六大评测场景上对比 Codex 在接入自进化（RSI）前后的任务解决率与 Token 成本变化，提交完整实验轨迹并补充至 GDPEVO Essential 榜单（遵循 RFC-0002 规范）。",
    },
    references: [
      { url: "https://penguin.ooo/leaderboards/gdpevo-essential" },
      { url: "https://github.com/openai/codex" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/32",
  },
  {
    id: "RSI-Q004",
    issueNumber: 33,
    publishedAt: "2026-11-10T10:15:00Z",
    status: "open",
    domain: "evaluation",
    exp: 100,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
    title: {
      en: "GPT-6 Evolution Capability Experiment",
      zh: "GPT-6 模型的进化能力实验",
    },
    description: {
      en: "Measure GPT-6's multi-round self-evolution gains and generalization across standard RSI methods, contributing traces to the GDPEVO leaderboard.",
      zh: "评测 GPT-6 作为基座模型在多轮自进化（ACE / OPRO / Skill 演化）下的分数提升幅度与泛化表现，并将评测结果补充至 GDPEVO 榜单。",
    },
    references: [
      { url: "https://penguin.ooo/leaderboards/gdpevo-essential" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/33",
  },
  {
    id: "RSI-Q012",
    issueNumber: 42,
    prNumber: 16,
    publishedAt: "2026-11-02T07:25:23Z",
    status: "completed",
    domain: "evaluation",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
    linkedPr: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/16",
    assignee: "Saigyouji-Yuyuko1000",
    title: {
      en: "Compare DeepSeek v4.1 Evolution Across RSI Methods on GDPevo",
      zh: "在 GDPevo 上对比 Deepseek v4.1 在不同算法的进化表现",
    },
    description: {
      en: "Evaluate DeepSeek v4.1 across four RSI methods (SkillAdam, SkillOpt, TRACE, OpenSkill) and a shared baseline on all six GDPevo Essential scenarios with three test repetitions (per RFC-0002).",
      zh: "在 GDPevo Essential 六大场景上评测 DeepSeek v4.1 在 SkillAdam、SkillOpt、TRACE、OpenSkill 四种自进化算法与基线下的训练与三次重复测试表现（遵循 RFC-0002 规范）。",
    },
    references: [
      { url: "https://penguin.ooo/leaderboards/gdpevo-essential" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/42",
  },
  {
    id: "RSI-Q013",
    issueNumber: 43,
    prNumber: 21,
    publishedAt: "2026-11-03T08:28:27Z",
    status: "completed",
    domain: "evaluation",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
    linkedPr: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/21",
    assignee: "Saigyouji-Yuyuko1000",
    title: {
      en: "Compare Cross-Harness Capabilities with DeepSeek v4.1",
      zh: "用 DeepSeek v4.1 对比不同 harness 能力",
    },
    description: {
      en: "Benchmark DeepSeek Harness, PenguinHarness, Pi, and Codex using DeepSeek v4.1 across Sec A–E benchmarks (600 scored test runs) and publish the cross-harness leaderboard (per RFC-0002 & RFC-0005).",
      zh: "使用 DeepSeek v4.1 在 Sec A–E 五大基准（共 600 次测试采样）上系统对比 DeepSeek Harness、PenguinHarness、Pi 与 Codex 四种框架的任务得分与成本（遵循 RFC-0002 与 RFC-0005 规范）。",
    },
    references: [
      { url: "https://penguin.ooo/leaderboards/harness-comparison" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/43",
  },
  {
    id: "RSI-Q005",
    issueNumber: 34,
    publishedAt: "2026-11-10T10:20:00Z",
    status: "in_progress",
    domain: "rsi-algorithm",
    exp: 100,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-plugins",
    assignee: "KeBbboy",
    title: {
      en: "Integrate RSIAgent Method",
      zh: "集成 RSIAgent 方法",
    },
    description: {
      en: "Implement and integrate RSIAgent (arXiv:2609.15364), coordinating Curriculum, Actor, and Verifier agents for broad-then-deep exploration and frozen causal memory.",
      zh: "复现并集成 RSIAgent（arXiv:2609.15364），通过 Curriculum、Actor 与 Verifier 智能体执行先广度后深度的环境探索，构建可复用的冻结因果记忆。",
    },
    references: [
      { url: "https://arxiv.org/abs/2609.15364" },
      { url: "https://aetherlabsai.github.io/RSIAgent/" },
      { url: "https://github.com/AetherLabsAI/RSIAgent" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/34",
  },
  {
    id: "RSI-Q006",
    issueNumber: 35,
    publishedAt: "2026-11-10T10:25:00Z",
    status: "open",
    domain: "rsi-algorithm",
    exp: 100,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-plugins",
    title: {
      en: "Integrate RRSI Method",
      zh: "集成 RRSI 方法",
    },
    description: {
      en: "Implement and integrate Regularized RSI (RRSI, arXiv:2609.24972) with annealed proposer budget, anti-overfitting critic, and token pruner.",
      zh: "复现并集成正则化递归自进化方法 RRSI（arXiv:2609.24972），包含退火修改预算 Proposer、防基准过拟合 Critic 与 Token 剪枝器 Pruner。",
    },
    references: [
      { url: "https://arxiv.org/abs/2609.24972" },
      { url: "https://github.com/google-research/rrsi" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/35",
  },
  {
    id: "RSI-Q007",
    issueNumber: 36,
    publishedAt: "2026-11-10T10:30:00Z",
    status: "open",
    domain: "penguin-harness",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-plugins",
    title: {
      en: "Develop Knowledge Base Plugin",
      zh: "开发知识库插件",
    },
    description: {
      en: "Develop a Knowledge Base plugin for PenguinHarness supporting document ingestion, hybrid retrieval, inline citations, and trace-driven knowledge accumulation.",
      zh: "为 PenguinHarness 开发知识库插件，支持多源文档切分入库、混合检索、行内引用标注以及从 Agent 轨迹中持续沉淀领域知识。",
    },
    references: [],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/36",
  },
  {
    id: "RSI-Q008",
    issueNumber: 37,
    publishedAt: "2026-11-10T10:35:00Z",
    status: "open",
    domain: "penguin-harness",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-plugins",
    title: {
      en: "Develop Ontology Plugin",
      zh: "开发本体插件",
    },
    description: {
      en: "Develop an Ontology plugin for PenguinHarness providing typed entity-relation-action modeling and trace-driven ontology refinement.",
      zh: "为 PenguinHarness 开发本体（Ontology）插件，支持实体、关系与动作契约的结构化建模及基于执行轨迹的本体自动演化。",
    },
    references: [],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/37",
  },
  {
    id: "RSI-Q014",
    issueNumber: 44,
    prNumber: 1491,
    publishedAt: "2026-11-10T12:00:00Z",
    status: "in_progress",
    domain: "penguin-harness",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness",
    linkedPr: "https://github.com/Prism-Shadow/penguin-harness/pull/1491",
    assignee: "hiyouga",
    title: {
      en: "Optimize PenguinHarness Context Compaction Algorithm",
      zh: "优化 PenguinHarness 的压缩算法",
    },
    description: {
      en: "Optimize PenguinHarness context compaction to write structured hand-off files before summarization and guide the next context on line-by-line Trace querying.",
      zh: "优化 PenguinHarness 上下文压缩（Compaction）机制，支持在生成摘要前通过多轮工具调用将长篇计划、结论与草稿写入 handoff 文件，并附带 Trace 行级检索指引。",
    },
    references: [],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/44",
  },
  {
    id: "RSI-Q015",
    issueNumber: 45,
    publishedAt: "2026-11-11T12:00:00Z",
    status: "open",
    domain: "penguin-harness",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness",
    title: {
      en: "Build a High-Playability Reproducible Self-Evolution Case Study",
      zh: "构建一个可玩性高的自进化案例实验",
    },
    description: {
      en: "Build an engaging, high-playability self-evolution case study on PenguinHarness with a fully reproducible environment, pre- and post-evolution execution traces, and step-by-step reproduction instructions.",
      zh: "基于 PenguinHarness 构建一个可玩性高、直观有趣的自进化案例实验（如游戏博弈、交互式挑战或复杂任务演化），要求提供完整可复现的环境配置、进化前后对比轨迹与复现说明。",
    },
    references: [],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/45",
  },
  {
    id: "RSI-Q016",
    issueNumber: 50,
    prNumber: 1434,
    publishedAt: "2026-11-04T08:04:12Z",
    status: "completed",
    domain: "penguin-harness",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness",
    linkedPr: "https://github.com/Prism-Shadow/penguin-harness/pull/1434",
    relatedIssue: "https://github.com/Prism-Shadow/penguin-harness/issues/1394",
    assignee: "ACAne0320",
    title: {
      en: "Keep Company Mode Channel Messages Concise",
      zh: "精简公司模式频道消息与沟通规范",
    },
    description: {
      en: "Refine the company-employee and company-ceo channel message prompts and handbook rules in the agent-company plugin so proposals and reports lead with the decision in at most five short lines, eliminating unaddressed status posts and self-mentions.",
      zh: "优化 agent-company 插件中公司员工（company-employee）与 CEO（company-ceo）的频道消息写作提示词与手册规范，使提案与汇报首行先行给出结论、控制在五短行以内，消除无指向状态刷屏与自我 @ 提及。",
    },
    references: [],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/50",
  },
  {
    id: "RSI-Q017",
    issueNumber: 51,
    publishedAt: "2026-11-11T13:15:00Z",
    status: "open",
    domain: "penguin-harness",
    exp: 150,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness",
    title: {
      en: "Build and Verify an End-to-End Company Mode Case Study",
      zh: "跑通一个公司模式的案例并实际验证",
    },
    description: {
      en: "Starting from a complex real-world scenario — such as having an Agent Company autonomously set up and operate a cloud service business — run and verify PenguinHarness Company Mode end-to-end across CEO strategic planning, role hiring, multi-employee ticket collaboration, and service delivery, producing a validated, reproducible case study.",
      zh: "从真实复杂业务场景出发——例如“让一家 Agent 公司自动筹建并运营一家云服务公司”，完整跑通 PenguinHarness 公司模式（Agent Company）从 CEO 战略拆解、岗位招募、多员工工单协同到最终产品与服务交付的全流程，在实际运行中验证其可行性并沉淀可复现的案例配置。",
    },
    references: [],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/51",
  },
  {
    id: "RSI-Q018",
    issueNumber: 52,
    publishedAt: "2026-11-11T13:16:00Z",
    status: "in_progress",
    domain: "penguin-harness",
    exp: 200,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness",
    assignee: "Myriad-Dreamin",
    title: {
      en: "Explore Personal Agent Applications",
      zh: "探索 Personal Agent 应用",
    },
    description: {
      en: "Focusing on long-term personal assistant scenarios, strengthen PenguinHarness memory mechanisms and contextual understanding to evolve the agent from a passive responder into a proactive AI assistant that anticipates needs, initiates reminders, and drives tasks forward based on user habits and history.",
      zh: "围绕个人长期日常助理场景，重点强化 PenguinHarness 的长短期记忆机制与上下文理解，使 Agent 从“被动等待指令”升级为能够结合用户习惯、日程与历史上下文主动提醒、主动规划并推进任务的“主动式 AI 助手”。",
    },
    references: [],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/52",
  },
  {
    id: "RSI-Q019",
    issueNumber: 53,
    publishedAt: "2026-11-11T13:17:00Z",
    status: "open",
    domain: "benchmark",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
    title: {
      en: "Design an Agent Team Benchmark for Real Revenue-Generating Companies",
      zh: "针对 Agent Team 设计一套商业营收 Benchmark",
    },
    description: {
      en: "Targeting the scenario where an Agent Team autonomously launches and operates a business, design a benchmark that evaluates end-to-end commercial viability (market demand fulfillment, product delivery, token/compute cost accounting, and net profit settlement) to verify whether an agent team can build a genuinely profitable company (per RFC-0001).",
      zh: "面向“Agent 团队自主开办并运营一家公司”的真实商业场景，设计一套评测 Agent Team 商业闭环能力的 Benchmark（包含市场需求响应、产品交付、算力与人力成本核算及净收益结算），验证 Agent 团队是否能够运营出真正实现正向盈利的公司（遵循 RFC-0001 规范）。",
    },
    references: [],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/53",
  },
  {
    id: "RSI-Q020",
    issueNumber: 54,
    publishedAt: "2026-11-11T13:18:00Z",
    status: "open",
    domain: "penguin-harness",
    exp: 100,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness",
    title: {
      en: "Analyze PenguinHarness Security & Enterprise Post-Deployment Evolution Freeze",
      zh: "分析 PenguinHarness 安全问题与企业部署进化锁定机制",
    },
    description: {
      en: "Addressing enterprise production compliance and security scenarios — where organizations require an agent's behavior, prompts, skills, and memory to be strictly frozen after deployment (\"no post-deployment evolution\") — analyze PenguinHarness security surfaces and design an enforceable read-only evolution lock and privilege isolation mechanism.",
      zh: "面向企业生产环境合规与安全管控场景——企业希望在完成自进化训练并将 Agent 正式部署上线后，锁定其行为边界、禁止线上运行期间继续自主修改提示词、技能或记忆（即“部署后不再进化”），系统分析 PenguinHarness 的安全风险面并设计可落地的只读锁定与权限隔离方案。",
    },
    references: [],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/54",
  },
];

export interface CommitteeGroupMember {
  name: string;
  handle: string;
  github: string;
  avatar?: string;
  tags: Text[];
}

export interface CommitteeGroup {
  id: string;
  title: Text;
  members: CommitteeGroupMember[];
}

export const COMMITTEE_HANDLES = [
  "hiyouga",
  "ArisaZz",
  "lzh368",
  "rank-Yu",
  "Saigyouji-Yuyuko1000",
  "Myriad-Dreamin",
] as const;

export const COMMITTEE_GROUPS: CommitteeGroup[] = [
  {
    id: "leadership",
    title: { en: "Project Leadership", zh: "项目主导方" },
    members: [
      {
        name: "Yaowei Zheng",
        handle: "hiyouga",
        github: "https://github.com/hiyouga",
        avatar: "/people/yaowei-zheng.jpg",
        tags: [
          { en: "Benchmark", zh: "Benchmark" },
          { en: "Algorithm", zh: "算法" },
          { en: "Harness", zh: "Harness" },
        ],
      },
    ],
  },
  {
    id: "proposal",
    title: { en: "Proposal Group", zh: "提案小组" },
    members: [
      {
        name: "Xiang Qu",
        handle: "ArisaZz",
        github: "https://github.com/ArisaZz",
        tags: [{ en: "Algorithm", zh: "算法" }],
      },
      {
        name: "Zhihao Liu",
        handle: "lzh368",
        github: "https://github.com/lzh368",
        tags: [{ en: "Benchmark", zh: "Benchmark" }],
      },
      {
        name: "Yanke Yu",
        handle: "rank-Yu",
        github: "https://github.com/rank-Yu",
        tags: [{ en: "Harness", zh: "Harness" }],
      },
    ],
  },
  {
    id: "review",
    title: { en: "Review Group", zh: "审核小组" },
    members: [
      {
        name: "Leijun Zhou",
        handle: "Saigyouji-Yuyuko1000",
        github: "https://github.com/Saigyouji-Yuyuko1000",
        tags: [{ en: "Algorithm", zh: "算法" }],
      },
      {
        name: "Zhihao Liu",
        handle: "lzh368",
        github: "https://github.com/lzh368",
        tags: [{ en: "Benchmark", zh: "Benchmark" }],
      },
      {
        name: "Yangxi Xiang",
        handle: "Myriad-Dreamin",
        github: "https://github.com/Myriad-Dreamin",
        tags: [{ en: "Harness", zh: "Harness" }],
      },
    ],
  },
];

export interface ContributorStats {
  name: string;
  handle: string;
  github: string;
  monthlyExp: number;
  totalExp: number;
  reachedAt: string;
}

const CONTRIBUTOR_NAME_BY_HANDLE: Record<string, string> = {
  "Saigyouji-Yuyuko1000": "Leijun Zhou",
  "Hoyant-Su": "Haoyang Su",
  "rank-Yu": "Yanke Yu",
  hiyouga: "Yaowei Zheng",
  ArisaZz: "Xiang Qu",
  lzh368: "Zhihao Liu",
  "Myriad-Dreamin": "Yangxi Xiang",
};

/**
 * Automatically settles EXP from all `completed` quests in `QUESTS`.
 * Tie-breaking rule (per RFC-0007): When two contributors have the same EXP,
 * whoever reached that EXP score earlier (earliest PR merge timestamp `reachedAt`) ranks higher.
 */
export function buildContributorsFromQuests(): ContributorStats[] {
  const byHandle = new Map<string, ContributorStats>();

  for (const q of QUESTS) {
    if (q.status !== "completed" || !q.assignee) continue;
    const handle = q.assignee;
    const existing = byHandle.get(handle) ?? {
      name: CONTRIBUTOR_NAME_BY_HANDLE[handle] ?? handle,
      handle,
      github: `https://github.com/${handle}`,
      monthlyExp: 0,
      totalExp: 0,
      reachedAt: q.publishedAt,
    };
    existing.monthlyExp += q.exp;
    existing.totalExp += q.exp;
    if (q.publishedAt > existing.reachedAt) {
      existing.reachedAt = q.publishedAt;
    }
    byHandle.set(handle, existing);
  }

  return [...byHandle.values()].sort(
    (a, b) => b.totalExp - a.totalExp || a.reachedAt.localeCompare(b.reachedAt),
  );
}

export const CONTRIBUTORS: ContributorStats[] = buildContributorsFromQuests();

export const TOP_FIVE_BONUSES_RMB = [800, 400, 200, 100, 50] as const;

export interface RankedContributorRow {
  rank: number;
  name: string;
  handle: string;
  github: string;
  exp: number;
  expRmb: number;
  topBonusRmb: number;
  totalEstimatedRmb: number;
}

export function computeContributorRankings(): {
  monthly: RankedContributorRow[];
  allTime: { rank: number; name: string; handle: string; github: string; exp: number }[];
} {
  // Monthly Reward Rule (up to ¥10,000 RMB monthly budget):
  // 1. 1:1 EXP-to-RMB conversion (1 EXP = ¥1 RMB)
  // 2. Top-5 bonus: #1 +¥800, #2 +¥400, #3 +¥200, #4 +¥100, #5 +¥50
  // 3. Tie-breaking: earliest to reach the EXP score (`reachedAt` ascending) ranks higher
  const sortedMonthly = [...CONTRIBUTORS].sort(
    (a, b) => b.monthlyExp - a.monthlyExp || a.reachedAt.localeCompare(b.reachedAt),
  );

  const monthly: RankedContributorRow[] = sortedMonthly.map((c, idx) => {
    const expRmb = c.monthlyExp;
    const topBonusRmb = c.monthlyExp > 0 ? (TOP_FIVE_BONUSES_RMB[idx] ?? 0) : 0;
    return {
      rank: idx + 1,
      name: c.name,
      handle: c.handle,
      github: c.github,
      exp: c.monthlyExp,
      expRmb,
      topBonusRmb,
      totalEstimatedRmb: expRmb + topBonusRmb,
    };
  });

  const allTime = [...CONTRIBUTORS]
    .sort((a, b) => b.totalExp - a.totalExp || a.reachedAt.localeCompare(b.reachedAt))
    .map((c, idx) => ({
      rank: idx + 1,
      name: c.name,
      handle: c.handle,
      github: c.github,
      exp: c.totalExp,
    }));

  return { monthly, allTime };
}

function parseOpenSourceContributorsFromYaml(raw: string): string[] {
  const sectionMatch = raw.match(/(?:^|\n)open_source_contributors:\s*\n((?:\s*-\s*[^\n]+\n?)*)/);
  if (!sectionMatch) return [];
  return Array.from(sectionMatch[1].matchAll(/^\s*-\s*["']?([^"'\s#]+)["']?/gm), (m) => m[1]);
}

/**
 * Open-source contributors synced directly from `community/people.yaml`
 * (falling back to unique assignees on the Task Board).
 */
export const OPEN_SOURCE_CONTRIBUTORS: string[] = (() => {
  const fromYaml = parseOpenSourceContributorsFromYaml(peopleYamlRaw);
  if (fromYaml.length > 0) return fromYaml;
  return Array.from(
    new Set(QUESTS.map((q) => q.assignee).filter((a): a is string => Boolean(a))),
  );
})();

/**
 * Opens the standardized `.github/ISSUE_TEMPLATE/task.yml` form (committee members only).
 */
export function buildProposeTaskIssueUrl(): string {
  return "https://github.com/Prism-Shadow/penguin-harness-community/issues/new?template=task.yml";
}
