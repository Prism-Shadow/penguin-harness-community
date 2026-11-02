# RFC-0002 Evaluation

- Feature Name: `evaluation`
- Start Date: 2026-10-29
- RFC PR: [#14](https://github.com/Prism-Shadow/penguin-harness-community/pull/14)
- Updated by: [#15](https://github.com/Prism-Shadow/penguin-harness-community/pull/15), [#21](https://github.com/Prism-Shadow/penguin-harness-community/pull/21)

[English](RFC-0002-evaluation.md)

Evaluation 是一个 Agent 的一组实验数据，使用 `<experiment-id>` 来区分。一组实验通常可以分成多个实验阶段（phase），例如训练、验证和测试（如 `train-1`、`val-1`、`train-2`、`val-2`、`test`），其中 `train` 和 `val` 后面**必须跟数字**（如 `train-1`、`val-1`），`test` 后面**一定不能跟数字**，且每组实验数据必须包含 `test` 测试阶段。

我们同样构建并复用 [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) 开源仓库来整理所有的 Agent Evaluation。本标准定义的 Evaluation 数据结构旨在统一不同实验与自进化阶段的结果记录格式，便于实验复现、横向对比与榜单汇总。

## 目录结构

每组实验数据按照所属榜单 `<leaderboard-id>` 分类收纳在 `experiments/<leaderboard-id>/<experiment-id>/` 目录下，仓库的文件组织格式如下：

```text
penguin-harness-benchmark/
└── experiments/
    └── <leaderboard-id>/
        └── <experiment-id>/
            ├── train-1/
            │   ├── attempt-1.yaml
            │   ├── attempt-2.yaml
            │   └── summary.yaml
            ├── test/
            │   ├── attempt-1.yaml
            │   ├── attempt-2.yaml
            │   ├── attempt-3.yaml
            │   └── summary.yaml
            └── meta_info.yaml
```

- `experiments/<leaderboard-id>/<experiment-id>/`：存放所属 `<leaderboard-id>` 下单组实验的元配置及各阶段评测结果。
- `<phase>/`（如 `train-1/`、`val-1/`、`test/`）：实验阶段文件夹。训练和验证阶段命名后面**必须跟数字**以标识迭代轮次（如 `train-1`、`val-1`、`train-2`、`val-2`）；最终测试阶段固定命名为 `test`（后面**一定不能跟数字**），且每组实验必须包含 `test/` 阶段。
- `meta_info.yaml`：记录整组实验的元信息与配置（模型、Harness、RSI 算法、数据集划分及作者信息）。
- `summary.yaml`：记录对应阶段聚合后的得分统计、耗时、Token 消耗与费用成本。
- `attempt-<n>.yaml`：记录对应阶段第 `n` 次重复试验在每道题目（Task）上的细粒度评测数据。

## 添加 Evaluation

要向仓库中添加一组新的 Evaluation 实验数据，请按以下步骤组织文件：

1. 创建 `experiments/<leaderboard-id>/<experiment-id>` 文件夹，并在其下创建 `meta_info.yaml` 配置文件：

```yaml
experiment_id: "<experiment-id>"        # 必填。实验唯一标识，必须与文件夹名称一致
status: "draft"                         # 必填。状态：提交时为 draft，审核通过后为 published
submit_time: "2026-10-29T12:00:00Z"     # 必填。提交时间，精确到秒（ISO 8601 UTC 时间）
harness_name: "PenguinHarness"          # 必填。所使用的 Harness 名称
harness_version: "0.2.16"               # 必填。Harness 版本号，采用标准的 x.y.z 格式
harness_setting:                        # 选填。Harness 附加配置项（任意键值对象）
  max_turns: 100
model_name: "deepseek-flash-1017"       # 必填。模型名称（如 deepseek-flash 等模型需附带具体版本号）
model_provider: "deepseek"              # 必填。模型提供商
thinking_level: "high"                  # 必填。推理等级：low | medium | high | xhigh | max
algorithm: "<plugin-id>"                # 选填。所使用的 RSI 算法插件 ID（必须是合法的 plugin_id）
training_data:                          # 选填。联合训练的训练集 benchmark-id 列表
  - "penguinharness-benchmark-gdpevo-essential-court-clerk-operations-train"
validation_data:                        # 选填。联合验证的验证集 benchmark-id 列表
  - "penguinharness-benchmark-gdpevo-essential-court-clerk-operations-val"
test_data:                              # 必填。联合评估的测试集 benchmark-id 列表
  - "penguinharness-benchmark-gdpevo-essential-court-clerk-operations-test"
references:                             # 选填。原始引用链接列表（如实验结果来源论文、榜单或报告链接）
  - "https://arxiv.org/abs/..."
author:                                 # 必填。作者与提交者信息
  name: "Author Name"                   # 必填。作者姓名或团队名称
  email: "author@example.com"           # 选填。联系邮箱
  homepage: "https://github.com/..."    # 选填。作者主页链接（默认可填 GitHub 主页）
```

### `meta_info.yaml` 字段说明

必填字段：

- `experiment_id` — 实验的唯一标识符，必须与所在的 `<experiment-id>` 文件夹名称完全一致，仅允许包含字母、数字和连字符 `-`（不允许下划线）。
- `status` — 当前状态，提交时默认为 `"draft"`，通过审核后为 `"published"`。
- `submit_time` — 实验提交时间，采用精确到秒的 ISO 8601 UTC 时间格式（例如 `"2026-10-29T12:00:00Z"`）。
- `harness_name` — 所使用的 Agent Harness 名称（字符串）。
- `harness_version` — Harness 版本号，采用标准的 `x.y.z` 格式（例如 `"0.2.16"`）。
- `model_name` — 评测所使用的基座模型名称（字符串）。若使用 `deepseek-flash` 等会随时间更新权重的模型，**必须附带具体的版本号后缀**（例如填写 `"deepseek-flash-1017"`），以保证实验结果的可复现性。
- `model_provider` — 模型提供商标识（字符串，例如 `"deepseek"`、`"google"`）。
- `thinking_level` — 模型推理思考等级，取值为 `"low"`、`"medium"`、`"high"`、`"xhigh"` 或 `"max"`。
- `test_data` — 测试集列表（字符串数组），每个元素必须是合法的 `benchmark-id`。
- `author` — 作者信息对象，其中 `author.name`（作者姓名或团队名称）为必填。

选填字段：

- `harness_setting` — Harness 的自定义运行参数或配置对象（任意键值结构）。
- `algorithm` — 实验所使用的 RSI 算法插件标识符（字符串），必须是合法的 `plugin_id`。
- `training_data` — 训练集列表（字符串数组），每个元素必须是合法的 `benchmark-id`。
- `validation_data` — 验证集列表（字符串数组），每个元素必须是合法的 `benchmark-id`。
- `references` — 原始引用链接列表（字符串数组），用于存放该组 Evaluation 实验数字或评测设置的原始出处（如相关论文链接、技术报告或公开榜单地址）。
- `author.email` — 作者联系邮箱。
- `author.homepage` — 作者主页链接（默认可填写 GitHub 主页链接）。

### 多数据集联合训练与拆分规范

在单个实验（`<experiment-id>`）的 `meta_info.yaml` 中：
- **填写多个数据集代表合并训练与评估**：如果 `training_data`、`validation_data` 或 `test_data` 中列出了多个 `benchmark-id`，代表这些数据集在该实验中**必须合并在一起作为统一集合进行训练、验证和评估，绝不能分开独立运行**。
- **分开独立训练与评估必须拆分为多个 Experiment**：如果实验协议要求在不同子基准（Sub-benchmark / Task Group）上**分别独立训练、独立评估**（例如 [GDPevo](https://arxiv.org/pdf/2608.03764) 的六个子基准各自独立进化、互不共享状态），则**必须像 [penguin-harness-benchmark#18](https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/18) 一样，将每个子基准拆分为独立的 `<experiment-id>` 文件夹**（每个 `<experiment-id>` 只包含单个子基准的 `*-train` 与 `*-test`），再通过 [RFC-0005 Leaderboard](RFC-0005-leaderboard.zh.md) 将多个 `<experiment-id>` 的结果聚合计算。

2. 在每个实验阶段文件夹 `experiments/<leaderboard-id>/<experiment-id>/<phase>/`（`train`、`val` 后必须跟数字，如 `train-1/`、`val-1/`；`test` 后一定不能跟数字，且必须包含 `test/`）下创建 `summary.yaml` 阶段汇总文件：

```yaml
time: "2026-10-29T12:00:00Z"            # 必填。阶段实验完成时间（ISO 8601 UTC 时间）
summary: "Improved prompt and skills."  # 选填。英文阶段总结（如记录本次实验改进了什么）
summary_zh: "优化了提示词与技能库。"      # 选填。中文阶段总结
score_mean: 72.5                        # 必填。阶段平均分
score_std: 1.8                          # 必填。样本标准差
pass@k: 60.0                            # 选填。n 次实验中至少通过一次的题目百分比（不计算标准差）
n_attempt: 3                            # 必填。重复试验次数
cost: 4.25                              # 必填。单次实验费用成本（美元，按 MMSP 目录价计算）
duration_ms: 540000                     # 必填。单次实验总耗时（毫秒）
n_input_tokens: 1250000                 # 必填。单次实验总输入 Token 数（包含缓存）
n_cache_tokens: 980000                  # 必填。单次实验总缓存 Token 数
n_output_tokens: 85000                  # 必填。单次实验总输出 Token 数
```

### `summary.yaml` 字段说明

必填字段：

- `time` — 该阶段实验记录的时间，采用精确到秒的 ISO 8601 UTC 时间格式（例如 `"2026-10-29T12:00:00Z"`）。
- `score_mean` — 该阶段多次重复试验的平均分（先计算单次实验总分，再对多次重复试验取均值）。
- `score_std` — 该阶段多次重复试验得分的样本标准差。
- `n_attempt` — 该阶段的重复试验次数（正整数，与目录下的 `attempt-<n>.yaml` 文件数量一致，通常 $n = 3$）。
- `cost` — 单次实验的费用成本（单位：美元），统一按照 [MMSP 模型目录价](https://mmsp.penguin.ooo/zh/models/) 计算。
- `duration_ms` — 单次实验的总耗时（单位：毫秒）。
- `n_input_tokens` — 单次实验的总输入 Token 数（包含命中缓存的 Token 数）。
- `n_cache_tokens` — 单次实验的总缓存命中 Token 数。
- `n_output_tokens` — 单次实验的总输出 Token 数。

选填字段：

- `pass@k` — $k$ 次尝试中至少通过一次的题目百分比（$k = \text{n\_attempt}$）。
- `summary` — 英文阶段摘要，例如记录该阶段实验相较上一阶段改进了什么。
- `summary_zh` — 中文阶段摘要。

### 得分计算公式

设当前阶段共有 $M$ 道题目（$i = 1, \dots, M$），重复进行了 $n = \text{n\_attempt}$ 次独立实验（$j = 1, \dots, n$，通常 $n = 3$），记第 $i$ 道题目在第 $j$ 次实验（`attempt-j.yaml`）中的得分为 $s_{i,j}$：

1. **单次实验总分（$S_j$）**：先汇总计算第 $j$ 次实验在全部 $M$ 道题目上的总得分（或百分制均分）：

$$S_j = \frac{1}{M} \sum_{i=1}^{M} s_{i,j}$$

2. **平均分（`score_mean`）与样本标准差（`score_std`）**：基于 $n$ 次实验（例如 3 次实验）的总分 $S_1, S_2, \dots, S_n$，计算算术平均值与样本标准差：

$$\text{score\_mean} = \bar{S} = \frac{1}{n} \sum_{j=1}^{n} S_j$$

$$\text{score\_std} = \sqrt{\frac{1}{n - 1} \sum_{j=1}^{n} \left(S_j - \bar{S}\right)^2}$$

3. **选填的 `pass@k`（$k = n$）**：每道题在 $k$ 次尝试中至少通过一次，记 $\mathbb{I}_i = 1$，否则为 $0$。对全部 $M$ 道题计算通过百分比，不计算标准差：

$$\text{pass@}k = \frac{100}{M} \sum_{i=1}^{M} \mathbb{I}_i$$

3. 在每个实验阶段文件夹 `experiments/<leaderboard-id>/<experiment-id>/<phase>/` 下创建每次重复试验的细粒度结果文件 `attempt-<n>.yaml`（如 `attempt-1.yaml`、`attempt-2.yaml`），文件内容为一个对象数组：

```yaml
- source:                                                 # 必填。题目来源
    - benchmark_id: "penguinharness-benchmark-gdpevo-crm-test" # 必填。所属 Benchmark ID
      task_id: "CASE-001-account-renewal"                   # 必填。题目 ID
  time: "2026-10-29T12:00:00Z"                             # 必填。单题完成时间（ISO 8601 UTC 时间）
  score: 85.0                                              # 必填。单题得分
  cost: 0.42                                               # 必填。单题费用成本（美元）
  duration_ms: 52000                                       # 必填。单题运行耗时（毫秒）
  n_input_tokens: 125000                                   # 必填。单题总输入 Token 数（包含缓存）
  n_cache_tokens: 98000                                    # 必填。单题总缓存 Token 数
  n_output_tokens: 8500                                    # 必填。单题总输出 Token 数
  trace_filepath: "traces/attempt-1/CASE-001.jsonl"        # 选填。运行轨迹文件路径
  error_reason: ""                                         # 选填。当前题目出错的原因
```

### `attempt-<n>.yaml` 字段说明

数组中的每个元素对应一道或多道题目在当次试验中的评测记录，包含以下字段：

必填字段：

- `source` — 本条记录涉及的题目列表，每项包含必填的 `benchmark_id` 和 `task_id`。例如，同一次训练包含多道题时，将这些题目逐项列入该数组。
- `time` — 该题在当次试验中完成记录的时间，采用精确到秒的 ISO 8601 UTC 时间格式（例如 `"2026-10-29T12:00:00Z"`）。
- `score` — 该题在当次试验中的得分。
- `cost` — 该题在当次试验中的费用成本（单位：美元，按 [MMSP 模型目录价](https://mmsp.penguin.ooo/zh/models/) 计算）。
- `duration_ms` — 该题在当次试验中的运行耗时（单位：毫秒）。
- `n_input_tokens` — 该题在当次试验中的总输入 Token 数（包含命中缓存的 Token 数）。
- `n_cache_tokens` — 该题在当次试验中的总缓存命中 Token 数。
- `n_output_tokens` — 该题在当次试验中的总输出 Token 数。

选填字段：

- `trace_filepath` — 该题运行轨迹（Trace）文件的相对路径或存档路径。
- `error_reason` — 记录当前题目运行或评分出错的原因（字符串）。

## GDPevo 评估与拆分方法

在评估自进化算法时，推荐使用 [GDPevo](https://arxiv.org/pdf/2608.03764)（如 `GDPevo-essential` 子集）。`GDPevo-essential` 按不同业务场景划分为六个独立的**子基准（Sub-benchmark）**（`court-clerk-operations`、`coverage-review`、`engineering-portfolio-analytics`、`financial-control`、`portfolio-management`、`service-ticket-resolution`），每个子基准均包含配对的训练集（`*-train`）和测试集（`*-test`）：

1. **按子基准拆分为独立 Experiment**：因为不同子基准之间的训练与评估相互隔离（不能合并在一起训练），每种方法在每个子基准上的实验**必须拆分为独立的 `<experiment-id>` 文件夹**（参见 [penguin-harness-benchmark#18](https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/18)）。例如对于第 $g$ 个子基准（$g = 1, \dots, 6$），在其独立 `<experiment-id>` 中记录 `train-1`、`train-2` 等训练阶段以及最终在对应 `*-test` 上的 `test` 评估阶段。
2. **通过 Leaderboard 表达式跨子基准聚合**：单个 `<experiment-id>` 的 `summary.yaml` 仅计算该子基准自身的统计量；六个子基准测试集结果的算术平均与合成样本标准差统一在 [RFC-0005 Leaderboard](RFC-0005-leaderboard.zh.md) 中通过表达式引用计算。
