# RFC-0005 Leaderboard

- Feature Name: `leaderboard`
- Start Date: 2026-10-30
- RFC PR: [#23](https://github.com/Prism-Shadow/penguin-harness-community/pull/23)
- Updated by: N/A

[中文版](RFC-0005-leaderboard.zh.md)

A Leaderboard aggregates one or more [RFC-0002 Evaluation](RFC-0002-evaluation.md) experiments into statistical charts and rankings. All Leaderboard definitions are stored in the open-source [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) repository, and this RFC specifies the declarative file format for Leaderboards.

Inspired by [Terminal-Bench (tbench.ai)](https://www.tbench.ai/), each Leaderboard directory contains a required `meta_info.yaml` metadata file and up to three optional chart configurations: **Table (`table.yaml`)**, **Pareto Frontier (`pareto.yaml`)**, and **Waffle Grid (`waffle.yaml`)**.

## Core Design Principles

1. **ID References and Expressions Only, No Precomputed Numbers**: Leaderboard configuration files **store only references to `experiment_id`, phase names (such as `train-1` or `test`), metric keys, and `value` expression objects—never hardcoded or precomputed numeric scores**. All values are computed dynamically from `experiments/<experiment-id>/<phase>/summary.yaml` (and `attempt-<n>.yaml`) at build or render time.
2. **Automatic `(Harness, Model, Algorithm)` Extraction and Grouping—No Manual `rows`**: Configuration files **do not define `rows` or manually write out the Cartesian product of `(harness_name, model_name, algorithm)`**. You only specify how `value` is computed; the renderer automatically inspects `experiments/<experiment-id>/meta_info.yaml` for the experiments referenced in `value`, extracts `harness_name`, `model_name`, and `algorithm` (treating an omitted `algorithm` as Baseline), and automatically displays, aligns, and classifies entries by `(harness_name, model_name, algorithm)`.
3. **Object-Based Expressions (`Expression Object`)**: How each metric is computed—such as averaging results across the six independently split sub-benchmarks of [GDPevo](https://arxiv.org/pdf/2608.03764)—is represented as a structured YAML object.
4. **`columns` + `sort_by` in `table.yaml` Renders a Horizontal Bar Chart + Number Only on the `sort_by` Column**: `table.yaml` defines one or more metric columns under `columns` (each specifying per-entry expressions via `value`) and keeps `sort_by` (sorted from high to low by default). **Only the `sort_by` column is placed at the end and rendered with a horizontal bar chart + number; all other columns display numbers only**.
5. **Sample Standard Deviation Across Multiple Attempts**: When the referenced experiments contain multiple repeated attempts (`n_attempt > 1`), the sample standard deviation of the expression is computed automatically across attempts.

## Directory Structure

Each Leaderboard is identified by `<leaderboard-id>` and stored under `leaderboards/<leaderboard-id>/` in `penguin-harness-benchmark`, containing a required `meta_info.yaml` and optional `table.yaml`, `pareto.yaml`, and `waffle.yaml` files:

```text
penguin-harness-benchmark/
└── leaderboards/
    └── <leaderboard-id>/
        ├── meta_info.yaml              # Required. Leaderboard ID, bilingual titles, and author metadata
        ├── table.yaml                  # Optional. Leaderboard ranking table specification
        ├── pareto.yaml                 # Optional. Pareto frontier chart (score vs. cost/duration)
        └── waffle.yaml                 # Optional. Waffle grid chart (sub-benchmark / task breakdown)
```

## 1. `meta_info.yaml` (Leaderboard Metadata)

`leaderboards/<leaderboard-id>/meta_info.yaml` declares the Leaderboard ID, English and Chinese titles, and author information:

```yaml
leaderboard_id: "gdpevo-essential"      # Required. Unique leaderboard identifier matching the directory name
title: "GDPevo-Essential Leaderboard"   # Required. English title
title_zh: "GDPevo-Essential 排行榜"     # Optional. Chinese title
author:                                 # Required. Author and submitter metadata
  name: "Prism-Shadow"                  # Required. Author or team name
  email: "author@example.com"           # Optional. Contact email
  homepage: "https://github.com/Prism-Shadow" # Optional. Author homepage URL
```

### `meta_info.yaml` Field Reference

- `leaderboard_id` (required): Unique identifier of the Leaderboard; must match the enclosing `<leaderboard-id>` folder name and contain only letters, digits, and hyphens `-`.
- `title` (required): English title of the Leaderboard.
- `title_zh` (optional): Chinese title of the Leaderboard.
- `author` (required): Author object where `author.name` is required and `author.email` and `author.homepage` are optional.

## 2. Expression Objects & Automatic Classification

In `table.yaml`, `pareto.yaml`, and `waffle.yaml`, every numeric metric is declared as an **Expression Object**, which is either a **Leaf Reference** or a **Composite Operator Expression**:

### Leaf Reference

References a specific `experiment_id` and `phase` (e.g., `train-1` or `test`) and reads a field from `experiments/<experiment-id>/<phase>/summary.yaml`:

```yaml
experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030"
phase: "test"                           # Required. Phase folder name, e.g., "train-1", "val-1", or "test"
metric: "score_mean"                    # Optional. Field in summary.yaml; defaults to "score_mean" (or "cost", "duration_ms", "pass@k")
```

### Composite Operator Expression

Combines multiple child expression objects via `op` and `args`:
- `op: "mean"`: Arithmetic mean over `args` (e.g., averaging the six sub-benchmarks of `GDPevo-essential`).
- `op: "sum"`: Sum over `args` (e.g., summing total `cost` or `duration_ms` across sub-benchmarks).
- `op: "sub"`: Difference `args[0] - args[1]` (e.g., computing self-evolution gain $\Delta$ between `test` and `train-1`).
- `op: "div"`: Ratio `args[0] / args[1]`.
- `op: "weighted_mean"`: Weighted average across `args` (where each item specifies `weight`).

### Automatic `(harness_name, model_name, algorithm)` Extraction & Alignment

1. **Automatic Identity Extraction**: For each expression in `value`, the renderer loads `experiments/<experiment-id>/meta_info.yaml` from the referenced experiments and automatically extracts `(harness_name, model_name, algorithm)` as the entry's identity (all child experiments within a single expression belong to the same `(harness_name, model_name, algorithm)`).
2. **Automatic Cross-Column Alignment**: When a table defines multiple `columns` (or a Pareto plot defines `x_axis` and `y_axis`), values sharing the same extracted `(harness_name, model_name, algorithm)` are automatically aligned onto the same row or point.

### Mean & Sample Standard Deviation of an Expression

Suppose a linear expression $Y = \sum_{g=1}^{G} w_g X_g$ combines $G$ experiment phases (e.g., $w_g = \frac{1}{G}$ for `op: "mean"`, $w_g = 1$ for `op: "sum"`, or $G = 2, w_1 = 1, w_2 = -1$ for `op: "sub"`):

1. **Expression Mean ($\bar{Y}$)**: Evaluated directly from the means $\bar{S}_g$ (such as `score_mean`) in each referenced `summary.yaml`:

$$\bar{Y} = \sum_{g=1}^{G} w_g \bar{S}_g$$

2. **Expression Sample Standard Deviation ($\text{std}(Y)$)**: When the referenced experiments contain multiple repeated attempts (`n_attempt` $= n > 1$):
   - By evaluating the expression on the $j$-th attempt ($j = 1, \dots, n$) as $Y_j = \sum_{g=1}^{G} w_g S_{g,j}$, the sample standard deviation is:

$$\text{std}(Y) = \sqrt{\frac{1}{n - 1} \sum_{j=1}^{n} \left(Y_j - \bar{Y}\right)^2}$$

   - Equivalently, for independent sub-benchmark experiments using `score_std` ($s_g$) from each `summary.yaml`:

$$\text{std}(Y) = \sqrt{\sum_{g=1}^{G} w_g^2 s_g^2}$$

## 3. Chart File Specifications

Each chart file supports optional `subtitle` (English) and `subtitle_zh` (Chinese) fields and does not require `rows`.

### 3.1 `table.yaml` (Leaderboard Table)

`table.yaml` defines one or more metric columns under `columns`. Each column contains a `value` list of expression objects (one expression per entry, from which `harness_name`, `model_name`, and `algorithm` are automatically extracted). Rows are sorted by `sort_by` from high to low by default; **when rendered, only the `sort_by` column is placed at the end with a horizontal bar chart + number, while all other columns display numbers only**:

```yaml
subtitle: "Evaluation on 6 Sub-Benchmarks of GDPevo-Essential"
subtitle_zh: "GDPevo-Essential 六个子基准综合评测"
sort_by: "test_score"                   # Required. Column key to sort by (high-to-low by default; placed last with horizontal bar chart + number, while other columns show numbers only)
columns:                                # Required. Metric column definitions
  - key: "train_1_score"
    title: "Train-1 Score"
    title_zh: "首轮训练分"
    value:                              # Each item is an expression for one entry; (harness, model, algorithm) is extracted automatically
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

### 3.2 `pareto.yaml` (Pareto Frontier Chart)

`pareto.yaml` defines the Pareto frontier scatter/line plot comparing performance against resource usage (inspired by [tbench.ai](https://www.tbench.ai/)). `x_axis` and `y_axis` each contain a `value` list of expressions, which are automatically aligned and classified by `(harness_name, model_name, algorithm)` into data points:

```yaml
subtitle: "Test Score vs. Single-Attempt Test Cost"
subtitle_zh: "测试集平均分 vs. 单次测试成本"
x_axis:                                 # Required. Horizontal axis configuration
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
y_axis:                                 # Required. Vertical axis configuration
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

### 3.3 `waffle.yaml` (Waffle Grid Chart)

`waffle.yaml` defines the fine-grained sub-benchmark or task-level grid breakdown (inspired by [tbench.ai](https://www.tbench.ai/)). You only list the referenced experiments and phases under `value` (or `columns`); the renderer automatically extracts `(harness_name, model_name, algorithm)` for each row (sorted by overall mean score from high to low) and populates grid cells from the sub-benchmarks or per-task records in `attempt-<n>.yaml`:

```yaml
subtitle: "Sub-Benchmark Score Breakdown"
subtitle_zh: "子基准得分分布网格"
value:                                  # Required. Automatically grouped by (harness, model, algorithm) and broken down by sub-benchmark/task
  - { experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
  - { experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
  - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
  - { experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
  - { experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
  - { experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
```
