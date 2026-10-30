# Basic Concepts

[中文版](concepts.zh.md)

This page briefly introduces the core concepts used across our community docs: **Agent**, **Self-Evolution (RSI)**, **Harness**, **Harness-Level vs. Model-Level Self-Evolution**, and **Benchmark**.

## What is an Agent?

An **Agent** is a system powered by a foundation model that can **perceive its environment, plan autonomously, invoke tools (editing files, running commands, browsing the web, etc.), and iteratively complete complex tasks based on environment feedback**.

Unlike a single-turn chat model ("text in → text out"), an Agent operates in a multi-step closed loop (**Observe → Think → Act → Feedback**) to deliver verifiable artifacts.

## What is Self-Evolution (RSI)?

**Self-Evolution (Recursive Self-Improvement, RSI)** is the process where an agent uses its own execution **trajectories (Traces)** and **evaluation feedback** to automatically diagnose weaknesses and update its configuration or model weights, continuously improving on future tasks.

A standard loop has four steps: **Forward Rollout → Critique → Update → Verify & Select**.

## What is a Harness?

If the foundation model is the "brain", the **Harness** is the **runtime architecture and control layer** wrapped around the model that turns it into a reliable engineering system (such as [PenguinHarness](https://penguin.ooo/)). It includes:
- **System Prompts**: e.g., `AGENTS.md`, defining operating rules and workflows.
- **Skills**: e.g., `SKILL.md` and scripts, packaging reusable domain knowledge and procedures loaded on demand.
- **Tools & Sandbox**: Execution interfaces for files, shell commands, browsers, and MCP servers.
- **Memory & Orchestration**: Cross-session memory, context compaction, and multi-agent (subagent) coordination.

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

Together, **Benchmarks** provide the arena, **[Algorithm Plugins](../rfcs/RFC-0003-plugin.md)** provide the evolution algorithms, and **[Evaluations](../rfcs/RFC-0002-evaluation.md)** record pre- and post-evolution scores and traces.
