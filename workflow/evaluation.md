# Submit Evaluation

[中文版](evaluation.zh.md)

- Target Repository: [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark)
- Specification: [RFC-0002 Evaluation](../rfcs/RFC-0002-evaluation.md)

## Submission Workflow

1. **Learn the RFC Data Structure**: Read [RFC-0002 Evaluation](../rfcs/RFC-0002-evaluation.md) to understand the schema of `meta_info.yaml`, `summary.yaml`, and `attempt-<n>.yaml` under `experiments/<experiment-id>/` (where `train-<n>` and `val-<n>` must be followed by a number, and `test` must never be followed by a number).
2. **Open an Issue**: Open an Issue in [PenguinHarness Benchmark Issues](https://github.com/Prism-Shadow/penguin-harness-benchmark/issues) describing the target Benchmark, backbone model, Harness, and RSI algorithm setup.
3. **Claim in Issue Comments (Optional)**: Leave a comment on the Issue to claim the experiment (claiming is optional and prevents duplicate evaluation runs).
4. **Submit a PR**: Run the evaluation, organize `experiments/<experiment-id>/` according to `RFC-0002` (with `status: "draft"` in `meta_info.yaml`), and open a Pull Request linked to the Issue.
5. **Maintainer Review & Merge**: Wait for a maintainer to verify the experiment metadata, score statistics, and cost calculation; once approved, `status` is updated to `"published"` and the PR is merged.

## Recommended Evaluation Guidelines & Examples

- **Recommended Setup for Self-Evolving (RSI) Algorithms**: When evaluating self-evolution algorithms, we recommend using the **DeepSeek Flash** model together with the **[GDPevo](https://arxiv.org/pdf/2608.03764) (`GDPevo-essential`)** dataset:
  - `GDPevo-essential` comprises six domain Task Groups: `crm`, `erp`, `finance`, `healthcare`, `legal`, and `data-analysis`.
  - First train the Agent on each Task Group's training split (e.g., `penguinharness-benchmark-gdpevo-crm-train`), then evaluate the frozen Agent on the corresponding test split (e.g., `penguinharness-benchmark-gdpevo-crm-test`), and average the test scores across all Task Groups.
- **Recommended Setup for General Benchmarks**: For general Benchmarks (such as `penguinharness-benchmark-sec-a` through `sec-e`), we recommend running 3 repeated attempts (`n_attempt: 3`) with **DeepSeek Flash** and reporting `score_mean`, `score_std`, and `pass@k`.
- **Model Version Requirement**: When using models such as `deepseek-flash`, always include the specific version suffix in `model_name` inside `meta_info.yaml` (for example, `deepseek-flash-1017`).

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
- **Test Phase (`test`) Score**: `<score_mean> ± <score_std>`, `pass@k`: `<pass@k>` (`n_attempt: 3`)
- **Single-Experiment Cost / Duration**: `$<cost>` / `<duration_ms> ms`

### Checklist
- [x] Directory layout and YAML fields conform to RFC-0002 Evaluation
- [x] `train-<n>` / `val-<n>` phases have numeric suffixes, `test/` has no numeric suffix, and `status: "draft"` is set in `meta_info.yaml`
- [x] `model_name` includes the explicit version suffix (e.g., `deepseek-flash-1017`) and cost is calculated using MMSP model list prices
```
