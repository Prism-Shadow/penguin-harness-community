# 提交 Algorithm

[English](algorithm.md)

- 目标仓库：[PenguinHarness Plugins](https://github.com/Prism-Shadow/penguin-harness-plugins)
- 标准格式：[RFC-0003 Plugin](../rfcs/RFC-0003-plugin.zh.md)

## 提交流程

1. **学习 RFC 文件结构**：先阅读 [RFC-0003 Plugin](../rfcs/RFC-0003-plugin.zh.md)，了解标准 NPM 插件包目录结构（`skills/`、`hooks/`、`workbenches/`、`icon.svg`）、算法与数据解耦原则，以及 `package.json` 中 `penguin` 扩展字段（含给出算法快速调用案例的 `quick_start`）的规范。
2. **提出 Issue**：在 [PenguinHarness Plugins Issues](https://github.com/Prism-Shadow/penguin-harness-plugins/issues) 中搜索或新建 Issue，说明计划实现或复现的 RSI 算法、论文来源与插件组件构成。
3. **Issue 评论区占坑（可选）**：在 Issue 评论区留言认领（占坑是可选步骤，主要用于防止多人同时开发同一个 RSI 算法插件撞车）。
4. **提交 PR**：按 `RFC-0003` 完成插件开发与效果测试后，向仓库提交 Pull Request 并关联 Issue。
5. **Maintainer 审核合并**：按[算法 PR 合入标准](#算法-pr-合入标准)逐项审核，通过后合入。

## 实现与测试指导

- **算法与数据解耦**：Plugin 的实现应只包含通用的 RSI 算法方法部分，不要与具体的 Benchmark 数据集绑定，以便插件能够直接迁移到不同 Benchmark 上运行。
- **完善 `quick_start` 快速调用案例**：在 `package.json` 的 `penguin.quick_start` 中提供一个清晰、可直接运行的算法快速调用示例提示词与默认挂载的 `skills`。
- **推荐效果验证配置**：完成插件实现后，推荐使用 **DeepSeek Flash** 模型（注明具体版本号，如 `deepseek-flash-1017`）在 **[GDPevo](https://arxiv.org/pdf/2608.03764)（`GDPevo-essential`）** 数据集上进行测试（在各任务组的 `*-train` 上运行自进化，在对应的 `*-test` 上评估并取平均），验证该算法相比基线是否带来稳定的得分提升。

## 算法 PR 合入标准

- **复现原方法**：附上论文或上游实现的链接，指出插件中哪些代码或 Skill 对应原方法的关键步骤。如有改动，说明改了什么；如果改变了核心机制，应标明是原方法的变体。
- **插件可运行**：插件须符合 RFC-0003。按文档安装后，应能在 PenguinHarness 中用 `quick_start` 示例跑通该算法。
- **实测有提升**：在适合该方法的真实任务上，将本 PR 的插件与基线对照，报告至少一项实测提升。例如，预算相同时，任务得分更高；任务质量相当时，消耗的 token 更少，或完成任务所需的时间更短。说明比较条件和主要取舍。
- **结果可复核**：列出测试任务或子集、关键配置和复现命令，附上可核对基线与插件实测结果的运行记录。

## 格式示例

### 1. Issue 示例

**标题**：`[Plugin] Add <plugin-id>: <RSI 算法名称>`

```markdown
### 算法插件简介
- **Plugin ID**: `<plugin-id>`
- **对应论文 / 方法**: <论文标题与链接>
- **包含组件**: `skills/` / `hooks/` / `workbenches/`

### 开发计划
- [ ] 实现 `<plugin-id>/skills/<skill-id>/SKILL.md`（与具体数据集解耦）
- [ ] 配置 `<plugin-id>/package.json`（含 `penguin` 扩展字段与 `quick_start` 快速调用案例）
- [ ] 在适合该方法的任务上与基线对照（例如使用 `deepseek-flash-1017` 在 `GDPevo-essential` 上测试）
```

### 2. Issue 评论占坑示例（可选）

```markdown
我来认领该 RSI 算法插件的开发与复现，预计在 YYYY-MM-DD 前提交 PR。
```

### 3. PR 示例

**标题**：`feat(plugin): add <plugin-id>`

```markdown
Closes #<issue-number>

### 变更内容
- 新增 `<plugin-id>/` 插件包，实现 <RSI 算法名称>（算法与具体数据解耦）
- **方法对应关系**：<论文或上游链接> → <核心机制及对应实现位置>；<与原方法的差异，如有>
- 配置 `package.json` 中的 `penguin` 字段（`category: "rsi"`、`preinstall: false`、`quick_start` 快速调用案例）

### 效果验证
- **测试条件**：<任务或子集、相关模型版本或硬件、比较预算>
- **实测对照**：<指标及单位>：<基线配置与结果> → <使用插件的结果>；<主要取舍，如有>
- **复现与记录**：<复现命令>；<基线与插件的运行记录链接或路径>

### 自查清单
- [x] 插件包结构与 `package.json` 字段符合 RFC-0003 Plugin 规范，且算法实现与数据解耦
- [x] 已在本地 PenguinHarness 中安装并通过 `quick_start` 快速调用案例验证
- [x] 已在可比条件下实测并记录相对基线的提升
```
