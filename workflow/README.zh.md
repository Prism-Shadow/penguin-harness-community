# 流程

[English](README.md)

社区所有开源贡献均遵循统一的协作流程：

1. **学习规范**：阅读对应的 RFC 标准文件或项目说明，了解目录结构与字段要求。
2. **创建 Issue**：在对应开源仓库中查看已有 Issue 或创建新 Issue。
3. **评论区占坑（可选）**：在目标 Issue 评论区留言认领（占坑是可选步骤，主要用于防止多人重复工作撞车）。
4. **提交 PR**：完成整理或开发后提交 Pull Request，并关联对应 Issue。
5. **Maintainer 审核合入**：等待 Maintainer 审核通过后合入主分支。

## 推荐评测与测试配置

为保证社区贡献的实验成本可控且结果可横向对比，各方向推荐遵循以下实验指导：

- **提交 Benchmark**：整理好新的 Benchmark 后，推荐使用 **DeepSeek Flash** 模型跑 **`pass@k`**（如 `n_attempt: 3`）进行验证与难度校准，可参考内置样例 [`penguinharness-benchmark-sec-a`](https://github.com/Prism-Shadow/penguin-harness-benchmark/tree/main/packages/penguinharness-benchmark-sec-a)。
- **提交 Evaluation**：对于自进化（RSI）算法的评估实验，推荐使用 **DeepSeek Flash** 模型配合 **`GDPevo-essential`** 数据集（包含 CRM、ERP、Finance、Healthcare、Legal、DataAnalysis 六个任务组，先在各自任务组的 `*-train` 上训练，再在对应的 `*-test` 上评估并取平均）。
- **提交 Algorithm（Plugin）**：插件实现应与具体数据解耦（仅包含算法方法部分）；实现完成后，推荐使用 **DeepSeek Flash** 模型和 **`GDPevo-essential`** 数据集测试算法相比基线是否有提升。
- **模型版本号要求**：若使用 `deepseek-flash` 等会随时间迭代权重的模型，在记录实验 `model_name` 时**必须加上具体版本号**，例如填写 `deepseek-flash-1017`。

## 贡献方向

| 方向 | 目标仓库 | 标准规范 | 流程指南 |
| --- | --- | --- | --- |
| 01 提交 Benchmark | [penguin-harness-benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) | [RFC-0001 Benchmark](../rfcs/RFC-0001-benchmark.zh.md) | [提交 Benchmark](benchmark.zh.md) |
| 02 提交 Evaluation | [penguin-harness-benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) | [RFC-0002 Evaluation](../rfcs/RFC-0002-evaluation.zh.md) | [提交 Evaluation](evaluation.zh.md) |
| 03 提交 Algorithm | [penguin-harness-plugins](https://github.com/Prism-Shadow/penguin-harness-plugins) | [RFC-0003 Plugin](../rfcs/RFC-0003-plugin.zh.md) | [提交 Algorithm](algorithm.zh.md) |
| 04 参与 PenguinHarness | [penguin-harness](https://github.com/Prism-Shadow/penguin-harness) | — | [参与 PenguinHarness](harness.zh.md) |
| 05 参与 Awesome RSI | [awesome-rsi](https://github.com/Prism-Shadow/awesome-rsi) | — | [参与 Awesome RSI](survey.zh.md) |
