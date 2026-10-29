# 参与 PenguinHarness

[English](harness.md)

- 目标仓库：[PenguinHarness](https://github.com/Prism-Shadow/penguin-harness)
- 社区任务列表：[for-community Issues](https://github.com/Prism-Shadow/penguin-harness/issues?q=state%3Aopen%20label%3A%22for-community%22)

## 参与流程

1. **认领或创建 Issue**：前往 PenguinHarness 仓库查看带有 `for-community` 标签的开放 Issue（[点击查看](https://github.com/Prism-Shadow/penguin-harness/issues?q=state%3Aopen%20label%3A%22for-community%22)），或者针对新功能建议与问题修复创建带有 `for-community` 话题的 Issue。
2. **Issue 评论区占坑（可选）**：在目标 Issue 评论区留言说明认领计划（占坑是可选步骤，主要用于防止多人同时开发同一个需求造成工作撞车）。
3. **提交 PR**：完成代码开发与测试验证后，向 [PenguinHarness](https://github.com/Prism-Shadow/penguin-harness) 仓库提交 Pull Request 并关联对应 Issue。
4. **Maintainer 审核合并**：等待 Maintainer 审核代码与测试结果，审核通过后合入主分支。

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
Closes #<issue-number>

### 变更内容
- 简述本次 PR 完成的功能或修复点

### 验证方式
- [x] 已通过项目单元测试、类型检查与构建验证
```
