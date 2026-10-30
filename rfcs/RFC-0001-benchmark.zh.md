# RFC-0001 Benchmark

- Feature Name: `benchmark`
- Start Date: 2026-10-29
- RFC PR: [#14](https://github.com/Prism-Shadow/penguin-harness-community/pull/14)
- Updated by: [#15](https://github.com/Prism-Shadow/penguin-harness-community/pull/15)

[English](RFC-0001-benchmark.md)

Benchmark 是用来评估 Agent 的一组数据，不包含评估结果。Benchmark 包含多道题目，每道题目通常都包含题干（`statement`）和评分标准（`rubric`）。

我们构建了 [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) 开源仓库来整理所有的 Agent Benchmark。本标准定义的 Benchmark 格式旨在统一不同 Benchmark 的结构，从而让 Benchmark 的运行更加简易。我们采用 **Agent-driven** 的 Benchmark 组织形式，目的是让 Agent 可以自主运行 Benchmark、自动计算分数，并借助 [Harbor](https://github.com/harbor-framework/harbor) 等沙箱评估框架来防止评测作弊（Eval Hacking）。

## 目录结构

每个 Benchmark 分为 `packages/<benchmark-id>` 和可选的 `data/<benchmark-id>` 两部分，仓库的文件组织格式如下：

```text
penguin-harness-benchmark/
├── packages/
│   └── <benchmark-id>/
│       ├── <task-id>/
│       │   ├── statement/
│       │   │   └── README.md
│       │   ├── rubric/
│       │   │   └── README.md
│       │   └── task_config.toml
│       └── benchmark_config.toml
└── data/
    └── <benchmark-id>/
        └── README.md
```

- `packages/`：承载 Benchmark 的元信息和描述文件，轻量且便于在不同环境间快速迁移。如果任务体量较小，可以直接放在 `statement/`（题干）和 `rubric/`（评分标准）中；对于体量较大的任务，则将原始数据放到 `data/` 文件夹中。
- `data/`：存放体积较大的原始数据文件（例如 Harbor 格式的任务），避免迁移 `packages/` 时占用过多磁盘空间。如果是 Harbor 格式的任务，将 Harbor 的运行方式写入 `statement/` 中，并将 Harbor 的数据存放在 `data/` 下。

示例：[penguinharness-benchmark-sec-a](https://github.com/Prism-Shadow/penguin-harness-benchmark/tree/main/packages/penguinharness-benchmark-sec-a)

## 添加 Benchmark

要向仓库中添加一个新的 Benchmark，请按以下步骤组织文件：

1. 创建 `packages/<benchmark-id>` 文件夹，里面每道题使用 `<task-id>` 文件夹（例如 `CASE-001-<name>`）进行存放：
   - 与题目有关的部分放到 `statement/` 文件夹中（对被测 Agent 公开，描述任务目标、可用材料与交付要求）。
   - 与评测有关的部分放到 `rubric/` 文件夹中（仅对评测 Agent 可见，定义评分标准、分值与参考答案）。
   - `README.md` 是每个文件夹的入口文件（Agent 必读文件）。
2. 在 `packages/<benchmark-id>/` 下创建 `benchmark_config.toml` 配置文件：

```toml
id = "<benchmark-id>"                   # 必填。Benchmark 唯一标识，必须与文件夹名称一致
title = "Benchmark Title"               # 必填。Benchmark 的英文显示名称
title_zh = "Benchmark 标题"             # 选填。Benchmark 的中文显示名称
description = "..."                     # 必填。Benchmark 的英文简介
description_zh = "..."                  # 选填。Benchmark 的中文简介
version = "0.1.0"                       # 必填。版本号，采用标准的 x.y.z 格式
last_update = "2026-10-29T12:00:00Z"    # 必填。最后更新时间，精确到秒（ISO 8601）
status = "draft"                        # 必填。状态：提交时为 draft，审核通过后为 published

[author]                                # 必填。作者与维护者信息
name = "Author Name"                    # 必填。作者姓名或团队名称
email = "author@example.com"            # 选填。联系邮箱
homepage = "https://github.com/..."     # 选填。作者主页链接（默认可填 GitHub 主页）
```

### `benchmark_config.toml` 字段说明

必填字段：

- `id` — Benchmark 的唯一标识符，必须与所在的 `<benchmark-id>` 文件夹名称完全一致，仅允许包含字母、数字和连字符 `-`（不允许下划线）。
- `title` — Benchmark 的英文显示名称。
- `description` — Benchmark 的英文描述，简要说明评测目标、数据来源与评分方式。
- `version` — 版本号，采用标准的 `x.y.z` 语义化版本格式（例如 `"0.1.0"`）。
- `last_update` — 最后更新时间，精确到秒（ISO 8601 格式，例如 `"2026-10-29T12:00:00Z"`）。
- `status` — 当前状态，提交时默认为 `"draft"`，通过审核后为 `"published"`。
- `[author]` — 作者信息表，包含：
  - `name` — 作者姓名或团队名称。

选填字段：

- `title_zh` — Benchmark 的中文显示名称。
- `description_zh` — Benchmark 的中文描述。
- `author.email` — 作者联系邮箱。
- `author.homepage` — 作者主页链接（默认可填写 GitHub 主页链接）。

3. 在 `packages/<benchmark-id>/<task-id>/` 下创建 `task_config.toml` 配置文件：

```toml
id = "<task-id>"                        # 必填。题目唯一标识，必须与文件夹名称一致
title = "Task Title"                    # 必填。题目的英文显示名称
title_zh = "题目标题"                    # 选填。题目的中文显示名称
description = "..."                     # 必填。题目的英文简介
description_zh = "..."                  # 选填。题目的中文简介

[budget]                                # 选填。单题评测资源预算与运行限制（不填代表不限制）
timeout = 900                           # 选填。单次运行超时时间（单位：秒，不填代表不限制）
cpus = 4                                # 选填。CPU 核数限制（单位：核，不填代表不限制）
ram = 8                                 # 选填。内存大小限制（单位：GB，不填代表不限制）
disk = 20                               # 选填。磁盘空间限制（单位：GB，不填代表不限制）
gpus = 0                                # 选填。GPU 数量限制（单位：卡，0 表示不使用 GPU，不填代表不限制）
```

### `task_config.toml` 字段说明

必填字段：

- `id` — 题目的唯一标识符，必须与所在的 `<task-id>` 文件夹名称完全一致。
- `title` — 题目的英文显示名称。
- `description` — 题目的英文描述，简要说明单题评测目标与任务概要。

选填字段：

- `title_zh` — 题目的中文显示名称。
- `description_zh` — 题目的中文描述。
- `[budget]` — 单题评测预算与运行资源配置表（整个 `[budget]` 表及其中每一项均为选填，不填即代表对该项不设限制）：
  - `timeout` — 单次运行超时时间，单位为秒（例如 `900` 表示 15 分钟；不填代表不限制）。
  - `cpus` — 分配的 CPU 核数（例如 `4`；不填代表不限制）。
  - `ram` — 分配的内存大小，单位为 GB（例如 `8`；不填代表不限制）。
  - `disk` — 分配的磁盘空间，单位为 GB（例如 `20`；不填代表不限制）。
  - `gpus` — 分配的 GPU 数量（`0` 表示不使用 GPU，正整数表示卡数；不填代表不限制）。

4. （可选）如果题目包含体积较大的原始数据或沙箱环境文件（如 Harbor 任务），请将原始数据归纳到 `data/<benchmark-id>/` 文件夹中，并提供 `README.md` 说明文件。`data/<benchmark-id>/` 内部的数据组织形式不限，只要 Agent 可以参考 `packages/<benchmark-id>/` 中的元信息运行该 Benchmark 即可。

## 训练数据与 GDPevo 评估方法

训练数据同样可以组织成标准的 Benchmark 形式：在 `packages/<benchmark-id>/` 下按每道题一个 `<task-id>` 文件夹进行存放，并与测试数据集相对应（例如 [GDPevo](https://arxiv.org/pdf/2608.03764) 的训练数据 [penguinharness-benchmark-gdpevo-crm-train](https://github.com/Prism-Shadow/penguin-harness-benchmark/tree/main/packages/penguinharness-benchmark-gdpevo-crm-train) 与测试数据 [penguinharness-benchmark-gdpevo-crm-test](https://github.com/Prism-Shadow/penguin-harness-benchmark/tree/main/packages/penguinharness-benchmark-gdpevo-crm-test)）。

在 [GDPevo](https://arxiv.org/pdf/2608.03764) 的自进化评估协议中，数据按不同业务场景划分为多个独立的**任务组（Task Group）**（例如 `GDPevo-essential` 包含 CRM、ERP、Finance、Healthcare、Legal、DataAnalysis 六个领域的任务组）：
1. **分组自进化训练**：Agent 先在各自 Task Group 的训练集（`*-train`）上进行自进化训练（如归纳规则、沉淀或优化 Skill）。
2. **配对测试集评估**：训练完成后冻结 Agent 状态，在该 Task Group 对应的独立测试集（`*-test`）上进行评估。
3. **跨任务组取平均**：最后对所有 Task Group 在各自测试集上的评估结果取算术平均值，作为整个 GDPevo 数据集的最终成绩。
