# Basic Concepts

[中文版](concepts.zh.md)

To help researchers and developers new to the Recursive Self-Improvement (RSI) community quickly build a clear mental model, this page introduces the core concepts that appear throughout our roadmap and specifications: **Agents**, **Self-Evolution (RSI)**, **Harnesses**, **Harness-Level vs. Model-Level Self-Evolution**, and **Benchmarks**.

## What is an Agent?

An **Agent** is a system powered by a Large Language Model (LLM) or multimodal foundation model that combines **Perception**, **Planning**, **Tool Use**, and **Memory** to autonomously accomplish complex, multi-step goals within a real or sandboxed environment.

Unlike a traditional static chat model that maps a single text prompt to a single text reply, an Agent operates in a closed-loop interaction cycle with its environment:
1. **Observation**: Inspecting task instructions, code repositories, data files, or environment states.
2. **Reasoning & Planning**: Decomposing long-horizon goals into sub-tasks and adapting strategies when obstacles arise.
3. **Action**: Invoking tools—such as file editors, shell commands, code interpreters, browsers, or external APIs—to modify the environment.
4. **Feedback & Self-Correction**: Observing test outputs, compiler errors, or runtime feedback to iteratively refine its work until verifiable deliverables are produced.

## What is Self-Evolution (RSI)?

**Self-Evolution**—also referred to as **Recursive Self-Improvement (RSI)**—is the mechanism by which an agent system leverages its own execution trajectories (**Traces**) and environment evaluation signals (**Feedback**) to **autonomously diagnose weaknesses and iteratively update its own configuration or parameters**, achieving sustained performance gains on future tasks.

A standard self-evolution loop consists of four stages:
- **Forward Rollout**: The agent executes reasoning and tool calls on a set of tasks, producing complete interaction trajectories (thoughts, tool invocations, and final artifacts).
- **Evaluation & Critique**: An evaluator scores the resulting artifacts, while a critique module attributes successes and diagnoses root causes of failures.
- **Evolution / Update**: An evolution algorithm updates the agent system based on these signals—either by modifying outer-layer prompts, skill libraries, and tools (**Harness-Level Evolution**) or by updating underlying neural network weights (**Model-Level Evolution**).
- **Verification & Selection**: The updated agent is validated on held-out tasks, retaining beneficial mutations to seed the next generation.

## What is a Harness?

If the underlying foundation model is the "brain" or "engine" of an agent, the **Harness** is the complete **runtime architecture and control layer** wrapped around the model that turns a raw LLM into a reliable engineering system (such as [PenguinHarness](https://penguin.ooo/)).

A modern Agent Harness typically comprises the following evolvable components:
- **System Instructions & Specifications (`AGENTS.md`)**: Defines the agent's role boundaries, operating principles, workflows, and stopping criteria.
- **Modular Skill Library (`Skills`)**: Self-contained packages (`skills/<skill_name>/SKILL.md` and helper scripts) that encapsulate domain-specific standard operating procedures (SOPs), reference knowledge, and verification scripts loaded on demand.
- **Tools & Execution Sandbox**: Interfaces connecting the model to the digital world, including file operations, shell execution, browser automation, and MCP servers.
- **Memory & Context Management**: Mechanisms for cross-session experience persistence (long-term memory), long-horizon context compaction, and attention routing.
- **Multi-Agent Orchestration & Hooks**: Support for delegating parallel subtasks to subagents and running automated pre-/post-tool verification hooks.

## Harness-Level vs. Model-Level Self-Evolution

Depending on **which part of the agent system is updated** during evolution, self-evolution research falls into two primary paradigms: **Harness-Level Self-Evolution** and **Model-Level Self-Evolution**.

- **Harness-Level Self-Evolution**: Keeps the underlying foundation model weights frozen and improves performance by searching, rewriting, synthesizing, and pruning outer harness components—such as system prompts, skills, tool scripts, memory stores, and multi-agent workflows.
- **Model-Level Self-Evolution**: Directly updates the parameter weights of the foundation model itself—by distilling high-scoring trajectories back into the model via Supervised Fine-Tuning (SFT) or running Reinforcement Learning with Verifiable Rewards (RLVR / Agentic RL) to internalize discovered experience into model weights.

The table below summarizes their key differences and complementary roles:

| Dimension | Harness-Level Self-Evolution (Stage 1 Focus) | Model-Level Self-Evolution (Stage 2 Expansion) |
| :--- | :--- | :--- |
| **Evolution Target** | Outer components: system prompts (`AGENTS.md`), skills (`SKILL.md`), tool code, memory stores, workflow topology | Underlying model: neural network parameter weights (full weights or LoRA adapters) |
| **Core Mechanisms** | Meta-prompting, skill synthesis & pruning, tool code evolution, experience reflection & retrieval | Trajectory synthesis & distillation, Supervised Fine-Tuning (SFT), Agentic Reinforcement Learning (Agentic RL) |
| **GPU & Compute Barrier** | **Very Low**: Requires only model inference (API calls or lightweight local inference); no gradient backpropagation or large GPU clusters | **High**: Requires multi-GPU clusters for long-context rollout sampling, gradient computation, and weight updates |
| **Cost & Iteration Cycle** | **Low cost, minute-to-hour iterations**: Consumes only inference tokens, enabling rapid experimentation and reproduction | **High cost, day-to-week iterations**: Involves massive rollout sampling and training steps with longer feedback cycles |
| **Interpretability & Control** | **High**: Evolved artifacts are human-readable Markdown skills, prompts, or code—easy to inspect, edit, and roll back | **Black-box**: Capabilities are encoded in dense floating-point weights, making localized manual edits difficult |
| **Cross-Model Transferability** | **Strong**: Evolved skills and workflows can be directly mounted onto different foundation models | **Model-specific**: Trained weights apply only to the specific base model architecture |
| **Synergy** | Acts as an outer-loop explorer that discovers solutions at low cost and accumulates high-quality traces and skill assets | Acts as an inner-loop consolidator that internalizes explicit harness experience into model weights, raising the base model's ceiling |

This complementarity explains why our [Evolution Roadmap](README.md) adopts a **two-stage strategy**: we first rally the community around low-barrier, transparent **Harness-Level Evolution** to accumulate benchmarks, algorithms, and high-quality traces, and then expand into **Model-Level Evolution** and **Harness × Model Co-Evolution**.

## What is a Benchmark?

In self-evolution research, a **Benchmark** is more than a static test set—it is a **standardized task environment and grading system** designed to both drive agent evolution and rigorously measure generalization (see [RFC-0001 Benchmark](../rfcs/RFC-0001-benchmark.md) for full specifications).

A standard RSI Benchmark consists of three core elements:
1. **Task Cases (`Cases`)**: Each case provides an isolated initial workspace (`input_dir`) and a concrete task instruction (`Prompt`), spanning realistic long-horizon domains such as software engineering, data analysis, scientific discovery, and enterprise workflows.
2. **Independent Evaluator (`Evaluator`)**: An automated grading program strictly isolated from the test agent (using verification scripts, unit tests, or LLM judges) that inspects the agent's final workspace artifacts and outputs a normalized score in `[0, 1]`.
3. **Leakage-Free Splits for Self-Evolution (`Splits`)**:
   - Traditional evaluation requires only a single test split, whereas self-evolving agents need tasks to learn and iterate on.
   - An RSI Benchmark therefore partitions identically distributed tasks into a **Training Split (`train`, used by evolution algorithms to interact and extract experience)**, a **Validation Split (`val`, used for candidate selection and preventing overfitting during evolution)**, and a **Test Split (`test`, strictly frozen and evaluated only once at the end to measure true generalization)**.
   - For multi-domain benchmarks (such as [GDPevo](https://arxiv.org/pdf/2608.03764)), tasks can also be organized into paired Task Groups (`*-train` and `*-test`), where the agent evolves independently on each group's training split and is evaluated on the corresponding test split.

Within our community ecosystem, **Benchmarks** provide the standardized arena, **[Algorithm Plugins](../rfcs/RFC-0003-plugin.md)** provide data-decoupled self-evolution algorithms, and **[Evaluations](../rfcs/RFC-0002-evaluation.md)** record reproducible pre-evolution (`pre_evolution`) and post-evolution (`post_evolution`) trajectories and scores—together forming a transparent, comparable foundation for open RSI research.
