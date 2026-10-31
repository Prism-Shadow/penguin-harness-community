# RFC-0002 Evaluation

- Feature Name: `evaluation`
- Start Date: 2026-10-29
- RFC PR: [#14](https://github.com/Prism-Shadow/penguin-harness-community/pull/14)
- Updated by: [#15](https://github.com/Prism-Shadow/penguin-harness-community/pull/15), [#21](https://github.com/Prism-Shadow/penguin-harness-community/pull/21)

[中文版](RFC-0002-evaluation.zh.md)

An Evaluation is a set of experimental data for an Agent, identified by `<experiment-id>`. An experiment is typically divided into multiple phases—such as training, validation, and testing (e.g., `train-1`, `val-1`, `train-2`, `val-2`, `test`)—where `train` and `val` **must be followed by a number** (such as `train-1`, `val-1`), `test` **must never be followed by a number**, and every experiment must include the `test` phase.

We also use the open-source [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) repository to curate all Agent Evaluations. The Evaluation data structure defined in this specification standardizes how results across different experiments and self-evolution phases are recorded, enabling reproducible comparisons and leaderboard aggregation.

## Directory Structure

Each experiment is stored under `experiments/<experiment-id>/`. The file structure of the repository is organized as follows:

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

- `experiments/<experiment-id>/`: Stores the metadata configuration and phase-by-phase evaluation records for a single experiment.
- `<phase>/` (e.g., `train-1/`, `val-1/`, `test/`): Phase directory. Training and validation phases **must have a numeric suffix** indicating the iteration round (such as `train-1`, `val-1`, `train-2`, `val-2`), whereas the final test phase must be named `test` (**never with a trailing number**), and every experiment must contain a `test/` phase.
- `meta_info.yaml`: Records the experiment-level metadata and runtime configuration (model, Harness, RSI algorithm, dataset splits, and author information).
- `summary.yaml`: Records the aggregated score statistics, duration, token usage, and cost for that phase.
- `attempt-<n>.yaml`: Records the fine-grained per-task results for the `n`-th repeated trial of that phase.

## Adding an Evaluation

To add a new Evaluation experiment to the repository, organize its files as follows:

1. Create an `experiments/<experiment-id>` directory and add a `meta_info.yaml` configuration file inside it:

```yaml
experiment_id: "<experiment-id>"        # Required. Unique experiment ID (must match the folder name)
status: "draft"                         # Required. Status: draft when submitted, published after review
submit_time: "2026-10-29T12:00:00Z"     # Required. Submission timestamp in ISO 8601 UTC format
harness_name: "PenguinHarness"          # Required. Name of the Harness used
harness_version: "0.2.16"               # Required. Harness version in standard x.y.z format
harness_setting:                        # Optional. Custom Harness configuration object
  max_turns: 100
model_name: "deepseek-flash-1017"       # Required. Model name (include explicit version suffix for models like deepseek-flash)
model_provider: "deepseek"              # Required. Model provider
thinking_level: "high"                  # Required. Reasoning level: low | medium | high | xhigh | max
algorithm: "<plugin-id>"                # Optional. RSI algorithm plugin ID (must be a valid plugin_id)
training_data:                          # Optional. List of training benchmark-ids
  - "penguinharness-benchmark-gdpevo-crm-train"
validation_data:                        # Optional. List of validation benchmark-ids
  - "penguinharness-benchmark-gdpevo-crm-val"
test_data:                              # Required. List of test benchmark-ids
  - "penguinharness-benchmark-gdpevo-crm-test"
references:                             # Optional. List of original reference URLs (e.g., paper, report, or leaderboard)
  - "https://arxiv.org/abs/..."
author:                                 # Required. Author and submitter metadata
  name: "Author Name"                   # Required. Author or team name
  email: "author@example.com"           # Optional. Contact email
  homepage: "https://github.com/..."    # Optional. Author homepage URL (defaults to GitHub profile)
```

### `meta_info.yaml` Specification

Required fields:

- `experiment_id` — Unique identifier for the experiment. Must match the `<experiment-id>` directory name and contain only letters, digits, and hyphens `-` (underscores are not allowed).
- `status` — Current status: defaults to `"draft"` upon submission and becomes `"published"` after passing review.
- `submit_time` — Submission timestamp in ISO 8601 UTC format accurate to seconds (e.g., `"2026-10-29T12:00:00Z"`).
- `harness_name` — Name of the Agent Harness evaluated (string).
- `harness_version` — Version of the Harness in standard `x.y.z` format (e.g., `"0.2.16"`).
- `model_name` — Name of the backbone model evaluated (string). When using models such as `deepseek-flash` whose weights may update over time, **`model_name` must include the specific version suffix** (e.g., `"deepseek-flash-1017"`) to ensure reproducibility.
- `model_provider` — Model provider identifier (string, e.g., `"deepseek"`, `"google"`).
- `thinking_level` — Reasoning effort level, one of `"low"`, `"medium"`, `"high"`, `"xhigh"`, or `"max"`.
- `test_data` — List of test Benchmark IDs (array of strings); each item must be a valid `benchmark-id`.
- `author` — Author metadata object, where `author.name` (author or team name) is required.

Optional fields:

- `harness_setting` — Arbitrary key-value object recording custom Harness settings.
- `algorithm` — RSI algorithm plugin identifier (string); must be a valid `plugin_id`.
- `training_data` — List of training Benchmark IDs (array of strings); each item must be a valid `benchmark-id`.
- `validation_data` — List of validation Benchmark IDs (array of strings); each item must be a valid `benchmark-id`.
- `references` — List of original reference links (array of strings) recording where the Evaluation results or experimental setup originate from (e.g., paper URLs, technical reports, or public leaderboards).
- `author.email` — Contact email address of the author.
- `author.homepage` — Author homepage link (can default to a GitHub profile URL).

2. Inside each phase directory `experiments/<experiment-id>/<phase>/` (where `train` and `val` must have a numeric suffix like `train-1/`, `val-1/`, and `test/` is required and must never have a numeric suffix), create a `summary.yaml` file:

```yaml
time: "2026-10-29T12:00:00Z"            # Required. Phase completion timestamp (ISO 8601 UTC)
summary: "Improved prompt and skills."  # Optional. English summary of what changed in this phase
summary_zh: "优化了提示词与技能库。"      # Optional. Chinese summary of what changed in this phase
score_mean: 72.5                        # Required. Mean score across attempts
score_std: 1.8                          # Required. Sample standard deviation of scores
pass@k: 60.0                            # Required. Mean score of tasks passed across all n attempts (no std)
n_attempt: 3                            # Required. Number of repeated attempts
cost: 4.25                              # Required. Single-experiment cost in USD (based on MMSP list price)
duration_ms: 540000                     # Required. Single-experiment total duration in milliseconds
n_input_tokens: 1250000                 # Required. Single-experiment total input tokens (including cached tokens)
n_cache_tokens: 980000                  # Required. Single-experiment total cached tokens
n_output_tokens: 85000                  # Required. Single-experiment total output tokens
```

### `summary.yaml` Specification

Required fields:

- `time` — Timestamp when the phase finished, in ISO 8601 UTC format accurate to seconds (e.g., `"2026-10-29T12:00:00Z"`).
- `score_mean` — Mean score across repeated attempts in this phase (computed by first calculating each attempt's overall score and then averaging over attempts).
- `score_std` — Sample standard deviation of the attempt scores across repeated attempts in this phase.
- `pass@k` — Mean score of tasks that pass in **all $n$ attempts** ($k = \text{n\_attempt}$), averaged across all tasks. `pass@k` does not have a standard deviation.
- `n_attempt` — Number of repeated attempts in this phase (positive integer matching the number of `attempt-<n>.yaml` files, typically $n = 3$).
- `cost` — Cost of a single experiment in USD, calculated using the [MMSP Model List Prices](https://mmsp.penguin.ooo/zh/models/).
- `duration_ms` — Total duration of a single experiment in milliseconds.
- `n_input_tokens` — Total input tokens for a single experiment (including cached tokens).
- `n_cache_tokens` — Total cached input tokens for a single experiment.
- `n_output_tokens` — Total output tokens for a single experiment.

Optional fields:

- `summary` — English summary describing key changes or improvements in this phase.
- `summary_zh` — Chinese summary describing key changes or improvements in this phase.

### Score Calculation Formulas

Suppose a phase evaluates $M$ tasks ($i = 1, \dots, M$) across $n = \text{n\_attempt}$ repeated attempts ($j = 1, \dots, n$, typically $n = 3$), and let $s_{i,j}$ denote the score of task $i$ in the $j$-th attempt (`attempt-j.yaml`):

1. **Per-Attempt Overall Score ($S_j$)**: First compute the overall score of the $j$-th attempt across all $M$ tasks:

$$S_j = \frac{1}{M} \sum_{i=1}^{M} s_{i,j}$$

2. **Mean (`score_mean`) & Sample Standard Deviation (`score_std`)**: Compute the mean and sample standard deviation over the $n$ attempt scores $S_1, S_2, \dots, S_n$ (e.g., across 3 attempts):

$$\text{score\_mean} = \bar{S} = \frac{1}{n} \sum_{j=1}^{n} S_j$$

$$\text{score\_std} = \sqrt{\frac{1}{n - 1} \sum_{j=1}^{n} \left(S_j - \bar{S}\right)^2}$$

3. **`pass@k` ($k = n$)**: `pass@k` does not compute a standard deviation; it only counts the score of tasks that pass in **all $n$ attempts**, averaged across all $M$ tasks. Let $\mathbb{I}_i \in \{0, 1\}$ indicate whether task $i$ passes in all $n$ attempts ($\mathbb{I}_i = 1$ if all $n$ attempts pass, and $0$ otherwise), and let $s_i^*$ be the passing score of task $i$ ($100$ on a 100-point scale):

$$\text{pass@}k = \frac{1}{M} \sum_{i=1}^{M} \mathbb{I}_i \cdot s_i^*$$

3. Inside each phase directory `experiments/<experiment-id>/<phase>/`, create `attempt-<n>.yaml` files (e.g., `attempt-1.yaml`, `attempt-2.yaml`) recording the fine-grained task-level results for each attempt as a YAML list of objects:

```yaml
- benchmark_id: "penguinharness-benchmark-gdpevo-crm-test" # Required. Benchmark ID
  task_id: "CASE-001-account-renewal"                      # Required. Task ID
  time: "2026-10-29T12:00:00Z"                             # Required. Task completion timestamp (ISO 8601 UTC)
  score: 85.0                                              # Required. Score on this task
  cost: 0.42                                               # Required. Cost on this task in USD
  duration_ms: 52000                                       # Required. Duration on this task in milliseconds
  n_input_tokens: 125000                                   # Required. Total input tokens on this task (including cached tokens)
  n_cache_tokens: 98000                                    # Required. Total cached tokens on this task
  n_output_tokens: 8500                                    # Required. Total output tokens on this task
  trace_filepath: "traces/attempt-1/CASE-001.jsonl"        # Optional. Path to the execution trace file
  error_reason: ""                                         # Optional. Reason why the task failed or errored
```

### `attempt-<n>.yaml` Specification

Each item in the list records the result of a single task in that attempt:

Required fields:

- `benchmark_id` — Unique identifier of the Benchmark (`benchmark-id`) to which the task belongs.
- `task_id` — Unique identifier of the task (`task-id`).
- `time` — Timestamp when the task evaluation completed, in ISO 8601 UTC format accurate to seconds (e.g., `"2026-10-29T12:00:00Z"`).
- `score` — Score achieved on the task in this attempt.
- `cost` — Cost incurred on the task in USD (calculated using the [MMSP Model List Prices](https://mmsp.penguin.ooo/zh/models/)).
- `duration_ms` — Execution duration of the task in milliseconds.
- `n_input_tokens` — Total input tokens for the task in this attempt (including cached tokens).
- `n_cache_tokens` — Total cached input tokens for the task in this attempt.
- `n_output_tokens` — Total output tokens for the task in this attempt.

Optional fields:

- `trace_filepath` — Relative or archived file path to the execution trace for the task.
- `error_reason` — Reason why the current task errored or failed during execution or grading (string).

## GDPevo Evaluation Method

When evaluating self-evolution algorithms, we recommend using [GDPevo](https://arxiv.org/pdf/2608.03764) (such as the `GDPevo-essential` subset). GDPevo is partitioned into independent **Task Groups** across realistic enterprise domains, with each Task Group consisting of a training split (`*-train`) and a corresponding held-out test split (`*-test`):

1. **Per-Group Training**: For each Task Group $g \in \{1, \dots, G\}$, the Agent first runs the self-evolution algorithm on that group's training split (e.g., `penguinharness-benchmark-gdpevo-crm-train`) to evolve its prompts, skills, or workflow.
2. **Paired Test Evaluation**: The evolved Agent is then frozen and evaluated on the corresponding test split of the same Task Group (e.g., `penguinharness-benchmark-gdpevo-crm-test`), yielding the group test score $\bar{S}^{(g)}$. Training and evaluation across different Task Groups are strictly isolated.
3. **Average Across Task Groups**: The final GDPevo score is the arithmetic mean across all $G$ Task Groups:

$$S_{\text{GDPevo}} = \frac{1}{G} \sum_{g=1}^{G} \bar{S}^{(g)}$$
