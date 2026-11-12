# RFC-0004 双周会

- Feature Name: `meeting`
- Start Date: 2026-10-30
- RFC PR: [#21](https://github.com/Prism-Shadow/penguin-harness-community/pull/21)
- Updated by: N/A

[English](RFC-0004-meeting.md)

为了保持开放透明的社区协作，Shared RSI Community 定期举办线上**双周会（Bi-weekly Meeting）**，同步社区在数据、综述与框架各方向的建设进展，开展前沿 RSI **论文分享**，并为全体社区成员提供开放的技术交流与提案讨论时间。

## 会议安排与通知

- **举办时间**：暂定每两周一次，**北京时间周二下午 6:00（18:00 UTC+8）**（线上会议，通常为 45–60 分钟）。
- **通知方式**：会议的具体议程概要及线上会议链接会在会议**前一天**发布在社区微信交流群与 [Discord](https://discord.gg/eFHKqqcU3D) 频道。

## 会议流程

每次双周会包含**前半段（Maintainer 汇报社区进展与论文分享）**与**后半段（自由讨论时间）**两个环节：

<figure class="flowchart"><svg class="flowchart-svg" viewBox="0 0 560 228" role="img" aria-labelledby="rfc-0004-zh-title"><title id="rfc-0004-zh-title">双周会流程</title><defs><marker id="rfc-0004-zh-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" class="fc-arrowhead"/></marker></defs><rect x="16" y="10" width="528" height="96" rx="10" class="fc-stage-primary"/><text x="32" y="31" class="fc-stage-title">前半段 · Maintainer 汇报社区进展 &amp; 论文分享</text><rect x="32" y="42" width="152" height="50" rx="6" class="fc-process"/><text x="108" y="72" class="fc-title" text-anchor="middle">数据与榜单进展</text><rect x="204" y="42" width="152" height="50" rx="6" class="fc-process"/><text x="280" y="72" class="fc-title" text-anchor="middle">算法与框架进展</text><rect x="376" y="42" width="152" height="50" rx="6" class="fc-process"/><text x="452" y="72" class="fc-title" text-anchor="middle">前沿论文分享</text><path d="M280 106V122" class="fc-edge" marker-end="url(#rfc-0004-zh-arrow)"/><rect x="16" y="124" width="528" height="96" rx="10" class="fc-stage-secondary"/><text x="32" y="145" class="fc-stage-badge">后半段 · 自由讨论时间</text><rect x="32" y="156" width="152" height="50" rx="6" class="fc-process"/><text x="108" y="186" class="fc-title" text-anchor="middle">PR 与 RFC 提案评审</text><rect x="204" y="156" width="152" height="50" rx="6" class="fc-process"/><text x="280" y="186" class="fc-title" text-anchor="middle">算法与实验交流</text><rect x="376" y="156" width="152" height="50" rx="6" class="fc-process"/><text x="452" y="186" class="fc-title" text-anchor="middle">社区建议与协作配对</text></svg><ol class="flowchart-steps"><li>前半段（Maintainer 汇报社区进展与论文分享）：数据与榜单进展、算法与框架进展、前沿论文分享。</li><li>后半段（自由讨论时间）：PR 与 RFC 提案评审、算法与实验交流、社区建议与协作配对。</li></ol></figure>

### 1. 前半段：Maintainer 汇报社区进展与论文分享

由社区 Maintainer 汇总汇报过去两周的核心进展，并进行最新 RSI 论文分享（约 25–30 分钟）：
- **数据与榜单进展**：通报 [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) 近期新增或合入的 Benchmark 数据集、Evaluation 实验结果及 RSI 榜单排名变化。
- **算法插件与框架进展**：同步 [PenguinHarness Plugins](https://github.com/Prism-Shadow/penguin-harness-plugins) 新合入的 RSI 算法插件，以及 [PenguinHarness](https://penguin.ooo/) 框架的最新特性、修复与待认领任务。
- **论文分享**：围绕 [Awesome RSI](https://github.com/Prism-Shadow/awesome-rsi) 近期收录的前沿代表性论文展开专题分享，解读核心算法机制、实验设置与可复现思路（也欢迎社区成员报名主讲）。
- **贡献者致谢与激励公示**：公示近期活跃贡献者名单、模型 Token 资源包发放情况，以及开源仓库与合作论文的署名进展。

### 2. 后半段：自由讨论时间

面向所有参会成员开放讨论与提问（约 20–30 分钟）：
- **PR 与 RFC 提案讨论**：针对审核中的 Benchmark、Evaluation、Plugin 提交或新的 RFC 标准改动进行现场答疑与评议。
- **自进化算法与实验交流**：参会者自由分享近期在自进化实验中的发现、复现难点、评测心得或新算法想法。
- **社区建议与协作配对**：收集对社区标准、工具链与文档的改进建议，协助有共同研究兴趣的成员组队开展实验或共建新课题。

## 会后归档

每次双周会结束后，Maintainer 会整理简要的**会议纪要（Meeting Notes）**、录播视频与资料，归档在**[社区活动](../roadmap/events.zh.md)**页面并同步至社区交流群。
