# Roadmap

[English](README.md)

大家好，欢迎来到开源共建的 **Shared RSI Community**。

在 Agent 时代，研究的速度每日都在加快，每天都有新的东西出现，我们相信未来 **AutoResearch** 和 **自进化（RSI）** 都会成为现实。但现在缺少这么一个框架和平台，能让我们去“摸到” RSI 的边界，因此我们构建了这个 RSI 社区和平台，希望能让大家都用 RSI 的方法完成探索，做出跨领域的 AI 应用。

此前，我们构建了自进化 Agent 的企业级评估基准 [GDPevo](https://arxiv.org/pdf/2608.03764)，并撰写了 [RSI 综述](https://arxiv.org/abs/2610.14625)。目前我们的社区围绕两个构想展开：

1. **做好基建和工具链**：围绕 [PenguinHarness](https://penguin.ooo/) 自进化框架，让参与的同学能做非常靠近 RSI 核心的研究，鼓励不同机构之间合作探索。
2. **打造 Agent-native 与 RSI-native 开源社区**：我们希望做出像 Hugging Face 一样的国际知名开源社区，为此建立了 **[社区委员会](/zh/people/)**，主要负责两件事：
   - 发布和审核研究课题，保证社区的整体质量，通过**[任务板](/zh/quests/)**对齐进度。
   - 探讨 RSI 社区运作机制，链接外部资源，邀请更多同仁，把社区做得越来越热闹。

虽然社区还很早期，但是我们对 RSI 探索非常执着，很期待能和大家一起做大事。

## 核心工作方向

- **数据**：整理 Agent 相关的 Benchmark 数据和 Evaluation 结果，构建**最大的 RSI 榜单**。
- **综述**：调研**最新的 RSI 论文**，重新分类整理，完善 [Awesome RSI](https://github.com/Prism-Shadow/awesome-rsi) 综述仓库。
- **框架**：优化 [PenguinHarness](https://penguin.ooo/) 开源 **Agent 自进化框架**。

## 演进路线

> 对 Agent、自进化（RSI）、Harness（Agent 框架）及 Benchmark 等概念不熟悉的读者，可以先阅读**[基本概念](concepts.zh.md)**。

在**第一阶段**，我们先重点推进**数据**、**综述**和 **Harness 层进化**。Harness 层进化无需更新模型参数，对 GPU 算力和实验成本的要求都比较低，进化出的提示词、Skills 和工具也可直接跨模型迁移，方便大家低门槛参与实验，让 RSI 更加普惠。

在**第二阶段**，随着评测基准、算法插件与高质量进化轨迹的积累，我们会进一步扩展到**模型层的进化**：
- **轨迹合成**：利用自进化 Agent 框架在 Benchmark 上产生的高分轨迹（Traces），合成训练数据并蒸馏到模型参数中。
- **模型训练**：基于评测沙箱奖励信号开展监督微调（SFT）与强化学习（Agentic RL），提升模型的规划与工具调用能力。
- **协同进化**：结合外层 Agent 框架进化与内层模型训练，共同提升任务能力上限。

<figure class="flowchart"><svg class="flowchart-svg" viewBox="0 0 560 274" role="img" aria-labelledby="roadmap-zh-title"><title id="roadmap-zh-title">Shared RSI Community 演进路线图</title><defs><marker id="roadmap-zh-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" class="fc-arrowhead"/></marker></defs><rect x="16" y="10" width="528" height="112" rx="10" class="fc-stage-primary"/><text x="32" y="31" class="fc-stage-title">第一阶段</text><rect x="32" y="42" width="152" height="64" rx="6" class="fc-process"/><text x="108" y="69" class="fc-title" text-anchor="middle">数据</text><text x="108" y="91" class="fc-text" text-anchor="middle">RSI 榜单</text><rect x="204" y="42" width="152" height="64" rx="6" class="fc-process"/><text x="280" y="69" class="fc-title" text-anchor="middle">综述</text><text x="280" y="91" class="fc-text" text-anchor="middle">Awesome RSI</text><rect x="376" y="42" width="152" height="64" rx="6" class="fc-process"/><text x="452" y="69" class="fc-title" text-anchor="middle">Harness 层进化</text><text x="452" y="91" class="fc-text" text-anchor="middle">PenguinHarness</text><path d="M280 122V150" class="fc-edge" marker-end="url(#roadmap-zh-arrow)"/><rect x="16" y="152" width="528" height="112" rx="10" class="fc-stage-secondary"/><text x="32" y="173" class="fc-stage-badge">第二阶段 · 模型层进化</text><rect x="32" y="184" width="152" height="64" rx="6" class="fc-process"/><text x="108" y="211" class="fc-title" text-anchor="middle">轨迹合成</text><text x="108" y="233" class="fc-text" text-anchor="middle">经验蒸馏</text><rect x="204" y="184" width="152" height="64" rx="6" class="fc-process"/><text x="280" y="211" class="fc-title" text-anchor="middle">模型训练</text><text x="280" y="233" class="fc-text" text-anchor="middle">SFT &amp; Agentic RL</text><rect x="376" y="184" width="152" height="64" rx="6" class="fc-process"/><text x="452" y="211" class="fc-title" text-anchor="middle">协同进化</text><text x="452" y="233" class="fc-text" text-anchor="middle">Harness × 模型</text></svg><ol class="flowchart-steps"><li>第一阶段：数据（RSI 榜单）、综述（Awesome RSI）、Harness 层进化（PenguinHarness）。</li><li>第二阶段（模型层进化）：轨迹合成（经验内化与蒸馏）、模型训练（SFT &amp; Agentic RL）、协同进化（Harness × 模型）。</li></ol></figure>

## 参与指南

具体的流程请查看**[流程](../workflow/README.zh.md)**页面：
- 如何提交 Benchmark: [../workflow/benchmark.zh.md](../workflow/benchmark.zh.md)
- 如何提交 Evaluation: [../workflow/evaluation.zh.md](../workflow/evaluation.zh.md)
- 如何提交 Algorithm Plugin: [../workflow/algorithm.zh.md](../workflow/algorithm.zh.md)
- 如何参与 PenguinHarness 项目: [../workflow/harness.zh.md](../workflow/harness.zh.md)
- 如何提交论文到 Awesome RSI: [../workflow/survey.zh.md](../workflow/survey.zh.md)

我们会通过**[双周会](meetings.zh.md)**（规范见 [RFC-0004](../rfcs/RFC-0004-meeting.zh.md)）进行社区讨论，会议链接会在前一天发布在交流群，线下活动见**[社区活动](events.zh.md)**。

欢迎大家来参与到我们的开源社区建设中，我们也承诺：
- 每月活跃的贡献者将获得 Gemini 等一线模型的 **Token 资源包**。
- 成果显著的开源用户可以署名到我们的**开源仓库**中。
- 提交原创方法、原创实验结果的同学可以署名到我们即将发表的**论文**中。
