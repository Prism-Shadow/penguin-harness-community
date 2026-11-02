# RFC-0005 Leaderboard

- Feature Name: `leaderboard`
- Start Date: 2026-10-30
- RFC PR: [#23](https://github.com/Prism-Shadow/penguin-harness-community/pull/23)
- Updated by: N/A

[English](RFC-0005-leaderboard.md)

Leaderboard（榜单）用于将一组或多组 [RFC-0002 Evaluation](RFC-0002-evaluation.zh.md) 实验结果聚合为可视化统计图表。我们同样使用 [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) 开源仓库来存放所有的 Leaderboard 定义文件，本 RFC 仅负责规定 Leaderboard 的数据格式规范。

参考 [Terminal-Bench (tbench.ai)](https://www.tbench.ai/) 的展示形式，每个 Leaderboard 包含元信息文件 `meta_info.yaml` 以及三种可选的统计图配置：**排行榜表格（`table.yaml`）**、**帕累托前沿图（`pareto.yaml`）**和**华夫饼网格图（`waffle.yaml`）**。

## 核心设计原则

1. **只存 ID 引用与计算表达式，不存计算结果**：Leaderboard 配置文件中**仅包含对 `experiment_id`、实验阶段（如 `train-1`、`test`）及指标字段的引用和 `value` 计算表达式，绝不直接存储计算后的分值或标准差数字**。所有数值均在渲染时通过查找 `experiments/<experiment-id>/<phase>/summary.yaml`（及 `attempt-<n>.yaml`）实时计算。
2. **自动提取与分类 `(Harness, Model, Algorithm)`，无需手动声明 `rows`**：配置文件中**不需要写 `rows`，也不需要手动写出 `(harness_name, model_name, algorithm)` 的叉乘组合**。只需指定 `value` 的计算方式，渲染器会自动读取每个 `value` 表达式所引用的 `experiments/<experiment-id>/meta_info.yaml` 中的 `harness_name`、`model_name` 和 `algorithm`（无自进化插件的基线实验 `algorithm` 为空，自动归类为 Baseline），并按 `(harness_name, model_name, algorithm)` 自动显示、对齐和分类。
3. **用对象表示计算表达式（Expression Object）**：当某个榜单指标需要由多个子实验聚合得出时（例如 [GDPevo](https://arxiv.org/pdf/2608.03764) 需要将六个独立拆分的子 Benchmark 结果平均到一起），使用结构化的表达式对象声明计算逻辑。
4. **`table.yaml` 使用 `columns` + `sort_by`，仅对 `sort_by` 列展示水平柱状图 + 数字**：表格通过 `columns` 定义展示的一列或多列指标（每列通过 `value` 表达式列表给出各参赛条目的计算方式），并通过 `sort_by` 指定默认排序列（从高到低排序）；渲染时，**只将 `sort_by` 列放在最后并显示水平柱状图 + 数字，其他列只显示数字**。
5. **支持多 Attempt 表达式样本标准差**：若所引用的 Experiment 包含多次重复试验（`n_attempt > 1`），可根据各次 Attempt 或 `summary.yaml` 自动合成整个表达式的样本标准差。

## 目录结构

每个 Leaderboard 使用唯一的 `<leaderboard-id>` 标识，存放在 `penguin-harness-benchmark` 仓库的 `leaderboards/<leaderboard-id>/` 目录下，包含必填的 `meta_info.yaml` 以及可选的 `table.yaml`、`pareto.yaml` 和 `waffle.yaml`：

```text
penguin-harness-benchmark/
└── leaderboards/
    └── <leaderboard-id>/
        ├── meta_info.yaml              # 必填。榜单唯一标识、中英文标题与作者信息
        ├── table.yaml                  # 可选。排行榜表格视图定义
        ├── pareto.yaml                 # 可选。帕累托前沿图（得分 vs. 成本/耗时）定义
        └── waffle.yaml                 # 可选。华夫饼网格图（子基准/任务级分布）定义
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

在 `table.yaml`、`pareto.yaml` 和 `waffle.yaml` 中，任何指标数值均通过**表达式对象**声明，分为**叶节点引用**与**复合运算表达式**两类：

### 叶节点引用（Leaf Reference）

直接通过 `experiment_id` 和阶段名 `phase`（如 `train-1` 或 `test`）查找 `experiments/<experiment-id>/<phase>/summary.yaml` 中的统计字段：

```yaml
experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030"
phase: "test"                           # 必填。阶段文件夹名称，如 "train-1"、"val-1" 或 "test"
metric: "score_mean"                    # 选填。读取 summary.yaml 中的字段名，默认为 "score_mean"（可选 "cost"、"duration_ms"、"pass@k" 等）
```

### 复合运算表达式（Operator Expression）

通过 `op` 指定聚合或二元运算符，通过 `args` 数组传入子表达式对象列表：
- `op: "mean"`：对 `args` 中所有子表达式的值求算术平均（例如将 `GDPevo-essential` 的六个子 Benchmark 结果平均到一起）。
- `op: "sum"`：对 `args` 中所有子表达式的值求和（例如汇总六个子 Benchmark 的总 `cost` 或总 `duration_ms`）。
- `op: "sub"`：计算 `args[0] - args[1]`（例如用 `test` 阶段得分减去 `train-1` 阶段得分以计算自进化增益 $\Delta$）。
- `op: "div"`：计算 `args[0] / args[1]`。
- `op: "weighted_mean"`：加权平均（每个子项可附带 `weight` 权重）。

### `(harness_name, model_name, algorithm)` 自动提取与对齐规则

1. **自动提取分类信息**：在每个表达式中，渲染器读取其引用的 `experiments/<experiment-id>/meta_info.yaml`，自动提取 `(harness_name, model_name, algorithm)` 作为该表达式所属的参赛条目身份（同一表达式内引用的子实验应属于同一组 `(harness_name, model_name, algorithm)`）。
2. **多列自动按分类对齐**：当表格包含多个 `columns`（或帕累托图包含 `x` 与 `y`）时，渲染器根据自动提取出的 `(harness_name, model_name, algorithm)` 将不同列的数值自动归并到同一行。

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

每个统计图文件均可包含 `subtitle`（英文副标题）和 `subtitle_zh`（中文副标题），无需编写 `rows`。

### 3.1 `table.yaml`（排行榜表格）

`table.yaml` 通过 `columns` 定义表格展示的一列或多列指标，每列内部的 `value` 为表达式列表（每个表达式对应一个参赛条目，自动从其引用的 `experiment_id` 提取 `harness_name`、`model_name` 和 `algorithm`）。表格按 `sort_by` 指定的列默认从高到低排序；**渲染时，最后只显示 `sort_by` 列的水平柱状图 + 数字，其他列只显示数字**：

```yaml
subtitle: "Evaluation on 6 Sub-Benchmarks of GDPevo-Essential"
subtitle_zh: "GDPevo-Essential 六个子基准综合评测"
sort_by: "test_score"                   # 必填。默认排序列 key（从高到低排序；置于最后一列显示水平柱状图 + 数字，其他列只显示数字）
columns:                                # 必填。表格指标列定义
  - key: "train_1_score"
    title: "Train-1 Score"
    title_zh: "首轮训练分"
    value:                              # 每个元素为一个参赛条目的计算表达式，自动提取其 (harness, model, algorithm)
      - op: "mean"
        args:
          - { experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030", phase: "train-1", metric: "score_mean" }
      - op: "mean"
        args:
          - { experiment_id: "gdpevo-essential-court-clerk-operations-skilladam-deepseek-flash-1017-20261028", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-coverage-review-skilladam-deepseek-flash-1017-20261028", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skilladam-deepseek-flash-1017-20261028", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-financial-control-skilladam-deepseek-flash-1017-20261028", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-portfolio-management-skilladam-deepseek-flash-1017-20261028", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-service-ticket-resolution-skilladam-deepseek-flash-1017-20261028", phase: "train-1", metric: "score_mean" }
  - key: "test_score"
    title: "Test Score"
    title_zh: "测试集平均分"
    value:
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

`pareto.yaml` 定义性能与开销权衡的帕累托前沿散点/折线图（参考 [tbench.ai](https://www.tbench.ai/)）。通过 `x_axis` 与 `y_axis` 中的 `value` 表达式列表定义横纵坐标的计算方式，并自动根据实验的 `(harness_name, model_name, algorithm)` 对齐和分类绘点：

```yaml
subtitle: "Test Score vs. Single-Attempt Test Cost"
subtitle_zh: "测试集平均分 vs. 单次测试成本"
x_axis:                                 # 必填。横轴配置
  title: "Test Cost ($)"
  title_zh: "单次测试成本 ($)"
  value:
    - op: "sum"
      args:
        - { experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
    - op: "sum"
      args:
        - { experiment_id: "gdpevo-essential-court-clerk-operations-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-coverage-review-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-financial-control-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-portfolio-management-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-service-ticket-resolution-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "cost" }
y_axis:                                 # 必填。纵轴配置
  title: "Test Score"
  title_zh: "测试集平均分"
  value:
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

`waffle.yaml` 定义细粒度子基准或单题（Task）维度的华夫饼网格图（参考 [tbench.ai](https://www.tbench.ai/)）。只需在 `value`（或 `columns`）中指定参与展示的实验及阶段，渲染器自动从实验中提取 `(harness_name, model_name, algorithm)` 分类并按总均分从高到低排列，同时读取各实验关联的子基准或 `attempt-<n>.yaml` 中的单题得分填充网格：

```yaml
subtitle: "Sub-Benchmark Score Breakdown"
subtitle_zh: "子基准得分分布网格"
value:                                  # 必填。自动提取实验的 (harness, model, algorithm) 分类与子基准/单题得分
  - { experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
  - { experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
  - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
  - { experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
  - { experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
  - { experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
```
