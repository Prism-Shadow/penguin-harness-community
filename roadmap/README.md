# Roadmap

[中文版](README.zh.md)

Welcome to the open-source **Shared RSI Community**.

In the Agent era, research velocity is accelerating every day with new breakthroughs emerging constantly — we believe both **AutoResearch** and **Self-Evolution (RSI)** will become reality. Yet there is still no unified framework and platform that lets us truly touch the boundary of RSI. We built this RSI community and platform so everyone can explore with RSI methods and build cross-domain AI applications.

Previously, we built [GDPevo](https://arxiv.org/pdf/2608.03764), an enterprise-grade evaluation benchmark for self-evolving agents, and wrote a [survey on RSI](https://arxiv.org/abs/2610.14625). Our community is built around two core ideas:

1. **Solid infrastructure and toolchains**: Centered around the [PenguinHarness](https://penguin.ooo/) self-evolution framework, enabling students and researchers to work on problems right at the core of RSI and encouraging cross-institutional collaboration.
2. **Building the largest open-source RSI community**: We aim to build an internationally recognized open-source community like Hugging Face, but more Agent-native and RSI-native. We established the **[Community Committee](/people/)** to focus on two key tasks:
   - Publishing and reviewing research topics to ensure overall quality, aligned through our **[Task Board](/quests/)**.
   - Exploring RSI community governance, connecting external resources, and inviting more collaborators.

Although the community is still early, we are deeply committed to exploring RSI and look forward to building something great together.

## Core Tracks

- **Data**: Curating Agent Benchmark datasets and Evaluation results to build **the largest RSI Leaderboard**.
- **Survey**: Surveying **the latest RSI papers** and reorganizing their taxonomy in [Awesome RSI](https://github.com/Prism-Shadow/awesome-rsi).
- **Framework**: Optimizing [PenguinHarness](https://penguin.ooo/), our open-source **self-evolving Agent framework**.

## Evolution Roadmap

> New to Agents, Self-Evolution (RSI), Harnesses (Agent Frameworks), or Benchmarks? See **[Basic Concepts](concepts.md)**.

In **Stage 1**, we focus on **Data**, **Survey**, and **Harness-Level Evolution**. Because harness-level evolution does not update model weights, it requires minimal GPU compute and cost, and the evolved prompts, skills, and tools transfer across models — making RSI accessible to everyone.

In **Stage 2**, as benchmarks, algorithms, and evolution traces accumulate, we will expand into **Model-Level Evolution**:
- **Trajectory Synthesis**: Using self-evolving Agent frameworks to generate high-scoring traces on benchmarks and distill them into model weights.
- **Model Training**: Running SFT and Agentic RL with reward signals from standardized evaluation sandboxes.
- **Co-Evolution**: Combining outer-loop Agent framework evolution with inner-loop model training.

<figure class="flowchart"><svg class="flowchart-svg" viewBox="0 0 560 274" role="img" aria-labelledby="roadmap-en-title"><title id="roadmap-en-title">Shared RSI Community Evolution Roadmap</title><defs><marker id="roadmap-en-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" class="fc-arrowhead"/></marker></defs><rect x="16" y="10" width="528" height="112" rx="10" class="fc-stage-primary"/><text x="32" y="31" class="fc-stage-title">Stage 1</text><rect x="32" y="42" width="152" height="64" rx="6" class="fc-process"/><text x="108" y="69" class="fc-title" text-anchor="middle">Data</text><text x="108" y="91" class="fc-text" text-anchor="middle">RSI Leaderboard</text><rect x="204" y="42" width="152" height="64" rx="6" class="fc-process"/><text x="280" y="69" class="fc-title" text-anchor="middle">Survey</text><text x="280" y="91" class="fc-text" text-anchor="middle">Awesome RSI</text><rect x="376" y="42" width="152" height="64" rx="6" class="fc-process"/><text x="452" y="69" class="fc-title" text-anchor="middle">Harness Evolution</text><text x="452" y="91" class="fc-text" text-anchor="middle">PenguinHarness</text><path d="M280 122V150" class="fc-edge" marker-end="url(#roadmap-en-arrow)"/><rect x="16" y="152" width="528" height="112" rx="10" class="fc-stage-secondary"/><text x="32" y="173" class="fc-stage-badge">Stage 2 · Model-Level Evolution</text><rect x="32" y="184" width="152" height="64" rx="6" class="fc-process"/><text x="108" y="211" class="fc-title" text-anchor="middle">Trajectory Synthesis</text><text x="108" y="233" class="fc-text" text-anchor="middle">Experience Distillation</text><rect x="204" y="184" width="152" height="64" rx="6" class="fc-process"/><text x="280" y="211" class="fc-title" text-anchor="middle">Model Training</text><text x="280" y="233" class="fc-text" text-anchor="middle">SFT &amp; Agentic RL</text><rect x="376" y="184" width="152" height="64" rx="6" class="fc-process"/><text x="452" y="211" class="fc-title" text-anchor="middle">Co-Evolution</text><text x="452" y="233" class="fc-text" text-anchor="middle">Harness × Model</text></svg><ol class="flowchart-steps"><li>Stage 1: Data (RSI Leaderboard), Survey (Awesome RSI), Harness Evolution (PenguinHarness).</li><li>Stage 2 (Model-Level Evolution): Trajectory Synthesis (Experience Distillation), Model Training (SFT &amp; Agentic RL), Co-Evolution (Harness × Model).</li></ol></figure>

## How to Participate

For detailed workflows, please refer to the **[Workflow](../workflow/README.md)** pages:
- How to submit a Benchmark: [../workflow/benchmark.md](../workflow/benchmark.md)
- How to submit an Evaluation: [../workflow/evaluation.md](../workflow/evaluation.md)
- How to submit an Algorithm Plugin: [../workflow/algorithm.md](../workflow/algorithm.md)
- How to contribute to PenguinHarness: [../workflow/harness.md](../workflow/harness.md)
- How to submit papers to Awesome RSI: [../workflow/survey.md](../workflow/survey.md)

We hold **[Bi-weekly Meetings](meetings.md)** (see [RFC-0004](../rfcs/RFC-0004-meeting.md)) for community discussion, with meeting links posted in our community group the day before. Offline events are listed in **[Community Events](events.md)**.

We warmly welcome everyone to join our open-source community, and we commit to the following for contributors:
- Active monthly contributors will receive **token resource packages** for frontier models such as Gemini.
- Open-source contributors with significant contributions will be credited as authors in our **open-source repositories**.
- Contributors who submit original methods or original experimental results will be invited as co-authors on our upcoming **papers**.
