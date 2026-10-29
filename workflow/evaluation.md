# Submit Evaluation

[中文版](evaluation.zh.md)

- Target Repository: [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark)
- Specification: [RFC-0002 Evaluation](../rfcs/RFC-0002-evaluation.md)

## Submission Workflow

1. **Learn the RFC Data Structure**: Read [RFC-0002 Evaluation](../rfcs/RFC-0002-evaluation.md) to understand the schema of `meta_info.yaml`, `summary.yaml`, and `attempt-<n>.yaml` under `experiments/<experiment-id>/`.
2. **Open an Issue**: Open an Issue in [PenguinHarness Benchmark Issues](https://github.com/Prism-Shadow/penguin-harness-benchmark/issues) describing the target Benchmark, backbone model, Harness, and RSI algorithm setup.
3. **Claim in Issue Comments (Optional)**: Leave a comment on the Issue to claim the experiment (claiming is optional and prevents duplicate evaluation runs).
4. **Submit a PR**: Run the evaluation, organize `experiments/<experiment-id>/` according to `RFC-0002` (with `status: "draft"` in `meta_info.yaml`), and open a Pull Request linked to the Issue.
5. **Maintainer Review & Merge**: Wait for a maintainer to verify the experiment metadata, score statistics, and cost calculation; once approved, `status` is updated to `"published"` and the PR is merged.

## Format Examples

### 1. Issue Example

**Title**: `[Evaluation] <experiment-id>: <Model> + <Algorithm> on <Benchmark>`

```markdown
### Experiment Setup
- **Experiment ID**: `<experiment-id>`
- **Harness**: `PenguinHarness` (`v0.2.16`)
- **Model**: `<model_provider>/<model_name>` (`thinking_level: high`)
- **RSI Algorithm**: `<plugin-id>` (or none)
- **Train / Validation Data**: `<train-benchmark-id>` / `<val-benchmark-id>`
- **Test Data**: `<test-benchmark-id>`
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
- **Test Phase (`test`) Score**: `<score_mean> ± <score_std>` (`n_attempt: <N>`)
- **Single-Experiment Cost / Duration**: `$<cost>` / `<duration_ms> ms`

### Checklist
- [x] Directory layout and YAML fields conform to RFC-0002 Evaluation
- [x] Includes the `test/` phase and sets `status: "draft"` in `meta_info.yaml`
- [x] Cost is calculated using the MMSP model list prices
```
