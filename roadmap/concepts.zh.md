# 基本概念

[English](concepts.md)

本页简要介绍社区文档中的核心概念：**Agent**、**自进化（RSI）**、**Harness**、**Harness 层与模型层自进化的区别**，以及 **Benchmark**。

## 什么是 Agent

**Agent（智能体）** 是以大模型为核心，能够**感知环境、自主规划、调用工具（读写文件、执行命令、访问网络等）并根据环境反馈迭代完成复杂任务的系统**。

相比“单轮输入 → 单轮输出”的对话模型，Agent 运行在“**观察 → 思考 → 行动 → 反馈**”的多步闭环中，最终交付可验证的工程或任务产物。

## 什么是自进化（RSI）

**自进化（Self-Evolution / Recursive Self-Improvement, RSI）** 是指智能体根据自身执行任务产生的**轨迹（Traces）**与**评估反馈（Feedback）**，自动分析短板并更新自身配置或模型参数，从而在后续任务中持续提升能力的过程。

标准闭环包含四步：**前向执行（Rollout） → 评估归因（Critique） → 更新系统（Update） → 验证保留（Select）**。

<figure class="flowchart"><svg class="flowchart-svg" viewBox="0 0 560 132" role="img" aria-labelledby="concepts-rsi-zh-title"><title id="concepts-rsi-zh-title">自进化（RSI）四步闭环</title><defs><marker id="concepts-rsi-zh-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" class="fc-arrowhead"/></marker></defs><rect x="16" y="16" width="116" height="62" rx="6" class="fc-process"/><text x="74" y="42" class="fc-title" text-anchor="middle">1. 前向执行</text><text x="74" y="62" class="fc-text" text-anchor="middle">生成轨迹 Traces</text><path d="M132 47H152" class="fc-edge" marker-end="url(#concepts-rsi-zh-arrow)"/><rect x="154" y="16" width="116" height="62" rx="6" class="fc-process"/><text x="212" y="42" class="fc-title" text-anchor="middle">2. 评估归因</text><text x="212" y="62" class="fc-text" text-anchor="middle">打分与缺陷诊断</text><path d="M270 47H290" class="fc-edge" marker-end="url(#concepts-rsi-zh-arrow)"/><rect x="292" y="16" width="116" height="62" rx="6" class="fc-process"/><text x="350" y="42" class="fc-title" text-anchor="middle">3. 更新系统</text><text x="350" y="62" class="fc-text" text-anchor="middle">Harness / 权重</text><path d="M408 47H428" class="fc-edge" marker-end="url(#concepts-rsi-zh-arrow)"/><rect x="430" y="16" width="114" height="62" rx="6" class="fc-process"/><text x="487" y="42" class="fc-title" text-anchor="middle">4. 验证保留</text><text x="487" y="62" class="fc-text" text-anchor="middle">保留更优分支</text><path d="M487 78V108H74V80" class="fc-edge" marker-end="url(#concepts-rsi-zh-arrow)"/><text x="280" y="101" class="fc-label" text-anchor="middle">下一代自进化迭代（Next Generation）</text></svg><ol class="flowchart-steps"><li>前向执行：生成轨迹 Traces。</li><li>评估归因：打分与缺陷诊断。</li><li>更新系统：更新 Harness 或模型权重。</li><li>验证保留：保留更优分支并进入下一代迭代。</li></ol></figure>

## 什么是 Harness

如果把底层大模型比作“大脑”，**Harness（智能体底座/运行框架）** 就是包裹在模型外围、将其转化为可靠智能体的**运行时架构与控制层**（如 [PenguinHarness](https://penguin.ooo/)），主要包括：
- **系统提示词（Prompts）**：如 `AGENTS.md`，定义行为规范与工作流。
- **技能库（Skills）**：如 `SKILL.md` 与脚本，封装可按需加载的领域知识与操作流程。
- **工具与沙箱（Tools & Sandbox）**：文件、终端、浏览器与 MCP 等执行接口。
- **记忆与编排（Memory & Orchestration）**：跨会话记忆、上下文压缩与多智能体（Subagents）协作。

<figure class="flowchart"><svg class="flowchart-svg" viewBox="0 0 560 206" role="img" aria-labelledby="concepts-harness-zh-title"><title id="concepts-harness-zh-title">Agent 架构：Harness 层与模型层</title><rect x="16" y="10" width="528" height="186" rx="10" class="fc-stage-primary"/><text x="32" y="31" class="fc-stage-title">Harness 层（第一阶段进化：外围运行时与控制层）</text><rect x="32" y="42" width="116" height="54" rx="6" class="fc-process"/><text x="90" y="65" class="fc-title" text-anchor="middle">系统提示词</text><text x="90" y="84" class="fc-text fc-code" text-anchor="middle">AGENTS.md</text><rect x="158" y="42" width="116" height="54" rx="6" class="fc-process"/><text x="216" y="65" class="fc-title" text-anchor="middle">技能库</text><text x="216" y="84" class="fc-text fc-code" text-anchor="middle">Skills</text><rect x="284" y="42" width="116" height="54" rx="6" class="fc-process"/><text x="342" y="65" class="fc-title" text-anchor="middle">工具与沙箱</text><text x="342" y="84" class="fc-text fc-code" text-anchor="middle">Tools &amp; MCP</text><rect x="410" y="42" width="118" height="54" rx="6" class="fc-process"/><text x="469" y="65" class="fc-title" text-anchor="middle">记忆与编排</text><text x="469" y="84" class="fc-text fc-code" text-anchor="middle">Memory</text><rect x="32" y="110" width="496" height="72" rx="8" class="fc-stage-secondary"/><text x="48" y="131" class="fc-stage-badge">模型层（第二阶段进化：底层参数权重）</text><text x="280" y="152" class="fc-title" text-anchor="middle">基座大模型（Foundation Model）</text><text x="280" y="171" class="fc-text" text-anchor="middle">轨迹蒸馏 · 监督微调（SFT） · 智能体强化学习（Agentic RL）</text></svg><ol class="flowchart-steps"><li>外层为 Harness 层（第一阶段进化对象）：包含系统提示词（AGENTS.md）、技能库（Skills）、工具与沙箱（Tools &amp; MCP）、记忆与编排（Memory）。</li><li>内层为模型层（第二阶段进化对象）：基座大模型参数权重（通过轨迹蒸馏、SFT、Agentic RL 进化）。</li></ol></figure>

## Harness 层自进化与模型层自进化的区别

根据**更新对象的不同**，自进化分为 **Harness 层自进化**（外围组件进化）与 **模型层自进化**（底层权重进化）：

| 维度 | Harness 层自进化（第一阶段） | 模型层自进化（第二阶段） |
| :--- | :--- | :--- |
| **进化对象** | 提示词、Skills、工具代码、记忆库、工作流 | 基座模型的神经网络权重（全参数或 LoRA） |
| **核心方法** | 提示词优化、技能合成与修剪、经验反思检索 | 轨迹合成与蒸馏、监督微调（SFT）、强化学习（RL） |
| **算力门槛** | **低**：仅需模型推理（API 调用即可），无需训练集群 | **高**：需多卡 GPU 集群进行采样与梯度更新 |
| **迭代成本** | **低成本、分钟/小时级迭代** | **高成本、天/周级迭代** |
| **可解释性** | **高**：产物为可读的 Markdown 或代码，易于审计与回滚 | **黑盒**：能力编码在浮点数权重中 |
| **跨模型迁移** | **强**：进化出的 Skills 与工作流可直接迁移到其他模型 | **弱**：权重与特定基座模型绑定 |

社区采用**先 Harness 层进化、后模型层进化**的[路线图](README.zh.md)：先以低门槛的 Harness 进化沉淀评测基准、算法与高质量轨迹，再将这些显式经验蒸馏与强化到模型参数中。

## 什么是 Benchmark

在自进化研究中，**Benchmark（评测基准）** 是驱动智能体进化并检验其泛化能力的标准化任务集与自动判分环境（详见 [RFC-0001](../rfcs/RFC-0001-benchmark.zh.md)），包含：
- **任务用例（Cases）**：提供初始工作区（`input_dir`）与任务指令（`Prompt`）。
- **验证器（Evaluator）**：通过脚本、单测或 LLM Judge 对产物自动打分（归一化为 `[0, 1]`）。
- **数据划分（Splits）**：划分为**训练集（`train`，供算法进化学习）**、**验证集（`val`，供选优防过拟合）**与**测试集（`test`，严格冻结用于最终盲测）**。

在社区中，**Benchmark** 提供赛场，**[Algorithm Plugin](../rfcs/RFC-0003-plugin.zh.md)** 提供进化算法，**[Evaluation](../rfcs/RFC-0002-evaluation.zh.md)** 记录进化前后的得分与轨迹：

<figure class="flowchart"><svg class="flowchart-svg" viewBox="0 0 560 100" role="img" aria-labelledby="concepts-bench-zh-title"><title id="concepts-bench-zh-title">Benchmark、Plugin 与 Evaluation 协同关系</title><defs><marker id="concepts-bench-zh-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" class="fc-arrowhead"/></marker></defs><rect x="16" y="14" width="156" height="72" rx="8" class="fc-stage-primary"/><text x="94" y="42" class="fc-title" text-anchor="middle">Benchmark</text><text x="94" y="64" class="fc-text" text-anchor="middle">train / val / test 任务集</text><path d="M172 50H200" class="fc-edge" marker-end="url(#concepts-bench-zh-arrow)"/><rect x="202" y="14" width="156" height="72" rx="8" class="fc-stage-primary"/><text x="280" y="42" class="fc-title" text-anchor="middle">Algorithm Plugin</text><text x="280" y="64" class="fc-text" text-anchor="middle">驱动 Agent 自进化</text><path d="M358 50H386" class="fc-edge" marker-end="url(#concepts-bench-zh-arrow)"/><rect x="388" y="14" width="156" height="72" rx="8" class="fc-stage-secondary"/><text x="466" y="42" class="fc-title" text-anchor="middle">Evaluation</text><text x="466" y="64" class="fc-text" text-anchor="middle">记录得分、成本与轨迹</text></svg><ol class="flowchart-steps"><li>Benchmark：提供 train / val / test 任务集与自动判分。</li><li>Algorithm Plugin：在训练集上驱动 Agent 自进化。</li><li>Evaluation：记录各阶段得分、成本与轨迹并汇总至榜单。</li></ol></figure>
