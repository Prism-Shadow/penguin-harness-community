# Roadmap

[中文版](README.zh.md)

Welcome to the Shared RSI Community! We focus on open-source research and engineering for Recursive Self-Improvement (RSI). Previously, we built [GDPevo](https://arxiv.org/pdf/2608.03764), an enterprise-grade evaluation benchmark for self-evolving agents, and authored a comprehensive [survey on RSI research](https://arxiv.org/abs/2610.14625).

Currently, we are iterating along the following tracks:
- **Data**: Curating agent Benchmark datasets and Evaluation results to build **the largest RSI Leaderboard**.
- **Survey**: Surveying **the latest RSI papers** and reorganizing their taxonomy to further improve the [Awesome RSI](https://github.com/Prism-Shadow/awesome-rsi) repository.
- **Framework**: Optimizing the [PenguinHarness](https://penguin.ooo/) unified RSI framework to build **the most comprehensive self-evolving harness**.

## Evolution Roadmap

> If you are new to core concepts such as Agents, Self-Evolution (RSI), Harnesses, the distinction between Harness-Level and Model-Level Evolution, and Benchmarks, check out **[Basic Concepts](concepts.md)** first.

In **Stage 1**, we focus on **Data**, **Survey**, and **Harness-Level Evolution**. Because harness-level evolution does not require updating underlying model weights, it demands significantly less GPU compute and lower experimental cost, while producing human-interpretable prompts, skills, and tools that transfer across models—making RSI far more accessible and inclusive for the broader research and developer community.

In **Stage 2**, building upon the benchmarks, algorithm plugins, and high-quality evolution traces accumulated by the community, we will expand into **Model-Level Evolution**:
- **Trajectory Synthesis & Distillation**: Leveraging high-scoring execution traces and evolved skill assets produced by self-evolving harnesses across diverse benchmarks in Stage 1 to synthesize and curate training data, internalizing explicit external experience into model weights.
- **Self-Evolving SFT & Agentic RL**: Driven by verifiable reward signals from standardized community sandboxes and automated evaluators, conducting supervised fine-tuning (SFT) and agentic reinforcement learning (Agentic RL) on long-horizon tasks to directly strengthen the base model's planning, tool use, and self-correction capabilities.
- **Harness × Model Co-Evolution**: Closing the bi-level loop between outer-loop harness search and inner-loop parameter updates—where stronger harnesses synthesize higher-ceiling trajectories for model training, and stronger models in turn empower harnesses to tackle more complex task boundaries.

<figure class="flowchart"><svg class="flowchart-svg" viewBox="0 0 560 274" role="img" aria-labelledby="roadmap-en-title"><title id="roadmap-en-title">Shared RSI Community Evolution Roadmap</title><defs><marker id="roadmap-en-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" class="fc-arrowhead"/></marker></defs><rect x="16" y="10" width="528" height="112" rx="10" class="fc-stage-primary"/><text x="32" y="31" class="fc-stage-title">Stage 1</text><rect x="32" y="42" width="152" height="64" rx="6" class="fc-process"/><text x="108" y="69" class="fc-title" text-anchor="middle">Data</text><text x="108" y="91" class="fc-text" text-anchor="middle">RSI Leaderboard</text><rect x="204" y="42" width="152" height="64" rx="6" class="fc-process"/><text x="280" y="69" class="fc-title" text-anchor="middle">Survey</text><text x="280" y="91" class="fc-text" text-anchor="middle">Awesome RSI</text><rect x="376" y="42" width="152" height="64" rx="6" class="fc-process"/><text x="452" y="69" class="fc-title" text-anchor="middle">Harness Evolution</text><text x="452" y="91" class="fc-text" text-anchor="middle">PenguinHarness</text><path d="M280 122V150" class="fc-edge" marker-end="url(#roadmap-en-arrow)"/><rect x="16" y="152" width="528" height="112" rx="10" class="fc-stage-secondary"/><text x="32" y="173" class="fc-stage-badge">Stage 2 · Model-Level Evolution</text><rect x="32" y="184" width="152" height="64" rx="6" class="fc-process"/><text x="108" y="211" class="fc-title" text-anchor="middle">Trajectory Synthesis</text><text x="108" y="233" class="fc-text" text-anchor="middle">Experience Distillation</text><rect x="204" y="184" width="152" height="64" rx="6" class="fc-process"/><text x="280" y="211" class="fc-title" text-anchor="middle">Model Training</text><text x="280" y="233" class="fc-text" text-anchor="middle">SFT &amp; Agentic RL</text><rect x="376" y="184" width="152" height="64" rx="6" class="fc-process"/><text x="452" y="211" class="fc-title" text-anchor="middle">Co-Evolution</text><text x="452" y="233" class="fc-text" text-anchor="middle">Harness × Model</text></svg><ol class="flowchart-steps"><li>Stage 1: Data (RSI Leaderboard), Survey (Awesome RSI), Harness Evolution (PenguinHarness).</li><li>Stage 2 (Model-Level Evolution): Trajectory Synthesis (Experience Distillation), Model Training (SFT &amp; Agentic RL), Co-Evolution (Harness × Model).</li></ol></figure>

## How to Participate

For detailed workflows, please refer to the **[Workflow](../workflow/README.md)** pages:
- How to submit a Benchmark: [../workflow/benchmark.md](../workflow/benchmark.md)
- How to submit an Evaluation: [../workflow/evaluation.md](../workflow/evaluation.md)
- How to submit an Algorithm Plugin: [../workflow/algorithm.md](../workflow/algorithm.md)
- How to contribute to PenguinHarness: [../workflow/harness.md](../workflow/harness.md)
- How to submit papers to Awesome RSI: [../workflow/survey.md](../workflow/survey.md)

We hold **Bi-weekly Sync** community meetings for discussion, with meeting links posted in our community group the day before.

We warmly welcome everyone to join our open-source community, and we commit to the following for contributors:
- Active monthly contributors will receive **token resource packages** for frontier models such as Gemini.
- Open-source contributors with significant contributions will be credited as authors in our **open-source repositories**.
- Contributors who submit original methods or original experimental results will be invited as co-authors on our upcoming **papers**.
