# RFC-0005 Leaderboard

- Feature Name: `leaderboard`
- Start Date: 2026-10-30
- RFC PR: [#23](https://github.com/Prism-Shadow/penguin-harness-community/pull/23)
- Updated by: N/A

[English](RFC-0005-leaderboard.md)

Leaderboard（榜单）用于将一组或多组 [RFC-0002 Evaluation](RFC-0002-evaluation.zh.md) 实验结果聚合为可视化统计图表。我们同样使用 [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) 开源仓库来存放所有的 Leaderboard 定义文件，本 RFC 仅负责规定 Leaderboard 的数据格式规范。

参考 [Terminal-Bench (tbench.ai)](https://www.tbench.ai/) 的展示形式，每个 Leaderboard 包含元信息文件 `meta_info.yaml` 以及三种可选的统计图配置：**排行榜表格（`table.yaml`）**、**帕累托前沿图（`pareto.yaml`）**和**华夫饼网格图（`waffle.yaml`）**。

## 核心设计原则

1. **只存 ID 引用与 `values` 计算表达式，不存计算结果**：Leaderboard 配置文件中**仅包含对 `experiment_id`、实验阶段（如 `train-1`、`test`）及指标字段的引用和计算表达式，绝不直接存储计算后的分值或标准差数字**。所有数值均在渲染时通过查找 `experiments/<leaderboard-id>/<experiment-id>/<phase>/summary.yaml`（及 `attempt-<n>.yaml`）实时计算。
2. **仅配置 `values`，自动提取 `(Harness, Model, Algorithm, Phase)`**：三种图表均**不需要写 `rows` 或 `columns`，也不需要手动写出 `(harness_name, model_name, algorithm, phase)` 的叉乘组合**。只需在 `values` 列表中给出每个参赛条目的计算表达式，渲染器会自动读取该表达式所引用的 `experiments/<leaderboard-id>/<experiment-id>/meta_info.yaml` 中的 `harness_name`、`model_name`、`algorithm`（无自进化插件的基线实验 `algorithm` 为空，自动归类为 Baseline）以及表达式引用的 `phase`，并自动显示和分类。
3. **三种视图共享统一的 `values` 表达式结构**：
   - **`table.yaml`**：只需指定 `values`（每个元素为一个跨 Benchmark 表达式，同一个表达式内的 `harness_name`、`model_name`、`algorithm` 和 `phase` 必须完全相同，仅 Benchmark 不同），默认按计算出的数值从高到低排序，并展示水平柱状图 + 数字。
   - **`pareto.yaml`**：文件中同样只需指定 `values`（得分表达式），无需配置坐标轴字段；前端图表默认以所引用实验阶段的成本（`cost`）总和作为开销轴，并**支持切换为成本（`cost`）、耗时（`duration_ms`）或 Token（`n_input_tokens` / `n_cache_tokens` / `n_output_tokens`）的总和**。
   - **`waffle.yaml`**：只需指定 `values`，渲染器直接读取所引用实验阶段 `attempt-<n>.yaml` 中的 `source`（`benchmark_id` 与 `task_id`）及 `score` 来展示细粒度网格分数。
4. **支持多 Attempt 表达式样本标准差**：若所引用的 Experiment 包含多次重复试验（`n_attempt > 1`），可根据各次 Attempt 或 `summary.yaml` 自动合成整个表达式的样本标准差。

## 目录结构

每个 Leaderboard 使用唯一的 `<leaderboard-id>` 标识，存放在 `penguin-harness-benchmark` 仓库的 `leaderboards/<leaderboard-id>/` 目录下，包含必填的 `meta_info.yaml` 以及可选的 `table.yaml`、`pareto.yaml` 和 `waffle.yaml`：

```text
penguin-harness-benchmark/
└── leaderboards/
    └── <leaderboard-id>/
        ├── meta_info.yaml              # 必填。榜单唯一标识、中英文标题与作者信息
        ├── table.yaml                  # 可选。排行榜表格视图定义
        ├── pareto.yaml                 # 可选。帕累托前沿图（得分 vs. 成本总和）定义
        └── waffle.yaml                 # 可选。华夫饼网格图（基于 source 展示题目得分）定义
```

## 1. `meta_info.yaml`（榜单元信息）

`leaderboards/<leaderboard-id>/meta_info.yaml` 用于声明榜单的 ID、中英文标题以及作者信息：

```yaml
leaderboard_id: "gdpevo-essential"      # 必填。榜单唯一标识，必须与所在文件夹名称一致
title: "GDPevo-Essential Leaderboard"   # 必填。榜单英文标题
title_zh: "GDPevo-Essential 排行榜"     # 选填。榜单中文标题
author:                                 # 必填。作者与提交者信息
  name: "Prism-Shadow"                  # 必填。作者姓名或团队名称
  email: "author@example.com"           # 选填。联系邮箱
  homepage: "https://github.com/Prism-Shadow" # 选填。作者主页链接
```

### `meta_info.yaml` 字段说明

- `leaderboard_id`（必填）：Leaderboard 的唯一标识符，必须与所在的 `<leaderboard-id>` 文件夹名称完全一致，仅允许包含字母、数字和连字符 `-`。
- `title`（必填）：Leaderboard 英文标题。
- `title_zh`（选填）：Leaderboard 中文标题。
- `author`（必填）：作者信息对象，其中 `author.name` 为必填，`author.email` 与 `author.homepage` 为选填。

## 2. 表达式对象（Expression Object）与自动分类机制

在 `table.yaml`、`pareto.yaml` 和 `waffle.yaml` 中，`values` 数组的每个元素都是一个**表达式对象**（对应一个参赛条目），分为**叶节点引用**与**复合运算表达式**两类：

### 叶节点引用（Leaf Reference）

直接通过 `experiment_id` 和阶段名 `phase`（如 `train-1` 或 `test`）查找 `experiments/<leaderboard-id>/<experiment-id>/<phase>/summary.yaml` 中的统计字段：

```yaml
experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030"
phase: "test"                           # 必填。阶段文件夹名称，如 "train-1"、"val-1" 或 "test"
metric: "score_mean"                    # 选填。读取 summary.yaml 中的字段名，默认为 "score_mean"
```

### 复合运算表达式（Operator Expression）

用于对**同一组 `(harness_name, model_name, algorithm, phase)` 在不同子 Benchmark 上的实验结果**进行跨 Benchmark 聚合计算（通过 `op` 指定运算符，通过 `args` 数组传入子表达式对象列表）：
- `op: "mean"`：对 `args` 中各子 Benchmark 的值求算术平均（例如将 `GDPevo-essential` 的六个子 Benchmark 结果平均到一起）。
- `op: "sum"`：对 `args` 中各子 Benchmark 的值求和。
- `op: "sub"`：计算 `args[0] - args[1]`。
- `op: "div"`：计算 `args[0] / args[1]`。
- `op: "weighted_mean"`：跨子 Benchmark 加权平均（每个子项可附带 `weight` 权重）。

### `(harness_name, model_name, algorithm, phase)` 一致性约束与自动提取规则

- **单表达式一致性约束**：**同一个表达式内引用的所有子实验，其 `harness_name`、`model_name`、`algorithm` 和 `phase` 必须完全一致，只能是所评测的 Benchmark 不同**（用于计算多个子 Benchmark 的聚合表达式）。
- **自动提取分类信息**：在 `values` 数组的每个表达式中，渲染器读取其引用的 `experiments/<leaderboard-id>/<experiment-id>/meta_info.yaml` 以及表达式中指定的 `phase`，自动提取唯一的 `(harness_name, model_name, algorithm, phase)` 作为该参赛条目在图表左侧展示的分类信息。

### 表达式的均值与样本标准差计算公式

设单个表达式 $Y = \sum_{g=1}^{G} w_g X_g$ 引用了 $G$ 个子实验阶段（如 `op: "mean"` 时 $w_g = \frac{1}{G}$；`op: "sum"` 时 $w_g = 1$；`op: "sub"` 时 $G = 2, w_1 = 1, w_2 = -1$）：

1. **表达式均值（$\bar{Y}$）**：直接读取各子实验阶段 `summary.yaml` 中的均值 $\bar{S}_g$（如 `score_mean`）代入线性组合：

$$\bar{Y} = \sum_{g=1}^{G} w_g \bar{S}_g$$

2. **表达式的样本标准差（$\text{std}(Y)$）**：当所引用的实验包含多次重复试验（`n_attempt` $= n > 1$）时：
   - 若按第 $j$ 次重复试验（$j = 1, \dots, n$）对应的单次实验总分 $S_{g,j}$ 合成第 $j$ 次试验的表达式值 $Y_j = \sum_{g=1}^{G} w_g S_{g,j}$，则表达式的样本标准差为：

$$\text{std}(Y) = \sqrt{\frac{1}{n - 1} \sum_{j=1}^{n} \left(Y_j - \bar{Y}\right)^2}$$

   - 若各子实验相互独立且直接基于各自 `summary.yaml` 中的 `score_std`（记为 $s_g$）计算，则由方差线性组合公式得：

$$\text{std}(Y) = \sqrt{\sum_{g=1}^{G} w_g^2 s_g^2}$$

## 3. 三种统计图文件规范

每个统计图文件均可包含选填的 `subtitle`（英文副标题）和 `subtitle_zh`（中文副标题），并通过 `values` 数组定义参赛条目的计算表达式。

### 3.1 `table.yaml`（排行榜表格）

`table.yaml` 只需指定 `values`，其中每个元素都是一个表达式对象（同一个表达式内的 `harness_name`、`model_name`、`algorithm` 和 `phase` 必须一致，仅 Benchmark 不同）。渲染器自动提取 `(harness_name, model_name, algorithm, phase)` 进行展示和分类，**默认按表达式计算出的值从高到低排序，并展示水平柱状图 + 数字**：

```yaml
subtitle: "Test Score on 6 Sub-Benchmarks of GDPevo-Essential"
subtitle_zh: "GDPevo-Essential 六个子基准测试集平均得分"
values:                                 # 必填。每个元素为一个参赛条目的计算表达式，自动提取其 (harness, model, algorithm, phase)
  - op: "mean"
    args:
      - { experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
  - op: "mean"
    args:
      - { experiment_id: "gdpevo-essential-court-clerk-operations-skilladam-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-coverage-review-skilladam-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skilladam-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-financial-control-skilladam-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-portfolio-management-skilladam-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-service-ticket-resolution-skilladam-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
  - op: "mean"
    args:
      - { experiment_id: "gdpevo-essential-court-clerk-operations-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-coverage-review-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-financial-control-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-portfolio-management-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-service-ticket-resolution-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
```

### 3.2 `pareto.yaml`（帕累托前沿图）

`pareto.yaml` 定义性能与资源开销权衡的帕累托前沿图（参考 [tbench.ai](https://www.tbench.ai/)）。**配置文件中同样只需要写 `values`**（以及选填的 `subtitle` / `subtitle_zh`）；图表渲染时默认统计表达式所引用的所有 `(experiment_id, phase)` 的 `cost` 成本总和，并**支持在页面上切换开销轴为 `cost`（成本总和）、`duration`（`duration_ms` 耗时总和）或 `token`（Token 总和）**：

```yaml
subtitle: "Test Score vs. Resource Usage"
subtitle_zh: "测试集平均分 vs. 资源开销"
values:                                 # 必填。只需指定 values，页面支持切换开销轴为 cost / duration / token 总和（默认 cost 总和）
  - op: "mean"
    args:
      - { experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
  - op: "mean"
    args:
      - { experiment_id: "gdpevo-essential-court-clerk-operations-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-coverage-review-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-financial-control-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-portfolio-management-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-service-ticket-resolution-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
```

### 3.3 `waffle.yaml`（华夫饼图 / 网格热力视图）

`waffle.yaml` 定义细粒度题目级华夫饼网格图（参考 [tbench.ai](https://www.tbench.ai/)）。同样只需在 `values` 中指定每个参赛条目的表达式，渲染器除了自动提取 `(harness_name, model_name, algorithm, phase)` 并按表达式均分从高到低排列外，会**直接读取所引用实验阶段 `attempt-<n>.yaml` 中的 `source`（`benchmark_id` 与 `task_id`）及 `score` 字段**来渲染每个网格单元的分数：

```yaml
subtitle: "Task-Level Score Breakdown"
subtitle_zh: "题目级得分分布网格"
values:                                 # 必填。直接读取所引用实验阶段 attempt-<n>.yaml 中的 source 来显示各题分数
  - op: "mean"
    args:
      - { experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
  - op: "mean"
    args:
      - { experiment_id: "gdpevo-essential-court-clerk-operations-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-coverage-review-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-financial-control-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-portfolio-management-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-service-ticket-resolution-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
```
