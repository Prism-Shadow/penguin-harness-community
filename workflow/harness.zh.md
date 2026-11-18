# 参与 PenguinHarness

[English](harness.md)

- 目标仓库：[PenguinHarness](https://github.com/Prism-Shadow/penguin-harness)
- 社区任务列表：[for-community Issues](https://github.com/Prism-Shadow/penguin-harness/issues?q=state%3Aopen%20label%3A%22for-community%22)

## 参与流程

1. **认领或创建 Issue**：前往 PenguinHarness 仓库查看带有 `for-community` 标签的开放 Issue（[点击查看](https://github.com/Prism-Shadow/penguin-harness/issues?q=state%3Aopen%20label%3A%22for-community%22)），或者针对新功能建议与问题修复创建带有 `for-community` 话题的 Issue。
2. **Issue 评论区占坑（可选）**：在目标 Issue 评论区留言说明认领计划（占坑是可选步骤，主要用于防止多人同时开发同一个需求造成工作撞车）。
3. **提交 PR**：完成代码开发与测试验证后，向 [PenguinHarness](https://github.com/Prism-Shadow/penguin-harness) 仓库提交 Pull Request 并关联对应 Issue。
4. **Maintainer 审核合并**：按 [PenguinHarness PR 合入标准](#penguinharness-pr-合入标准)审核，通过后合入主分支。

开发、测试或提交插件时，可以在 PenguinHarness 会话中请 Agent 使用 [penguin-plugin Skill](https://github.com/Prism-Shadow/penguin-harness/blob/main/plugins/agent-development/skills/penguin-plugin/SKILL.md)。

## PenguinHarness PR 合入标准

- **改动范围明确**。每个 PR 聚焦一项改动，说明解决的问题和用户会看到的变化。有对应 Issue 时，附上完整链接。
- **验证记录完整**。写明实际运行的检查及结果。修复问题时附复现步骤和修复后的验证结果。新增功能时说明如何验证，并补上相关测试。仓库要求的 CI 检查应通过。
- **文档与变更日志齐全**。按主仓库要求补齐中英文变更日志。涉及使用方式、接口或配置变更时，同步更新文档，并说明适用的迁移步骤。

使用英文填写 PR 标题和正文，具体要求见 [PenguinHarness 贡献指南](https://github.com/Prism-Shadow/penguin-harness/blob/main/.github/CONTRIBUTING.zh.md#pull-request)和 [PR 模板](https://github.com/Prism-Shadow/penguin-harness/blob/main/.github/PULL_REQUEST_TEMPLATE.md)。提交 RSI 算法插件时，也请参照[提交 Algorithm](algorithm.zh.md)。

## 格式示例

### 1. Issue 示例

**标题**：`[Feature / Fix] <简要描述功能或修复内容>`

```markdown
### 背景与目标
- 描述要解决的问题或希望新增的 PenguinHarness 功能

### 实现方案
- 简述拟修改的模块与实现思路
```

### 2. Issue 评论占坑示例（可选）

```markdown
我来认领这个 Issue，预计在 YYYY-MM-DD 前完成并提交 PR。
```

### 3. PR 示例

**标题**：`feat: <简要描述变更内容>`（或 `fix: <简要描述修复内容>`）

```markdown
## What this changes
<Describe the change and why it is needed.>
Closes <full Issue URL, if applicable>

## Verification
<List the checks or reproduction steps you ran and their results.>
```
