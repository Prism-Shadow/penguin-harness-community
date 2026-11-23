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
type TopicDefinition = { id: string; title: Text; phases?: Phase[] };
type ProjectDefinition = TopicDefinition & { demoAchieved?: true; followUp?: TopicDefinition };
type Achievement = "demo-achieved" | "unlocked" | "locked";

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
    zh: "面向 NVIDIA GPU 的 AutoResearch 预训练性能优化",
    en: "AutoResearch Pretraining Performance Tuning for NVIDIA GPUs",
  },
  phases: trainingPhases,
};

const speedrun: TopicDefinition = {
  id: "nanogpt-speedrun-transfer",
  title: {
    zh: "AutoResearch 预训练优化向 NanoGPT Speedrun 的跨负载迁移评测",
    en: "Cross-Workload Transfer of AutoResearch Optimizations to NanoGPT Speedrun",
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
    zh: "昇腾 950PR 上 Qwen3.8-27B 推理投机解码步数与服务模式对照评测",
    en: "MTP Speculative Decoding Steps & Serving Mode Evaluation for Qwen3.8-27B on Ascend 950PR",
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
    zh: "SOL-ExecBench 生产算子基准上 ERNIE Evolve 双层进化循环的算子生成性能评测",
    en: "Operator Generation Performance of ERNIE Evolve Dual-Loop Evolution on SOL-ExecBench",
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
    zh: "基于 TableQA 与写作拟人度样本的自动判分器与人类专家裁决一致性评测",
    en: "Automated Judge vs. Human Expert Agreement on TableQA and Writing Realism Samples",
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
    zh: "TuringBench 多模态生成与长文去 AI 味场景下的成对盲测判分稳定性评测",
    en: "Pairwise Blind Judge Stability on TuringBench Multimodal & De-AI Writing Tasks",
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
    zh: "工具缺失与故障场景下 Harness 汇报规则对智能体隐瞒阻碍的抑制效果评测",
    en: "Effect of Harness Reporting Rules on Suppressing Agent Blocker Deception under Tool Failures",
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
    zh: "长程多轮任务中「交接文件＋轨迹行级检索」与纯摘要的上下文压缩信息保留对比",
    en: "Context Compaction Retention: Handoff Files + Trace Line Lookup vs. Pure Summary",
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
    zh: "多智能体公司模式（Company Mode）沟通规范约束对频道信噪比与协同交付效率的影响评测",
    en: "Impact of Company Mode Communication Norms on Channel Signal-to-Noise and Team Delivery",
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
    zh: "GDPEVO Essential 多步业务场景下四种 Skill 自进化算法的任务得分与成本对照评测",
    en: "Task Score and Cost Comparison of Four Skill Self-Evolution Algorithms on GDPEVO Essential",
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
    zh: "GDPEVO Essential 上本体自进化插件（Ontology RSI）与跨 Harness 框架迁移对照评测",
    en: "Ontology RSI Plugin & Cross-Harness Transfer Evaluation on GDPEVO Essential",
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
    zh: "HLE-Diamond 高难科学推理题上多轮 SkillOpt 进化对冻结测试集的泛化效应评测",
    en: "Generalization of Multi-Round SkillOpt Evolution on HLE-Diamond Scientific Reasoning",
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
    zh: "正则化自进化（RRSI）从终端任务向软件工程任务的跨基准泛化与 Token 压缩评测",
    en: "Cross-Benchmark Generalization and Token Compression of Regularized RSI (Terminal-Bench to SWE-bench)",
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
    zh: "多领域基准（Sec A–E）上同一基座模型跨四种 Agent Harness 框架的能力与成本基准对比",
    en: "Capability and Cost Comparison of One Base Model across Four Agent Harnesses on Sec A–E",
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
  title: Text;
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
        pending: P.dev,
        work: config.uiWork,
        evidence: config.uiEvidence,
        references: [{ label: { zh: "应用工作台仓库 penguin-harness-apps", en: "Workbench repo penguin-harness-apps" }, url: REPO.apps }],
      },
      {
        label: L.appMarket,
        pending: P.register,
        work: {
          zh: "在官方插件索引仓库 penguin-harness-plugins 注册插件元数据与入口，支持从 PenguinHarness 应用中心一键安装打开。",
          en: "Register plugin manifest and entry point in penguin-harness-plugins for one-click launch from the PenguinHarness App Center.",
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
  title: {
    zh: "Super Agent 任务树与 DAG 依赖看板工作台",
    en: "Super Agent Task Tree & DAG Dependency Board Workbench",
  },
  protoState: "done",
  protoIssues: [50],
  protoRefs: [
    { label: { zh: "dshbook 第 11 章 AgentTeams 原型", en: "dshbook Ch.11 AgentTeams prototype" }, url: `${REPO.dshbookRepo}/blob/main/book/chapter11.md` },
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
    zh: "在 penguin-harness-apps 实现「Super Agent 任务树看板」插件，支持 DAG 依赖图悬停高亮、点击节点固定查看子代理实时工具流与产物。",
    en: "Build the Super Agent Task Tree Workbench in penguin-harness-apps with interactive DAG highlighting, node pinning, and live subagent tool streams.",
  },
  uiEvidence: {
    zh: "可交互的 Super Agent 任务树与 DAG 依赖看板前端工作台。",
    en: "Interactive Super Agent task tree and DAG dependency board workbench UI.",
  },
  evalIssues: [51, 108],
  evalWork: {
    zh: "结合多智能体真实项目案例（#51）与 SWE-CoWork 协同基准（#108 / PR #36）完成看板端到端协同验收。",
    en: "Validate end-to-end multi-agent workflows on real project cases (#51) and the SWE-CoWork benchmark (#108 / PR #36).",
  },
  evalEvidence: {
    zh: "多子代理并行审查与软件开发任务的端到端演示录屏及评测记录。",
    en: "End-to-end walkthrough and evaluation records on parallel code review and software engineering tasks.",
  },
});

const appOverleafPaper = buildAppTopic({
  id: "app-overleaf-paper-workbench",
  title: {
    zh: "Overleaf 科研论文协同撰写与审稿工作台",
    en: "Overleaf Scientific Paper Co-Writing & Review Workbench",
  },
  protoState: "active",
  protoIssues: [118, 68],
  protoRefs: [{ label: { zh: "Typst/学术排版插件参考", en: "Typst academic plugin reference" }, url: REPO.plugins }],
  protoWork: {
    zh: "围绕学术论文全流程（大纲规划、实验图表汇总、LaTeX/Typst 源码编写、去 AI 味润色与模拟审稿），定义科研写作工作台交互规范。",
    en: "Define the scientific writing workbench workflow covering outlining, experiment table/figure synthesis, LaTeX/Typst editing, de-AI polishing, and mock peer review.",
  },
  protoEvidence: {
    zh: "结合社区论文撰写任务（#118、#122）与写作质量基准（#68）的科研工作台原型设计。",
    en: "Workbench specification grounded in community paper tasks (#118, #122) and writing quality benchmarks (#68).",
  },
  skillIssues: [68],
  skillWork: {
    zh: "封装 BibTeX 文献真实性核查、实验 JSON/CSV 自动转三线表與 TikZ/PGFPlots 绘图、去 AI 味学术润色及 Reviewer 挑刺 Skill。",
    en: "Package Skills for BibTeX citation verification, automated LaTeX booktabs/plots from experiment JSON/CSV, academic de-AI polishing, and reviewer critique.",
  },
  skillEvidence: {
    zh: "科研写作与审稿检查专属 Skill 工具包及 Overleaf Git/API 同步脚本。",
    en: "Academic writing and review Skill suite with Overleaf Git/API synchronization scripts.",
  },
  uiWork: {
    zh: "在 penguin-harness-apps 实现左栏章节/实验数据资产、中栏 LaTeX/PDF 双栏实时编译预览、右栏 Agent 审稿批注与润色对比的科研工作台。",
    en: "Implement a 3-pane workbench in penguin-harness-apps with section/data assets, side-by-side LaTeX & PDF preview, and Agent review annotations.",
  },
  uiEvidence: {
    zh: "支持 Overleaf 项目双向同步与实时编译预览的论文写作工作台插件。",
    en: "Paper writing workbench plugin with bidirectional Overleaf sync and live PDF compilation preview.",
  },
  evalIssues: [118, 122, 68],
  evalWork: {
    zh: "以 PenguinHarness 技术报告/预印本（#118、#122）与去 AI 味盲测基准（#68）验证论文成稿效率与引用准确率。",
    en: "Validate drafting efficiency and citation accuracy on PenguinHarness technical reports (#118, #122) and the de-AI writing benchmark (#68).",
  },
  evalEvidence: {
    zh: "完整产出的 LaTeX 论文项目案例与去 AI 味盲测通过率报告。",
    en: "A complete LaTeX paper case study and blind de-AI writing evaluation report.",
  },
});

const appShortDramaStudio = buildAppTopic({
  id: "app-short-drama-studio",
  title: {
    zh: "AI 短剧剧本拆解与分镜视频生成工作台",
    en: "AI Short Drama Script Breakdown & Storyboard Video Studio",
  },
  protoState: "done",
  protoRefs: [{ label: { zh: "dshbook 第 8 章《让 dsh 制作短剧》", en: "dshbook Ch.8 Short Drama workflow" }, url: `${REPO.dshbookRepo}/blob/main/book/chapter8.md` }],
  protoWork: {
    zh: "基于 dshbook 第 8 章验证通过的四步短剧流水线（剧本 story.md → 角色/场景设定 assets.md → 分镜脚本 storyboard.md → 视频提示词 prompts.md），定义可视化工作台。",
    en: "Adapt dshbook Ch.8's verified 4-stage pipeline (story.md → character/scene assets.md → storyboard.md → video prompts.md) into a visual studio.",
  },
  protoEvidence: {
    zh: "dshbook 第 8 章完整短剧生成案例与角色/场景资产一致性规范。",
    en: "Complete short drama case study and character/scene consistency specification from dshbook Ch.8.",
  },
  skillWork: {
    zh: "封装剧本冲突扩写、角色外貌锚点锁定、景别/运镜分镜拆解及多模态视频生成（如 SeedDance / 万相 API）批量调用 Skill。",
    en: "Package Skills for script expansion, character visual anchor locking, camera movement storyboarding, and batch video generation API calls.",
  },
  skillEvidence: {
    zh: "支持角色跨镜头一致性保持的短剧分镜与视频合成工具链。",
    en: "Short drama storyboarding and video synthesis toolchain with cross-shot character consistency.",
  },
  uiWork: {
    zh: "在 penguin-harness-apps 构建短剧创作工作台：包含角色/场景设定卡管理、分镜时间轴看板、单镜头重抽卡与成片拼接预览。",
    en: "Build the Short Drama Studio in penguin-harness-apps featuring character/scene cards, a storyboard timeline, per-shot rerolls, and video assembly preview.",
  },
  uiEvidence: {
    zh: "可从应用中心启动的 AI 短剧分镜与视频生成工作台插件。",
    en: "An AI short drama storyboard and video studio workbench plugin launchable from the App Center.",
  },
  evalIssues: [96],
  evalWork: {
    zh: "对接 TuringBench（#96）的视频分镜连贯性与拟人度评测，交付多集短剧端到端生成样片。",
    en: "Evaluate storyboard coherence and realism against TuringBench (#96) and deliver multi-episode short drama samples.",
  },
  evalEvidence: {
    zh: "短剧成片案例包与 TuringBench 视觉叙事连贯性评分记录。",
    en: "Short drama sample bundle and TuringBench visual narrative coherence scores.",
  },
});

const appHealthAssistant = buildAppTopic({
  id: "app-health-assistant",
  title: {
    zh: "AI 个人健康档案追踪与主动提醒助手",
    en: "AI Personal Health Records & Proactive Reminder Workbench",
  },
  protoState: "active",
  protoIssues: [52, 41],
  protoWork: {
    zh: "结合 Personal Agent 主动提醒与长短期记忆探索（#52）及生物医学纵向重复测量分析（#41），定义个人与家庭健康管理工作台。",
    en: "Combine Personal Agent proactive reminders and long/short-term memory (#52) with longitudinal biomedical analysis (#41) into a personal health workbench.",
  },
  protoEvidence: {
    zh: "涵盖体检报告结构化、纵向指标趋势与主动健康干预的场景定义。",
    en: "Scenario specification covering checkup report extraction, longitudinal biomarker trends, and proactive reminders.",
  },
  skillIssues: [52],
  skillWork: {
    zh: "封装体检 PDF/OCR 指标抽取、跨年度异常指标纵向对比、饮食运动打卡记忆沉淀及定时用药/复查主动提醒 Skill。",
    en: "Package Skills for checkup PDF/OCR extraction, multi-year biomarker trend analysis, diet/exercise memory logging, and scheduled medication/checkup reminders.",
  },
  skillEvidence: {
    zh: "具备本地隐私保护、长短期健康记忆与定时触发能力的健康助手工具链。",
    en: "Privacy-preserving health assistant toolchain with persistent health memory and scheduled proactive triggers.",
  },
  uiWork: {
    zh: "在 penguin-harness-apps 实现健康助手工作台：提供关键生理指标趋势图表、异常项解读卡片、每日健康打卡日历与提醒配置面板。",
    en: "Implement the Health Assistant Workbench in penguin-harness-apps with biomarker trend charts, anomaly explanations, daily logs, and reminder settings.",
  },
  uiEvidence: {
    zh: "可视化的 AI 个人健康助手工作台插件。",
    en: "Visual AI Personal Health Assistant workbench plugin.",
  },
  evalIssues: [52, 90],
  evalWork: {
    zh: "在长周期记忆基准（#90）与多轮健康咨询场景（#52）下验证跨会话病史记忆准确率与主动提醒及时性。",
    en: "Validate cross-session health history recall and reminder accuracy on long-horizon memory benchmarks (#90) and consultation scenarios (#52).",
  },
  evalEvidence: {
    zh: "脱敏体检纵向追踪演示案例与长周期健康记忆评测报告。",
    en: "Anonymized longitudinal health tracking demo and long-term memory evaluation report.",
  },
});

const appEcommerceStrategy = buildAppTopic({
  id: "app-ecommerce-strategy-workbench",
  title: {
    zh: "AI 电商选品分析与营销策略工作台",
    en: "AI E-Commerce Product Selection & Marketing Strategy Workbench",
  },
  protoState: "active",
  protoIssues: [53],
  protoWork: {
    zh: "对接 Agent Team 商业营收基准（#53），定义涵盖市场选品、竞品价格/差评监控、卖点提炼、商品详情页生成与大促投放复盘的电商策略工作台。",
    en: "Aligned with the Agent Team commercial revenue benchmark (#53), define an e-commerce workbench for product selection, competitor review mining, copy generation, and ROI analysis.",
  },
  protoEvidence: {
    zh: "电商多智能体分工（市场调研员、视觉文案、定价策略师、投放分析师）与数据看板规范。",
    en: "Multi-agent e-commerce role specification (market researcher, copywriter, pricing strategist, ad analyst) and dashboard schema.",
  },
  skillIssues: [53],
  skillWork: {
    zh: "封装竞品评论痛点聚类、价格弹性与毛利测算、高转化主图/详情页多模态素材生成及活动湊单 ROI 模拟 Skill。",
    en: "Package Skills for competitor review clustering, margin/elasticity modeling, high-conversion listing generation, and promotion ROI simulation.",
  },
  skillEvidence: {
    zh: "电商选品、定价、素材生成与数据分析全链路 Skill 组件。",
    en: "End-to-end e-commerce Skills covering product research, pricing, creative generation, and ROI analytics.",
  },
  uiWork: {
    zh: "在 penguin-harness-apps 实现电商策略工作台：集成选品对比矩阵、竞品痛点雷达图、商品详情页画布预览与促销利润模拟器。",
    en: "Build the E-Commerce Strategy Workbench in penguin-harness-apps with product comparison matrices, pain-point radar charts, listing canvas preview, and margin simulators.",
  },
  uiEvidence: {
    zh: "面向电商运营场景的 AI 策略工作台插件。",
    en: "AI E-Commerce Strategy Workbench plugin for store operations.",
  },
  evalIssues: [53],
  evalWork: {
    zh: "结合商业营收与店铺运营模拟基准（#53），评测策略工作台在选品命中率、转化文案质量与利润率优化上的表现。",
    en: "Evaluate product selection hit rate, listing conversion quality, and profit optimization on the commercial simulation benchmark (#53).",
  },
  evalEvidence: {
    zh: "真实品类选品与营销策划案例包及商业基准评测得分。",
    en: "Category selection and marketing campaign case study plus commercial benchmark scores.",
  },
});

const appMarketResearchQuant = buildAppTopic({
  id: "app-market-research-quant",
  title: {
    zh: "AI 市场投研与量化回测工作台（dshbook 案例）",
    en: "AI Market Research & Quantitative Backtesting Workbench (dshbook Case)",
  },
  protoState: "done",
  protoRefs: [{ label: { zh: "dshbook 第 10 章《构建市场投研助手》", en: "dshbook Ch.10 Market Research Assistant" }, url: `${REPO.dshbookRepo}/blob/main/book/chapter10.md` }],
  protoWork: {
    zh: "基于 dshbook 第 10 章验证通过的投研流水线（指数成分股筛选 → 信号规则定义 → 历史回测净值曲线 → 盘中异动监控 → 收盘日报看板），定义投研工作台。",
    en: "Adapt dshbook Ch.10's verified pipeline (index constituent screening → signal rules → historical backtest NAV curve → intraday anomaly monitor → daily report dashboard).",
  },
  protoEvidence: {
    zh: "dshbook 第 10 章净值曲线、回撤统计与收盘总览看板（10-4-03-stock-analysis-overview-v4.png）原型。",
    en: "NAV curve, drawdown statistics, and daily market overview dashboard prototype from dshbook Ch.10.",
  },
  skillWork: {
    zh: "封装行情与财报数据拉取、无未来函数信号回测、夏普率/最大回撤指标计算及盘后复盘摘要生成 Skill。",
    en: "Package Skills for market/financial data ingestion, lookahead-free signal backtesting, Sharpe/drawdown calculation, and post-market report generation.",
  },
  skillEvidence: {
    zh: "可复现的量化信号回测脚本与定时行情异动扫描工具链。",
    en: "Reproducible quantitative signal backtesting scripts and scheduled anomaly scanning toolchain.",
  },
  uiWork: {
    zh: "在 penguin-harness-apps 实现投研工作台：支持股票池条件筛选、策略净值与基准对比曲线、盘中异动提醒流与日报一键导出。",
    en: "Build the Market Research Workbench in penguin-harness-apps with stock screeners, strategy vs. benchmark NAV charts, anomaly feeds, and daily report export.",
  },
  uiEvidence: {
    zh: "可交互的 AI 市场投研与量化回测工作台插件。",
    en: "Interactive AI market research and quantitative backtesting workbench plugin.",
  },
  evalWork: {
    zh: "在多段历史行情区间上校验回测数值准确性、无数据泄露约束及投研日报数据溯源准确率。",
    en: "Verify backtest numerical accuracy, zero-lookahead constraints, and daily report data provenance across historical market regimes.",
  },
  evalEvidence: {
    zh: "端到端指数增强/信号回测案例与数据一致性核验报告。",
    en: "End-to-end signal backtesting case study and data consistency audit report.",
  },
});

const appDigitalSecretaryPoster = buildAppTopic({
  id: "app-digital-secretary-design",
  title: {
    zh: "飞书数字秘书与自进化视觉设计工作台（dshbook 案例）",
    en: "Feishu Digital Secretary & Self-Evolving Visual Design Workbench (dshbook Case)",
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
const versions: VersionDefinition[] = [
  {
    id: "v1",
    projects: {
      infra: [autoResearch, ascendInference],
      "auto-bench": [autoBenchJudgeAlignment],
      agent: [agentBlockerHonesty],
      platform: [gdpevoSkillEvolution],
      apps: [appSuperAgentTaskTree],
    },
  },
  {
    id: "v2",
    preview: true,
    projects: {
      infra: [
        { ...autoResearch, demoAchieved: true, followUp: speedrun },
        ascendInference,
        solExecBenchErnie,
      ],
      "auto-bench": [
        autoBenchJudgeAlignment,
        turingBenchWritingRealism,
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
        appSuperAgentTaskTree,
        appOverleafPaper,
        appShortDramaStudio,
        appHealthAssistant,
        appEcommerceStrategy,
        appMarketResearchQuant,
        appDigitalSecretaryPoster,
      ],
    },
  },
];

const empty = { zh: "待填写", en: "To be filled in" };
const blankPhases = trainingPhases.map(({ label }) => ({ label, work: empty, evidence: empty }));

export function researchVersions(quests: QuestItem[], locale: Locale) {
  const byIssue = new Map(quests.map((q) => [q.issueNumber, q]));
  const stageDetails = (phase: Phase, demoAchieved: boolean) => {
    const tasks = (phase.issues ?? []).map((number) => ({ number, quest: byIssue.get(number) }));
    const state: StageState = demoAchieved ? "done"
      : phase.state ? phase.state
      : tasks.length > 0 && tasks.every(({ quest }) => quest?.status === "completed") ? "done"
      : !phase.pending && tasks.some(({ quest }) => quest?.status === "in_progress" || quest?.status === "completed") ? "active"
      : "planned";
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
  const topicDetails = (topic: TopicDefinition, achievement?: Achievement) => ({
    id: topic.id,
    title: resolveText(topic.title, locale),
    template: topic.phases === undefined,
    achievement,
    stages: (topic.phases ?? blankPhases).map((phase) => stageDetails(phase, achievement === "demo-achieved")),
  });
  return versions.map((version) => ({
    id: version.id,
    preview: version.preview,
    routes: (Object.keys(routeTitles) as RouteId[]).map((id) => ({
      id,
      title: resolveText(routeTitles[id], locale),
      projects: (version.projects[id] ?? []).map((project) => {
        const demoAchieved = version.preview && project.demoAchieved;
        const resolved = topicDetails(project, demoAchieved ? "demo-achieved" : undefined);
        const completed = Boolean(demoAchieved) || (!resolved.template && resolved.stages.every((s) => s.state === "done"));
        return {
          ...resolved,
          followUp: version.preview && project.followUp
            ? topicDetails(project.followUp, completed ? "unlocked" : "locked")
            : undefined,
        };
      }),
    })),
  }));
}

export type ResearchVersion = ReturnType<typeof researchVersions>[number];
export type ResearchProject = Omit<ResearchVersion["routes"][number]["projects"][number], "followUp">;
