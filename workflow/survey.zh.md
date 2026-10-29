# 参与 Awesome RSI

[English](survey.md)

- 目标仓库：[Awesome RSI](https://github.com/Prism-Shadow/awesome-rsi)
- 综述论文：[RSI 研究综述](https://arxiv.org/abs/2610.14625)

## 参与流程

1. **阅读文章与仓库结构**：阅读我们的 [RSI 综述文章](https://arxiv.org/abs/2610.14625) 以及 [Awesome RSI](https://github.com/Prism-Shadow/awesome-rsi) 仓库，了解现有的分类维度与论文条目格式。
2. **创建 Issue 与评论区占坑（可选）**：在 [Awesome RSI Issues](https://github.com/Prism-Shadow/awesome-rsi/issues) 中创建 Issue 并在评论区留言占坑（占坑是可选步骤，主要用于防止多人同时整理同一批论文或分类维度造成撞车；单篇论文补充也可直接提交 PR）。
3. **提交 PR**：将新增或重新分类整理的 RSI 论文按仓库格式写入对应章节，向 [Awesome RSI](https://github.com/Prism-Shadow/awesome-rsi) 提交 Pull Request。
4. **Maintainer 审核合并**：等待 Maintainer 审核论文信息与分类维度，审核通过后合入主分支。

## 格式示例

### 1. Issue 示例

**标题**：`[Paper] Add <论文简称或方向>: <论文标题>`

```markdown
### 论文信息
- **标题**: <论文完整标题>
- **链接**: <arXiv / 代码仓库链接>
- **建议分类维度**: <对应 Awesome RSI 中的分类章节>
```

### 2. Issue 评论占坑示例（可选）

```markdown
我来认领这篇（批）论文的整理工作，预计在 YYYY-MM-DD 前提交 PR。
```

### 3. PR 示例

**标题**：`docs(papers): add <论文简称或方向>`

```markdown
Closes #<issue-number>

### 变更内容
- 在 `<分类章节>` 下新增论文《<论文标题>》（含论文链接、发表时间与开源代码链接）

### 自查清单
- [x] 论文链接、作者与年份信息准确无误
- [x] 条目排版与分类符合 Awesome RSI 仓库规范
```
