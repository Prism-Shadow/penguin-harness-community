import { resolveText, type QuestItem } from "./community";
import type { Locale } from "./i18n";

type Text = Record<Locale, string>;
type StageState = "planned" | "open" | "active" | "done";
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

export const researchStageLabels = {
  zh: { planned: "未开始", open: "待认领", active: "进行中", done: "已完成" },
  en: { planned: "Not started", open: "Open", active: "In progress", done: "Complete" },
};

const L = {
  bench: { zh: "Bench", en: "Bench" },
  algo: { zh: "算法", en: "Algorithm" },
  run: { zh: "实验", en: "Experiment" },
  dev: { zh: "应用开发", en: "App development" },
};

const P = {
  integrate: { zh: "待接入", en: "Pending integration" },
  accept: { zh: "待验收", en: "Pending acceptance" },
  confirm: { zh: "待确认", en: "Pending confirmation" },
  review: { zh: "待评审", en: "Pending review" },
  run: { zh: "待开展", en: "Pending experiment" },
  dev: { zh: "待开发", en: "Pending development" },
  benchAcceptance: { zh: "待基准验收", en: "Awaiting benchmark acceptance" },
  previousStage: { zh: "等待前序阶段", en: "Awaiting a previous stage" },
};

const REPO = {
  harness: "https://github.com/Prism-Shadow/penguin-harness",
  rsiPlatform: "https://github.com/Prism-Shadow/penguin-harness-rsi-platform",
  plugins: "https://github.com/Prism-Shadow/penguin-harness-plugins",
  apps: "https://github.com/Prism-Shadow/penguin-harness-apps",
  mmsp: "https://github.com/Prism-Shadow/model-message-stream-protocol",
  bench: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
  gdpevo: "https://github.com/Prism-Shadow/GDPevo",
  sweCowork: "https://github.com/Prism-Shadow/swe-cowork",
  leaderboard: "https://github.com/Prism-Shadow/penguin-harness-leaderboard",
  paper: "https://github.com/Prism-Shadow/penguin-harness-paper",
  dshbook: "https://dshbook.penguin.ooo",
  dshbookRepo: "https://github.com/Prism-Shadow/deepseek-harness-book",
};

/* ---------- 1. InfraRSI ---------- */
const infraPr = `${REPO.harness}/pull/1551`;
const infraRun = `${infraPr}#issuecomment-6997394473`;
const trainingPhases: Phase[] = [
  {
    label: L.algo,
    work: {
      zh: "在 PenguinHarness 中集成 InfraRSI 训练基础设施自进化方法（#71），支持围绕 micro-batch、编译配置与训练算子的候选生成、数值校验与成对复测闭环。",
      en: "Integrate the InfraRSI self-evolution method (#71) in PenguinHarness to search micro-batch sizes, compiler flags, and training code edits with automated verification.",
    },
    evidence: {
      zh: "合入插件仓的 InfraRSI 算法插件与自动化验证钩子（#71）。",
      en: "Merged InfraRSI algorithm plugin and automated verification hooks (#71).",
    },
    issues: [71],
    references: [{ label: { zh: "InfraRSI 实现与试跑 PR #1551", en: "InfraRSI implementation & trial PR #1551" }, url: infraPr }],
  },
  {
    label: L.run,
    work: {
      zh: "在单张 NVIDIA A100 80GB 上固定 50.3M 参数模型与每步 2¹⁹ Token（基线 micro-batch 128），运行 InfraRSI 搜索训练配置与代码改动并统计第 21–60 步稳态耗时及验证集 BPB（#121 / PR #1551）。",
      en: "On a single NVIDIA A100 80GB with a fixed 50.3M-parameter model and 2¹⁹ tokens/step, run InfraRSI (#121 / PR #1551) and measure steady-state step time (steps 21–60) and validation BPB.",
    },
    evidence: {
      zh: "基线与进化候选的成对复测记录、单步耗时/Loss/BPB 对照表及可复跑实验报告。",
      en: "Paired baseline vs. candidate measurements, step-time/loss/BPB comparison tables, and a reproducible experiment report.",
    },
    issues: [121],
    references: [
      { label: { zh: "实验 PR #1551", en: "Experiment PR #1551" }, url: infraPr },
      { label: { zh: "B-Comp 试跑记录", en: "B-Comp trial records" }, url: infraRun },
    ],
  },
  {
    label: L.bench,
    pending: P.integrate,
    work: {
      zh: "按 RFC-0001 接入 NanoChat AutoResearch 训练基础设施优化基准（#120），固定基准版本、数据准备流程和评测规则。",
      en: "Integrate the NanoChat AutoResearch training infrastructure benchmark (#120) under RFC-0001 with pinned data preparation and evaluation rules.",
    },
    dataset: {
      zh: "试跑使用 ClimbMix 镜像（karpathy/climbmix-400b-shuffle），训练分片 00000–00009，验证分片 06542。社区基准的数据版本与划分待 #120 确认。",
      en: "The trial used the ClimbMix mirror (karpathy/climbmix-400b-shuffle), training shards 00000–00009, and validation shard 06542. Community benchmark splits are tracked in #120.",
    },
    evidence: {
      zh: "交付可运行的基准包，支持数据准备、基线复跑和候选自动评分。",
      en: "Deliver a runnable benchmark package with data preparation, baseline reproduction, and automated candidate scoring.",
    },
    issues: [120],
  },
];

const autoResearch: TopicDefinition = {
  id: "autoresearch-a100",
  title: {
    zh: "在 AutoResearch 跑 GPU 的预训练性能优化",
    en: "Running GPU Pretraining Performance Optimization on AutoResearch",
  },
  phases: trainingPhases,
};

const speedrun: TopicDefinition = {
  id: "nanogpt-speedrun-transfer",
  title: {
    zh: "NanoGPT Speedrun 预训练速度优化实验",
    en: "Pretraining Speed Optimization on NanoGPT Speedrun",
  },
  phases: [
    {
      label: L.algo,
      work: {
        zh: "基于 PenguinHarness 中的 ERNIE Evolve 双层循环自动研究系统（#86），适配 NanoGPT Speedrun 的分布式/编译、优化器与注意力算子搜索空间。",
        en: "Adapt the ERNIE Evolve dual-loop automated research system (#86) in PenguinHarness to NanoGPT Speedrun's compiler, optimizer, and kernel search space.",
      },
      evidence: { zh: "适配 Speedrun 赛道的自动演化配置与验证脚本。", en: "Evolution configuration and verifier scripts adapted for Speedrun." },
      issues: [86],
    },
    {
      label: L.bench,
      pending: P.integrate,
      work: {
        zh: "选定 NanoGPT Speedrun 赛道（Track 1 或 Track 3），固定版本、FineWeb 数据流和目标验证集 Loss 达标线（#84）。",
        en: "Select a NanoGPT Speedrun track (Track 1 or Track 3) and pin its version, FineWeb data stream, and target validation loss (#84).",
      },
      evidence: { zh: "可复跑的赛道基线与自动评分入口。", en: "A reproducible track baseline and automated scoring entry point." },
      issues: [84],
    },
    {
      label: L.run,
      state: "planned",
      pending: P.benchAcceptance,
      work: {
        zh: "待 #84 赛道基准接入后，在相同硬件和赛道规则下对照官方基线与自进化版本，记录达到目标验证精度的端到端耗时（Time-to-Target）与训练步数。",
        en: "Once the #84 track benchmark is integrated, compare the official Speedrun baseline against the evolved variant on identical hardware, recording time-to-target and step count.",
      },
      evidence: { zh: "迁移补丁、两组训练日志及可评审的 Speedrun 预训练速度优化实验报告。", en: "Transfer patches, paired training logs, and a reviewable Speedrun optimization experiment report." },
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
      label: L.run,
      work: {
        zh: "在单张 Ascend 950PR 上开展 Qwen3.8 推理 Infra 低时延与确定性吞吐 RSI 优化实验（#88 / PR #1627），对比 latency（MTP 3 tokens）、throughput（MTP 1 token）及动态投机调度，32 并发吞吐由 814.2 升至 904.7 tok/s（+11.1%）。",
        en: "Run Qwen3.8 inference latency and throughput RSI optimization on a single Ascend 950PR (#88 / PR #1627), comparing latency (MTP 3), throughput (MTP 1), and dynamic scheduling to raise 32-concurrency throughput from 814.2 to 904.7 tok/s (+11.1%).",
      },
      evidence: { zh: "带 3×CV 噪声门限对照的多并发吞吐/TPOT/TTFT 结果表与实验报告（#88 / PR #1627）。", en: "Throughput, TPOT, and TTFT comparison tables against 3×CV noise thresholds and the verified report (#88 / PR #1627)." },
      issues: [88],
      references: [{ label: { zh: "实验数据与报告 PR #1627", en: "Experiment measurements & report PR #1627" }, url: ascendPr }],
    },
    {
      label: L.algo,
      state: "planned",
      pending: P.integrate,
      work: {
        zh: "待将 #88（PR #1627）中面向昇腾 CANN 图编译、MTP 投机步数档位与调度参数的搜索及精度门禁校验流程抽离为通用推理 Infra 自进化算法插件。",
        en: "Pending extraction of the Ascend CANN graph compilation, MTP speculative step mode, and scheduling parameter evolution workflow from #88 (PR #1627) into a reusable inference Infra RSI plugin.",
      },
      evidence: { zh: "独立封装的国产算力芯片推理参数与投机调度自进化算法插件。", en: "A standalone inference parameter and speculative scheduling RSI algorithm plugin." },
      references: [{ label: { zh: "演化实现参考 PR #1627", en: "Evolution implementation reference PR #1627" }, url: ascendPr }],
    },
    {
      label: L.bench,
      state: "planned",
      pending: P.integrate,
      work: {
        zh: "待将 #88（PR #1627）中的 32 并发/单流压测负载与 20 题问答精度门禁（temperature=0，要求 20/20 全过且偏差 ≤1 题）按 RFC-0001 拆分为独立基准包并发布接入任务。",
        en: "Pending extraction of the 32-concurrency/single-stream workload and 20-question accuracy gate (temperature=0, 20/20 pass) from #88 (PR #1627) into a standalone RFC-0001 benchmark package.",
      },
      dataset: {
        zh: "固定 Qwen3.8-27B-w8a8、32K 上下文、max-num-seqs=32 与 20 道固定问答校验题。",
        en: "Pin Qwen3.8-27B-w8a8, 32K context length, max-num-seqs=32, and a 20-question deterministic QA gate.",
      },
      evidence: { zh: "独立于进化产物的昇腾 vLLM 推理评测基准包。", en: "A standalone Ascend vLLM inference benchmark package." },
    },
  ],
};

const qwenPostTraining: TopicDefinition = {
  id: "qwen-llamafactory-post-training",
  title: {
    zh: "基于 LlamaFactory 的 Qwen3.8 后训练优化",
    en: "Optimizing Qwen3.8 Post-Training with LlamaFactory",
  },
  phases: [
    {
      label: L.run,
      work: {
        zh: "在固定算力与时间预算下，结合 LlamaFactory 与 PenguinHarness 自进化闭环优化 Qwen3.8 训练与后训练配方（#87），对比默认基线与多轮演化候选在收敛速度（val loss / BPB）、训练系统吞吐（tokens/s、MFU）及下游基准准确率上的提升。",
        en: "Under fixed compute and time budgets, optimize Qwen3.8 training and post-training recipes with LlamaFactory and PenguinHarness (#87), comparing default baselines against evolved candidates on convergence speed, throughput, and downstream accuracy.",
      },
      evidence: {
        zh: "后训练配方改动补丁、候选树演化日志及吞吐/精度前后对比实验报告（#87）。",
        en: "Post-training recipe patches, candidate tree evolution logs, and before/after throughput and accuracy evaluation report (#87).",
      },
      issues: [87],
      references: [
        { label: { zh: "LlamaFactory 开源仓库", en: "LlamaFactory repository" }, url: "https://github.com/hiyouga/LlamaFactory" },
      ],
    },
    {
      label: L.algo,
      state: "planned",
      pending: P.integrate,
      work: {
        zh: "待将围绕 LlamaFactory 数据配比打包、优化器学习率日程与后训练超参策略的多轮假设验证流程沉淀为可复用的后训练自进化算法插件。",
        en: "Pending extraction of the multi-round hypothesis testing workflow over LlamaFactory data packing, optimizer/LR schedules, and alignment hyperparameters into a reusable post-training RSI plugin.",
      },
      evidence: {
        zh: "LlamaFactory × PenguinHarness 通用后训练配方自进化算法插件与验证脚本。",
        en: "Reusable LlamaFactory × PenguinHarness post-training recipe evolution plugin and verification scripts.",
      },
    },
    {
      label: L.bench,
      state: "planned",
      pending: P.integrate,
      work: {
        zh: "待基于 LlamaFactory 拆分并固定可复现的 Qwen3.8 训练与后训练标准评测基准包，固定算力与时间预算、训练吞吐（tokens/s、MFU）、收敛指标（val loss / BPB）及下游评测协议。",
        en: "Pending setup of a standalone reproducible Qwen3.8 + LlamaFactory training and post-training benchmark package with pinned compute/time budgets, throughput metrics, and downstream accuracy gates.",
      },
      dataset: {
        zh: "固定 Qwen3.8 训练/后训练数据配比、验证集划分、GPU 预算与下游标准评测集。",
        en: "Pin Qwen3.8 training/post-training data splits, validation sets, GPU budgets, and downstream evaluation suites.",
      },
      evidence: {
        zh: "可一键复跑的 Qwen3.8 + LlamaFactory 训练与后训练基线环境及自动评分入口。",
        en: "Reproducible Qwen3.8 + LlamaFactory training/post-training baseline environment and automated scoring entry point.",
      },
    },
  ],
};

const solExecBenchErnie: TopicDefinition = {
  id: "sol-execbench-ernie-evolve",
  title: {
    zh: "GPU 算子自动优化实验",
    en: "Automated GPU Kernel Optimization Experiment",
  },
  phases: [
    {
      label: L.algo,
      work: {
        zh: "在 PenguinHarness 中复现 ERNIE Evolve 双层循环自动研究系统（外层候选树规划 + 内层算子实现与硬件性能反馈验证，#86）。",
        en: "Reproduce the ERNIE Evolve dual-loop system (outer tree planner + inner kernel implementation and hardware profiling verifier, #86) in PenguinHarness.",
      },
      evidence: { zh: "双层进化循环插件实现与算子编译/数值/性能自动校验工具链。", en: "Dual-loop evolution plugin implementation and automated kernel compilation/numerical/profiling verifier." },
      issues: [86],
    },
    {
      label: L.bench,
      pending: P.integrate,
      work: {
        zh: "接入 NVIDIA SOL-ExecBench 的 235 道生产模型算子题目与 Evaluation Stack v1.1 隔离评测环境（#85）。",
        en: "Integrate NVIDIA SOL-ExecBench's 235 production operator problems and Evaluation Stack v1.1 isolated harness (#85).",
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
      state: "planned",
      pending: P.benchAcceptance,
      work: {
        zh: "待 #85 算子基准与 #86 双层进化系统就绪后，在 SOL-ExecBench 12 类算子家族上对比单轮直接生成基线与多轮进化，统计数值正确率与相对硬件极限的 SOL 平均得分（参考值：ERNIE Evolve 0.819 vs Hyra-1.0 0.736）。",
        en: "Once the #85 benchmark and #86 dual-loop system are ready, compare single-pass generation against multi-round evolution across all 12 SOL-ExecBench operator families, measuring pass rate and mean SOL score.",
      },
      evidence: { zh: "12 类算子家族的正确率、SOL 加速比对照表及典型算子（MLA/MoE）演化轨迹报告。", en: "Pass rate and SOL speedup breakdown across 12 operator families plus trajectory analysis on MLA/MoE." },
    },
  ],
};

/* ---------- 2. Auto Bench ---------- */
const hleEvalPr = `${REPO.bench}/pull/32`;
const honestyPr = `${REPO.bench}/pull/42`;

const autoBenchJudgeAlignment: TopicDefinition = {
  id: "auto-bench-judge-alignment",
  title: {
    zh: "从原始数据自动生成评测基准实验",
    en: "Automated Benchmark Generation and Judge Calibration",
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
        zh: "包含客观简答等价判分边界题（可复用 PR #32 与 PR #42 的双口径分歧样本）与长文成对盲测样本。",
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
      label: L.algo,
      work: {
        zh: "开发 Auto Bench 插件（#78），实现从原始业务数据自动生成评测题、引入人类选样、边界样本消歧与多轮判分规则修订。",
        en: "Develop the Auto Bench plugin (#78) supporting automated task generation from raw data, human sample selection, boundary disambiguation, and iterative rubric refinement.",
      },
      evidence: { zh: "Auto Bench 插件实现与判分规则多轮迭代校准工具链。", en: "Auto Bench plugin implementation and iterative rubric calibration toolchain." },
      issues: [78],
    },
    {
      label: L.run,
      state: "planned",
      pending: P.benchAcceptance,
      work: {
        zh: "待校准样本集与 #78 插件就绪后，对比「LLM 零样本自动生成判分规则」与「Auto Bench 人机协同校准判分器」，测量与人类专家裁决的一致率（Cohen's κ）、边界样本误判率及抑制奖励黑客的效果。",
        en: "Once the calibration set and #78 plugin are ready, compare zero-shot LLM rubric generation against the calibrated Auto Bench judge, measuring human agreement (Cohen's κ), boundary error rates, and reward-hacking resistance.",
      },
      evidence: { zh: "判分一致率对照表、误判案例消融分析与 Auto Bench 验收报告。", en: "Judge agreement comparison tables, boundary error ablations, and the Auto Bench evaluation report." },
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
      state: "planned",
      pending: P.benchAcceptance,
      work: {
        zh: "待 #96、#68 基准构建完成后，交换正反位置运行多轮成对盲测，对比单维度总体打分与分项（句式多样性、情感自然度、分镜连贯性）规则判分，统计正反序翻转率、跨评审模型一致率及去偏置效果。",
        en: "Once the #96 and #68 benchmarks are ready, run position-swapped pairwise blind evaluations comparing holistic scoring against decomposed criteria, reporting flip rates, cross-judge agreement, and debiasing effectiveness.",
      },
      evidence: { zh: "位置偏置消融日志、主观评测稳定性量化结果表与基准评测报告。", en: "Position-bias ablation logs, subjective evaluation stability tables, and the benchmark evaluation report." },
    },
  ],
};

/* ---------- 3. Super Agent & Personal Agent ---------- */
const compactionPr = `${REPO.harness}/pull/1491`;
const compactionUiPr = `${REPO.harness}/pull/1591`;
const contextCompactionHandoff: TopicDefinition = {
  id: "context-compaction-handoff",
  title: {
    zh: "长程任务上下文压缩与 Memory 优化",
    en: "Long-Horizon Context Compaction and Memory Optimization",
  },
  phases: [
    {
      label: L.algo,
      work: {
        zh: "优化 PenguinHarness 上下文压缩算法（#44，PR #1491 压缩前多轮工具写入 handoff 文件 + trace-lookup JSONL 行级检索、PR #1591 压缩配置），并推进 Obelisk 原始历史检索层与分层图视图记忆架构接入（#91）。",
        en: "Optimize PenguinHarness context compaction (#44, PR #1491 handoff files + trace-lookup JSONL retrieval, PR #1591 UI) and integrate the Obelisk raw history retrieval & hierarchical graph memory layer (#91).",
      },
      evidence: { zh: "已合入主干的压缩交接实现（PR #1491、PR #1591）与分层记忆检索插件（#91）。", en: "Merged compaction handoff implementation (PR #1491, PR #1591) and hierarchical memory retrieval layer (#91)." },
      issues: [44, 91],
      references: [
        { label: { zh: "压缩交接与轨迹检索 PR #1491", en: "Compaction handoff & trace-lookup PR #1491" }, url: compactionPr },
        { label: { zh: "压缩配置界面 PR #1591", en: "Compaction settings UI PR #1591" }, url: compactionUiPr },
      ],
    },
    {
      label: L.bench,
      pending: P.integrate,
      work: {
        zh: "构建触发多次上下文压缩的长程任务评测集（#62）与 Agent Memory 第一性原理评测基准（#90，涵盖原始历史检索、跨会话溯源研究与 Memory Tax 净收益评测）。",
        en: "Build the long-horizon context compaction benchmark (#62) and the first-principles Agent Memory benchmark (#90, covering raw history retrieval, cross-session provenance, and Memory Tax).",
      },
      evidence: { zh: "固定压缩阈值与探针检查点的长程上下文压缩与 Memory 评测基准。", en: "A long-horizon compaction and memory benchmark with pinned token thresholds and probe checkpoints." },
      issues: [62, 90],
    },
    {
      label: L.run,
      state: "planned",
      pending: P.benchAcceptance,
      work: {
        zh: "待 #62、#90 基准接入后，在相同模型与压缩阈值下对比「纯文本摘要」、「压缩交接 + JSONL 行级检索（#44）」与「分层 Memory 检索（#91）」在关键事实保留率、跨会话溯源准确率及 Memory Tax 开销上的表现。",
        en: "Once benchmarks #62 and #90 are integrated, compare plain text summaries, compaction handoff + JSONL trace lookup (#44), and hierarchical memory retrieval (#91) on fact recall, cross-session provenance accuracy, and token overhead.",
      },
      evidence: { zh: "关键信息召回率、端到端任务完成率与 Token 开销对照表及实验报告。", en: "Fact recall, task completion rate, and token overhead comparison tables and evaluation report." },
    },
  ],
};

const computerUsePr = `${REPO.harness}/pull/1650`;
const personalAgentComputerUse: TopicDefinition = {
  id: "personal-agent-computer-use",
  title: {
    zh: "Personal Agent 电脑与浏览器操控评测",
    en: "Evaluating Personal Agent Computer and Browser Use",
  },
  phases: [
    {
      label: L.algo,
      work: {
        zh: "为 PenguinHarness 集成跨平台原生 Computer Use 桌面 GUI 视觉感知与键鼠操控能力（#92 / PR #1650，支持高分屏坐标自适应、辅助功能树定位与「动作执行—画面变化」闭环自检），结合 Personal Agent 主动任务推进机制（#52）实现跨终端、浏览器与原生桌面软件协同。",
        en: "Integrate cross-platform native Computer Use GUI perception and mouse/keyboard control (#92 / PR #1650) with Personal Agent proactive workflows (#52) across terminal, browser, and desktop applications.",
      },
      evidence: {
        zh: "跨平台 Computer Use 工具与 Skill 接口（#92 / PR #1650）及 Personal Agent 跨应用操控实现（#52）。",
        en: "Cross-platform Computer Use tool/Skill interface (#92 / PR #1650) and Personal Agent cross-app automation (#52).",
      },
      issues: [92, 52],
      references: [{ label: { zh: "Computer Use 集成 PR #1650", en: "Computer Use integration PR #1650" }, url: computerUsePr }],
    },
    {
      label: L.bench,
      pending: P.integrate,
      work: {
        zh: "按 RFC-0001 接入标准化 Computer Use（如 OSWorld 桌面跨应用任务集）与 Browser Use（如 WebArena、BrowserGym 网页交互）评测基准，固定容器沙箱快照与终态自动判分器（#93）。",
        en: "Integrate standardized Computer Use (e.g., OSWorld desktop tasks) and Browser Use (e.g., WebArena, BrowserGym) benchmarks under RFC-0001 with deterministic sandbox snapshots and state evaluators (#93).",
      },
      evidence: {
        zh: "可一键复现的桌面与浏览器交互评测沙箱、初始状态快照及自动判分入口（#93）。",
        en: "Reproducible desktop and browser evaluation sandboxes, state snapshots, and automated evaluators (#93).",
      },
      issues: [93],
    },
    {
      label: L.run,
      state: "planned",
      pending: P.benchAcceptance,
      work: {
        zh: "待 #93 基准接入后，在 OSWorld、WebArena 等真实桌面与浏览器任务集上评测 Personal Agent（#92、#52）的端到端任务完成率、键鼠/网页操作步数开销与异常界面视觉自纠错成功率。",
        en: "Once benchmark #93 is integrated, evaluate Personal Agent (#92, #52) end-to-end task completion rate, action step efficiency, and visual self-correction rate on OSWorld and WebArena tasks.",
      },
      evidence: {
        zh: "桌面与浏览器操控轨迹及截图记录、成功率—步数对照表与评测报告。",
        en: "Desktop and browser action trajectory logs, success-rate vs. step-cost comparison tables, and evaluation report.",
      },
    },
  ],
};

const agentBlockerHonesty: TopicDefinition = {
  id: "agent-blocker-honesty",
  title: {
    zh: "Agent 工具故障如实汇报能力评测",
    en: "Evaluating Agent Honesty Under Tool Failures",
  },
  phases: [
    {
      label: L.bench,
      state: "active",
      pending: P.accept,
      work: {
        zh: "从 Failure-Transparent Agents、RetryRealistic、Async-RBench 精选 50 道工具缺失/故障与异步后续事件题目（25 题归纳规则、25 题冻结测试），建立双口径（非盲复核 + 盲测 AI 判分）评测基准（PR #42）。",
        en: "Curate 50 tool-failure and async follow-up tasks from Failure-Transparent Agents, RetryRealistic, and Async-RBench (25 train, 25 frozen test) with dual-mode evaluation (PR #42).",
      },
      dataset: {
        zh: "包含 25 道测试题与 3 类异步后续追问事件，检验首答阻碍披露与状态变化后的结论更新。",
        en: "25 frozen test tasks plus 3 async follow-up event types testing initial blocker disclosure and conclusion updates.",
      },
      evidence: { zh: "PR #42 提交的诚实性评测集与双口径评分器。", en: "The honesty benchmark dataset and dual-mode evaluator in PR #42." },
      references: [{ label: { zh: "基准与实验 PR #42", en: "Benchmark & experiment PR #42" }, url: honestyPr }],
    },
    {
      label: L.run,
      work: {
        zh: "固定 gpt-6.1-sol（high 思考档），对「模型直答」「默认 Codex CLI」「注入 policy-v2 汇报规则的智能体」各独立运行 3 轮（252 份答复，#112、#124，PR #42）：首答合格率由 44/75 升至 70/75（+34.67%），待基准审校合入并扩展至 PenguinHarness。",
        en: "Fix gpt-6.1-sol (high reasoning) across direct model calls, default Codex CLI, and policy-v2 rules for 3 trials each (252 runs, #112, #124, PR #42): honest disclosure rose from 44/75 to 70/75 (+34.67 pp), pending benchmark merge and PenguinHarness evaluation.",
      },
      evidence: { zh: "252 份运行轨迹、非盲/盲测双口径对照表与阻碍如实汇报实验报告（#112 / PR #42）。", en: "252 run trajectories, non-blind vs. blind comparison tables, and the blocker honesty evaluation report (#112 / PR #42)." },
      issues: [112, 124],
      references: [{ label: { zh: "252 份实测记录与报告 PR #42", en: "252 run records & report in PR #42" }, url: honestyPr }],
    },
  ],
};

const companyPr = `${REPO.harness}/pull/1434`;
const companyNextSpecPr = `${REPO.harness}/pull/1556`;
const sweCoworkPr = `${REPO.bench}/pull/36`;
const companyModeCoordination: TopicDefinition = {
  id: "company-mode-coordination",
  title: {
    zh: "Super Agent 仓库级代码维护能力评测",
    en: "Evaluating Super Agent Repo-Scale Code Maintenance Capability",
  },
  phases: [
    {
      label: L.bench,
      work: {
        zh: "接入多智能体软件工程协同基准 SWE-CoWork（#108 / PR #36），基于 swe-cowork 数据仓托管的 101 个 Harbor 任务建立真实代码仓库多角色协同维护评测环境。",
        en: "Integrate the SWE-CoWork multi-agent benchmark (#108 / PR #36) with 101 Harbor tasks hosted in swe-cowork for repo-scale collaborative code maintenance evaluation.",
      },
      evidence: { zh: "swe-cowork 托管的 101 道真实代码仓库多角色协同任务集与频道消息/工单交付统计脚本。", en: "101 repo-scale multi-role collaborative Harbor tasks in swe-cowork and channel message / ticket delivery metrics scripts." },
      issues: [108],
      references: [
        { label: { zh: "SWE-CoWork 基准 PR #36", en: "SWE-CoWork benchmark PR #36" }, url: sweCoworkPr },
        { label: { zh: "SWE-CoWork 数据仓 swe-cowork", en: "SWE-CoWork dataset repo swe-cowork" }, url: REPO.sweCowork },
      ],
    },
    {
      label: L.algo,
      work: {
        zh: "优化 Company Mode 沟通规范（#50 / PR #1434，结论先行、禁刷屏与自我 @，两轮对照试跑将无指向刷屏由 16 条降至 0）并持续演进 Super Agent 协同架构（#94 / PR #1556，支持任务树拆解、里程碑并行调度与通知去重路由）。",
        en: "Optimize Company Mode communication norms (#50 / PR #1434, reducing undirected status spam from 16 to 0 in two-round trials) and evolve the Super Agent coordination architecture (#94 / PR #1556, supporting task-tree decomposition, milestone parallel scheduling, and notification deduplication).",
      },
      evidence: { zh: "PR #1434 已合入的沟通手册补丁及两轮对照试跑记录，与 Super Agent 协同架构规范及任务树调度实现（#94 / PR #1556）。", en: "Merged communication handbook patch and two-round trial records in PR #1434, plus Super Agent architecture spec & task-tree scheduler (#94 / PR #1556)." },
      issues: [50, 94],
      references: [
        { label: { zh: "沟通规范优化与两轮对照试跑 PR #1434", en: "Communication norms & trial comparison PR #1434" }, url: companyPr },
        { label: { zh: "下一代 Company Mode 规范与原型 PR #1556", en: "Next-gen Company Mode spec & prototype PR #1556" }, url: companyNextSpecPr },
      ],
    },
    {
      label: L.run,
      state: "planned",
      pending: P.benchAcceptance,
      work: {
        zh: "待 SWE-CoWork 基准（#108 / PR #36）与 Super Agent 里程碑并行调度（#94 / PR #1556）合入后，在 101 道真实代码仓库维护任务上对比原始提示词、精简沟通规范（#50）与 Super Agent 任务树调度的协同效率与交付率。",
        en: "Once the SWE-CoWork benchmark (#108 / PR #36) and Super Agent milestone scheduling (#94 / PR #1556) are merged, compare baseline prompts, concise communication norms (#50), and Super Agent task-tree scheduling across the 101 SWE-CoWork tasks.",
      },
      evidence: { zh: "频道消息长度、无效刷屏频次、Token 消耗与仓库级代码维护任务交付率对照报告。", en: "Comparison report of message length, status spam count, token cost, and repo-scale task delivery rate." },
    },
  ],
};

/* ---------- 4. RSI Platform & Applications ---------- */
const gdpevoBenchPr = `${REPO.bench}/pull/5`;
const gdpevoEvalPr = `${REPO.bench}/pull/16`;
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
      state: "done",
      work: {
        zh: "基于 GDPevo 研究与数据仓库，在社区基准仓接入 GDPevo Essential 基准（从中选取 6 个真实业务场景，每个场景 5 道连续训练题 + 5 道独立测试题，共 30 训练 / 30 测试，#40）。",
        en: "Based on the GDPevo research and dataset repository, integrate the GDPevo Essential benchmark across 6 real-world business scenarios (5 sequential train + 5 held-out test tasks per scenario; 30 train / 30 test total, #40).",
      },
      dataset: {
        zh: "固定基准提交 53f779e，涵盖客户服务、运营排期、财务核对等 6 类业务工作流的 Train/Test 标准包。",
        en: "Pinned at benchmark commit 53f779e providing Train/Test packages across 6 multi-step business workflows.",
      },
      evidence: { zh: "已合入主干的 GDPevo Essential 基准包（PR #5）。", en: "Merged GDPevo Essential benchmark package (PR #5)." },
      issues: [40],
      references: [
        { label: { zh: "基准 PR #5", en: "Benchmark PR #5" }, url: gdpevoBenchPr },
        { label: { zh: "GDPevo 研究与数据仓", en: "GDPevo research & data repo" }, url: REPO.gdpevo },
      ],
    },
    {
      label: L.algo,
      state: "done",
      work: {
        zh: "在自进化工作台与官方算法工具包仓库（penguin-harness-rsi-platform）中集成并对齐 OpenSkill、SkillAdam、TRACE、SkillOpt 四种 Skill 自进化算法的训练更新循环与冻结测试接口。",
        en: "Integrate and align the training update loops and frozen evaluation interfaces for OpenSkill, SkillAdam, TRACE, and SkillOpt in penguin-harness-rsi-platform.",
      },
      evidence: { zh: "随产品发布的四种官方 Skill 自进化算法工具包与统一评测驱动配置。", en: "Four official Skill self-evolution algorithm toolkits and unified evaluation driver configurations in penguin-harness-rsi-platform." },
      references: [
        { label: { zh: "自进化工作台与算法仓 penguin-harness-rsi-platform", en: "RSI platform & toolkit repo penguin-harness-rsi-platform" }, url: REPO.rsiPlatform },
      ],
    },
    {
      label: L.run,
      state: "done",
      work: {
        zh: "固定 PenguinHarness 0.2.19 与 DeepSeek-V4.1-Flash-1017（max 思考档），完成 450 条测试轨迹横评（#42）：基线 56.32±2.17（$2.39/次）、OpenSkill 62.16±2.31（$2.50）、TRACE 68.02±1.80（$1.59，测试成本降 33%）、SkillAdam 68.95±0.74（$1.96）、SkillOpt 70.25±0.03（$1.86）。",
        en: "Fix PenguinHarness 0.2.19 and DeepSeek-V4.1-Flash-1017 across 450 test trajectories (#42): baseline 56.32±2.17 ($2.39/test), OpenSkill 62.16±2.31 ($2.50), TRACE 68.02±1.80 ($1.59, -33% cost), SkillAdam 68.95±0.74 ($1.96), and SkillOpt 70.25±0.03 ($1.86).",
      },
      evidence: { zh: "PR #16 合入并发布的 450 条测试轨迹、6 场景得分—成本对照表与评测报告。", en: "450 test trajectories, six-scenario score-cost comparison tables, and published report merged in PR #16." },
      issues: [42],
      references: [
        { label: { zh: "已发布评测报告 PR #16", en: "Published evaluation report PR #16" }, url: gdpevoEvalPr },
        { label: { zh: "公开榜单仓库 penguin-harness-leaderboard", en: "Public leaderboard repo penguin-harness-leaderboard" }, url: REPO.leaderboard },
      ],
    },
  ],
};

const gdpevoOntologyTransfer: TopicDefinition = {
  id: "gdpevo-ontology-codex-transfer",
  title: {
    zh: "跨 harness 进化效率对比实验",
    en: "Cross-Harness Evolution Efficiency Comparison Experiment",
  },
  phases: [
    {
      label: L.bench,
      state: "done",
      work: {
        zh: "复用 GDPEVO Essential 6 场景 30 训练 / 30 测试划分，统一跨框架自进化评测与计费口径（#40）。",
        en: "Reuse the GDPEVO Essential 30-train / 30-test split under a unified cross-harness evolution and cost protocol (#40).",
      },
      evidence: { zh: "已合入主干的 GDPEVO Essential 标准基准包（PR #5）。", en: "Merged GDPEVO Essential benchmark package (PR #5)." },
      issues: [40],
      references: [{ label: { zh: "基准 PR #5", en: "Benchmark PR #5" }, url: gdpevoBenchPr }],
    },
    {
      label: L.run,
      state: "active",
      work: {
        zh: "在相同 GDPEVO Essential 基准与模型配置下，以 PenguinHarness 四种 RSI 算法评测结果（#42 / PR #16）为参照基线，对比 Codex（#32 / PR #29）以及 Claude Code、DeepSeek Harness 与 Pi（#116）在 Default、OpenSkill、SkillAdam、SkillOpt、TRACE 等算法下的自进化提分幅度与单次测试成本。",
        en: "Using PenguinHarness's GDPEVO Essential evolution results (#42 / PR #16) as reference, compare self-evolution score gains and per-test costs across Codex (#32 / PR #29), Claude Code, DeepSeek Harness, and Pi (#116).",
      },
      evidence: { zh: "多 Harness 自进化轨迹、提分效率—成本对照表与跨框架进化评测报告。", en: "Multi-harness evolution trajectories, efficiency-cost comparison tables, and cross-harness evaluation report." },
      issues: [32, 116],
      references: [
        { label: { zh: "Codex 自进化评测 PR #29", en: "Codex evolution evaluation PR #29" }, url: codexGdpevoPr },
        { label: { zh: "PenguinHarness 基线评测 PR #16", en: "PenguinHarness baseline evaluation PR #16" }, url: gdpevoEvalPr },
        { label: { zh: "公开榜单仓库 penguin-harness-leaderboard", en: "Public leaderboard repo penguin-harness-leaderboard" }, url: REPO.leaderboard },
      ],
    },
  ],
};

const hleBenchPr = `${REPO.bench}/pull/27`;
const hleDiamondSkillOpt: TopicDefinition = {
  id: "hle-diamond-skillopt",
  title: {
    zh: "HLE 高难科学推理多轮自进化实验",
    en: "Multi-Round Self-Evolution on HLE Scientific Reasoning",
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
        zh: "固定 PenguinHarness 0.2.18 与 DeepSeek-V4.1-Flash-1017（low 思考档），在 25 道进化题上做 1 轮与 3 轮 SkillOpt 迭代并冻结，在 25 道测试题上各测 3 次（共 225 份答卷，#75、#113，PR #32），揭示异构难题上正负迁移相抵现象。",
        en: "Run 1 and 3 SkillOpt rounds on 25 HLE-Diamond train items and evaluate frozen skills 3 times each on 25 test items (225 runs, #75, #113, PR #32), highlighting positive/negative transfer cancellation on heterogeneous problems.",
      },
      evidence: { zh: "PR #32 提交的 225 份测试记录、逐题正负翻转矩阵与泛化边界实验报告。", en: "225 test records, per-item flip matrices, and the generalization boundary report in PR #32." },
      issues: [75, 113],
      references: [{ label: { zh: "实验记录与报告 PR #32", en: "Experiment records & report PR #32" }, url: hleEvalPr }],
    },
  ],
};

const rrsiPluginPr = `${REPO.harness}/pull/1535`;
const rrsiDatasetPr = `${REPO.bench}/pull/30`;
const rrsiEvalPr = `${REPO.bench}/pull/31`;
const rrsiCrossBenchTransfer: TopicDefinition = {
  id: "rrsi-cross-bench-transfer",
  title: {
    zh: "自进化提示词精简与跨基准迁移实验",
    en: "Prompt Regularization and Cross-Benchmark Transfer Experiment",
  },
  phases: [
    {
      label: L.bench,
      pending: P.accept,
      work: {
        zh: "固定 Terminal-Bench 2.1（#56）的 18 道进化题子集与 SWE-bench Verified（#30）的 100 道独立测试题子集（PR #30）。",
        en: "Pin an 18-task evolution subset from Terminal-Bench 2.1 (#56) and a 100-task held-out test subset from SWE-bench Verified (#30, PR #30).",
      },
      evidence: { zh: "PR #30 提交的跨基准固定题目划分与评测入口。", en: "Fixed cross-benchmark task splits and evaluation entry points in PR #30." },
      issues: [56, 30],
      references: [{ label: { zh: "固定子集基准 PR #30", en: "Subset benchmark PR #30" }, url: rrsiDatasetPr }],
    },
    {
      label: L.algo,
      work: {
        zh: "在 PenguinHarness 中集成正则化自进化算法 rrsi-rsi-toolkit（#35 / PR #1535，含 L0 修改预算、过拟合审查器与无增益组件剪枝）。",
        en: "Integrate the regularized self-evolution plugin rrsi-rsi-toolkit (#35 / PR #1535, featuring L0 modification budgets, overfitting critic, and pruning).",
      },
      evidence: { zh: "已合入主干的 RRSI 算法插件（PR #1535）。", en: "Merged RRSI algorithm plugin (PR #1535)." },
      issues: [35],
      references: [{ label: { zh: "RRSI 插件 PR #1535", en: "RRSI plugin PR #1535" }, url: rrsiPluginPr }],
    },
    {
      label: L.run,
      state: "active",
      work: {
        zh: "在 18 道终端题上演化 5 轮并冻结，跨基准在 100 道 SWE-bench Verified 上各测 2 轮（400 条记录，PR #31）：训练题由 83.33 升至 91.67，跨域测试总 Token 降低 38.69%。",
        en: "Evolve for 5 rounds on 18 Terminal-Bench tasks and evaluate twice on 100 SWE-bench Verified tasks (400 runs, PR #31): train score rose from 83.33 to 91.67 while cross-domain test tokens dropped by 38.69%.",
      },
      evidence: { zh: "PR #31 提交的 5 轮演化快照、400 条测试轨迹与跨基准评测报告。", en: "5-round evolution snapshots, 400 test trajectories, and the cross-benchmark report in PR #31." },
      references: [{ label: { zh: "跨基准实验与报告 PR #31", en: "Cross-benchmark experiment & report PR #31" }, url: rrsiEvalPr }],
    },
  ],
};

const multiDomainBenchPr = `${REPO.bench}/pull/3`;
const harnessCompPr = `${REPO.bench}/pull/21`;
const multiDomainHarnessComparison: TopicDefinition = {
  id: "multi-domain-harness-comparison",
  title: {
    zh: "同一模型在不同 harness 中的对比实验",
    en: "Comparing the Same Model Across Harnesses",
  },
  phases: [
    {
      label: L.bench,
      state: "done",
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
      state: "done",
      work: {
        zh: "固定 DeepSeek-V4.1-Flash-1017（max 思考档）与统一 MMSP（model-message-stream-protocol）流式消息/Trace/计价口径，在 PenguinHarness 0.2.17、DeepSeek Harness 0.2.1-rc.2、Pi 1.4.0、Codex 0.162.1 上各跑 3 轮（600 次测试，#43 / PR #21），量化底层 Harness 设计带来的原生能力与成本差距。",
        en: "Fix DeepSeek-V4.1-Flash-1017 (max thinking) and unified MMSP (model-message-stream-protocol) trace & pricing across PenguinHarness 0.2.17, DeepSeek Harness 0.2.1-rc.2, Pi 1.4.0, and Codex 0.162.1 for 3 rounds each (600 runs, #43 / PR #21).",
      },
      evidence: { zh: "PR #21 合入并发布的 600 条评测记录、五领域能力雷达与跨 Harness 基线报告。", en: "600 evaluation records, five-domain capability profiles, and the cross-harness baseline report published in PR #21." },
      issues: [43],
      references: [
        { label: { zh: "跨框架评测报告 PR #21", en: "Cross-harness evaluation report PR #21" }, url: harnessCompPr },
        { label: { zh: "MMSP 协议仓库 model-message-stream-protocol", en: "MMSP repo model-message-stream-protocol" }, url: REPO.mmsp },
        { label: { zh: "公开榜单仓库 penguin-harness-leaderboard", en: "Public leaderboard repo penguin-harness-leaderboard" }, url: REPO.leaderboard },
      ],
    },
  ],
};

const tbenchBenchPr = `${REPO.bench}/pull/33`;
const swebenchBenchPr = `${REPO.bench}/pull/25`;
const rrsiMarketPr = `${REPO.plugins}/pull/43`;
const dgmPluginPr = `${REPO.harness}/pull/1553`;
const reflexionPluginPr = `${REPO.harness}/pull/1555`;
const skillweaverPluginPr = `${REPO.harness}/pull/1690`;
const rsiagentPluginPr = `${REPO.plugins}/pull/20`;

const metaHarnessReproduction: TopicDefinition = {
  id: "meta-harness-reproduction",
  title: {
    zh: "RSI 算法复现准确度对比实验",
    en: "RSI Algorithm Reproduction Accuracy Comparison",
  },
  phases: [
    {
      label: L.bench,
      pending: P.accept,
      work: {
        zh: "对齐外部 RSI 算法原论文采用的评测基准与任务集——核心包括斯坦福 Meta-Harness（arXiv:2603.28052）与 RRSI 原论文使用的 Terminal-Bench 2.0 / 2.1（#56，已提基准 PR #33 与固定子集 PR #30）及 SWE-bench Verified（#30，已提基准 PR #25），同时复用 GDPEVO Essential（#40 / PR #5）作为通用业务评测基准。",
        en: "Align evaluation benchmarks used by external RSI papers—centered on Terminal-Bench 2.0 / 2.1 (#56, benchmark PR #33 & subset PR #30, used by Stanford Meta-Harness arXiv:2603.28052 and RRSI) and SWE-bench Verified (#30, benchmark PR #25), alongside GDPEVO Essential (#40 / PR #5).",
      },
      dataset: {
        zh: "Meta-Harness 原论文核心智能体基准为 Terminal-Bench 2.0（89 道 Docker 化真实终端任务，原论文实验产物仓 stanford-iris-lab/meta-harness-tbench2-artifact），辅以在线文本分类（LawBench / Symptom2Disease / USPTO-50k）与数学检索推理；社区 #56 已提交 Terminal-Bench 2.0 & 2.1 接入 PR #33（待审校合入）。",
        en: "Meta-Harness's primary agentic benchmark is Terminal-Bench 2.0 (89 Dockerized terminal tasks; artifact repo stanford-iris-lab/meta-harness-tbench2-artifact), alongside text classification and math retrieval; community issue #56 has submitted Terminal-Bench 2.0 & 2.1 integration PR #33 (open for review).",
      },
      evidence: {
        zh: "PR #33（Terminal-Bench 2.0/2.1）、PR #25（SWE-bench Verified）与 PR #30 提交的与原论文设定对齐的基准包及判分入口。",
        en: "Benchmark packages and scoring entry points aligned with original paper settings in PR #33 (Terminal-Bench 2.0/2.1), PR #25 (SWE-bench Verified), and PR #30.",
      },
      issues: [56, 30],
      references: [
        { label: { zh: "Terminal-Bench 2.0/2.1 基准 PR #33（在审）", en: "Terminal-Bench 2.0/2.1 benchmark PR #33 (open)" }, url: tbenchBenchPr },
        { label: { zh: "SWE-bench Verified 基准 PR #25（在审）", en: "SWE-bench Verified benchmark PR #25 (open)" }, url: swebenchBenchPr },
        { label: { zh: "Meta-Harness TerminalBench-2 原论文实验仓", en: "Meta-Harness TerminalBench-2 paper artifact repo" }, url: "https://github.com/stanford-iris-lab/meta-harness-tbench2-artifact" },
      ],
    },
    {
      label: L.algo,
      work: {
        zh: "在 PenguinHarness 中复现并集成外部前沿 RSI 算法：（1）已合入发布：RRSI（#35 / 主仓 PR #1535 + 插件仓 PR #43）及 ACE / APE / AWM / OPRO 基线包；（2）已提 PR 在审：Darwin Gödel Machine（#72 / PR #1553）、Reflexion（#73 / PR #1555）、SkillWeaver（#74 / PR #1690）与 RSIAgent（#34 / 插件仓 PR #20）；（3）已认领开发中：斯坦福 Meta-Harness（#58，基于历史候选源码、得分与执行轨迹的 Proposer Agent 外层元搜索，认领者已先提交配套基准 PR #33，算法本体迁移中）。",
        en: "Reproduce and integrate external RSI algorithms in PenguinHarness: (1) Merged & released: RRSI (#35 / PR #1535 + plugins PR #43) alongside ACE/APE/AWM/OPRO; (2) PR open for review: Darwin Gödel Machine (#72 / PR #1553), Reflexion (#73 / PR #1555), SkillWeaver (#74 / PR #1690), and RSIAgent (#34 / plugins PR #20); (3) Claimed & in development: Stanford Meta-Harness (#58, Proposer Agent outer meta-search; assignee submitted companion benchmark PR #33 while algorithm plugin is in progress).",
      },
      evidence: {
        zh: "已合入 penguin-harness-rsi-platform / penguin-harness-plugins 的 RRSI（PR #1535 / PR #43）等算法包，以及在审的 DGM（PR #1553）、Reflexion（PR #1555）、SkillWeaver（PR #1690）、RSIAgent（PR #20）和开发中的 Meta-Harness（#58）。",
        en: "Merged RRSI (PR #1535 / PR #43) toolkits in penguin-harness-rsi-platform & penguin-harness-plugins, open PRs for DGM (PR #1553), Reflexion (PR #1555), SkillWeaver (PR #1690), RSIAgent (PR #20), and in-progress Meta-Harness (#58).",
      },
      issues: [58, 35, 72, 73, 74, 34],
      references: [
        { label: { zh: "斯坦福 Meta-Harness 原论文 arXiv:2603.28052", en: "Stanford Meta-Harness paper arXiv:2603.28052" }, url: "https://arxiv.org/abs/2603.28052" },
        { label: { zh: "RRSI 已合入主仓 PR #1535", en: "Merged RRSI core PR #1535" }, url: rrsiPluginPr },
        { label: { zh: "RRSI 已合入插件商城 PR #43", en: "Merged RRSI marketplace PR #43" }, url: rrsiMarketPr },
        { label: { zh: "DGM 复现 PR #1553（在审）", en: "DGM reproduction PR #1553 (open)" }, url: dgmPluginPr },
        { label: { zh: "Reflexion 复现 PR #1555（在审）", en: "Reflexion reproduction PR #1555 (open)" }, url: reflexionPluginPr },
        { label: { zh: "SkillWeaver 复现 PR #1690（在审）", en: "SkillWeaver reproduction PR #1690 (open)" }, url: skillweaverPluginPr },
        { label: { zh: "RSIAgent 插件 PR #20（在审）", en: "RSIAgent plugin PR #20 (open)" }, url: rsiagentPluginPr },
      ],
    },
    {
      label: L.run,
      state: "active",
      work: {
        zh: "在对齐的原论文基准上检验各复现算法的提分幅度与复现准确度：其中 RRSI 已在 Terminal-Bench 2.1 + SWE-bench Verified 上完成 400 条评测（PR #31，训练分 83.33→91.67、测试 Token 降 38.69%）；待 Terminal-Bench 2.0（#56 / PR #33）与 Meta-Harness（#58）、DGM（#72）、Reflexion（#73）、SkillWeaver（#74）、RSIAgent（#34）合入后开展完整对照实验。",
        en: "Verify score gains and reproduction accuracy on aligned benchmarks: RRSI completed 400 runs on Terminal-Bench 2.1 + SWE-bench Verified (PR #31, train 83.33→91.67, test tokens -38.69%); full comparisons for Meta-Harness (#58) on Terminal-Bench 2.0 (#56 / PR #33) and DGM/Reflexion/SkillWeaver/RSIAgent await benchmark and plugin merge.",
      },
      evidence: {
        zh: "RRSI 复现评测记录（PR #31），以及 Meta-Harness（#58）等复现算法相对原论文指标与官方算法工具包（penguin-harness-rsi-platform）的对比实验报告。",
        en: "RRSI reproduction evaluation (PR #31) and full comparison reports against original paper metrics and official toolkits in penguin-harness-rsi-platform.",
      },
      references: [
        { label: { zh: "RRSI 跨基准复现评测 PR #31（在审）", en: "RRSI reproduction evaluation PR #31 (open)" }, url: rrsiEvalPr },
        { label: { zh: "自进化工作台与算法仓 penguin-harness-rsi-platform", en: "RSI platform & toolkit repo penguin-harness-rsi-platform" }, url: REPO.rsiPlatform },
      ],
    },
  ],
};

/* ---------- 5. Vertical App Center Plugins (垂域应用中心插件) ---------- */
function buildAppTopic(config: {
  id: string;
  title: TopicDefinition["title"];
  issues?: number[];
  protoWork: Text;
  protoEvidence: Text;
  protoRefs?: { label: Text; url: string }[];
  skillWork: Text;
  skillEvidence: Text;
  uiWork: Text;
  uiEvidence: Text;
  evalWork: Text;
  evalEvidence: Text;
}): TopicDefinition {
  const references = [
    ...(config.protoRefs ?? []),
    { label: { zh: "可选 App 与工作台源码仓 penguin-harness-apps", en: "Optional apps & workbench repo penguin-harness-apps" }, url: REPO.apps },
    { label: { zh: "插件商城目录仓 penguin-harness-plugins", en: "Plugin marketplace registry penguin-harness-plugins" }, url: REPO.plugins },
  ];
  return {
    id: config.id,
    title: config.title,
    phases: [
      {
        label: L.dev,
        state: config.issues?.length ? undefined : "planned",
        pending: P.dev,
        issues: config.issues,
        work: {
          zh: `${config.protoWork.zh} ${config.skillWork.zh} ${config.uiWork.zh}`,
          en: `${config.protoWork.en} ${config.skillWork.en} ${config.uiWork.en}`,
        },
        evidence: {
          zh: `${config.uiEvidence.zh} ${config.evalEvidence.zh}`,
          en: `${config.uiEvidence.en} ${config.evalEvidence.en}`,
        },
        references,
      },
    ],
  };
}

const appSuperAgentTaskTree = buildAppTopic({
  id: "app-super-agent-task-tree",
  issues: [128],
  title: {
    zh: "Super Agent 任务树与依赖看板",
    en: ["Super Agent Task Tree and ", "Dependency Board"],
  },
  protoRefs: [
    { label: { zh: "dshbook 第 11 章 AgentTeams 原型", en: "dshbook Ch.11 AgentTeams prototype" }, url: `${REPO.dshbook}/chapter11/` },
  ],
  protoWork: {
    zh: "基于 dshbook 第 11 章 AgentTeams 代码审查团队原型，定义队长拆解派发、成员并行执行卡片及 t1..t4 → t5 任务依赖 DAG 视图。",
    en: "Based on dshbook Ch.11 AgentTeams prototype, define leader decomposition, member execution cards, and the t1..t4 → t5 DAG dependency view.",
  },
  protoEvidence: {
    zh: "AgentTeams 活动面板交互原型（含进行中/等待依赖/已交付进度条与依赖高亮）。",
    en: "AgentTeams activity panel specification (progress bar, member status cards, and DAG dependency highlighting).",
  },
  skillWork: {
    zh: "对接 Super Agent 多角色协同与子代理调度接口，支持任务树节点状态订阅、前置依赖解锁唤醒与成果交叉核对汇总。",
    en: "Connect Super Agent multi-role coordination and subagent scheduling APIs for live node status streaming, dependency unlocking, and cross-check synthesis.",
  },
  skillEvidence: {
    zh: "支持任务树拆解、并行派发与依赖调度的 Super Agent 编排工具链。",
    en: "Super Agent orchestration toolchain supporting task tree decomposition, parallel dispatch, and dependency scheduling.",
  },
  uiWork: {
    zh: "在 penguin-harness-apps 构建「左侧 AgentTeams 子代理实时活动流 + 右侧任务树与依赖 DAG 拓扑图」双栏看板并登记至插件商城 penguin-harness-plugins，点击或悬停节点可查看上游阻塞项与已交付产物。",
    en: "Build a split-pane board in penguin-harness-apps with a sub-agent activity stream on the left and an interactive task dependency DAG on the right, registered in penguin-harness-plugins.",
  },
  uiEvidence: {
    zh: "可从应用中心安装运行的 Super Agent 任务树与 DAG 依赖看板工作台插件。",
    en: "Installable Super Agent task tree and DAG dependency board workbench plugin in the App Center.",
  },
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
  issues: [129],
  title: {
    zh: "兼容 LaTeX 的论文写作与编译工作台",
    en: "LaTeX-Compatible Paper Writing and Compilation Workbench",
  },
  protoRefs: [
    { label: { zh: "Overleaf 开源仓库 overleaf/overleaf", en: "Open-source Overleaf repo overleaf/overleaf" }, url: "https://github.com/overleaf/overleaf" },
    { label: { zh: "PenguinHarness 论文仓库 penguin-harness-paper", en: "PenguinHarness paper repo penguin-harness-paper" }, url: REPO.paper },
  ],
  protoWork: {
    zh: "围绕多文件 LaTeX 论文工程（如 penguin-harness-paper）并参考开源 Overleaf（overleaf/overleaf）架构，定义兼容标准 LaTeX/Overleaf 工程导入导出、AI 章节撰写润色、实验图表插入、结构化审稿批注与实时 PDF 编译的工作台流程。",
    en: "Grounded in multi-file LaTeX paper projects (such as penguin-harness-paper) and referencing open-source Overleaf (overleaf/overleaf), define the workflow for LaTeX/Overleaf project round-trip compatibility, AI drafting/polishing, figure integration, structured review findings, and live PDF compilation.",
  },
  protoEvidence: {
    zh: "包含多 .tex 章节、图表与 .bib 参考文献的完整论文样稿及工作台交互规范。",
    en: "A multi-file LaTeX sample project with sections, figures, and .bib references plus the workbench specification.",
  },
  skillWork: {
    zh: "借鉴开源 Overleaf 的编译与工程管理思路，封装多文件 LaTeX 编译与错误行号映射、AI 章节学术化润色与 BibTeX 整理、以及绑定到具体源文件与段落的结构化 AI 审稿批注。",
    en: "Drawing on open-source Overleaf's build and project model, package multi-file LaTeX compilation with line-mapped diagnostics, AI section polishing and BibTeX formatting, and structured AI review findings linked to source files and passages.",
  },
  skillEvidence: {
    zh: "可复用的 LaTeX 编译流水线、AI 润色 Diff 生成器及带源文定位的审阅记录。",
    en: "A reusable LaTeX build pipeline, AI diff generator, and review records with source locations.",
  },
  uiWork: {
    zh: "在 penguin-harness-apps 适配开源 Overleaf 的编辑与预览体验，支持无损导入导出标准 LaTeX / Overleaf 项目 ZIP 包、源码与编译 PDF 双栏同步预览、AI 撰写润色 Diff 对比、点击审稿意见跳转源码及一键应用修订，并在 penguin-harness-plugins 登记。",
    en: "Adapt open-source Overleaf editing/preview patterns in penguin-harness-apps to support lossless LaTeX/Overleaf ZIP import/export, side-by-side LaTeX & live PDF preview, AI drafting diffs, source navigation from review findings, and one-click revision application.",
  },
  uiEvidence: {
    zh: "可从应用中心安装的兼容 LaTeX 的论文写作与编译工作台插件。",
    en: "An installable LaTeX-compatible paper writing and compilation workbench plugin in the App Center.",
  },
  evalWork: {
    zh: "用多文件 LaTeX 论文样稿跑通 AI 润色/审阅、批注跳转源码、一键应用 Diff、PDF 重编译及与标准 LaTeX / Overleaf 工程的兼容往返验证。",
    en: "Verify AI polishing/review, finding-to-source navigation, one-click diff application, live PDF recompilation, and LaTeX/Overleaf round-trip compatibility on a multi-file sample paper.",
  },
  evalEvidence: {
    zh: "完整产出的 LaTeX 论文项目案例、演示录屏与编译验证记录。",
    en: "A complete LaTeX paper case study, walkthrough recording, and compilation verification log.",
  },
});

const appShortDramaStudio = buildAppTopic({
  id: "app-short-drama-studio",
  issues: [127],
  title: {
    zh: "AI 短剧分镜与视频生成工作台",
    en: ["AI Short Drama Storyboard ", "and Video Workbench"],
  },
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
    zh: "在 penguin-harness-apps 构建短剧创作工作台并在 penguin-harness-plugins 登记：支持导入示例剧本、编辑分镜列表、确认后逐镜生成视频、单镜头重做及按序预览导出 MP4。",
    en: "Build the Short Drama Workbench in penguin-harness-apps and register it in penguin-harness-plugins with script import, editable storyboard, per-shot regeneration, ordered preview, and MP4 export.",
  },
  uiEvidence: {
    zh: "可从 PenguinHarness 应用中心安装并运行的 AI 短剧分镜与视频生成工作台插件。",
    en: "An installable AI Short Drama Storyboard and Video Workbench plugin in the PenguinHarness App Center.",
  },
  evalWork: {
    zh: "用《纸箱小屋》流程或同等规模原创样例跑通单镜头重生成与 MP4 导出，核对其余已生成镜头保持原样。",
    en: "Verify single-shot regeneration and MP4 export on the Cardboard Cabin flow or an equivalent sample and check that the remaining clips are preserved.",
  },
  evalEvidence: {
    zh: "工作台源码 PR、插件登记 PR、可复跑样例说明及从应用中心安装到导出 MP4 的完整演示记录。",
    en: "Workbench source PR, plugin registry PR, reproducible sample guide, and a recording from App Center installation through MP4 export.",
  },
});

const appEcommerceStrategy = buildAppTopic({
  id: "app-ecommerce-strategy-workbench",
  issues: [130],
  title: {
    zh: "AI 电商选品与策略分析工作台",
    en: ["AI E-Commerce Selection ", "and Strategy Workbench"],
  },
  protoWork: {
    zh: "围绕商品经营表（售价、成本、销量、库存、转化）与用户评论语料，定义智能选品、评论痛点挖掘与促销策略推演的工作台流程。",
    en: "Centered on product operations tables (price, cost, sales, inventory, conversion) and customer reviews, define the workflow for product selection, pain-point mining, and promotion strategy simulation.",
  },
  protoEvidence: {
    zh: "包含商品经营数据与用户评价语料的测试样表及选品促销分析规范。",
    en: "A sample dataset combining product operations metrics and customer reviews plus the strategy analysis specification.",
  },
  skillWork: {
    zh: "校验经营字段并试算促销前后单位毛利与保本销量增幅；调用 Agent/大模型完成评论痛点聚类、选品排序推荐与高转化卖点文案生成，且结论关联原始数据行与评论证据。",
    en: "Validate operational metrics and simulate promotion margins/break-even lift; invoke the Agent/LLM for review pain-point clustering, candidate ranking, and selling-point copy with row/review provenance.",
  },
  skillEvidence: {
    zh: "带可核对计算口径的商品毛利试算器与评论痛点聚类/策略生成工具链。",
    en: "A margin simulator with verifiable calculations and an AI review clustering & strategy generation toolchain.",
  },
  uiWork: {
    zh: "在 penguin-harness-apps 构建工作台并在 penguin-harness-plugins 登记：支持导入经营表与评论样本、对比候选商品、试算促销折扣利润，调用 AI 生成并导出带数据与评论溯源依据的选品及营销策略报告。",
    en: "Build the workbench in penguin-harness-apps and register it in penguin-harness-plugins: import product tables and reviews, compare candidates, simulate promotion discounts, and export AI selection and marketing reports with traceable citations.",
  },
  uiEvidence: {
    zh: "可从应用中心安装的 AI 电商选品与策略分析工作台插件。",
    en: "Installable AI E-Commerce Selection and Strategy Workbench plugin in the App Center.",
  },
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
  issues: [131],
  title: {
    zh: "AI 市场投研与策略回测工作台",
    en: ["AI Market Research and ", "Strategy Backtesting Workbench"],
  },
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
    zh: "在 penguin-harness-apps 提供历史行情导入、自然语言/控件策略参数配置、K 线买卖信号与策略/基准净值回撤对比图、以及 AI 可溯源投研复盘报告生成与导出，并在 penguin-harness-plugins 登记。",
    en: "Provide historical price import, natural-language/UI strategy configuration, K-line buy/sell signal and equity/drawdown comparison charts, and traceable AI research report export in penguin-harness-apps, registered in penguin-harness-plugins.",
  },
  uiEvidence: {
    zh: "可从应用中心安装的 AI 市场投研与策略回测工作台插件。",
    en: "Installable AI market research and strategy backtesting workbench plugin in the App Center.",
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

const appHealthAssistant = buildAppTopic({
  id: "app-health-assistant",
  issues: [133],
  title: {
    zh: "AI 健康助手工作台",
    en: "AI Health Assistant Workbench",
  },
  protoWork: {
    zh: "结合 Personal Agent 主动提醒、长短期健康记忆与纵向体检指标追踪，定义个人与家庭健康管理工作台流程。",
    en: "Combine Personal Agent proactive reminders, persistent health memory, and longitudinal biomarker tracking into a personal health workbench workflow.",
  },
  protoEvidence: {
    zh: "涵盖体检报告结构化、纵向指标趋势与主动健康干预的场景定义。",
    en: "Scenario specification covering checkup report extraction, longitudinal biomarker trends, and proactive reminders.",
  },
  skillWork: {
    zh: "实现体检报告结构化指标抽取、跨年度异常指标纵向对比、饮食运动打卡记忆沉淀及定时用药/复查主动提醒核心能力，AI 健康建议均绑定具体历史体检项与打卡记录。",
    en: "Implement structured checkup biomarker extraction, multi-year anomaly trend analysis, diet/exercise memory logging, and scheduled medication/checkup reminders with traceable health advice.",
  },
  skillEvidence: {
    zh: "具备本地隐私保护、长短期健康记忆与定时触发能力的健康助手工具链。",
    en: "Privacy-preserving health assistant toolchain with persistent health memory and scheduled proactive triggers.",
  },
  uiWork: {
    zh: "在 penguin-harness-apps 实现健康助手工作台并在 penguin-harness-plugins 登记：提供关键生理指标趋势图表、异常项 AI 解读卡片、每日健康打卡日历与提醒配置面板。",
    en: "Implement the Health Assistant Workbench in penguin-harness-apps and register it in penguin-harness-plugins with biomarker trend charts, AI anomaly explanations, daily logs, and reminder settings.",
  },
  uiEvidence: {
    zh: "可从应用中心安装的 AI 健康助手工作台插件。",
    en: "Installable AI Health Assistant workbench plugin in the App Center.",
  },
  evalWork: {
    zh: "用跨年度脱敏体检样表与打卡记录验证指标趋势计算、跨会话健康记忆召回准确率及主动提醒触发。",
    en: "Validate biomarker trend calculation, cross-session health history recall, and reminder triggers on multi-year anonymized checkup samples and logs.",
  },
  evalEvidence: {
    zh: "脱敏体检纵向追踪演示案例、预期趋势核对表与演示录屏。",
    en: "Anonymized longitudinal health tracking sample, expected trend verification table, and walkthrough recording.",
  },
});

const appDigitalSecretaryPoster = buildAppTopic({
  id: "app-digital-secretary-design",
  title: {
    zh: "AI 海报与概念图设计工作台",
    en: ["AI Poster and Concept ", "Diagram Workbench"],
  },
  protoRefs: [
    { label: { zh: "dshbook 第 7 章《制作活动海报》", en: "dshbook Ch.7 Event Poster Design" }, url: `${REPO.dshbook}/chapter7/` },
    { label: { zh: "dshbook 第 13 章《通过自进化画出概念图》", en: "dshbook Ch.13 Self-Evolving Concept Diagrams" }, url: `${REPO.dshbook}/chapter13/` },
  ],
  protoWork: {
    zh: "参考 dshbook 第 7 章活动海报排版与第 13 章概念图多轮绘制案例，定义从文字需求或论文方法描述生成可编辑海报与架构概念图的工作台流程。",
    en: "Based on dshbook Ch.7 poster layout and Ch.13 iterative concept diagram workflows, define a workbench flow from text briefs or method descriptions to editable posters and architecture diagrams.",
  },
  protoEvidence: {
    zh: "dshbook 活动海报版式模板与 SVG 概念图「生成→视觉自检→多轮迭代」原型。",
    en: "Poster layout templates and SVG generation → visual check → multi-round refinement prototypes from dshbook.",
  },
  skillWork: {
    zh: "封装版式构图规划、SVG/HTML 矢量画布生成及基于视觉反馈的多轮排版修订 Skill，支持局部元素调整与高分辨率导出。",
    en: "Package Skills for layout planning, SVG/HTML vector canvas generation, and vision-guided iterative layout refinement with element-level editing and high-resolution export.",
  },
  skillEvidence: {
    zh: "支持多轮视觉自检与局部重绘的海报及概念图生成工具链。",
    en: "Poster and concept diagram generation toolchain supporting multi-round visual checks and local redrawing.",
  },
  uiWork: {
    zh: "在 penguin-harness-apps 实现海报与概念图设计工作台并在 penguin-harness-plugins 登记：提供需求与风格配置面板、多轮演化版本对比画布、源码/图层微调及 PNG/SVG/PDF 导出。",
    en: "Build the Poster and Concept Diagram Workbench in penguin-harness-apps and register it in penguin-harness-plugins with brief/style controls, multi-round comparison canvas, layer/source tweaking, and PNG/SVG/PDF export.",
  },
  uiEvidence: {
    zh: "可从应用中心安装的 AI 海报与概念图设计工作台插件。",
    en: "Installable AI Poster and Concept Diagram Workbench plugin in the App Center.",
  },
  evalWork: {
    zh: "用活动海报与科研架构图样例跑通多轮视觉自检迭代与局部修改，核对文字可读性、对齐规范与导出产物完整性。",
    en: "Verify multi-round visual refinement and local editing on event poster and architecture diagram samples, checking text legibility, alignment, and export fidelity.",
  },
  evalEvidence: {
    zh: "海报与概念图多轮迭代样例、版本对比截图及完整演示录屏。",
    en: "Multi-round poster and concept diagram samples, version comparison snapshots, and walkthrough recording.",
  },
});

/* ---------- Routes ---------- */
const publishedAppProjects = [
  appSuperAgentTaskTree,
  appOverleafPaper,
  appShortDramaStudio,
  appEcommerceStrategy,
  appMarketResearchQuant,
  appHealthAssistant,
];

const routeProjects: Record<RouteId, ProjectDefinition[]> = {
  infra: [autoResearch, ascendInference, qwenPostTraining, solExecBenchErnie],
  "auto-bench": [turingBenchWritingRealism],
  agent: [contextCompactionHandoff, personalAgentComputerUse, companyModeCoordination],
  platform: [
    { ...gdpevoSkillEvolution, followUp: gdpevoOntologyTransfer },
    multiDomainHarnessComparison,
    metaHarnessReproduction,
  ],
  apps: publishedAppProjects,
};

const empty = { zh: "待填写", en: "To be filled in" };
const blankPhases = trainingPhases.map(({ label }) => ({ label, work: empty, evidence: empty }));

export function researchRoutes(quests: QuestItem[], locale: Locale) {
  const byIssue = new Map(quests.map((q) => [q.issueNumber, q]));
  const stageOrder: Record<StageState, number> = { done: 0, active: 1, open: 2, planned: 3 };
  const stageDetails = (phase: Phase) => {
    const tasks = (phase.issues ?? []).map((number) => ({ number, quest: byIssue.get(number) }));
    const state: StageState = phase.state ?? (
      tasks.length > 0 && tasks.every(({ quest }) => quest?.status === "completed") ? "done"
        : tasks.some(({ quest }) => quest?.status === "in_progress" || quest?.status === "completed") ? "active"
        : tasks.some(({ quest }) => quest?.status === "open") ? "open"
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
    const rawStages = phases.map(stageDetails);
    const benchIndex = phases.findIndex((phase) => phase.label === L.bench);
    if (benchIndex >= 0 && rawStages[benchIndex]?.state !== "done") {
      for (let i = 0; i < rawStages.length; i++) {
        if (i !== benchIndex && rawStages[i].state === "done") rawStages[i].state = "active";
      }
    }
    const stages = topic.phases === undefined
      ? rawStages
      : [...rawStages].sort((a, b) => stageOrder[a.state] - stageOrder[b.state]);
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
  return (Object.keys(routeTitles) as RouteId[]).map((id) => ({
    id,
    title: resolveText(routeTitles[id], locale),
    projects: (routeProjects[id] ?? []).map((project) => {
      const resolved = topicDetails(project);
      const completed = !resolved.template && resolved.stages.every((stage) => stage.state === "done");
      return {
        ...resolved,
        followUp: project.followUp
          ? topicDetails(project.followUp, completed ? "unlocked" : "locked")
          : undefined,
      };
    }),
  }));
}

export type ResearchRoute = ReturnType<typeof researchRoutes>[number];
export type ResearchProject = Omit<ResearchRoute["projects"][number], "followUp">;
