# RFC-0005 Leaderboard

- Feature Name: `leaderboard`
- Start Date: 2026-10-30
- RFC PR: [#23](https://github.com/Prism-Shadow/penguin-harness-community/pull/23)
- Updated by: N/A

[中文版](RFC-0005-leaderboard.zh.md)

A Leaderboard aggregates one or more [RFC-0002 Evaluation](RFC-0002-evaluation.md) experiments into statistical charts and rankings. All Leaderboard definitions are stored in the open-source [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) repository, and this RFC specifies the declarative file format for Leaderboards.

Inspired by [Terminal-Bench (tbench.ai)](https://www.tbench.ai/), each Leaderboard directory contains a required `meta_info.yaml` metadata file and up to three optional chart configurations: **Table (`table.yaml`)**, **Pareto Frontier (`pareto.yaml`)**, and **Waffle Grid (`waffle.yaml`)**.

## Core Design Principles

1. **ID References and `values` Expressions Only, No Precomputed Numbers**: Leaderboard configuration files **store only references to `experiment_id`, phase names (such as `train-1` or `test`), metric keys, and `values` expression objects—never hardcoded or precomputed numeric scores**. All values are computed dynamically from `experiments/<leaderboard-id>/<experiment-id>/<phase>/summary.yaml` (and `attempt-<n>.yaml`) at build or render time.
2. **Only `values` Is Required—`(Harness, Model, Algorithm, Phase)` Is Extracted Automatically**: None of the chart files require `rows`, `columns`, or a manual Cartesian product of `(harness_name, model_name, algorithm, phase)`. You only provide the list of expressions under `values`; for each expression, the renderer automatically inspects `experiments/<leaderboard-id>/<experiment-id>/meta_info.yaml` of the referenced experiments and the referenced `phase`, extracts `harness_name`, `model_name`, `algorithm` (treating an omitted `algorithm` as Baseline), and `phase`, and automatically displays and classifies the entry.
3. **Unified `values` Structure Across All Three Views**:
   - **`table.yaml`**: Specifies only `values` (each item is an expression object). Rows are sorted by the evaluated score from high to low by default and rendered with a horizontal bar chart + number.
   - **`pareto.yaml`**: Specifies only `values` (vertical axis score expressions) without specifying `x`; the horizontal axis `x` **defaults to the sum of `cost` across all `(experiment_id, phase)` pairs referenced in each expression**.
   - **`waffle.yaml`**: Specifies only `values`; the renderer directly reads `source` (`benchmark_id` and `task_id`) and `score` from `attempt-<n>.yaml` in the referenced experiment phases to display per-task scores in the grid.
4. **Sample Standard Deviation Across Multiple Attempts**: When the referenced experiments contain multiple repeated attempts (`n_attempt > 1`), the sample standard deviation of the expression is computed automatically across attempts.

## Directory Structure

Each Leaderboard is identified by `<leaderboard-id>` and stored under `leaderboards/<leaderboard-id>/` in `penguin-harness-benchmark`, containing a required `meta_info.yaml` and optional `table.yaml`, `pareto.yaml`, and `waffle.yaml` files:

```text
penguin-harness-benchmark/
└── leaderboards/
    └── <leaderboard-id>/
        ├── meta_info.yaml              # Required. Leaderboard ID, bilingual titles, and author metadata
        ├── table.yaml                  # Optional. Leaderboard ranking table specification
        ├── pareto.yaml                 # Optional. Pareto frontier chart (score vs. total cost)
        └── waffle.yaml                 # Optional. Waffle grid chart (task scores read directly from source)
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

In `table.yaml`, `pareto.yaml`, and `waffle.yaml`, each item in `values` is an **Expression Object** (representing one entry), which is either a **Leaf Reference** or a **Composite Operator Expression**:

### Leaf Reference

References a specific `experiment_id` and `phase` (e.g., `train-1` or `test`) and reads a field from `experiments/<leaderboard-id>/<experiment-id>/<phase>/summary.yaml`:

```yaml
experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030"
phase: "test"                           # Required. Phase folder name, e.g., "train-1", "val-1", or "test"
metric: "score_mean"                    # Optional. Field in summary.yaml; defaults to "score_mean"
```

### Composite Operator Expression

Combines multiple child expression objects via `op` and `args`:
- `op: "mean"`: Arithmetic mean over `args` (e.g., averaging the six sub-benchmarks of `GDPevo-essential`).
- `op: "sum"`: Sum over `args`.
- `op: "sub"`: Difference `args[0] - args[1]` (e.g., computing self-evolution gain $\Delta$ between `test` and `train-1`).
- `op: "div"`: Ratio `args[0] / args[1]`.
- `op: "weighted_mean"`: Weighted average across `args` (where each item specifies `weight`).

### Automatic `(harness_name, model_name, algorithm, phase)` Extraction

For each expression in `values`, the renderer loads `experiments/<leaderboard-id>/<experiment-id>/meta_info.yaml` from the referenced experiments along with the referenced `phase`, and automatically extracts `(harness_name, model_name, algorithm, phase)` to display and classify the entry on the chart (all child experiments within a single expression belong to the same `(harness_name, model_name, algorithm)`).

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

Each chart file supports optional `subtitle` (English) and `subtitle_zh` (Chinese) fields and defines its entries through `values`.

### 3.1 `table.yaml` (Leaderboard Table)

`table.yaml` only specifies `values`, where each item is an expression object. The renderer automatically extracts `harness_name`, `model_name`, `algorithm`, and `phase` from the expression and its referenced experiments for display and classification, **sorts rows by the evaluated value from high to low by default, and renders a horizontal bar chart + number**:

```yaml
subtitle: "Test Score on 6 Sub-Benchmarks of GDPevo-Essential"
subtitle_zh: "GDPevo-Essential 六个子基准测试集平均得分"
values:                                 # Required. Each item is an expression for one entry; (harness, model, algorithm, phase) is extracted automatically
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

`pareto.yaml` defines the Pareto frontier chart comparing score against cost (inspired by [tbench.ai](https://www.tbench.ai/)). **There is no need to specify `x`**: you only provide the score expressions under `values` (as the vertical axis `y`), and the horizontal axis `x` **defaults to the sum of `cost` across all `(experiment_id, phase)` pairs referenced in that expression**:

```yaml
subtitle: "Test Score vs. Total Cost"
subtitle_zh: "测试集平均分 vs. 成本总和"
values:                                 # Required. Y-axis is the evaluated expression value; X-axis defaults to the sum of cost across referenced experiment phases
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

`waffle.yaml` defines the fine-grained task-level Waffle grid breakdown (inspired by [tbench.ai](https://www.tbench.ai/)). You only specify `values`; in addition to extracting `(harness_name, model_name, algorithm, phase)` and sorting entries from high to low, the renderer **directly reads `source` (`benchmark_id` and `task_id`) and `score` from `attempt-<n>.yaml` in the referenced experiment phases** to display each task's score in the grid:

```yaml
subtitle: "Task-Level Score Breakdown"
subtitle_zh: "题目级得分分布网格"
values:                                 # Required. Directly reads source in attempt-<n>.yaml of referenced experiment phases to display task scores
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
