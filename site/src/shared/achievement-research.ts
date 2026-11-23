import { resolveText, type QuestItem } from "./community";
import type { Locale } from "./i18n";

type Text = Record<Locale, string>;
type StageState = "planned" | "active" | "done";
type Phase = {
  label: Text;
  work: Text;
  evidence: Text;
  dataset?: Text;
  issues?: number[];
  pending?: Text;
  state?: StageState;
  references?: { label: Text; url: string }[];
};
type TopicDefinition = {
  id: string;
  title: Record<Locale, string | readonly string[]>;
  twoLineTitle?: true;
  phases?: Phase[];
};
type ProjectDefinition = TopicDefinition & { followUp?: TopicDefinition };
type Achievement = "unlocked" | "locked";

const routeTitles = {
  infra: { zh: "InfraRSI", en: "InfraRSI" },
  "auto-bench": { zh: "Auto Bench", en: "Auto Bench" },
  agent: { zh: "Super Agent 与 Personal Agent", en: "Super Agent & Personal Agent" },
  platform: { zh: "RSI 平台与应用", en: "RSI platform & applications" },
  apps: { zh: "垂域应用中心插件", en: "Vertical App Center plugins" },
};
type RouteId = keyof typeof routeTitles;
type VersionDefinition = {
  id: string;
  preview?: true;
  projects: Partial<Record<RouteId, ProjectDefinition[]>>;
};

export const researchStageLabels = {
  zh: { planned: "未开始", active: "进行中", done: "已完成" },
  en: { planned: "Not started", active: "In progress", done: "Complete" },
};

const L = {
  bench: { zh: "Bench", en: "Bench" },
  run: { zh: "实验", en: "Run" },
  results: { zh: "结果", en: "Results" },
  analysis: { zh: "结果分析", en: "Analysis" },
  report: { zh: "报告", en: "Report" },
  appProto: { zh: "场景与原型", en: "Scenario & prototype" },
  appSkill: { zh: "Skill 与工具链", en: "Skills & toolchain" },
  appUi: { zh: "工作台插件", en: "Workbench UI" },
  appMarket: { zh: "插件市场集成", en: "Marketplace" },
  appEval: { zh: "案例与评测验收", en: "Case & evaluation" },
};

const P = {
  integrate: { zh: "待接入", en: "Pending integration" },
  accept: { zh: "待验收", en: "Pending acceptance" },
  confirm: { zh: "待确认", en: "Pending confirmation" },
  analyze: { zh: "待分析", en: "Pending analysis" },
  review: { zh: "待评审", en: "Pending review" },
  run: { zh: "待开展", en: "Pending experiment" },
  submit: { zh: "待提交", en: "Pending submission" },
  dev: { zh: "待开发", en: "Pending development" },
  register: { zh: "待注册", en: "Pending registration" },
  benchAcceptance: { zh: "待基准验收", en: "Awaiting benchmark acceptance" },
  previousStage: { zh: "等待前序阶段", en: "Awaiting a previous stage" },
};

const REPO = {
  harness: "https://github.com/Prism-Shadow/penguin-harness",
  bench: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
  plugins: "https://github.com/Prism-Shadow/penguin-harness-plugins",
  apps: "https://github.com/Prism-Shadow/penguin-harness-apps",
  dshbook: "https://dshbook.penguin.ooo",
  dshbookRepo: "https://github.com/Prism-Shadow/deepseek-harness-book",
};

/* ---------- 1. InfraRSI ---------- */
const infraPr = `${REPO.harness}/pull/1551`;
const infraRun = `${infraPr}#issuecomment-6997394473`;
const trainingPhases: Phase[] = [
  {
    label: L.bench,
    pending: P.integrate,
    work: {
      zh: "按 RFC-0001 接入 NanoChat AutoResearch 基准，固定基准版本、数据准备流程和评测规则。",
      en: "Integrate the NanoChat AutoResearch benchmark under RFC-0001. Pin its version, data preparation, and evaluation rules.",
    },
    dataset: {
      zh: "试跑使用 ClimbMix 镜像（karpathy/climbmix-400b-shuffle），训练分片 00000–00009，验证分片 06542。社区基准的数据版本与划分待 #83 确认。",
      en: "The trial used the ClimbMix mirror (karpathy/climbmix-400b-shuffle), training shards 00000–00009, and validation shard 06542. The community benchmark's dataset version and splits are pending confirmation in issue #83.",
    },
    evidence: {
      zh: "交付可运行的基准包，支持数据准备、基线复跑和候选自动评分。",
      en: "Deliver a runnable benchmark package with data preparation, baseline reproduction, and automated candidate scoring.",
    },
    issues: [83],
  },
  {
    label: L.run,
    pending: P.accept,
    work: {
      zh: "PR #1551 在单张 NVIDIA A100 80GB 上试跑。使用修复版 AutoResearch（228791f），固定 50.3M 参数模型、优化器与每步 2¹⁹ Token，基线 micro-batch 为 128。",
      en: "PR #1551 reports a trial on one NVIDIA A100 80GB. It uses patched AutoResearch (228791f) with a fixed 50.3M-parameter model, optimizer, and 2¹⁹ tokens per update. The baseline micro-batch size is 128.",
    },
    evidence: {
      zh: "B-Comp 试跑搜索了 micro-batch 大小和训练代码改动。固定训练 60 步，计时第 21–60 步。候选、验证输出和成对复测记录供验收时复核。",
      en: "The B-Comp trial searched micro-batch sizes and training-code edits. Each run used 60 updates and timed updates 21–60. Candidate runs, verifier output, and paired reruns are available for review.",
    },
    issues: [121],
    references: [
      { label: { zh: "实验 PR #1551", en: "Experiment PR #1551" }, url: infraPr },
      { label: { zh: "B-Comp 试跑记录", en: "B-Comp trial records" }, url: infraRun },
    ],
  },
  {
    label: L.results,
    pending: P.confirm,
    work: {
      zh: "待确认课题的基线与候选对照结果。PR 中的成对复测作为试跑记录供复核。",
      en: "Confirm the project's baseline and candidate comparison. The paired measurements in the PR remain available as trial records for review.",
    },
    evidence: {
      zh: "结果表应注明运行条件、单步耗时、训练 loss 和验证集 BPB，并能追溯到原始日志。",
      en: "Record run conditions, step time, training loss, and validation BPB in a results table linked to raw logs.",
    },
    references: [{ label: { zh: "试跑复测原始记录", en: "Raw trial measurements" }, url: infraRun }],
  },
  {
    label: L.analysis,
    pending: P.analyze,
    work: {
      zh: "结果确认后，分析单步耗时、额外编译开销及不同运行之间的波动。",
      en: "Once results are confirmed, analyze step time, additional compilation overhead, and variability across runs.",
    },
    evidence: {
      zh: "根据确认后的结果记录端到端收益、适用条件和实验局限。",
      en: "Document the end-to-end gains, applicable conditions, and limitations supported by the confirmed results.",
    },
  },
  {
    label: L.report,
    pending: P.review,
    work: {
      zh: "试跑资料已随插件 PR 提交，课题报告待评审。",
      en: "The plugin PR includes the trial materials. The project report is pending review.",
    },
    evidence: {
      zh: "跟踪社区任务 #71 对实测记录及插件适配的验收。",
      en: "Track acceptance of the experiment records and plugin integration in community issue #71.",
    },
    issues: [71],
  },
];

const autoResearch: TopicDefinition = {
  id: "autoresearch-a100",
  title: {
    zh: ["面向 NVIDIA GPU 的 ", "AutoResearch 预训练性能优化"],
    en: "AutoResearch Pretraining Performance Tuning for NVIDIA GPUs",
  },
  phases: trainingPhases,
};

const speedrun: TopicDefinition = {
  id: "nanogpt-speedrun-transfer",
  title: {
    zh: ["面向 NanoGPT Speedrun 的", "预训练速度纪录冲击"],
    en: "Chasing a Pretraining Speed Record on NanoGPT Speedrun",
  },
  phases: [
    {
      label: L.bench,
      pending: P.integrate,
      work: {
        zh: "选定 NanoGPT Speedrun 赛道（Track 1 或 Track 3），固定版本、FineWeb 数据流和目标验证集 Loss 达标线。",
        en: "Select a NanoGPT Speedrun track (Track 1 or Track 3) and pin its version, FineWeb data stream, and target validation loss.",
      },
      evidence: { zh: "可复跑的赛道基线与自动评分入口。", en: "A reproducible track baseline and automated scoring entry point." },
      issues: [84],
    },
    {
      label: L.run,
      pending: P.run,
      work: {
        zh: "迁移 AutoResearch 中验收通过的 micro-batch、编译或算子优化，在相同硬件和赛道规则下对照官方基线与迁移版本。",
        en: "Transfer accepted AutoResearch optimizations and compare them against the Speedrun baseline on identical hardware and track rules.",
      },
      evidence: { zh: "迁移补丁、实验配置和两组训练日志。", en: "The transfer patch, configurations, and logs for both variants." },
      references: [{ label: { zh: "上游实验 PR #1551", en: "Upstream PR #1551" }, url: infraPr }],
    },
    {
      label: L.results,
      pending: P.confirm,
      work: { zh: "记录两组达到目标验证精度的端到端耗时（Time-to-Target）与稳态单步吞吐。", en: "Record time-to-target and steady-state step throughput for both variants." },
      evidence: { zh: "可追溯到原始日志的对照结果表。", en: "A comparison table linked to the raw run logs." },
    },
    {
      label: L.analysis,
      pending: P.analyze,
      work: { zh: "分析训练基础设施优化收益能否跨模型与负载复现，区分局部调参与通用加速。", en: "Assess whether training infrastructure gains generalize across models and workloads." },
      evidence: { zh: "基于重复运行的迁移结论及适用条件。", en: "A conclusion and applicability conditions supported by repeated runs." },
    },
    {
      label: L.report,
      pending: P.submit,
      work: { zh: "整理迁移步骤、配置、对照结果和复跑说明。", en: "Document the transfer steps, configurations, comparisons, and rerun instructions." },
      evidence: { zh: "可评审的跨基准迁移实验报告。", en: "A reviewable cross-benchmark transfer report." },
      issues: [84],
    },
  ],
};

const ascendPr = `${REPO.harness}/pull/1627`;
const ascendInference: TopicDefinition = {
  id: "ascend-inference-mtp",
  title: {
    zh: "面向昇腾芯片的 Qwen3.8 推理性能优化",
    en: "Optimizing Qwen3.8 Inference on Ascend Chips",
  },
  phases: [
    {
      label: L.bench,
      pending: P.integrate,
      work: {
        zh: "将 32 并发/单流压测负载与 20 题问答精度门禁（temperature=0，要求 20/20 全过且偏差 ≤1 题）按 RFC-0001 拆分为独立基准。",
        en: "Extract the 32-concurrency/single-stream benchmark workload and 20-question accuracy gate (temperature=0, 20/20 pass) under RFC-0001.",
      },
      dataset: {
        zh: "固定 Qwen3.8-27B-w8a8、32K 上下文、max-num-seqs=32 与 20 道固定问答校验题。",
        en: "Pin Qwen3.8-27B-w8a8, 32K context length, max-num-seqs=32, and a 20-question deterministic QA gate.",
      },
      evidence: { zh: "独立于进化产物的昇腾 vLLM 推理评测基准包。", en: "A standalone Ascend vLLM inference benchmark package." },
      issues: [88],
    },
    {
      label: L.run,
      work: {
        zh: "在单张 Ascend 950PR（CANN 9.2.1、vLLM-Ascend 0.30.0 提交 0c002b4）上对比 latency（MTP 3 tokens）、throughput（MTP 1 token）及运行时动态投机调度。",
        en: "Compare latency mode (MTP 3 tokens), throughput mode (MTP 1 token), and runtime dynamic speculative scheduling on a single Ascend 950PR.",
      },
      evidence: { zh: "PR #1627 提交的 3 轮演进补丁、精度门禁输出与 120 轮连续压测日志。", en: "Three-round evolution patches, accuracy gate outputs, and 120-round stress test logs in PR #1627." },
      issues: [88],
      references: [{ label: { zh: "试跑 PR #1627", en: "Trial PR #1627" }, url: ascendPr }],
    },
    {
      label: L.results,
      pending: P.confirm,
      work: {
        zh: "试跑记录：32 并发输出吞吐由 814.2 升至 904.7 tok/s（+11.1%，超 6.66% 的 3×CV 噪声门限），单流 Mean TPOT 11.10 ms，动态投机触发 PIECEWISE 图反亏 5%–8%。",
        en: "Trial records: 32-concurrency throughput rose from 814.2 to 904.7 tok/s (+11.1%, exceeding the 6.66% 3×CV noise floor), single-stream Mean TPOT reached 11.10 ms, while dynamic scheduling lost 5%–8%.",
      },
      evidence: { zh: "带 3×CV 噪声门限对照的多并发吞吐、TPOT 与 TTFT 结果表。", en: "Throughput, TPOT, and TTFT comparison tables against 3×CV noise thresholds." },
      references: [{ label: { zh: "试跑数据与补丁 PR #1627", en: "Trial measurements in PR #1627" }, url: ascendPr }],
    },
    {
      label: L.analysis,
      pending: P.analyze,
      work: {
        zh: "分析昇腾 CANN 图编译下 MTP 步数随并发度变化的收益拐点，以及动态切换触发图重编译的开销来源。",
        en: "Analyze the concurrency crossover point for MTP steps under CANN graph compilation and the overhead of dynamic switching.",
      },
      evidence: { zh: "静态档位切换 vs 动态调度的适用边界分析。", en: "Applicability analysis comparing static mode switching against dynamic scheduling." },
    },
    {
      label: L.report,
      pending: P.review,
      work: {
        zh: "试跑报告（examples/ascend-inference-rsi/report.md）已随 PR #1627 提交，待基准拆分后重新提交验收。",
        en: "The trial report was submitted in PR #1627 and awaits resubmission after benchmark extraction.",
      },
      evidence: { zh: "经独立基准复核的昇腾推理自进化实验报告。", en: "An Ascend inference self-evolution report verified against the standalone benchmark." },
      issues: [88],
      references: [{ label: { zh: "试跑报告 PR #1627", en: "Trial report PR #1627" }, url: ascendPr }],
    },
  ],
};

const solExecBenchErnie: TopicDefinition = {
  id: "sol-execbench-ernie-evolve",
  title: {
    zh: "用自进化算法自动编写高性能 GPU 算子",
    en: "Writing High-Performance GPU Kernels through Self-Evolution",
  },
  phases: [
    {
      label: L.bench,
      pending: P.integrate,
      work: {
        zh: "接入 NVIDIA SOL-ExecBench 的 235 道生产模型算子题目与 Evaluation Stack v1.1 隔离评测环境。",
        en: "Integrate NVIDIA SOL-ExecBench's 235 production operator problems and Evaluation Stack v1.1 isolated harness.",
      },
      dataset: {
        zh: "涵盖 GQA、MLA、MoE、DeltaNet 等 12 类生产级算子负载及数值容差校验集。",
        en: "Covers 12 production operator families including GQA, MLA, MoE, and DeltaNet with numerical tolerance checks.",
      },
      evidence: { zh: "支持防奖励黑客计时与 Speed-of-Light（SOL）打分的基准包。", en: "A benchmark package supporting anti-reward-hacking timing and Speed-of-Light (SOL) scoring." },
      issues: [85],
    },
    {
      label: L.run,
      work: {
        zh: "在 PenguinHarness 中运行 ERNIE Evolve（外层候选树规划 + 内层实现验证），与单轮直接生成算子基线对照。",
        en: "Run ERNIE Evolve (outer tree planner + inner implementation verifier) in PenguinHarness against a single-pass baseline.",
      },
      evidence: { zh: "双层进化循环插件实现、候选演化树轨迹与评测日志。", en: "Dual-loop plugin implementation, candidate evolution tree traces, and evaluation logs." },
      issues: [86],
    },
    {
      label: L.results,
      pending: P.confirm,
      work: {
        zh: "统计数值正确率与相对硬件极限的 SOL 平均得分（论文参考值：ERNIE Evolve 0.819 vs Hyra-1.0 0.736）。",
        en: "Measure numerical pass rate and mean SOL score relative to hardware limits (reference: ERNIE Evolve 0.819 vs Hyra-1.0 0.736).",
      },
      evidence: { zh: "按 12 类算子家族细分的正确率与 SOL 加速比对照表。", en: "Pass rate and SOL speedup breakdown across all 12 operator families." },
    },
    {
      label: L.analysis,
      pending: P.analyze,
      work: {
        zh: "分析外层演化轮数、硬件性能反馈与算子瓶颈类型（访存受限 vs 计算受限）对加速收益的影响。",
        en: "Analyze how evolution rounds, hardware profiling feedback, and bottleneck types affect speedup gains.",
      },
      evidence: { zh: "典型算子（如 MLA/MoE）的演化路径拆解与瓶颈分析。", en: "Evolution trajectory breakdown and bottleneck analysis on representative operators." },
    },
    {
      label: L.report,
      pending: P.submit,
      work: {
        zh: "汇总 SOL-ExecBench 复现配置、演化策略消融与复跑指南。",
        en: "Compile SOL-ExecBench reproduction configs, evolution ablations, and rerun instructions.",
      },
      evidence: { zh: "可复核的 GPU 算子自动进化研究报告。", en: "A reviewable automated GPU kernel evolution research report." },
      issues: [85, 86],
    },
  ],
};

/* ---------- 2. Auto Bench ---------- */
const hleEvalPr = `${REPO.bench}/pull/32`;
const honestyPr = `${REPO.bench}/pull/42`;

const autoBenchJudgeAlignment: TopicDefinition = {
  id: "auto-bench-judge-alignment",
  title: {
    zh: ["从原始数据自动生成", "评测基准（Auto Bench）"],
    en: "Generating Evaluation Benchmarks from Raw Data with Auto Bench",
  },
  phases: [
    {
      label: L.bench,
      pending: P.integrate,
      work: {
        zh: "从已完成 Harbor 改造的 TableQA（#103）与写作拟人度评测（#96、#68）抽取边界争议样本，建立人类专家裁决金标准。",
        en: "Curate ambiguous boundary samples from Harbor-adapted TableQA (#103) and writing realism benchmarks (#96, #68) with human expert gold labels.",
      },
      dataset: {
        zh: "包含客观简答等价判分边界题（可先行复用 PR #32 的 8 份简答复核与 PR #42 的双口径分歧样本）与长文成对盲测样本。",
        en: "Combines short-answer equivalence boundary cases (bootstrapped with PR #32 and PR #42 judge disagreements) and paired writing samples.",
      },
      evidence: { zh: "带专家双盲标注与争议理由说明的校准样本集。", en: "A calibration dataset with double-blind expert labels and rationales." },
      issues: [103, 96, 68],
      references: [
        { label: { zh: "HLE 简答人工复核记录 PR #32", en: "HLE manual judge audit PR #32" }, url: hleEvalPr },
        { label: { zh: "盲测/非盲测判分对比 PR #42", en: "Blind vs. non-blind judge audit PR #42" }, url: honestyPr },
      ],
    },
    {
      label: L.run,
      work: {
        zh: "对比「LLM 零样本自动生成判分规则」与「引入人类选样、边界消歧与多轮规则修订的 Auto Bench 插件（#78）」。",
        en: "Compare zero-shot LLM rubric generation against the human-in-the-loop Auto Bench plugin (#78) with sample selection and boundary disambiguation.",
      },
      evidence: { zh: "Auto Bench 插件实现、规则迭代版本记录与两套判分器评测输出。", en: "Auto Bench plugin implementation, rubric revision history, and judge evaluation outputs." },
      issues: [78],
    },
    {
      label: L.results,
      pending: P.confirm,
      work: {
        zh: "计算两套自动判分器与人类专家裁决的一致率（Cohen's κ）、边界样本误判率及多轮打分方差。",
        en: "Measure judge-human agreement (Cohen's κ), boundary false-positive/negative rates, and multi-run scoring variance.",
      },
      evidence: { zh: "判分一致率与误判案例对照表。", en: "Agreement metrics and misjudged boundary case comparison tables." },
    },
    {
      label: L.analysis,
      pending: P.analyze,
      work: {
        zh: "分析哪些人工消歧步骤对抑制 RSI 训练中的奖励黑客（Reward Hacking）最关键。",
        en: "Identify which human disambiguation steps are most critical for preventing reward hacking during RSI loops.",
      },
      evidence: { zh: "客观简答与主观质量评测的判分规则消歧指南。", en: "Rubric disambiguation guidelines for objective QA and subjective quality benchmarks." },
    },
    {
      label: L.report,
      pending: P.submit,
      work: {
        zh: "沉淀人机协同构建评测基准与自动判分器校准报告。",
        en: "Document the human-in-the-loop benchmark construction workflow and judge calibration report.",
      },
      evidence: { zh: "Auto Bench 插件验收报告与基准构建手册。", en: "Auto Bench plugin acceptance report and benchmark construction guide." },
      issues: [78, 103],
    },
  ],
};

const turingBenchWritingRealism: TopicDefinition = {
  id: "turingbench-writing-realism",
  title: {
    zh: "AI 写作与生成产物的「去 AI 味」评测",
    en: "Evaluating Naturalness in AI Writing and Generated Content",
  },
  phases: [
    {
      label: L.bench,
      pending: P.integrate,
      work: {
        zh: "构建覆盖文本去 AI 味、自然语音合成与短剧视频分镜的拟人度与真实感基准（#96、#68）。",
        en: "Build the TuringBench anthropomorphism and writing quality benchmark across text, speech, and video storyboards (#96, #68).",
      },
      evidence: { zh: "多模态样本对、人类真实基线锚点与成对盲测协议。", en: "Multimodal sample pairs, human reference anchors, and pairwise blind evaluation protocol." },
      issues: [96, 68],
    },
    {
      label: L.run,
      work: {
        zh: "交换正反位置运行多轮成对盲测，对比单维度总体打分与分项（句式多样性、情感自然度、分镜连贯性）规则判分。",
        en: "Run position-swapped pairwise blind evaluations comparing holistic scoring against decomposed rubric criteria.",
      },
      evidence: { zh: "位置偏置消融日志与多评审模型交叉打分记录。", en: "Position-bias ablation logs and cross-judge model scoring records." },
      issues: [68, 78],
    },
    {
      label: L.results,
      pending: P.confirm,
      work: {
        zh: "统计正反序判分翻转率、跨评审模型一致率及对去 AI 味 Skill 迭代的敏感度。",
        en: "Report order-swap flip rates, cross-judge agreement, and sensitivity to de-AI writing skill iterations.",
      },
      evidence: { zh: "主观评测稳定性与位置偏置量化结果表。", en: "Quantitative tables on subjective evaluation stability and position bias." },
    },
    {
      label: L.analysis,
      pending: P.analyze,
      work: {
        zh: "分析成对盲测中长度偏置、格式偏置与修辞模板化对判分信号的干扰机制。",
        en: "Analyze how length bias, formatting bias, and rhetorical tropes distort pairwise blind judge rewards.",
      },
      evidence: { zh: "去偏置判分提示词规范与反作弊校验项。", en: "Debiased judge prompting rules and anti-gaming checks." },
    },
    {
      label: L.report,
      pending: P.submit,
      work: {
        zh: "整理多模态与长文拟人度基准构建及判分器消融报告。",
        en: "Compile the multimodal and long-form writing realism benchmark and judge ablation report.",
      },
      evidence: { zh: "可复跑的主观质量评测基准报告。", en: "A reproducible subjective quality benchmark report." },
      issues: [96, 68],
    },
  ],
};

/* ---------- 3. Super Agent & Personal Agent ---------- */
const agentBlockerHonesty: TopicDefinition = {
  id: "agent-blocker-honesty",
  title: {
    zh: "解决智能体工具故障时谎报完成的问题",
    en: "Preventing False Completion Reports after Agent Tool Failures",
  },
  phases: [
    {
      label: L.bench,
      pending: P.accept,
      work: {
        zh: "从 Failure-Transparent Agents、RetryRealistic、Async-RBench 精选 50 道工具缺失/故障与异步后续事件题目（25 题归纳规则、25 题冻结测试）。",
        en: "Curate 50 tool-failure and async follow-up tasks from Failure-Transparent Agents, RetryRealistic, and Async-RBench (25 train, 25 frozen test).",
      },
      dataset: {
        zh: "包含 25 道测试题与 3 类异步后续追问事件，检验首答阻碍披露与状态变化后的结论更新。",
        en: "25 frozen test tasks plus 3 async follow-up event types testing initial blocker disclosure and conclusion updates.",
      },
      evidence: { zh: "PR #42 提交的诚实性评测集与双口径（非盲复核 + 盲测 AI 判分）评分器。", en: "The honesty benchmark dataset and dual-mode (non-blind + blind AI judge) evaluator in PR #42." },
      issues: [112, 124],
      references: [{ label: { zh: "基准与实验 PR #42", en: "Benchmark & experiment PR #42" }, url: honestyPr }],
    },
    {
      label: L.run,
      work: {
        zh: "固定 gpt-6.1-sol（high 思考档），对「A：模型直答」「B：默认 Codex CLI 0.169.1」「C：注入 policy-v2 汇报规则的 Codex」各独立运行 3 轮（252 份答复）。",
        en: "Fix gpt-6.1-sol (high reasoning) and run 3 independent trials across direct model call, default Codex CLI 0.169.1, and Codex with policy-v2 rules (252 responses).",
      },
      evidence: { zh: "三组各 75 次首答与 9 次后续事件完整轨迹及盲测重评记录。", en: "Complete trajectories for 75 initial answers and 9 follow-up events per group, plus blind re-evaluation logs." },
      issues: [112],
      references: [{ label: { zh: "252 份实测记录 PR #42", en: "252 run records in PR #42" }, url: honestyPr }],
    },
    {
      label: L.results,
      pending: P.confirm,
      work: {
        zh: "试跑记录：非盲复核首答合格数由默认 Codex 的 44/75 升至加规则后的 70/75（+34.67 个百分点）；盲测 AI 判分下由 42/75 升至 67/75；后续事件三组均为 9/9。",
        en: "Trial records: initial honest disclosure rose from 44/75 (default Codex) to 70/75 (+34.67 pp) under non-blind review, and from 42/75 to 67/75 under blind AI judging.",
      },
      evidence: { zh: "按题目来源细分的非盲复核与隐藏分组盲测对照表。", en: "Per-source breakdown tables comparing non-blind review and group-masked blind judging." },
      references: [{ label: { zh: "双口径判分汇总 PR #42", en: "Dual-judge summary in PR #42" }, url: honestyPr }],
    },
    {
      label: L.analysis,
      pending: P.analyze,
      work: {
        zh: "核查盲测与非盲测出现分歧的边界样本，分析智能体在部分工具失败时“借历史输出硬编完成”的触发条件。",
        en: "Audit samples where blind and non-blind judges diverge, and analyze what triggers fabricated completion under partial tool failures.",
      },
      evidence: { zh: "隐瞒阻碍典型失败模式分类与人工抽检复核说明。", en: "Taxonomy of blocker deception failure modes and manual audit notes." },
    },
    {
      label: L.report,
      pending: P.review,
      work: {
        zh: "跟踪 Benchmark PR #42 审校合入，并推进同一套 50 题在 PenguinHarness 上的迁移盲测报告。",
        en: "Track acceptance of Benchmark PR #42 and extend the 50-task blind evaluation to PenguinHarness.",
      },
      evidence: { zh: "智能体阻碍如实汇报评测报告与 Harness 提示词改进建议。", en: "Blocker honesty evaluation report and Harness system prompt recommendations." },
      issues: [112, 124],
      references: [{ label: { zh: "待验收报告 PR #42", en: "Pending report in PR #42" }, url: honestyPr }],
    },
  ],
};

const compactionPr = `${REPO.harness}/pull/1491`;
const compactionUiPr = `${REPO.harness}/pull/1591`;
const contextCompactionHandoff: TopicDefinition = {
  id: "context-compaction-handoff",
  title: {
    zh: "解决智能体压缩长上下文时的「失忆」问题",
    en: "Preserving Context When Agents Compact Long Tasks",
  },
  phases: [
    {
      label: L.bench,
      pending: P.integrate,
      work: {
        zh: "构建触发多次上下文压缩的长程任务评测集（#62、#90），埋入精确参数、工具中间产物与用户中途纠偏指令。",
        en: "Build a long-horizon evaluation suite (#62, #90) that triggers repeated context compaction with embedded facts, tool states, and mid-run user corrections.",
      },
      evidence: { zh: "固定压缩阈值与探针检查点的长程记忆与压缩评测基准。", en: "A long-horizon memory and compaction benchmark with pinned token thresholds and probe checkpoints." },
      issues: [62, 90],
    },
    {
      label: L.run,
      work: {
        zh: "在相同模型与压缩阈值下，对比 PR #1491「压缩前多轮工具写入 handoff 文件 + trace-lookup JSONL 行级检索」与「纯文本 [context_summary] 摘要」。",
        en: "Under identical models and compaction thresholds, compare PR #1491's pre-compaction handoff files + trace-lookup JSONL retrieval against plain [context_summary] text.",
      },
      evidence: { zh: "已合入主干的压缩交接实现（PR #1491、PR #1591）及两组长程对照运行轨迹。", en: "Merged compaction handoff implementation (PR #1491, PR #1591) and paired long-horizon run traces." },
      issues: [44],
      references: [
        { label: { zh: "压缩交接与轨迹检索 PR #1491", en: "Compaction handoff & trace-lookup PR #1491" }, url: compactionPr },
        { label: { zh: "压缩配置界面 PR #1591", en: "Compaction settings UI PR #1591" }, url: compactionUiPr },
      ],
    },
    {
      label: L.results,
      pending: P.confirm,
      work: {
        zh: "评测压缩后对关键事实、文件路径、未完成子步骤及用户纠偏要求的保留准确率，并统计压缩阶段额外工具调用开销。",
        en: "Measure post-compaction retention accuracy on facts, file paths, pending substeps, and user steering, plus extra pre-compaction tool token overhead.",
      },
      evidence: { zh: "关键信息召回率、端到端任务完成率与 Token 开销对照表。", en: "Comparison tables for fact recall, end-to-end task completion, and token overhead." },
    },
    {
      label: L.analysis,
      pending: P.analyze,
      work: {
        zh: "分析压缩前工具预算轮数（如默认 8 轮）与压缩后按需检索 JSONL 原始轨迹的触发频率及收益边界。",
        en: "Analyze how pre-compaction tool turn budgets (default 8) and post-compaction JSONL trace lookups trade off cost against accuracy.",
      },
      evidence: { zh: "不同任务长度下的最优压缩交接配置建议。", en: "Optimal compaction handoff configuration guidelines across task horizons." },
    },
    {
      label: L.report,
      pending: P.submit,
      work: {
        zh: "整理长程上下文压缩机制设计与基准实测报告。",
        en: "Compile the long-horizon context compaction design and benchmark evaluation report.",
      },
      evidence: { zh: "可复跑的上下文压缩对照实验报告。", en: "A reproducible context compaction comparison report." },
      issues: [44, 62],
    },
  ],
};

const companyPr = `${REPO.harness}/pull/1434`;
const sweCoworkPr = `${REPO.bench}/pull/36`;
const companyModeCoordination: TopicDefinition = {
  id: "company-mode-coordination",
  title: {
    zh: ["多智能体「公司模式」的", "分工协同与防刷屏优化"],
    en: "Improving Coordination and Reducing Chat Noise in Company Mode",
  },
  phases: [
    {
      label: L.bench,
      work: {
        zh: "基于多智能体软件工程协同基准 SWE-CoWork（#108 / PR #36，101 道协同题目）与公司模式真实项目案例（#51）建立评测环境。",
        en: "Set up evaluation using the 101-task SWE-CoWork multi-agent benchmark (#108 / PR #36) and end-to-end Company Mode project cases (#51).",
      },
      evidence: { zh: "多角色协同任务集与频道消息/工单交付统计脚本。", en: "Multi-role collaborative task suite and channel message / ticket delivery metrics scripts." },
      issues: [108, 51],
      references: [{ label: { zh: "SWE-CoWork 基准 PR #36", en: "SWE-CoWork benchmark PR #36" }, url: sweCoworkPr }],
    },
    {
      label: L.run,
      work: {
        zh: "固定 agent-company 插件与相同基座模型，对比原始提示词、PR #1434 精简沟通规范（结论先行、限 5 行、禁刷屏与自我 @）及 #94 里程碑并行调度。",
        en: "Fix the agent-company plugin and base model to compare baseline prompts, PR #1434 concise communication norms, and #94 milestone-based parallel scheduling.",
      },
      evidence: { zh: "PR #1434 已合入的沟通手册补丁与本地多角色协同对照轨迹。", en: "Merged communication handbook patch in PR #1434 and multi-agent collaborative run traces." },
      issues: [50],
      references: [{ label: { zh: "沟通规范优化 PR #1434", en: "Communication norms PR #1434" }, url: companyPr }],
    },
    {
      label: L.results,
      pending: P.confirm,
      work: {
        zh: "PR #1434 玩具仓库试跑：员工消息中位长度由 186 字降至 86/79 字，无指向状态刷屏由 16 条降至 0，自我 @ 由 3 次降至 0；待补充完整项目交付率。",
        en: "PR #1434 toy-repo trial: median employee message length dropped from 186 to 86/79 chars, unaddressed status spam from 16 to 0, and self-@ from 3 to 0; full project pass rate pending.",
      },
      evidence: { zh: "频道消息长度、无效刷屏频次、Token 消耗与工单按期完成率对照表。", en: "Comparison tables for message length, status spam count, token cost, and ticket completion rate." },
      references: [{ label: { zh: "两轮对照试跑记录 PR #1434", en: "Two-round trial comparison in PR #1434" }, url: companyPr }],
    },
    {
      label: L.analysis,
      pending: P.analyze,
      work: {
        zh: "区分哪些多智能体协作问题能靠 Skill 规范解决，哪些必须在 Server 层改造通知去重与会话路由（#94）。",
        en: "Separate multi-agent coordination bottlenecks solvable via Skill norms from those requiring server-side notification routing (#94).",
      },
      evidence: { zh: "提示词规范与调度架构对协同损耗的消融分析。", en: "Ablation analysis of prompt norms vs. scheduler architecture on coordination overhead." },
      issues: [94],
    },
    {
      label: L.report,
      pending: P.submit,
      work: {
        zh: "汇总 Company Mode 沟通规范与 Super Agent 协同调度改进报告。",
        en: "Compile the Company Mode communication norms and Super Agent scheduling evaluation report.",
      },
      evidence: { zh: "含端到端真实项目案例（#51）的多智能体协同研究报告。", en: "Multi-agent coordination report backed by end-to-end project cases (#51)." },
      issues: [50, 94, 51],
    },
  ],
};

/* ---------- 4. RSI Platform & Applications ---------- */
const gdpevoBenchPr = `${REPO.bench}/pull/5`;
const gdpevoEvalPr = `${REPO.bench}/pull/16`;
const ontologyPluginPr = `${REPO.plugins}/pull/21`;
const ontologyEvalPr = `${REPO.bench}/pull/28`;
const codexGdpevoPr = `${REPO.bench}/pull/29`;

const gdpevoSkillEvolution: TopicDefinition = {
  id: "gdpevo-skill-evolution",
  title: {
    zh: "四种 Skill 自进化算法提分效果与成本横评",
    en: "Comparing Score Gains and Costs of Four Skill Evolution Methods",
  },
  phases: [
    {
      label: L.bench,
      work: {
        zh: "接入 GDPEVO Essential 基准（6 个真实多步业务场景，每个场景 5 道连续训练题 + 5 道独立测试题，共 30 训练 / 30 测试）。",
        en: "Integrate the GDPEVO Essential benchmark across 6 multi-step business scenarios (5 sequential train + 5 held-out test tasks per scenario; 30 train / 30 test total).",
      },
      dataset: {
        zh: "固定基准提交 53f779e，涵盖客户服务、运营排期、财务核对等 6 类业务工作流。",
        en: "Pinned at benchmark commit 53f779e covering 6 multi-step business workflows.",
      },
      evidence: { zh: "已合入主干的 GDPEVO Essential 基准包（PR #5）。", en: "Merged GDPEVO Essential benchmark package (PR #5)." },
      issues: [40],
      references: [{ label: { zh: "基准 PR #5", en: "Benchmark PR #5" }, url: gdpevoBenchPr }],
    },
    {
      label: L.run,
      work: {
        zh: "固定 PenguinHarness 0.2.19（e5ae52a）与 DeepSeek-V4.1-Flash-1017（max 思考档），对无 Skill 基线、OpenSkill、SkillAdam、TRACE 各跑 3 次独立测试（SkillOpt 单列对照）。",
        en: "Fix PenguinHarness 0.2.19 (e5ae52a) and DeepSeek-V4.1-Flash-1017 (max thinking), running 3 independent test trials each for baseline, OpenSkill, SkillAdam, and TRACE (plus SkillOpt).",
      },
      evidence: { zh: "PR #16 合入的 450 条测试轨迹与训练阶段完整日志。", en: "450 test trajectories and complete training logs merged in PR #16." },
      issues: [42],
      references: [{ label: { zh: "评测实验 PR #16", en: "Evaluation PR #16" }, url: gdpevoEvalPr }],
    },
    {
      label: L.results,
      work: {
        zh: "已发布结果：基线 56.32±2.17（单次测试 $2.39）、OpenSkill 62.16±2.31（$2.50）、TRACE 68.02±1.80（$1.59）、SkillAdam 68.95±0.74（$1.96）；单列 SkillOpt 70.25±0.03（$1.86）。",
        en: "Published results: baseline 56.32±2.17 ($2.39/test), OpenSkill 62.16±2.31 ($2.50), TRACE 68.02±1.80 ($1.59), SkillAdam 68.95±0.74 ($1.96); separately listed SkillOpt 70.25±0.03 ($1.86).",
      },
      evidence: { zh: "6 场景测试均分、标准差、训练成本与单次测试成本对照表。", en: "Six-scenario mean test scores, standard deviations, training costs, and per-test cost tables." },
      issues: [42],
      references: [{ label: { zh: "GDPEVO 结果表 PR #16", en: "GDPEVO results in PR #16" }, url: gdpevoEvalPr }],
    },
    {
      label: L.analysis,
      work: {
        zh: "分析进化后 Skill 如何通过固化业务操作步骤在提分超过 11 分的同时显著压缩测试阶段无效工具调用（TRACE 测试成本降低 33%）。",
        en: "Analyze how evolved Skills raise scores by >11 points while cutting redundant tool calls during testing (TRACE reduced test cost by 33%).",
      },
      evidence: { zh: "各场景得分增益、方差收敛与成本 Pareto 分析。", en: "Per-scenario score gains, variance reduction, and cost Pareto analysis." },
      issues: [42],
    },
    {
      label: L.report,
      work: {
        zh: "实验报告已随 PR #16 合入并设为 published 状态。",
        en: "The experiment report is merged in PR #16 and published on the benchmark site.",
      },
      evidence: { zh: "已发布的 experiments/gdpevo-essential/ 评测报告。", en: "Published evaluation report under experiments/gdpevo-essential/." },
      issues: [40, 42],
      references: [{ label: { zh: "已发布报告 PR #16", en: "Published report PR #16" }, url: gdpevoEvalPr }],
    },
  ],
};

const gdpevoOntologyTransfer: TopicDefinition = {
  id: "gdpevo-ontology-codex-transfer",
  title: {
    zh: ["让自进化经验", "跨 Agent 框架", "复用", "与知识沉淀"],
    en: "Capturing and Reusing Self-Evolution Experience Across Agent Frameworks",
  },
  phases: [
    {
      label: L.bench,
      work: {
        zh: "复用 GDPEVO Essential 6 场景 30 训练 / 30 测试划分，统一框架与基准提交口径。",
        en: "Reuse the GDPEVO Essential 30-train / 30-test split under a unified harness and benchmark commit.",
      },
      evidence: { zh: "对齐版本口径的 GDPEVO Essential 评测配置。", en: "Version-aligned GDPEVO Essential evaluation configuration." },
      issues: [40],
    },
    {
      label: L.run,
      work: {
        zh: "评测结构化领域本体自进化插件 ontology-rsi-toolkit（#37 / PR #21 / PR #28）及 Codex 框架在同基准上的表现（#32 / PR #29），并将 SkillOpt 对齐到同一框架版本复测。",
        en: "Evaluate the structured ontology-rsi-toolkit plugin (#37 / PR #21 / PR #28) and Codex (#32 / PR #29) on GDPEVO Essential, and rerun SkillOpt on the unified commit.",
      },
      evidence: { zh: "本体进化各轮次快照、测试轨迹与跨框架运行记录。", en: "Per-round ontology snapshots, test trajectories, and cross-harness run records." },
      issues: [37, 32],
      references: [
        { label: { zh: "Ontology 插件 PR #21", en: "Ontology plugin PR #21" }, url: ontologyPluginPr },
        { label: { zh: "Ontology 评测 PR #28", en: "Ontology evaluation PR #28" }, url: ontologyEvalPr },
        { label: { zh: "Codex 评测 PR #29", en: "Codex evaluation PR #29" }, url: codexGdpevoPr },
      ],
    },
    {
      label: L.results,
      pending: P.confirm,
      work: {
        zh: "PR #28 试跑记录：ontology-rsi-toolkit 三轮测试均分达 67.78±0.78（较基线 +11.46 分，测试成本降 24%）；待与同版本 SkillOpt 及 PR #29 Codex 结果并表确认。",
        en: "PR #28 trial records: ontology-rsi-toolkit reached 67.78±0.78 (+11.46 over baseline, 24% lower test cost); awaiting unified comparison with SkillOpt and PR #29.",
      },
      evidence: { zh: "文本 Skill 进化 vs 结构化本体进化 vs 跨框架基线对照表。", en: "Comparison table of text Skill evolution, structured ontology evolution, and cross-harness baselines." },
      references: [{ label: { zh: "Ontology 试跑结果 PR #28", en: "Ontology trial results PR #28" }, url: ontologyEvalPr }],
    },
    {
      label: L.analysis,
      pending: P.analyze,
      work: {
        zh: "比较自然语言 Skill 总结与显式概念/关系/规则本体图谱在多步业务推理中的互补性。",
        en: "Compare natural-language Skill summaries against explicit concept/relation/rule ontologies in multi-step workflows.",
      },
      evidence: { zh: "产物形态（Skill vs Ontology）消融与错误案例对比分析。", en: "Artifact representation ablation (Skill vs. Ontology) and error analysis." },
    },
    {
      label: L.report,
      pending: P.review,
      work: {
        zh: "跟踪 PR #21、PR #28 与 PR #29 的审校合入，补充 GDPEVO 第二阶段横向评测报告。",
        en: "Track review of PR #21, PR #28, and PR #29 to publish the Phase-2 GDPEVO comparison report.",
      },
      evidence: { zh: "涵盖五种进化方法与跨框架基线的扩展报告。", en: "An extended report covering five evolution methods and cross-harness baselines." },
      issues: [37, 32],
    },
  ],
};

const hleBenchPr = `${REPO.bench}/pull/27`;
const hleDiamondSkillOpt: TopicDefinition = {
  id: "hle-diamond-skillopt",
  title: {
    zh: ["用多轮自进化攻克", "高难科学推理题（HLE）"],
    en: "Applying Iterative Self-Evolution to Hard Scientific Reasoning on HLE",
  },
  phases: [
    {
      label: L.bench,
      pending: P.accept,
      work: {
        zh: "接入 HLE-Diamond 50 道跨学科高难纯文本推理题（25 道进化题 Train + 25 道冻结测试题 Test）及 GLM-5.3 等价判分规则（#77 / PR #27）。",
        en: "Integrate HLE-Diamond's 50 text-only frontier reasoning problems (25 train + 25 frozen test) and GLM-5.3 equivalence grading (#77 / PR #27).",
      },
      dataset: {
        zh: "覆盖数学、物理、化学、计算机与生物医药的高难多选与简答题，待完成独立数据仓拆分。",
        en: "Covers frontier multiple-choice and short-answer problems across STEM domains, pending data repo extraction.",
      },
      evidence: { zh: "PR #27 提交的 HLE-Diamond 基准包与判分脚本。", en: "HLE-Diamond benchmark package and grading scripts in PR #27." },
      issues: [77],
      references: [{ label: { zh: "基准 PR #27", en: "Benchmark PR #27" }, url: hleBenchPr }],
    },
    {
      label: L.run,
      work: {
        zh: "固定 PenguinHarness 0.2.18 与 DeepSeek-V4.1-Flash-1017（low 思考档），在 25 道进化题上做 1 轮与 3 轮 SkillOpt 迭代并冻结，在 25 道测试题上各测 3 次（共 225 份答卷）。",
        en: "Fix PenguinHarness 0.2.18 and DeepSeek-V4.1-Flash-1017 (low thinking), run 1 and 3 SkillOpt rounds on 25 train items, and evaluate frozen versions 3 times each on 25 test items (225 runs).",
      },
      evidence: { zh: "PR #32 提交的原版、第 1 轮冻结版、第 3 轮冻结版完整测试记录与 8 份简答人工复核。", en: "Complete test logs for baseline, Round-1, and Round-3 frozen skills plus 8 manual short-answer audits in PR #32." },
      issues: [75],
      references: [{ label: { zh: "实验记录 PR #32", en: "Experiment records PR #32" }, url: hleEvalPr }],
    },
    {
      label: L.results,
      pending: P.confirm,
      work: {
        zh: "试跑记录：原版测试均分 28.00%±4.00%、第 1 轮冻结版 28.00%±0.00%、第 3 轮冻结版 26.67%±6.11%；第 1 轮“错变对”与“对变错”各 7 题次完全抵消。",
        en: "Trial records: baseline 28.00%±4.00%, Round-1 frozen 28.00%±0.00%, Round-3 frozen 26.67%±6.11%; Round 1's 7 wrong→right flips were offset by 7 right→wrong flips.",
      },
      evidence: { zh: "三版本正确率、逐题正负翻转矩阵与进化/求解 Token 成本表。", en: "Accuracy tables, per-item flip matrices, and evolution/inference token cost breakdowns." },
      references: [{ label: { zh: "试跑对照结果 PR #32", en: "Trial comparison results PR #32" }, url: hleEvalPr }],
    },
    {
      label: L.analysis,
      pending: P.analyze,
      work: {
        zh: "揭示在题目高度异构的专业难题上，仅归纳通用解题习惯容易因启发式过度泛化造成“正负迁移相抵”。",
        en: "Demonstrate how generic reasoning heuristics over-generalize on heterogeneous frontier problems, causing positive and negative transfer to cancel out.",
      },
      evidence: { zh: "正负翻转题目的逐题归因与通用提示进化适用边界结论。", en: "Item-level attribution of flips and boundary conditions for generic prompt evolution." },
    },
    {
      label: L.report,
      pending: P.review,
      work: {
        zh: "待 PR #27 完成数据拆分合入后，推进 PR #32 报告正式评审发布。",
        en: "Finalize review and publication of PR #32 once PR #27 completes data repo separation.",
      },
      evidence: { zh: "HLE-Diamond 上 SkillOpt 泛化边界实验报告。", en: "SkillOpt generalization boundary report on HLE-Diamond." },
      issues: [77, 75],
      references: [{ label: { zh: "待评审报告 PR #32", en: "Draft report PR #32" }, url: hleEvalPr }],
    },
  ],
};

const rrsiPluginPr = `${REPO.harness}/pull/1535`;
const rrsiDatasetPr = `${REPO.bench}/pull/30`;
const rrsiEvalPr = `${REPO.bench}/pull/31`;
const rrsiCrossBenchTransfer: TopicDefinition = {
  id: "rrsi-cross-bench-transfer",
  title: {
    zh: ["防止自进化提示词", "越改越臃肿的「瘦身」优化"],
    en: "Keeping Self-Evolving Prompts Compact",
  },
  phases: [
    {
      label: L.bench,
      pending: P.accept,
      work: {
        zh: "固定 Terminal-Bench 2.1 的 18 道进化题子集与 SWE-bench Verified 的 100 道独立测试题子集（PR #30）。",
        en: "Pin an 18-task evolution subset from Terminal-Bench 2.1 and a 100-task held-out test subset from SWE-bench Verified (PR #30).",
      },
      evidence: { zh: "PR #30 提交的跨基准固定题目划分与评测入口。", en: "Fixed cross-benchmark task splits and evaluation entry points in PR #30." },
      references: [{ label: { zh: "固定子集基准 PR #30", en: "Subset benchmark PR #30" }, url: rrsiDatasetPr }],
    },
    {
      label: L.run,
      state: "active",
      work: {
        zh: "使用已合入的 rrsi-rsi-toolkit（#35 / PR #1535，含 L0 修改预算、过拟合审查器与无增益组件剪枝）在 18 道终端题上演化 5 轮并冻结，在 100 道 SWE-bench 上各测 2 轮（400 条记录）。",
        en: "Run the merged rrsi-rsi-toolkit (#35 / PR #1535, with L0 budget, overfitting critic, and pruner) for 5 rounds on 18 Terminal-Bench tasks, then test twice on 100 SWE-bench tasks (400 runs).",
      },
      evidence: { zh: "已合入的 RRSI 插件（PR #1535）及 PR #31 提交的 5 轮演化快照与 400 条测试轨迹。", en: "Merged RRSI plugin (PR #1535) plus 5-round evolution snapshots and 400 test trajectories in PR #31." },
      issues: [35],
      references: [
        { label: { zh: "RRSI 插件 PR #1535", en: "RRSI plugin PR #1535" }, url: rrsiPluginPr },
        { label: { zh: "跨基准实验 PR #31", en: "Cross-benchmark experiment PR #31" }, url: rrsiEvalPr },
      ],
    },
    {
      label: L.results,
      pending: P.confirm,
      work: {
        zh: "试跑记录：18 道训练题得分由 83.33 升至 91.67；跨基准到 100 道 SWE-bench Verified 上基线为 83.50±0.71、进化后为 81.50±0.71，但总测试 Token 下降 38.69%。",
        en: "Trial records: 18-task train score rose from 83.33 to 91.67; on 100 SWE-bench Verified tasks, score was 81.50±0.71 vs. 83.50±0.71 baseline while total test tokens dropped by 38.69%.",
      },
      evidence: { zh: "同域训练提分、跨域测试准确率与推理 Token 压缩率对照表。", en: "Comparison tables for in-domain training gain, cross-domain test accuracy, and token reduction." },
      references: [{ label: { zh: "试跑结果表 PR #31", en: "Trial results in PR #31" }, url: rrsiEvalPr }],
    },
    {
      label: L.analysis,
      pending: P.analyze,
      work: {
        zh: "分析 L0 正则化与组件剪枝在跨领域迁移时如何用 2.0 分的轻微折损换取近四成的推理 Token 节省。",
        en: "Analyze how L0 regularization and pruning trade a minor 2.0-point cross-domain dip for a 38.69% reduction in inference tokens.",
      },
      evidence: { zh: "剪枝前后 Harness 提示结构对比与跨基准迁移得失分析。", en: "Pre/post-pruning Harness prompt comparison and cross-benchmark trade-off analysis." },
    },
    {
      label: L.report,
      pending: P.review,
      work: {
        zh: "推进 PR #30 与 PR #31 审校合入，并补充同域（SWE-bench 训练 → SWE-bench 测试）对照说明。",
        en: "Complete review of PR #30 and PR #31 and add an in-domain SWE-bench evolution comparison.",
      },
      evidence: { zh: "RRSI 正则化自进化跨基准评测报告。", en: "Regularized RSI cross-benchmark evaluation report." },
      issues: [35],
      references: [{ label: { zh: "实验报告 PR #31", en: "Experiment report PR #31" }, url: rrsiEvalPr }],
    },
  ],
};

const multiDomainBenchPr = `${REPO.bench}/pull/3`;
const harnessCompPr = `${REPO.bench}/pull/21`;
const multiDomainHarnessComparison: TopicDefinition = {
  id: "multi-domain-harness-comparison",
  title: {
    zh: "同一模型在不同harness中的对比测试",
    en: "Comparing the Same Model Across Harnesses",
  },
  phases: [
    {
      label: L.bench,
      work: {
        zh: "建立覆盖软件工程、数据分析、检索研究、科学推理与综合办公五大领域（Sec A–E）共 50 道题目的多领域基准（#39 / PR #3）。",
        en: "Establish the 50-task Sec A–E multi-domain benchmark across software engineering, data analysis, web research, scientific reasoning, and office workflows (#39 / PR #3).",
      },
      evidence: { zh: "已合入主干的五领域 50 题标准化基准包（PR #3）。", en: "Merged 50-task five-domain benchmark package (PR #3)." },
      issues: [39],
      references: [{ label: { zh: "五领域基准 PR #3", en: "Five-domain benchmark PR #3" }, url: multiDomainBenchPr }],
    },
    {
      label: L.run,
      work: {
        zh: "固定 DeepSeek-V4.1-Flash-1017（max 思考档）与统一 MMSP 计价口径，在 PenguinHarness 0.2.17、DeepSeek Harness 0.2.1-rc.2、Pi 1.4.0、Codex 0.162.1 上各跑 3 轮（600 次测试）。",
        en: "Fix DeepSeek-V4.1-Flash-1017 (max thinking) and MMSP pricing across PenguinHarness 0.2.17, DeepSeek Harness 0.2.1-rc.2, Pi 1.4.0, and Codex 0.162.1 for 3 rounds each (600 runs).",
      },
      evidence: { zh: "PR #21 合入的 20 组跨框架实验配置与 600 条评测记录。", en: "20 cross-harness experiment groups and 600 evaluation records merged in PR #21." },
      issues: [43],
      references: [{ label: { zh: "跨框架评测 PR #21", en: "Cross-harness evaluation PR #21" }, url: harnessCompPr }],
    },
    {
      label: L.results,
      work: {
        zh: "已合入并发布四框架在 Sec A–E 五大领域的平均得分、标准差、耗时与美元成本对照表。",
        en: "Merged and published comparison tables of mean scores, standard deviations, latency, and USD cost across Sec A–E.",
      },
      evidence: { zh: "五领域能力雷达与得分—成本 Pareto 前沿数据。", en: "Five-domain capability profiles and score-cost Pareto frontier data." },
      issues: [43],
      references: [{ label: { zh: "跨框架结果表 PR #21", en: "Cross-harness results PR #21" }, url: harnessCompPr }],
    },
    {
      label: L.analysis,
      work: {
        zh: "量化同一模型因底层 Harness 工具设计、沙箱反馈与循环控制差异带来的原生能力差距。",
        en: "Quantify native capability gaps induced purely by Harness tool design, sandbox feedback, and loop control.",
      },
      evidence: { zh: "四大框架在五类任务上的优势拆解与逐题明细补齐清单。", en: "Per-domain strength breakdown across the four harnesses and per-item telemetry checklist." },
      issues: [43],
    },
    {
      label: L.report,
      work: {
        zh: "跨框架对比报告已随 PR #21 合入并发布于 experiments/harness-comparison/。",
        en: "The cross-harness comparison report is merged in PR #21 and published under experiments/harness-comparison/.",
      },
      evidence: { zh: "作为后续所有自进化实验参照系的跨 Harness 基线报告。", en: "Published cross-harness baseline report serving as a reference for subsequent RSI studies." },
      issues: [39, 43],
      references: [{ label: { zh: "已发布报告 PR #21", en: "Published report PR #21" }, url: harnessCompPr }],
    },
  ],
};

/* ---------- 5. Vertical App Center Plugins (垂域应用中心插件) ---------- */
function buildAppTopic(config: {
  id: string;
  title: TopicDefinition["title"];
  protoWork: Text;
  protoEvidence: Text;
  protoIssues?: number[];
  protoState?: StageState;
  protoRefs?: { label: Text; url: string }[];
  skillWork: Text;
  skillEvidence: Text;
  skillIssues?: number[];
  skillState?: StageState;
  uiWork: Text;
  uiEvidence: Text;
  implementationIssue?: number;
  evalWork: Text;
  evalEvidence: Text;
  evalIssues?: number[];
}): TopicDefinition {
  return {
    id: config.id,
    title: config.title,
    phases: [
      {
        label: L.appProto,
        state: config.protoState,
        pending: config.protoState ? undefined : P.dev,
        work: config.protoWork,
        evidence: config.protoEvidence,
        issues: config.protoIssues,
        references: config.protoRefs,
      },
      {
        label: L.appSkill,
        state: config.skillState,
        pending: config.skillState ? undefined : P.dev,
        work: config.skillWork,
        evidence: config.skillEvidence,
        issues: config.skillIssues,
      },
      {
        label: L.appUi,
        pending: config.implementationIssue ? undefined : P.dev,
        work: config.uiWork,
        evidence: config.uiEvidence,
        issues: config.implementationIssue ? [config.implementationIssue] : undefined,
        references: [{ label: { zh: "应用工作台仓库 penguin-harness-apps", en: "Workbench repo penguin-harness-apps" }, url: REPO.apps }],
      },
      {
        label: L.appMarket,
        pending: P.register,
        work: {
          zh: "在 penguin-harness-plugins 登记可安装包。通过插件市场安装后，将工作台添加到 Agent，并从应用中心打开。",
          en: "Register the installable package in penguin-harness-plugins. Install it from the marketplace, add the workbench to an Agent, and open it from the App Center.",
        },
        evidence: { zh: "合入 penguin-harness-plugins 的插件注册 PR。", en: "A merged plugin registration PR in penguin-harness-plugins." },
        references: [{ label: { zh: "官方插件市场 penguin-harness-plugins", en: "Plugin registry penguin-harness-plugins" }, url: REPO.plugins }],
      },
      {
        label: L.appEval,
        pending: P.accept,
        work: config.evalWork,
        evidence: config.evalEvidence,
        issues: config.evalIssues,
      },
    ],
  };
}

const appSuperAgentTaskTree = buildAppTopic({
  id: "app-super-agent-task-tree",
  implementationIssue: 128,
  title: {
    zh: ["Super Agent 任务树与", "依赖看板"],
    en: ["Super Agent Task Tree and ", "Dependency Board"],
  },
  protoState: "done",
  protoIssues: [50],
  protoRefs: [
    { label: { zh: "dshbook 第 11 章 AgentTeams 原型", en: "dshbook Ch.11 AgentTeams prototype" }, url: `${REPO.dshbook}/chapter11/` },
    { label: { zh: "Company Mode 沟通规范 PR #1434", en: "Company Mode norms PR #1434" }, url: companyPr },
  ],
  protoWork: {
    zh: "基于 dshbook 第 11 章 AgentTeams 代码审查团队原型与 #50 协同规范，定义队长拆解派发、成员并行执行卡片及 t1..t4 → t5 任务依赖 DAG 视图。",
    en: "Based on dshbook Ch.11 AgentTeams prototype and #50 norms, define leader decomposition, member execution cards, and the t1..t4 → t5 DAG dependency view.",
  },
  protoEvidence: {
    zh: "AgentTeams 活动面板交互原型（含进行中/等待依赖/已交付进度条与依赖高亮）及 PR #1434 协同规范。",
    en: "AgentTeams activity panel specification (progress bar, member status cards, and DAG dependency highlighting) plus PR #1434 norms.",
  },
  skillState: "active",
  skillIssues: [94],
  skillWork: {
    zh: "对接 agent-company 与子代理调度接口（#94），支持任务树节点状态订阅、前置依赖解锁唤醒与成果交叉核对汇总。",
    en: "Connect agent-company and subagent scheduling APIs (#94) for live node status streaming, dependency unlocking, and cross-check synthesis.",
  },
  skillEvidence: {
    zh: "支持任务树拆解、并行派发与依赖调度的 Super Agent 编排工具链。",
    en: "Super Agent orchestration toolchain supporting task tree decomposition, parallel dispatch, and dependency scheduling.",
  },
  uiWork: {
    zh: "接入真实多 Agent 运行状态，构建「左侧 AgentTeams 子代理实时活动流 + 右侧任务树与依赖 DAG 拓扑图」双栏看板，点击或悬停节点可查看上游阻塞项与已交付产物。",
    en: "Connect live multi-agent state to a split-pane board with a sub-agent activity stream on the left and an interactive task dependency DAG on the right, highlighting blockers and deliverables on click/hover.",
  },
  uiEvidence: {
    zh: "可交互的 Super Agent 任务树与 DAG 依赖看板前端工作台。",
    en: "Interactive Super Agent task tree and DAG dependency board workbench UI.",
  },
  evalIssues: [51, 108],
  evalWork: {
    zh: "复现四项并行分析加一项汇总的案例。四项前置任务都交付后，核对汇总任务是否由等待变为可执行。",
    en: "Reproduce four parallel analyses followed by a summary. Check that the summary becomes runnable once all four prerequisites are delivered.",
  },
  evalEvidence: {
    zh: "可复跑的团队任务样例和展示状态变化的录屏。",
    en: "A reproducible team-task fixture and a recording of its status changes.",
  },
});

const appOverleafPaper = buildAppTopic({
  id: "app-overleaf-paper-workbench",
  implementationIssue: 129,
  title: {
    zh: ["兼容 Overleaf 的", "论文写作与编译工作台"],
    en: ["Overleaf-Compatible Paper ", "Writing and Compilation Workbench"],
  },
  protoIssues: [118, 122, 68],
  protoWork: {
    zh: "围绕社区多文件 LaTeX 论文工程（#118、#122），定义兼容 Overleaf 工程导入导出、AI 章节撰写润色、实验图表插入、结构化审稿批注与实时 PDF 编译的工作台流程。",
    en: "Grounded in multi-file LaTeX paper projects (#118, #122), define the workflow for Overleaf project round-trip compatibility, AI drafting/polishing, figure integration, structured review findings, and live PDF compilation.",
  },
  protoEvidence: {
    zh: "包含多 .tex 章节、图表与 .bib 参考文献的完整论文样稿及工作台交互规范。",
    en: "A multi-file LaTeX sample project with sections, figures, and .bib references plus the workbench specification.",
  },
  skillIssues: [68],
  skillWork: {
    zh: "封装多文件 LaTeX 编译与错误行号映射、AI 章节学术化润色与 BibTeX 整理、以及绑定到具体源文件与段落的结构化 AI 审稿批注。",
    en: "Package multi-file LaTeX compilation with line-mapped diagnostics, AI section polishing and BibTeX formatting, and structured AI review findings linked to source files and passages.",
  },
  skillEvidence: {
    zh: "可复用的 LaTeX 编译流水线、AI 润色 Diff 生成器及带源文定位的审阅记录。",
    en: "A reusable LaTeX build pipeline, AI diff generator, and review records with source locations.",
  },
  uiWork: {
    zh: "无损导入导出 Overleaf 标准项目 ZIP 包，提供源码与编译 PDF 双栏同步预览、AI 撰写润色 Diff 对比、点击审稿意见跳转源码及一键应用修订。",
    en: "Support lossless Overleaf project ZIP import/export with side-by-side LaTeX & live PDF preview, AI drafting diffs, source navigation from review findings, and one-click revision application.",
  },
  uiEvidence: {
    zh: "可安装的兼容 Overleaf 的论文写作与编译工作台插件。",
    en: "An installable Overleaf-compatible paper writing and compilation workbench plugin.",
  },
  evalIssues: [118, 122, 68],
  evalWork: {
    zh: "用多文件 LaTeX 论文样稿跑通 AI 润色/审阅、批注跳转源码、一键应用 Diff、PDF 重编译及与 Overleaf 的兼容往返验证。",
    en: "Verify AI polishing/review, finding-to-source navigation, one-click diff application, live PDF recompilation, and Overleaf round-trip compatibility on a multi-file sample paper.",
  },
  evalEvidence: {
    zh: "完整产出的 LaTeX 论文项目案例、演录记录与去 AI 味盲测通过率报告。",
    en: "A complete LaTeX paper case study, walkthrough recording, and blind de-AI writing evaluation report.",
  },
});

const appShortDramaStudio = buildAppTopic({
  id: "app-short-drama-studio",
  implementationIssue: 127,
  title: {
    zh: ["AI 短剧分镜与", "视频生成工作台"],
    en: ["AI Short Drama Storyboard ", "and Video Workbench"],
  },
  protoState: "done",
  protoRefs: [
    { label: { zh: "dshbook 第 8 章《让 dsh 制作短剧》", en: "dshbook Ch.8 Short Drama workflow" }, url: `${REPO.dshbook}/chapter8/` },
    { label: { zh: "drama-skills 技能集", en: "drama-skills toolkit" }, url: "https://github.com/zenstory-ai/drama-skills" },
  ],
  protoWork: {
    zh: "参考《DeepSeek Harness 实战指南》第 8 章和 drama-skills，定义导入单集剧本、生成包含角色/场景/视频提示词的可编辑分镜、逐镜生成视频并导出 MP4 的工作台流程。",
    en: "Based on dshbook Ch.8 and drama-skills, define a workbench flow to import a single-episode script, generate an editable storyboard, render clips per shot, and export MP4.",
  },
  protoEvidence: {
    zh: "dshbook 第 8 章《纸箱小屋》完整短剧生成流程与 drama-skills 分镜资产规范。",
    en: "Complete Cardboard Cabin short drama workflow from dshbook Ch.8 and drama-skills asset specification.",
  },
  skillWork: {
    zh: "复用并封装 drama-skills 与视频生成服务接口，支持单集剧本拆解为角色、场景与视频提示词，并支持单镜头独立重生成。",
    en: "Integrate drama-skills and a video generation provider to break scripts into characters, scenes, and prompts with single-shot regeneration.",
  },
  skillEvidence: {
    zh: "支持修改并重生成单个镜头且保留其余已生成镜头的短剧分镜与视频生成工具链。",
    en: "Short drama storyboarding and video generation toolchain supporting single-shot regeneration while preserving remaining clips.",
  },
  uiWork: {
    zh: "在 penguin-harness-apps 构建短剧创作工作台：支持导入示例剧本、编辑分镜列表、确认后逐镜生成视频、单镜头重做及按序预览导出 MP4。",
    en: "Build the Short Drama Workbench in penguin-harness-apps with script import, editable storyboard, per-shot regeneration, ordered preview, and MP4 export.",
  },
  uiEvidence: {
    zh: "可从 PenguinHarness 应用中心安装并运行的 AI 短剧分镜与视频生成工作台插件。",
    en: "An installable AI Short Drama Storyboard and Video Workbench plugin in the PenguinHarness App Center.",
  },
  evalIssues: [96],
  evalWork: {
    zh: "用《纸箱小屋》流程或同等规模原创样例跑通单镜头重生成与 MP4 导出，核对其余已生成镜头保持原样。TuringBench（#96）可用于后续评估成片连贯性。",
    en: "Verify single-shot regeneration and MP4 export on the Cardboard Cabin flow or an equivalent sample and check that the remaining clips are preserved. TuringBench (#96) can support later continuity evaluation.",
  },
  evalEvidence: {
    zh: "工作台源码 PR、插件登记 PR、可复跑样例说明及从应用中心安装到导出 MP4 的完整演示记录。",
    en: "Workbench source PR, plugin registry PR, reproducible sample guide, and a recording from App Center installation through MP4 export.",
  },
});

const appEcommerceStrategy = buildAppTopic({
  id: "app-ecommerce-strategy-workbench",
  implementationIssue: 130,
  title: {
    zh: ["AI 电商选品与", "策略分析工作台"],
    en: ["AI E-Commerce Selection ", "and Strategy Workbench"],
  },
  protoIssues: [53],
  protoWork: {
    zh: "关联商业营收基准（#53），围绕商品经营表（售价、成本、销量、库存、转化）与用户评论语料，定义智能选品、评论痛点挖掘与促销策略推演流程。",
    en: "Aligned with the commercial revenue benchmark (#53), define the workflow for product selection, customer review pain-point mining, and promotion strategy simulation.",
  },
  protoEvidence: {
    zh: "包含商品经营数据与用户评价语料的测试样表及选品促销分析规范。",
    en: "A sample dataset combining product operations metrics and customer reviews plus the strategy analysis specification.",
  },
  skillIssues: [53],
  skillWork: {
    zh: "校验经营字段并试算促销前后单位毛利与保本销量增幅；调用 Agent/大模型完成评论痛点聚类、选品排序推荐与高转化卖点文案生成，且结论关联原始数据行与评论证据。",
    en: "Validate operational metrics and simulate promotion margins/break-even lift; invoke the Agent/LLM for review pain-point clustering, candidate ranking, and selling-point copy with row/review provenance.",
  },
  skillEvidence: {
    zh: "带可核对计算口径的商品毛利试算器与评论痛点聚类/策略生成工具链。",
    en: "A margin simulator with verifiable calculations and an AI review clustering & strategy generation toolchain.",
  },
  uiWork: {
    zh: "导入经营表与评论样本，对比候选商品、试算促销折扣利润，调用 AI 生成并导出带数据与评论溯源依据的选品及营销策略报告。",
    en: "Import product tables and reviews, compare candidates, simulate promotion discounts, and generate/export AI selection and marketing reports with traceable citations.",
  },
  uiEvidence: {
    zh: "面向电商运营场景的 AI 选品与策略分析工作台插件。",
    en: "AI E-Commerce Selection and Strategy Workbench plugin for store operations.",
  },
  evalIssues: [53],
  evalWork: {
    zh: "用固定经营样表与评论样本核对毛利试算结果，并验证 AI 选品推荐、痛点分析与促销建议均能追溯到具体商品指标、原始数据行或评论证据。",
    en: "Check margin calculations on the fixed sample dataset and verify that every AI product selection, pain-point, and promotion recommendation traces back to specific metrics, rows, and reviews.",
  },
  evalEvidence: {
    zh: "经营与评论样表、预期试算结果及一份数据可溯源的 AI 选品与促销策略报告。",
    en: "Sample operations & review dataset, expected calculations, and a traceable AI selection & promotion strategy report.",
  },
});

const appMarketResearchQuant = buildAppTopic({
  id: "app-market-research-quant",
  implementationIssue: 131,
  title: {
    zh: ["AI 市场投研与", "策略回测工作台"],
    en: ["AI Market Research and ", "Strategy Backtesting Workbench"],
  },
  protoState: "done",
  protoRefs: [{ label: { zh: "dshbook 第 10 章《构建市场投研助手》", en: "dshbook Ch.10 Market Research Assistant" }, url: `${REPO.dshbook}/chapter10/` }],
  protoWork: {
    zh: "参考 dshbook 第 10 章的指数双均线信号、无未来函数历史回测、市场日报与个股对比，定义 AI 市场投研与策略回测工作台。",
    en: "Use the index moving-average signals, lookahead-free historical backtest, daily market report, and stock comparison in dshbook Ch.10 to define the AI market research workbench.",
  },
  protoEvidence: {
    zh: "书中已有策略与基准的净值曲线、回撤统计和注明行情截止时间的投研对比报告。",
    en: "The chapter includes strategy and benchmark equity curves, drawdown figures, and a research report with data cutoffs.",
  },
  skillWork: {
    zh: "支持通过自然语言/Agent 辅助配置量化规则，导入带来源及截止日期的 OHLCV 历史行情，按无未来函数口径计算信号、模拟成交、累计收益与最大回撤，并由 AI 生成数据可溯源的投研复盘报告。",
    en: "Support natural-language/Agent-assisted strategy configuration, import OHLCV data with source/cutoff metadata, run lookahead-free backtests, and synthesize traceable AI research reports.",
  },
  skillEvidence: {
    zh: "可用固定行情数据复跑的信号与成交账本、无未来函数回测脚本及 AI 投研报告生成工具链。",
    en: "A reproducible signal/fill ledger, lookahead-free backtest script, and AI research report generation toolchain.",
  },
  uiWork: {
    zh: "提供历史行情导入、自然语言/控件策略参数配置、K 线买卖信号与策略/基准净值回撤对比图，以及 AI 可溯源投研复盘报告生成与导出。",
    en: "Provide historical price import, natural-language/UI strategy configuration, K-line buy/sell signal and equity/drawdown comparison charts, and traceable AI research report export.",
  },
  uiEvidence: {
    zh: "可交互的 AI 市场投研与策略回测工作台插件。",
    en: "Interactive AI market research and strategy backtesting workbench plugin.",
  },
  evalWork: {
    zh: "用固定历史行情复跑 dshbook 第 10 章双均线案例（注明 T+1 开盘或收盘成交口径），核对信号与成交日期、净值与最大回撤，并验证导出的 AI 投研报告中所有日期与指标均可溯源至回测账本。",
    en: "Reproduce the dshbook Ch.10 dual-moving-average case on fixed historical data, verify signal/fill dates, equity, and drawdown, and confirm all dates and metrics in the AI report trace to the backtest ledger.",
  },
  evalEvidence: {
    zh: "固定输入数据与参数、预期指标结果及数据可溯源的 AI 投研复盘报告。",
    en: "Fixed input data and parameters, expected metrics, and a traceable AI backtest research report.",
  },
});

const appDigitalSecretaryPoster = buildAppTopic({
  id: "app-digital-secretary-design",
  title: {
    zh: "飞书数字秘书与自进化视觉设计工作台",
    en: "Feishu Digital Secretary & Self-Evolving Visual Design Workbench",
  },
  protoState: "done",
  protoRefs: [
    { label: { zh: "dshbook 第 6 章《飞书里的数字秘书》", en: "dshbook Ch.6 Feishu Digital Secretary" }, url: `${REPO.dshbookRepo}/blob/main/book/chapter6.md` },
    { label: { zh: "dshbook 第 13 章《通过自进化画出概念图》", en: "dshbook Ch.13 Self-Evolving Concept Diagrams" }, url: `${REPO.dshbookRepo}/blob/main/book/chapter13.md` },
  ],
  protoWork: {
    zh: "融合 dshbook 第 5/6 章日常办公与飞书数字秘书、第 7/13 章活动海报与概念图自进化绘制案例，定义智能办公与视觉设计工作台。",
    en: "Combine dshbook Ch.5/6 office & Feishu digital secretary workflows with Ch.7/13 poster layout & self-evolving SVG concept diagram generation.",
  },
  protoEvidence: {
    zh: "dshbook 飞书远程会话联动、表格清洗复盘及 SVG「生成→视觉自检→多轮进化」闭环原型。",
    en: "Feishu remote session integration, spreadsheet cleaning, and SVG generation → visual critique → multi-round evolution prototypes from dshbook.",
  },
  skillWork: {
    zh: "封装多文档要点提炼、Excel 报表校验、飞书待办/日程同步，以及带视觉评分器的海报/科研架构图多轮自进化生成 Skill。",
    en: "Package Skills for multi-document synthesis, Excel auditing, Feishu task/calendar sync, and vision-critiqued multi-round poster/diagram evolution.",
  },
  skillEvidence: {
    zh: "办公自动化处理与视觉概念图自进化 Skill 工具链。",
    en: "Office automation and self-evolving visual diagram Skill toolchain.",
  },
  uiWork: {
    zh: "在 penguin-harness-apps 实现办公与设计双视图工作台：支持报表/文档批处理看板、飞书消息任务流及概念图/海报多轮进化对比画布。",
    en: "Implement a dual-view workbench in penguin-harness-apps with batch document/spreadsheet boards, Feishu task streams, and multi-round diagram/poster evolution canvases.",
  },
  uiEvidence: {
    zh: "数字秘书与自进化视觉设计工作台插件。",
    en: "Digital secretary and self-evolving visual design workbench plugin.",
  },
  evalWork: {
    zh: "基于 Sec E 综合办公基准（#39）与概念图多轮自进化评分曲线，验证文档报表处理准确率与视觉排版迭代增益。",
    en: "Validate document/spreadsheet processing accuracy on Sec E office tasks (#39) and visual layout gains across self-evolution rounds.",
  },
  evalEvidence: {
    zh: "办公自动化与概念图多轮进化端到端案例包。",
    en: "End-to-end case bundle for office automation and multi-round concept diagram evolution.",
  },
});

/* ---------- Versions (V1 & V2) ---------- */
const publishedAppProjects = [
  appSuperAgentTaskTree,
  appOverleafPaper,
  appShortDramaStudio,
  appEcommerceStrategy,
  appMarketResearchQuant,
];

const versions: VersionDefinition[] = [
  {
    id: "v1",
    projects: {
      infra: [autoResearch, ascendInference, solExecBenchErnie],
      "auto-bench": [turingBenchWritingRealism],
      agent: [agentBlockerHonesty, contextCompactionHandoff],
      platform: [
        { ...gdpevoSkillEvolution, followUp: gdpevoOntologyTransfer },
        multiDomainHarnessComparison,
      ],
      apps: publishedAppProjects,
    },
  },
  {
    id: "v2",
    preview: true,
    projects: {
      infra: [
        { ...autoResearch, followUp: speedrun },
        ascendInference,
        solExecBenchErnie,
      ],
      "auto-bench": [
        turingBenchWritingRealism,
        autoBenchJudgeAlignment,
      ],
      agent: [
        agentBlockerHonesty,
        contextCompactionHandoff,
        companyModeCoordination,
      ],
      platform: [
        { ...gdpevoSkillEvolution, followUp: gdpevoOntologyTransfer },
        hleDiamondSkillOpt,
        rrsiCrossBenchTransfer,
        multiDomainHarnessComparison,
      ],
      apps: [
        ...publishedAppProjects,
        appDigitalSecretaryPoster,
      ],
    },
  },
];

const empty = { zh: "待填写", en: "To be filled in" };
const blankPhases = trainingPhases.map(({ label }) => ({ label, work: empty, evidence: empty }));

export function researchVersions(quests: QuestItem[], locale: Locale) {
  const byIssue = new Map(quests.map((q) => [q.issueNumber, q]));
  const stageDetails = (phase: Phase) => {
    const tasks = (phase.issues ?? []).map((number) => ({ number, quest: byIssue.get(number) }));
    const state: StageState = phase.state ?? (
      tasks.length > 0 && tasks.every(({ quest }) => quest?.status === "completed") ? "done"
        : tasks.some(({ quest }) => quest) ? "active"
        : "planned"
    );
    return {
      label: resolveText(phase.label, locale),
      work: resolveText(phase.work, locale),
      dataset: phase.dataset && resolveText(phase.dataset, locale),
      evidence: resolveText(phase.evidence, locale),
      tasks,
      pending: phase.pending && resolveText(phase.pending, locale),
      references: phase.references ?? [],
      state,
    };
  };
  const topicDetails = (topic: TopicDefinition, achievement?: Achievement) => {
    const title = topic.title[locale] || topic.title[locale === "zh" ? "en" : "zh"];
    const titleParts = typeof title === "string" ? undefined : title;
    const phases = topic.phases ?? blankPhases;
    const stages = phases.map(stageDetails);
    const [bench, run, ...outcomes] = stages;
    if (phases[0]?.label === L.bench && bench.state !== "done") {
      if (run.state === "done") run.state = "active";
      for (const stage of outcomes) {
        stage.state = "planned";
        stage.pending = resolveText(P.benchAcceptance, locale);
      }
    }
    const firstPending = stages.findIndex((stage) => stage.state === "planned");
    if (firstPending !== -1) {
      for (const stage of stages.slice(firstPending + 1)) {
        if (stage.state === "planned") continue;
        stage.state = "planned";
        stage.pending = resolveText(P.previousStage, locale);
      }
    }
    return {
      id: topic.id,
      title: typeof title === "string" ? title : title.join(""),
      titleParts,
      twoLineTitle: titleParts && topic.twoLineTitle,
      template: topic.phases === undefined,
      achievement,
      stages,
    };
  };
  return versions.map((version) => ({
    id: version.id,
    preview: version.preview,
    routes: (Object.keys(routeTitles) as RouteId[]).map((id) => ({
      id,
      title: resolveText(routeTitles[id], locale),
      projects: (version.projects[id] ?? []).map((project) => {
        const resolved = topicDetails(project);
        const completed = !resolved.template && resolved.stages.every((stage) => stage.state === "done");
        return {
          ...resolved,
          followUp: project.followUp
            ? topicDetails(project.followUp, completed ? "unlocked" : "locked")
            : undefined,
        };
      }),
    })),
  }));
}

export type ResearchVersion = ReturnType<typeof researchVersions>[number];
export type ResearchProject = Omit<ResearchVersion["routes"][number]["projects"][number], "followUp">;
