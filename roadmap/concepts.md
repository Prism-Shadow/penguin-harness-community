# Basic Concepts

[中文版](concepts.zh.md)

This page briefly introduces the core concepts used across our community docs: **Agent**, **Self-Evolution (RSI)**, **Harness**, **Harness-Level vs. Model-Level Self-Evolution**, and **Benchmark**.

## What is an Agent?

An **Agent** is a system powered by a foundation model that can **perceive its environment, plan autonomously, invoke tools (editing files, running commands, browsing the web, etc.), and iteratively complete complex tasks based on environment feedback**.

Unlike a single-turn chat model ("text in → text out"), an Agent operates in a multi-step closed loop (**Observe → Think → Act → Feedback**) to deliver verifiable artifacts.

## What is Self-Evolution (RSI)?

**Self-Evolution (Recursive Self-Improvement, RSI)** is the process where an agent uses its own execution **trajectories (Traces)** and **evaluation feedback** to automatically diagnose weaknesses and update its configuration or model weights, continuously improving on future tasks.

A standard loop has four steps: **Forward Rollout → Critique → Update → Verify & Select**.

<figure class="flowchart"><svg class="flowchart-svg" viewBox="0 0 560 132" role="img" aria-labelledby="concepts-rsi-en-title"><title id="concepts-rsi-en-title">Four-Step Self-Evolution (RSI) Loop</title><defs><marker id="concepts-rsi-en-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" class="fc-arrowhead"/></marker></defs><rect x="16" y="16" width="116" height="62" rx="6" class="fc-process"/><text x="74" y="42" class="fc-title" text-anchor="middle">1. Rollout</text><text x="74" y="62" class="fc-text" text-anchor="middle">Generate Traces</text><path d="M132 47H152" class="fc-edge" marker-end="url(#concepts-rsi-en-arrow)"/><rect x="154" y="16" width="116" height="62" rx="6" class="fc-process"/><text x="212" y="42" class="fc-title" text-anchor="middle">2. Critique</text><text x="212" y="62" class="fc-text" text-anchor="middle">Score &amp; Diagnose</text><path d="M270 47H290" class="fc-edge" marker-end="url(#concepts-rsi-en-arrow)"/><rect x="292" y="16" width="116" height="62" rx="6" class="fc-process"/><text x="350" y="42" class="fc-title" text-anchor="middle">3. Update</text><text x="350" y="62" class="fc-text" text-anchor="middle">Harness / Weights</text><path d="M408 47H428" class="fc-edge" marker-end="url(#concepts-rsi-en-arrow)"/><rect x="430" y="16" width="114" height="62" rx="6" class="fc-process"/><text x="487" y="42" class="fc-title" text-anchor="middle">4. Select</text><text x="487" y="62" class="fc-text" text-anchor="middle">Keep Best Branch</text><path d="M487 78V108H74V80" class="fc-edge" marker-end="url(#concepts-rsi-en-arrow)"/><text x="280" y="101" class="fc-label" text-anchor="middle">Next Generation Iteration</text></svg><ol class="flowchart-steps"><li>Rollout: Generate execution traces.</li><li>Critique: Score artifacts and diagnose weaknesses.</li><li>Update: Evolve Harness components or model weights.</li><li>Select: Retain improved candidates for the next generation.</li></ol></figure>

## What is a Harness?

If the foundation model is the "brain", the **Harness** is the **runtime architecture and control layer** wrapped around the model that turns it into a reliable engineering system (such as [PenguinHarness](https://penguin.ooo/)). It includes:
- **System Prompts**: e.g., `AGENTS.md`, defining operating rules and workflows.
- **Skills**: e.g., `SKILL.md` and scripts, packaging reusable domain knowledge and procedures loaded on demand.
- **Tools & Sandbox**: Execution interfaces for files, shell commands, browsers, and MCP servers.
- **Memory & Orchestration**: Cross-session memory, context compaction, and multi-agent (subagent) coordination.

<figure class="flowchart"><svg class="flowchart-svg" viewBox="0 0 560 206" role="img" aria-labelledby="concepts-harness-en-title"><title id="concepts-harness-en-title">Agent Architecture: Harness Layer vs. Model Layer</title><rect x="16" y="10" width="528" height="186" rx="10" class="fc-stage-primary"/><text x="32" y="31" class="fc-stage-title">Harness Layer (Stage 1 Evolution: Outer Runtime &amp; Control)</text><rect x="32" y="42" width="116" height="54" rx="6" class="fc-process"/><text x="90" y="65" class="fc-title" text-anchor="middle">Prompts</text><text x="90" y="84" class="fc-text fc-code" text-anchor="middle">AGENTS.md</text><rect x="158" y="42" width="116" height="54" rx="6" class="fc-process"/><text x="216" y="65" class="fc-title" text-anchor="middle">Skill Library</text><text x="216" y="84" class="fc-text fc-code" text-anchor="middle">Skills</text><rect x="284" y="42" width="116" height="54" rx="6" class="fc-process"/><text x="342" y="65" class="fc-title" text-anchor="middle">Tools &amp; Sandbox</text><text x="342" y="84" class="fc-text fc-code" text-anchor="middle">Tools &amp; MCP</text><rect x="410" y="42" width="118" height="54" rx="6" class="fc-process"/><text x="469" y="65" class="fc-title" text-anchor="middle">Memory</text><text x="469" y="84" class="fc-text fc-code" text-anchor="middle">Context &amp; Subagents</text><rect x="32" y="110" width="496" height="72" rx="8" class="fc-stage-secondary"/><text x="48" y="131" class="fc-stage-badge">Model Layer (Stage 2 Evolution: Neural Network Weights)</text><text x="280" y="152" class="fc-title" text-anchor="middle">Foundation Model</text><text x="280" y="171" class="fc-text" text-anchor="middle">Trajectory Distillation · Supervised Fine-Tuning (SFT) · Agentic RL</text></svg><ol class="flowchart-steps"><li>Outer Harness Layer (Stage 1 Evolution Target): Prompts (AGENTS.md), Skill Library (Skills), Tools &amp; Sandbox (Tools &amp; MCP), and Memory.</li><li>Inner Model Layer (Stage 2 Evolution Target): Foundation Model weights evolved via Trajectory Distillation, SFT, and Agentic RL.</li></ol></figure>

## Harness-Level vs. Model-Level Self-Evolution

Depending on **what gets updated**, self-evolution falls into **Harness-Level Self-Evolution** (evolving outer components) and **Model-Level Self-Evolution** (evolving model weights):

| Dimension | Harness-Level Evolution (Stage 1) | Model-Level Evolution (Stage 2) |
| :--- | :--- | :--- |
| **Target** | Prompts, Skills, tool code, memory, workflows | Neural network weights (full weights or LoRA) |
| **Methods** | Prompt optimization, skill synthesis/pruning, reflection | Trajectory distillation, SFT, Agentic RL |
| **Compute Barrier** | **Low**: Inference only (API calls); no training cluster needed | **High**: Multi-GPU clusters for rollouts and gradient updates |
| **Iteration Speed** | **Low cost, minutes to hours** | **High cost, days to weeks** |
| **Interpretability** | **High**: Human-readable Markdown/code, easy to audit and roll back | **Black-box**: Encoded in dense floating-point weights |
| **Transferability** | **Strong**: Evolved skills and workflows transfer across models | **Model-specific**: Tied to a single base model |

Our [Roadmap](README.md) progresses from **Harness-Level Evolution** to **Model-Level Evolution**: first accumulating benchmarks, algorithms, and high-quality traces at low cost, then distilling and reinforcing that experience into model weights.

## What is a Benchmark?

In self-evolution research, a **Benchmark** is a standardized task suite and automated grading environment that drives evolution and measures generalization (see [RFC-0001](../rfcs/RFC-0001-benchmark.md)):
- **Cases**: Each case provides an initial workspace (`input_dir`) and a task prompt (`Prompt`).
- **Evaluator**: Automated scripts, unit tests, or LLM judges that score final artifacts in `[0, 1]`.
- **Splits**: Partitioned into **Training (`train`, for evolving the agent)**, **Validation (`val`, for selection and preventing overfitting)**, and **Test (`test`, strictly frozen for final evaluation)**.

Together, **Benchmarks** provide the arena, **[Algorithm Plugins](../rfcs/RFC-0003-plugin.md)** provide the evolution algorithms, and **[Evaluations](../rfcs/RFC-0002-evaluation.md)** record pre- and post-evolution scores and traces:

<figure class="flowchart"><svg class="flowchart-svg" viewBox="0 0 560 100" role="img" aria-labelledby="concepts-bench-en-title"><title id="concepts-bench-en-title">How Benchmark, Plugin, and Evaluation Fit Together</title><defs><marker id="concepts-bench-en-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" class="fc-arrowhead"/></marker></defs><rect x="16" y="14" width="156" height="72" rx="8" class="fc-stage-primary"/><text x="94" y="42" class="fc-title" text-anchor="middle">Benchmark</text><text x="94" y="64" class="fc-text" text-anchor="middle">train / val / test Splits</text><path d="M172 50H200" class="fc-edge" marker-end="url(#concepts-bench-en-arrow)"/><rect x="202" y="14" width="156" height="72" rx="8" class="fc-stage-primary"/><text x="280" y="42" class="fc-title" text-anchor="middle">Algorithm Plugin</text><text x="280" y="64" class="fc-text" text-anchor="middle">Drives Agent Evolution</text><path d="M358 50H386" class="fc-edge" marker-end="url(#concepts-bench-en-arrow)"/><rect x="388" y="14" width="156" height="72" rx="8" class="fc-stage-secondary"/><text x="466" y="42" class="fc-title" text-anchor="middle">Evaluation</text><text x="466" y="64" class="fc-text" text-anchor="middle">Scores, Cost &amp; Traces</text></svg><ol class="flowchart-steps"><li>Benchmark: Provides train / val / test splits and automated grading.</li><li>Algorithm Plugin: Drives agent self-evolution on training splits.</li><li>Evaluation: Records scores, cost, and traces for the leaderboard.</li></ol></figure>
