# 提交 Algorithm

[English](algorithm.md)

- 提交入口：内置插件代码提交至 [PenguinHarness](https://github.com/Prism-Shadow/penguin-harness)。第三方插件发布后，按[插件索引提交指南](https://github.com/Prism-Shadow/penguin-harness-plugins/blob/main/CONTRIBUTING.md)提交收录条目。
- 插件格式：[PenguinHarness 插件文档](https://github.com/Prism-Shadow/penguin-harness/blob/main/packages/docs/content/plugins.zh.md)

## 提交流程

1. **确认插件格式**：按目标 PenguinHarness 版本的插件文档打包，并遵循 [RFC-0003 的算法与数据解耦原则](../rfcs/RFC-0003-plugin.zh.md#设计原则算法与数据解耦)。
2. **提出 Issue**：查找已有任务，或在对应项目仓库新建 Issue，说明计划实现或复现的 RSI 算法、论文来源与插件组件构成。
3. **Issue 评论区占坑（可选）**：在 Issue 评论区留言认领（占坑是可选步骤，主要用于防止多人同时开发同一个 RSI 算法插件撞车）。
4. **提交 PR**：完成插件开发与效果测试后，按提交入口选择仓库，并在 PR 中关联对应 Issue。
5. **Maintainer 审核合并**：按[算法 PR 合入标准](#算法-pr-合入标准)逐项审核，通过后合入。

## 算法 PR 合入标准

- **复现原方法**：附上论文或上游实现链接，指明原方法关键步骤对应的代码或 Skill。如有调整需说明具体差异；若改动了核心机制，应注明为原方法的变体。
- **插件可运行**。按目标 PenguinHarness 版本的格式打包。算法实现不得硬编码特定 Benchmark 数据集。按文档安装后，使用提供的调用示例（如 Quick Start）可以执行该算法。
- **实测有提升**。在适合该方法的真实任务上，用相同的测试题目和评分规则比较本 PR 的插件与基线，报告至少一项实测提升。提升可以是相同预算下得分更高，也可以是得分相当时 Token 消耗更少或用时更短。说明比较条件和预算包含哪些阶段。如有训练或进化阶段，分别报告该阶段与测试阶段的开销。
- **结果可复核**。列出测试任务、关键配置和复现命令。使用子集时说明选取范围和依据。附上基线与插件的结构化运行记录，可链接到评测 PR 或其他可查阅的记录。

## 推荐验证配置

- **推荐效果验证配置**：完成插件实现后，推荐使用 **DeepSeek Flash** 模型（注明具体版本号，如 `deepseek-flash-1017`）在 **[GDPevo](https://arxiv.org/pdf/2608.03764)（`GDPevo-essential`）** 数据集上进行测试（在各任务组的 `*-train` 上运行自进化，在对应的 `*-test` 上评估并取平均），验证该算法相比基线是否带来稳定的得分提升。
- 提交前也可以请 Agent 用 [penguin-plugin Skill](https://github.com/Prism-Shadow/penguin-harness/blob/main/plugins/agent-development/skills/penguin-plugin/SKILL.md) 检查插件结构、运行相关测试并确认目标仓库。

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
- [ ] 按目标 PenguinHarness 版本打包插件，提供可运行的调用示例
- [ ] 在适合该方法的任务上与基线对照（例如使用 `deepseek-flash-1017` 在 `GDPevo-essential` 上测试）
```

### 2. Issue 评论占坑示例（可选）

```markdown
我来认领该 RSI 算法插件的开发与复现，预计在 YYYY-MM-DD 前提交 PR。
```

### 3. PR 示例

下面是插件实现 PR 的示例。索引条目按插件索引提交指南填写。

**标题**：`feat(plugin): add <plugin-id>`

```markdown
Closes <完整 Issue URL，如适用>

### 变更内容
- 新增 `<plugin-id>/` 插件包，实现 <RSI 算法名称>（算法与具体数据解耦）
- **方法对应关系**：<论文或上游链接> → <核心机制及对应实现位置>；<与原方法的差异，如有>
- 提供插件的安装说明和调用示例

### 效果验证
- **测试条件**：<任务或子集及选取依据、模型版本或硬件、比较预算及所含阶段>
- **实测对照**：<指标及单位>：<基线配置与结果> → <使用插件的结果>；<适用时分别列出训练或进化开销与测试开销>
- **复现与记录**：<复现命令>；<基线与插件的运行记录链接或路径>

### 自查清单
- [x] 插件符合目标 PenguinHarness 版本的格式，算法实现与数据解耦
- [x] 已在目标 PenguinHarness 版本安装并运行调用示例
- [x] 已在可比条件下实测并记录相对基线的提升
```
