# RFC-0002 Evaluation

[English](RFC-0002-evaluation.md)

Evaluation 是一个 Agent 的一组实验数据，使用 `<experiment-id>` 来区分。一组实验通常可以分成多个实验阶段（phase），例如训练、验证和测试（如 `train-1`、`val-1`、`train-2`、`val-2`、`test`），其中 `test` 后面一定不能跟数字，且每组实验数据必须包含 `test` 测试阶段。

我们同样构建并复用 [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) 开源仓库来整理所有的 Agent Evaluation。本标准定义的 Evaluation 数据结构旨在统一不同实验与自进化阶段的结果记录格式，便于实验复现、横向对比与榜单汇总。

## 目录结构

每组实验数据存放在 `experiments/<experiment-id>/` 目录下，仓库的文件组织格式如下：

```text
penguin-harness-benchmark/
└── experiments/
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

- `experiments/<experiment-id>/`：存放单组实验的元配置及各阶段评测结果。
- `<phase>/`（如 `train-1/`、`val-1/`、`test/`）：实验阶段文件夹。训练和验证阶段可按迭代轮次编号（如 `train-1`、`val-1`、`train-2`、`val-2`），最终测试阶段固定命名为 `test`（后不能跟数字），且每组实验必须包含 `test/` 阶段。
- `meta_info.yaml`：记录整组实验的元信息与配置（模型、Harness、RSI 算法、数据集划分及作者信息）。
- `summary.yaml`：记录对应阶段聚合后的得分统计、耗时、Token 消耗与费用成本。
- `attempt-<n>.yaml`：记录对应阶段第 `n` 次重复试验在每道题目（Task）上的细粒度评测数据。

## 添加 Evaluation

要向仓库中添加一组新的 Evaluation 实验数据，请按以下步骤组织文件：

1. 创建 `experiments/<experiment-id>` 文件夹，并在其下创建 `meta_info.yaml` 配置文件：

```yaml
experiment_id: "<experiment-id>"        # 必填。实验唯一标识，必须与文件夹名称一致
status: "draft"                         # 必填。状态：提交时为 draft，审核通过后为 published
submit_time: "2026-10-29T12:00:00Z"     # 必填。提交时间，精确到秒（ISO 8601 UTC 时间）
harness_name: "PenguinHarness"          # 必填。所使用的 Harness 名称
harness_version: "0.2.16"               # 必填。Harness 版本号，采用标准的 x.y.z 格式
harness_setting:                        # 选填。Harness 附加配置项（任意键值对象）
  max_turns: 100
model_name: "gemini-2.5-pro"            # 必填。模型名称
model_provider: "google"                # 必填。模型提供商
thinking_level: "high"                  # 必填。推理等级：low | medium | high | xhigh | max
algorithm: "<plugin-id>"                # 选填。所使用的 RSI 算法插件 ID（必须是合法的 plugin_id）
training_data:                          # 选填。训练集 benchmark-id 列表
  - "penguinharness-benchmark-gdpevo-crm-train"
validation_data:                        # 选填。验证集 benchmark-id 列表
  - "penguinharness-benchmark-gdpevo-crm-val"
test_data:                              # 必填。测试集 benchmark-id 列表
  - "penguinharness-benchmark-gdpevo-crm-test"
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
- `model_name` — 评测所使用的基座模型名称（字符串）。
- `model_provider` — 模型提供商标识（字符串）。
- `thinking_level` — 模型推理思考等级，取值为 `"low"`、`"medium"`、`"high"`、`"xhigh"` 或 `"max"`。
- `test_data` — 测试集列表（字符串数组），每个元素必须是合法的 `benchmark-id`。
- `author` — 作者信息对象，其中 `author.name`（作者姓名或团队名称）为必填。

选填字段：

- `harness_setting` — Harness 的自定义运行参数或配置对象（任意键值结构）。
- `algorithm` — 实验所使用的 RSI 算法插件标识符（字符串），必须是合法的 `plugin_id`。
- `training_data` — 训练集列表（字符串数组），每个元素必须是合法的 `benchmark-id`。
- `validation_data` — 验证集列表（字符串数组），每个元素必须是合法的 `benchmark-id`。
- `author.email` — 作者联系邮箱。
- `author.homepage` — 作者主页链接（默认可填写 GitHub 主页链接）。

2. 在每个实验阶段文件夹 `experiments/<experiment-id>/<phase>/`（如 `train-1/`、`test/`，其中必须包含 `test/` 且 `test` 后不能跟数字）下创建 `summary.yaml` 阶段汇总文件：

```yaml
time: "2026-10-29T12:00:00Z"            # 必填。阶段实验完成时间（ISO 8601 UTC 时间）
summary: "Improved prompt and skills."  # 选填。英文阶段总结（如记录本次实验改进了什么）
summary_zh: "优化了提示词与技能库。"      # 选填。中文阶段总结
score_mean: 72.5                        # 必填。阶段平均分
score_std: 1.8                          # 必填。样本标准差
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
- `score_mean` — 该阶段多次重复试验的平均分。
- `score_std` — 该阶段多次重复试验得分的样本标准差。
- `n_attempt` — 该阶段的重复试验次数（正整数，与目录下的 `attempt-<n>.yaml` 文件数量一致）。
- `cost` — 单次实验的费用成本（单位：美元），统一按照 [MMSP 模型目录价](https://mmsp.penguin.ooo/zh/models/) 计算。
- `duration_ms` — 单次实验的总耗时（单位：毫秒）。
- `n_input_tokens` — 单次实验的总输入 Token 数（包含命中缓存的 Token 数）。
- `n_cache_tokens` — 单次实验的总缓存命中 Token 数。
- `n_output_tokens` — 单次实验的总输出 Token 数。

选填字段：

- `summary` — 英文阶段摘要，例如记录该阶段实验相较上一阶段改进了什么。
- `summary_zh` — 中文阶段摘要。

3. 在每个实验阶段文件夹 `experiments/<experiment-id>/<phase>/` 下创建每次重复试验的细粒度结果文件 `attempt-<n>.yaml`（如 `attempt-1.yaml`、`attempt-2.yaml`），文件内容为一个对象数组：

```yaml
- benchmark_id: "penguinharness-benchmark-gdpevo-crm-test" # 必填。所属 Benchmark ID
  task_id: "CASE-001-account-renewal"                      # 必填。题目 ID
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

数组中的每个元素对应一道题目在当次试验中的评测记录，包含以下字段：

必填字段：

- `benchmark_id` — 题目所属的 Benchmark 唯一标识符（`benchmark-id`）。
- `task_id` — 题目的唯一标识符（`task-id`）。
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
