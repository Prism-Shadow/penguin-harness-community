# Workflow

[中文版](README.zh.md)

All community contributions follow a unified collaboration workflow:

1. **Read the Specification**: Review the corresponding RFC specification or repository guide to understand the required directory layout and schema.
2. **Open an Issue**: Check existing Issues or open a new Issue in the target repository.
3. **Claim in Issue Comments (Optional)**: Leave a comment on the Issue to claim the task (claiming is optional and primarily prevents duplicate work).
4. **Submit a PR**: Open a Pull Request linking the Issue once the work is complete.
5. **Maintainer Review & Merge**: Wait for a maintainer to review and merge the PR into the main branch.

## Recommended Evaluation & Testing Setup

To keep experimental costs low and results directly comparable across the community, we recommend the following guidelines:

- **Submit Benchmark**: When verifying a newly formatted Benchmark, we recommend running **`pass@k`** (e.g., `n_attempt: 3`) with the **DeepSeek Flash** model, following the built-in example [`penguinharness-benchmark-sec-a`](https://github.com/Prism-Shadow/penguin-harness-benchmark/tree/main/packages/penguinharness-benchmark-sec-a).
- **Submit Evaluation**: For self-evolving (RSI) algorithms, we recommend evaluating with the **DeepSeek Flash** model on the **`GDPevo-essential`** dataset (covering six domain task groups—CRM, ERP, Finance, Healthcare, Legal, and DataAnalysis—training on each group's `*-train` split, evaluating on its paired `*-test` split, and averaging across task groups).
- **Submit Algorithm (Plugin)**: Keep the Plugin implementation decoupled from specific datasets (containing only the algorithm method), and test it with **DeepSeek Flash** on **`GDPevo-essential`** after implementation to verify whether it improves over the baseline.
- **Model Version Requirement**: When using models such as `deepseek-flash`, always include the explicit version suffix in `model_name` (for example, `deepseek-flash-1017`).

## Contribution Tracks

| Track | Target Repository | Specification | Workflow Guide |
| --- | --- | --- | --- |
| 01 Submit Benchmark | [penguin-harness-benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) | [RFC-0001 Benchmark](../rfcs/RFC-0001-benchmark.md) | [Submit Benchmark](benchmark.md) |
| 02 Submit Evaluation | [penguin-harness-benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) | [RFC-0002 Evaluation](../rfcs/RFC-0002-evaluation.md) | [Submit Evaluation](evaluation.md) |
| 03 Submit Algorithm | [penguin-harness-plugins](https://github.com/Prism-Shadow/penguin-harness-plugins) | [RFC-0003 Plugin](../rfcs/RFC-0003-plugin.md) | [Submit Algorithm](algorithm.md) |
| 04 Contribute to PenguinHarness | [penguin-harness](https://github.com/Prism-Shadow/penguin-harness) | — | [Contribute to PenguinHarness](harness.md) |
| 05 Contribute to Awesome RSI | [awesome-rsi](https://github.com/Prism-Shadow/awesome-rsi) | — | [Contribute to Awesome RSI](survey.md) |
