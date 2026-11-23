# Submit Evaluation

[中文版](evaluation.zh.md)

- Target Repository: [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark)
- Specification: [RFC-0002 Evaluation](../rfcs/RFC-0002-evaluation.md)

## Submission Workflow

1. **Learn the RFC Data Structure**: Read [RFC-0002 Evaluation](../rfcs/RFC-0002-evaluation.md) to understand the schema of `meta_info.yaml`, `summary.yaml`, and `attempt-<n>.yaml` under `experiments/<leaderboard-id>/<experiment-id>/` (where `train-<n>` and `val-<n>` must be followed by a number, and `test` must never be followed by a number).
2. **Open an Issue**: Open an Issue in [PenguinHarness Benchmark Issues](https://github.com/Prism-Shadow/penguin-harness-benchmark/issues) describing the target Benchmark, backbone model, Harness, and RSI algorithm setup.
3. **Claim in Issue Comments (Optional)**: Leave a comment on the Issue to claim the experiment (claiming is optional and prevents duplicate evaluation runs).
4. **Submit a PR**: Run the evaluation, organize `experiments/<leaderboard-id>/<experiment-id>/` according to `RFC-0002` (with `status: "draft"` in `meta_info.yaml`), and open a Pull Request linked to the Issue.
5. **Maintainer Review & Merge**: Review the PR against the [Evaluation PR merge criteria](#evaluation-pr-merge-criteria), then set `status` to `"published"` and merge once approved.

## Evaluation PR Merge Criteria

- **Reproducible setup.** Submit the configuration and results according to RFC-0002. For models whose weights change over time, record the specific version in `model_name` in `meta_info.yaml`, such as `deepseek-flash-1017`. In the PR description, include the benchmark version, test scope, run budget, key settings, and reproduction commands.
- **Comparable conditions.** When comparing runs, use the same test tasks and grading rules. Explain any differences in the setups and how they affect the conclusions. If training or tuning is involved, document the data splits and hold the test tasks out of training and tuning.
- **Complete run records.** Record every task in the declared test scope for each attempt in `attempt-<n>.yaml`. Include agent failures and timeouts, score them according to the rubric, and explain how they were handled. If infrastructure errors leave missing results, document the cause and complete the records before aggregating.
- **Verifiable summaries.** Check the scores, duration, token usage, and cost in `summary.yaml` against `attempt-<n>.yaml`. Report duration in milliseconds and cost in USD using MMSP model list prices. State which phases and runs the summary covers. For a single attempt, set `score_std: null`. The `pass@k` field is optional.

## Recommended Evaluation Guidelines & Examples

- **Recommended Setup for Self-Evolving (RSI) Algorithms**: When evaluating self-evolution algorithms, we recommend using the **DeepSeek Flash** model together with the **[GDPevo](https://arxiv.org/pdf/2608.03764) (`GDPevo-essential`)** dataset:
  - `GDPevo-essential` comprises six independent sub-benchmarks: `court-clerk-operations`, `coverage-review`, `engineering-portfolio-analytics`, `financial-control`, `portfolio-management`, and `service-ticket-resolution`.
  - Because each sub-benchmark is trained and evaluated independently (never combined into a single joint training run), **each sub-benchmark must be submitted as its own separate `<experiment-id>` folder** (see [penguin-harness-benchmark#18](https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/18)), and then aggregated across the six sub-benchmarks via [RFC-0005 Leaderboard](../rfcs/RFC-0005-leaderboard.md).
- **Recommended Setup for General Benchmarks**: For general Benchmarks (such as `penguinharness-benchmark-sec-a` through `sec-e`), we recommend running 3 repeated attempts (`n_attempt: 3`) with **DeepSeek Flash** and reporting `score_mean`, `score_std`, and optionally `pass@k`.

## Format Examples

### 1. Issue Example

**Title**: `[Evaluation] <experiment-id>: deepseek-flash-1017 + <Algorithm> on GDPevo-essential`

```markdown
### Experiment Setup
- **Experiment ID**: `<experiment-id>`
- **Harness**: `PenguinHarness` (`v0.2.16`)
- **Model**: `deepseek/deepseek-flash-1017` (`thinking_level: high`)
- **RSI Algorithm**: `<plugin-id>` (or none)
- **Train / Validation Data**: `GDPevo-essential` `*-train` splits (e.g., `penguinharness-benchmark-gdpevo-crm-train`)
- **Test Data**: `GDPevo-essential` `*-test` splits (e.g., `penguinharness-benchmark-gdpevo-crm-test`)
```

### 2. Issue Claim Comment Example (Optional)

```markdown
I am claiming this evaluation experiment and plan to submit the results PR by YYYY-MM-DD.
```

### 3. PR Example

**Title**: `feat(evaluation): add <experiment-id>`

```markdown
Closes #<issue-number>

### Results Summary
- **Experiment ID**: `<experiment-id>`
- **Model**: `deepseek/deepseek-flash-1017`
- **Test Phase (`test`) Score**: `<score_mean>` (include `± <score_std>` for multiple attempts), `pass@k` (optional): `<pass@k>` (`n_attempt: <N>`)
- **Single-Experiment Cost / Duration**: `$<cost>` / `<duration_ms> ms`
- **Reproduction and Records**: <benchmark version, test scope, run budget, key settings, reproduction commands, per-task records, and handling of failures>
- **Comparison Setup (if applicable)**: <links to comparison runs, shared evaluation conditions, and configuration differences>

### Checklist
- [x] Directory layout and YAML fields conform to RFC-0002 Evaluation
- [x] `train-<n>` / `val-<n>` phases have numeric suffixes, `test/` has no numeric suffix, and `status: "draft"` is set in `meta_info.yaml`
- [x] Recorded the model version as specified in RFC-0002 and checked summaries and MMSP pricing against the per-task records
```
