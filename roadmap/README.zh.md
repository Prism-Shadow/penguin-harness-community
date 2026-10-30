# Roadmap

[English](README.md)

大家好，欢迎来到开放共享的 RSI 社区，我们正在专注于和 RSI 有关的开源工作。此前，我们构建了自进化 Agent 的企业级评估基准 [GDPevo](https://arxiv.org/pdf/2608.03764)，撰写了一篇关于 RSI 研究的[综述文章](https://arxiv.org/abs/2610.14625)。

目前，我们正在围绕下面几个方向迭代：
- **数据**：整理 Agent 相关的 Benchmark 数据和 Evaluation 结果，构建**最大的 RSI 榜单**（RSI Leaderboard）。
- **综述**：调研**最新的 RSI 论文**，重新分类整理，进一步完善 [Awesome RSI](https://github.com/Prism-Shadow/awesome-rsi) 综述仓库。
- **框架**：优化 [PenguinHarness](https://penguin.ooo/) 统一 RSI 框架，构建**最全面的自进化 Harness**。

## 演进路线

> 对 Agent、自进化（RSI）、Harness、Harness 层与模型层自进化的区别以及 Benchmark 等核心概念尚不熟悉的读者，可以先阅读**[基本概念](concepts.zh.md)**。

在**第一阶段**，我们先重点推进**数据**、**综述**和 **Harness 层进化**。我们认为 Harness 层进化无需更新底层模型参数，对 GPU 算力和实验成本的要求都比较低，且进化出的提示词、技能（Skills）与工具具备极佳的可解释性与跨模型迁移能力，能够让更多研究者与开发者低门槛地参与实验与复现，从而让 RSI 更加普惠。

在**第二阶段**，随着社区评测基准、算法插件与高质量进化轨迹的积累，我们会进一步扩展到**模型层的进化**：
- **轨迹合成与经验蒸馏**：利用第一阶段由自进化 Harness 在多样化 Benchmark 上探索出的高分执行轨迹（Traces）与技能资产，自动化合成与清洗训练数据，将显式的外部经验内化（Internalize）到模型参数中。
- **自进化微调与强化学习**：基于社区标准化的评测沙箱与自动化验证器（Evaluator）提供可验证奖励信号，开展面向长程复杂任务的监督微调（SFT）与智能体强化学习（Agentic RL），直接提升基座模型的规划、工具调用与自我纠错能力。
- **Harness 与模型协同进化**：打通外层 Harness 搜索与内层模型参数更新的双层闭环——更强的 Harness 为模型训练合成更高上限的轨迹，进化后的模型又反哺 Harness 解锁更复杂的任务边界，实现架构与权重的协同演进。

<figure class="flowchart"><svg class="flowchart-svg" viewBox="0 0 560 274" role="img" aria-labelledby="roadmap-zh-title"><title id="roadmap-zh-title">Shared RSI Community 演进路线图</title><defs><marker id="roadmap-zh-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" class="fc-arrowhead"/></marker></defs><rect x="16" y="10" width="528" height="112" rx="10" class="fc-stage-primary"/><text x="32" y="31" class="fc-stage-title">第一阶段</text><rect x="32" y="42" width="152" height="64" rx="6" class="fc-process"/><text x="108" y="69" class="fc-title" text-anchor="middle">数据</text><text x="108" y="91" class="fc-text" text-anchor="middle">RSI 榜单</text><rect x="204" y="42" width="152" height="64" rx="6" class="fc-process"/><text x="280" y="69" class="fc-title" text-anchor="middle">综述</text><text x="280" y="91" class="fc-text" text-anchor="middle">Awesome RSI</text><rect x="376" y="42" width="152" height="64" rx="6" class="fc-process"/><text x="452" y="69" class="fc-title" text-anchor="middle">Harness 层进化</text><text x="452" y="91" class="fc-text" text-anchor="middle">PenguinHarness</text><path d="M280 122V150" class="fc-edge" marker-end="url(#roadmap-zh-arrow)"/><rect x="16" y="152" width="528" height="112" rx="10" class="fc-stage-secondary"/><text x="32" y="173" class="fc-stage-badge">第二阶段 · 模型层进化</text><rect x="32" y="184" width="152" height="64" rx="6" class="fc-process"/><text x="108" y="211" class="fc-title" text-anchor="middle">轨迹合成</text><text x="108" y="233" class="fc-text" text-anchor="middle">经验内化与蒸馏</text><rect x="204" y="184" width="152" height="64" rx="6" class="fc-process"/><text x="280" y="211" class="fc-title" text-anchor="middle">模型训练</text><text x="280" y="233" class="fc-text" text-anchor="middle">SFT &amp; Agentic RL</text><rect x="376" y="184" width="152" height="64" rx="6" class="fc-process"/><text x="452" y="211" class="fc-title" text-anchor="middle">协同进化</text><text x="452" y="233" class="fc-text" text-anchor="middle">Harness × 模型</text></svg><ol class="flowchart-steps"><li>第一阶段：数据（RSI 榜单）、综述（Awesome RSI）、Harness 层进化（PenguinHarness）。</li><li>第二阶段（模型层进化）：轨迹合成（经验内化与蒸馏）、模型训练（SFT &amp; Agentic RL）、协同进化（Harness × 模型）。</li></ol></figure>

## 参与指南

具体的流程请查看**[流程](../workflow/README.zh.md)**页面：
- 如何提交 Benchmark: [../workflow/benchmark.zh.md](../workflow/benchmark.zh.md)
- 如何提交 Evaluation: [../workflow/evaluation.zh.md](../workflow/evaluation.zh.md)
- 如何提交 Algorithm Plugin: [../workflow/algorithm.zh.md](../workflow/algorithm.zh.md)
- 如何参与 PenguinHarness 项目: [../workflow/harness.zh.md](../workflow/harness.zh.md)
- 如何提交论文到 Awesome RSI: [../workflow/survey.zh.md](../workflow/survey.zh.md)

我们会通过**双周会**的形式来进行社区讨论，会议链接会在前一天发布在交流群。

欢迎大家来参与到我们的开源社区建设中，我们也承诺：
- 每月活跃的贡献者将获得 Gemini 等一线模型的 **Token 资源包**。
- 成果显著的开源用户可以署名到我们的**开源仓库**中。
- 提交原创方法、原创实验结果的同学可以署名到我们即将发表的**论文**中。
