# Roadmap

[中文版](README.zh.md)

Welcome to the Shared RSI Community! We focus on open-source research and engineering for Recursive Self-Improvement (RSI). Previously, we built [GDPevo](https://arxiv.org/pdf/2608.03764), an enterprise-grade evaluation benchmark for self-evolving agents, and authored a comprehensive [survey on RSI research](https://arxiv.org/abs/2610.14625).

Currently, we are iterating along the following tracks:
- **Data**: Curating agent Benchmark datasets and Evaluation results to build **the largest RSI Leaderboard**.
- **Survey**: Surveying **the latest RSI papers** and reorganizing their taxonomy to further improve the [Awesome RSI](https://github.com/Prism-Shadow/awesome-rsi) repository.
- **Framework**: Optimizing the [PenguinHarness](https://penguin.ooo/) unified RSI framework to build **the most comprehensive self-evolving harness**.

## Evolution Roadmap

In our initial stage, we focus on **Data**, **Survey**, and **Harness-Level Evolution**. Because harness-level evolution requires significantly less GPU compute and lower experimental cost, it makes RSI far more accessible and inclusive for the broader research and developer community. In the next stage, building upon the benchmarks, algorithm plugins, and evolution traces curated by the community, we will expand into **Model-Level Evolution**.

<figure class="flowchart"><svg class="flowchart-svg flowchart-wide" viewBox="0 0 680 340" role="img" aria-labelledby="roadmap-en-title"><title id="roadmap-en-title">Shared RSI Community Evolution Roadmap</title><defs><marker id="roadmap-en-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" class="fc-arrowhead"/></marker></defs><rect x="16" y="10" width="648" height="184" rx="12" class="fc-stage-primary"/><text x="36" y="38" class="fc-stage-title">Stage 1 (Current): Data, Survey &amp; Harness-Level Evolution</text><text x="644" y="38" class="fc-stage-badge" text-anchor="end">Low GPU &amp; Experiment Cost · Democratizing RSI</text><rect x="36" y="54" width="188" height="120" rx="8" class="fc-process"/><text x="130" y="84" class="fc-title" text-anchor="middle">Data</text><text x="130" y="112" class="fc-text" text-anchor="middle">Curate Agent Benchmarks</text><text x="130" y="134" class="fc-text" text-anchor="middle">&amp; Evaluation Results</text><text x="130" y="156" class="fc-label" text-anchor="middle">Largest RSI Leaderboard</text><rect x="246" y="54" width="188" height="120" rx="8" class="fc-process"/><text x="340" y="84" class="fc-title" text-anchor="middle">Survey</text><text x="340" y="112" class="fc-text" text-anchor="middle">Track Latest RSI Papers</text><text x="340" y="134" class="fc-text" text-anchor="middle">&amp; Refine Taxonomy</text><text x="340" y="156" class="fc-label" text-anchor="middle">Awesome RSI Repository</text><rect x="456" y="54" width="188" height="120" rx="8" class="fc-process"/><text x="550" y="84" class="fc-title" text-anchor="middle">Framework (Harness)</text><text x="550" y="112" class="fc-text" text-anchor="middle">Optimize PenguinHarness</text><text x="550" y="134" class="fc-text" text-anchor="middle">Prompt / Skill / Hook Evolution</text><text x="550" y="156" class="fc-label" text-anchor="middle">Self-Evolving Harness</text><path d="M340 194V234" class="fc-edge" marker-end="url(#roadmap-en-arrow)"/><text x="352" y="219" class="fc-label" text-anchor="start">Accumulate benchmarks, plugins &amp; evolution traces</text><rect x="16" y="238" width="648" height="92" rx="12" class="fc-stage-secondary"/><text x="340" y="272" class="fc-title" text-anchor="middle">Stage 2 (Next): Expand to Model-Level Evolution</text><text x="340" y="302" class="fc-text" text-anchor="middle">Extend from harness-level evolution to model-weight self-improvement built on community data &amp; traces</text></svg><ol class="flowchart-steps"><li>Stage 1 (Current): Advance Data (RSI Leaderboard), Survey (Awesome RSI), and Framework (PenguinHarness harness-level evolution) with low GPU and experimental cost requirements to make RSI widely accessible.</li><li>Stage 2 (Next): Expand into model-level evolution built on the benchmarks, plugins, and trajectories accumulated by the community.</li></ol></figure>

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
