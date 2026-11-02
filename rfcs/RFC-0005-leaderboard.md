# RFC-0005 Leaderboard

- Feature Name: `leaderboard`
- Start Date: 2026-10-30
- RFC PR: [#23](https://github.com/Prism-Shadow/penguin-harness-community/pull/23)
- Updated by: N/A

[中文版](RFC-0005-leaderboard.zh.md)

A Leaderboard aggregates one or more [RFC-0002 Evaluation](RFC-0002-evaluation.md) experiments into statistical charts and rankings. All Leaderboard definitions are stored in the open-source [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) repository, and this RFC specifies the declarative file format for Leaderboards.

Inspired by [Terminal-Bench (tbench.ai)](https://www.tbench.ai/), each Leaderboard supports up to three optional chart views: **Table (`table`)**, **Pareto Frontier (`pareto`)**, and **Waffle Grid (`waffle`)**.

## Core Design Principles

1. **ID References Only, No Precomputed Numbers**: Leaderboard configuration files **store only references to `experiment_id`, phase names (such as `train-1` or `test`), metric keys, and expression objects—never hardcoded or precomputed numeric scores**. All values are computed dynamically from `experiments/<experiment-id>/<phase>/summary.yaml` (and `attempt-<n>.yaml`) at build or render time.
2. **Row Variables Default to the Cartesian Product of `(Harness, Model, Algorithm)`**: Across `table`, `pareto`, and `waffle`, each entry (row or point) is uniquely identified by the **Cartesian product of `(harness_name, model_name, algorithm)`** (for baseline runs without an RSI plugin, `algorithm` is `null` or `"baseline"`).
3. **Object-Based Expressions (`Expression Object`)**: How each metric is computed—such as averaging results across the six independently split sub-benchmarks of [GDPevo](https://arxiv.org/pdf/2608.03764)—is represented as a structured YAML object.
4. **Sorted High-to-Low by Default**: `table.yaml` sorts rows by the evaluated value of the primary expression in **descending order (from high to low)** by default.
5. **Sample Standard Deviation Across Multiple Attempts**: When the referenced experiments contain multiple repeated attempts (`n_attempt > 1`), the sample standard deviation of the expression is computed automatically across attempts.

## Directory Structure

Each Leaderboard is identified by `<leaderboard-id>` and stored under `leaderboards/<leaderboard-id>/` in `penguin-harness-benchmark`, containing optional `table.yaml`, `pareto.yaml`, and `waffle.yaml` files:

```text
penguin-harness-benchmark/
└── leaderboards/
    └── <leaderboard-id>/
        ├── table.yaml                  # Optional. Leaderboard ranking table specification
        ├── pareto.yaml                 # Optional. Pareto frontier chart (score vs. cost/duration)
        └── waffle.yaml                 # Optional. Waffle grid chart (sub-benchmark / task breakdown)
```

## Expression Object Specification

In `table.yaml`, `pareto.yaml`, and `waffle.yaml`, every numeric metric is declared as an **Expression Object**, which is either a **Leaf Reference** or a **Composite Operator Expression**:

### 1. Leaf Reference

Looks up a specific `experiment_id` and `phase` (e.g., `train-1` or `test`) and reads a field from `experiments/<experiment-id>/<phase>/summary.yaml`:

```yaml
experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030"
phase: "test"                           # Required. Phase folder name, e.g., "train-1", "val-1", or "test"
metric: "score_mean"                    # Optional. Field in summary.yaml; defaults to "score_mean" (or "cost", "duration_ms", "pass@k")
```

### 2. Composite Operator Expression

Combines multiple child expression objects via `op` and `args`:
- `op: "mean"`: Arithmetic mean over `args` (e.g., averaging the six sub-benchmarks of `GDPevo-essential`).
- `op: "sum"`: Sum over `args` (e.g., summing total `cost` or `duration_ms` across sub-benchmarks).
- `op: "sub"`: Difference `args[0] - args[1]` (e.g., computing self-evolution gain $\Delta$ between `test` and baseline or `train-1`).
- `op: "div"`: Ratio `args[0] / args[1]`.
- `op: "weighted_mean"`: Weighted average across `args` (where each item specifies `weight`).

For example, the expression object that averages the `test` scores across the six sub-benchmarks of `GDPevo-essential` is:

```yaml
op: "mean"
args:
  - experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030"
    phase: "test"
    metric: "score_mean"
  - experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030"
    phase: "test"
    metric: "score_mean"
  - experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030"
    phase: "test"
    metric: "score_mean"
  - experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030"
    phase: "test"
    metric: "score_mean"
  - experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030"
    phase: "test"
    metric: "score_mean"
  - experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030"
    phase: "test"
    metric: "score_mean"
```

### Mean & Sample Standard Deviation of an Expression

Suppose a linear expression $Y = \sum_{g=1}^{G} w_g X_g$ combines $G$ experiment phases (e.g., $w_g = \frac{1}{G}$ for `op: "mean"`, $w_g = 1$ for `op: "sum"`, or $G = 2, w_1 = 1, w_2 = -1$ for `op: "sub"`):

1. **Expression Mean ($\bar{Y}$)**: Evaluated directly from the means $\bar{S}_g$ (such as `score_mean`) in each referenced `summary.yaml`:

$$\bar{Y} = \sum_{g=1}^{G} w_g \bar{S}_g$$

2. **Expression Sample Standard Deviation ($\text{std}(Y)$)**: When the referenced experiments contain multiple repeated attempts (`n_attempt` $= n > 1$):
   - By evaluating the expression on the $j$-th attempt ($j = 1, \dots, n$) as $Y_j = \sum_{g=1}^{G} w_g S_{g,j}$, the sample standard deviation is:

$$\text{std}(Y) = \sqrt{\frac{1}{n - 1} \sum_{j=1}^{n} \left(Y_j - \bar{Y}\right)^2}$$

   - Equivalently, for independent sub-benchmark experiments using `score_std` ($s_g$) from each `summary.yaml`:

$$\text{std}(Y) = \sqrt{\sum_{g=1}^{G} w_g^2 s_g^2}$$

## Chart File Specifications

### 1. `table.yaml` (Leaderboard Table)

`table.yaml` defines the ranking table. The left columns identify each entry by `(harness_name, model_name, algorithm)`, and the metric columns are defined by expression objects. **Rows are sorted by the primary expression (`sort_by`, defaulting to the first column) from high to low (`desc`) by default**:

```yaml
leaderboard_id: "gdpevo-essential"      # Required. Must match the directory name
title: "GDPevo-Essential Leaderboard"   # Required. English title
title_zh: "GDPevo-Essential 排行榜"     # Optional. Chinese title
sort_by: "test_score"                   # Optional. Column key to sort by (defaults to the first column)
sort_order: "desc"                      # Optional. Sort order: desc (default, high to low) | asc
columns:                                # Required. Metric column definitions
  - key: "test_score"
    title: "Test Score"
    title_zh: "测试集平均分"
    show_std: true                      # Optional. Whether to display ± sample standard deviation when n_attempt > 1
  - key: "train_1_score"
    title: "Train-1 Score"
    title_zh: "首轮训练分"
  - key: "total_cost"
    title: "Cost ($)"
    title_zh: "单次成本 ($)"
rows:                                   # Required. Each row corresponds to a (harness, model, algorithm) tuple
  - harness_name: "PenguinHarness"
    model_name: "DeepSeek-V4.1-Flash-1017"
    algorithm: "skillopt-rsi-toolkit"
    values:
      test_score:
        op: "mean"
        args:
          - { experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      train_1_score:
        op: "mean"
        args:
          - { experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030", phase: "train-1", metric: "score_mean" }
      total_cost:
        op: "sum"
        args:
          - { experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
          - { experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
          - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
          - { experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
          - { experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
          - { experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
```

### 2. `pareto.yaml` (Pareto Frontier Chart)

`pareto.yaml` defines the Pareto frontier scatter/line plot comparing performance against resource usage (inspired by [tbench.ai](https://www.tbench.ai/)). Each point corresponds to a `(harness_name, model_name, algorithm)` combination, with expression objects specifying the horizontal axis `x` (e.g., total `cost` or `duration_ms`) and vertical axis `y` (e.g., mean `score_mean`):

```yaml
leaderboard_id: "gdpevo-essential"      # Required. Must match the directory name
title: "Score vs. Cost Pareto Frontier" # Required. English title
title_zh: "得分 vs. 成本 帕累托前沿"     # Optional. Chinese title
x_axis:                                 # Required. Horizontal axis configuration
  title: "Test Cost ($)"
  title_zh: "单次测试成本 ($)"
  better: "lower"
y_axis:                                 # Required. Vertical axis configuration
  title: "Test Score"
  title_zh: "测试集平均分"
  better: "higher"
  show_std: true                        # Optional. Whether to render vertical std error bars when n_attempt > 1
points:                                 # Required. Each point corresponds to a (harness, model, algorithm) tuple
  - harness_name: "PenguinHarness"
    model_name: "DeepSeek-V4.1-Flash-1017"
    algorithm: "skillopt-rsi-toolkit"
    x:
      op: "sum"
      args:
        - { experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
    y:
      op: "mean"
      args:
        - { experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
        - { experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
        - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
        - { experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
        - { experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
        - { experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
```

### 3. `waffle.yaml` (Waffle Grid Chart)

`waffle.yaml` defines the fine-grained sub-benchmark or task-level grid breakdown (inspired by [tbench.ai](https://www.tbench.ai/)). The left rows default to the Cartesian product of `(harness_name, model_name, algorithm)` (sorted by overall mean score from high to low), while each grid cell references the corresponding `(experiment_id, phase)` expression:

```yaml
leaderboard_id: "gdpevo-essential"      # Required. Must match the directory name
title: "Sub-Benchmark Score Breakdown"  # Required. English title
title_zh: "子基准得分分布网格"           # Optional. Chinese title
granularity: "benchmark"                # Optional. Grid granularity: "benchmark" (per sub-benchmark) | "task" (per task in attempt-<n>.yaml)
items:                                  # Required. Grid columns (sub-benchmark keys or task keys)
  - key: "court-clerk-operations"
    title: "Court Clerk"
    title_zh: "法院书记员"
  - key: "coverage-review"
    title: "Coverage Review"
    title_zh: "保险核保"
  - key: "engineering-portfolio-analytics"
    title: "Eng. Portfolio"
    title_zh: "工程组合分析"
  - key: "financial-control"
    title: "Financial Control"
    title_zh: "财务内控"
  - key: "portfolio-management"
    title: "Portfolio Mgmt"
    title_zh: "投资组合管理"
  - key: "service-ticket-resolution"
    title: "Service Ticket"
    title_zh: "工单处理"
rows:                                   # Required. Each row corresponds to a (harness, model, algorithm) tuple
  - harness_name: "PenguinHarness"
    model_name: "DeepSeek-V4.1-Flash-1017"
    algorithm: "skillopt-rsi-toolkit"
    cells:
      court-clerk-operations:
        experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030"
        phase: "test"
        metric: "score_mean"
      coverage-review:
        experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030"
        phase: "test"
        metric: "score_mean"
      engineering-portfolio-analytics:
        experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030"
        phase: "test"
        metric: "score_mean"
      financial-control:
        experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030"
        phase: "test"
        metric: "score_mean"
      portfolio-management:
        experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030"
        phase: "test"
        metric: "score_mean"
      service-ticket-resolution:
        experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030"
        phase: "test"
        metric: "score_mean"
```
