# RFC-0003 Plugin

[English](RFC-0003-plugin.md)

Plugin 是 PenguinHarness 的可插拔组件，可以包含服务端模块、Skills、Hooks 和 Workbenches。与 Benchmark 和 Evaluation 不同，一个 Plugin 必须为标准的 **NPM 包**。

通过可插拔的 Plugin 机制，PenguinHarness 具备同时适配任意数量 RSI 算法的能力。通常我们会将一个 RSI 算法实现为一个独立的 Plugin。我们构建了 [PenguinHarness Plugins](https://github.com/Prism-Shadow/penguin-harness-plugins) 开源仓库来整理所有的 Plugin。

## 目录结构

每个 Plugin 存放在 `<plugin-id>/` 目录下，仓库的文件组织格式如下：

```text
penguin-harness-plugins/
└── <plugin-id>/
    ├── skills/
    │   └── <skill-id>/
    │       └── SKILL.md
    ├── hooks/
    │   └── stop.mjs
    ├── workbenches/
    │   └── <workbench-id>/
    │       └── package.json
    ├── icon.svg
    └── package.json
```

- `skills/<skill-id>/SKILL.md`：插件包含的技能定义文件（可选，可包含一个或多个 Skill）。
- `hooks/*.mjs`：插件包含的生命周期钩子脚本（可选，例如 `stop.mjs`）。
- `workbenches/<workbench-id>/`：插件包含的可视化工作台工程（可选）。
- `icon.svg`：插件的 SVG 图标文件（可选）。
- `package.json`：标准 NPM 包清单文件，同时通过 `penguin` 字段提供插件在 PenguinHarness 中的显示与启动配置。

示例：[opro-rsi-toolkit/package.json](https://github.com/Prism-Shadow/penguin-harness/blob/main/plugins/opro-rsi-toolkit/package.json)

## 添加 Plugin

要向仓库中添加一个新的 Plugin，请按以下步骤组织文件：

1. 创建 `<plugin-id>` 文件夹，并按插件功能组织 `skills/`、`hooks/`、`workbenches/` 及可选的 `icon.svg` 图标。
2. 在 `<plugin-id>/` 下创建 `package.json` 文件，除标准 NPM 包字段外，需包含 `penguin` 扩展字段以辅助界面显示与快速启动：

```json
{
  "name": "@penguinharness/<plugin-id>",
  "version": "0.1.0",
  "description": "English description of the RSI plugin.",
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Prism-Shadow/penguin-harness-plugins.git",
    "directory": "<plugin-id>"
  },
  "files": [
    "icon.svg",
    "skills",
    "hooks",
    "workbenches"
  ],
  "publishConfig": {
    "access": "public"
  },
  "penguin": {
    "title": "Plugin Title",
    "title_zh": "插件标题",
    "description": "Detailed English description of the plugin.",
    "description_zh": "插件的详细中文描述。",
    "short_description": "One-line English summary for the plugin card.",
    "short_description_zh": "插件卡片展示的单行中文简介。",
    "category": "rsi",
    "preinstall": false,
    "icon": "icon.svg",
    "quick_start": {
      "prompt": "Use the `<skill-id>` Skill to ...",
      "prompt_zh": "使用 `<skill-id>` 技能……",
      "skills": [
        "<skill-id>"
      ]
    }
  }
}
```

### `package.json` 字段说明

标准 NPM 字段：

- `name` — NPM 包名称（如 `"@penguinharness/<plugin-id>"` 或 `"<plugin-id>"`），去掉 scope 后的名称即 `<plugin-id>`，仅允许包含字母、数字和连字符 `-`。
- `version` — 插件版本号，采用标准的 `x.y.z` 语义化版本格式（例如 `"0.1.0"`）。
- `description` — NPM 包的英文描述。
- `license` — 开源许可证标识（例如 `"Apache-2.0"` 或 `"MIT"`）。
- `repository` — 代码仓库信息对象（包含 `type`、`url`、`directory`）。
- `files` — 发布到 NPM 时包含的文件与目录列表（如 `["icon.svg", "skills", "hooks", "workbenches"]`）。
- `publishConfig` — NPM 发布配置（通常设为 `{ "access": "public" }`）。

`penguin` 扩展字段（必填）：

- `penguin.title` — 插件在 PenguinHarness 中显示的英文名称。
- `penguin.description` — 插件在详情页展示的完整英文描述。
- `penguin.short_description` — 插件卡片上展示的单行英文简介。
- `penguin.category` — 插件分类，RSI 算法插件固定填写 `"rsi"`。
- `penguin.preinstall` — 是否作为默认预装插件，社区提交的插件设为 `false`。
- `penguin.quick_start` — 插件「快速开始」配置对象，用于在新对话草稿中预填演示指令：
  - `prompt` — 预填的英文启动提示词（必填）。
  - `skills` — 启动时默认勾选的 Skill 名称数组（必填，字符串列表）。

`penguin` 扩展字段（选填）：

- `penguin.title_zh` — 插件在中文界面下显示的名称。
- `penguin.description_zh` — 插件在中文界面详情页展示的完整中文描述。
- `penguin.short_description_zh` — 插件卡片在中文界面下展示的单行中文简介。
- `penguin.icon` — 插件包内 SVG 图标文件的相对路径（例如 `"icon.svg"`）。
- `penguin.quick_start.prompt_zh` — 中文界面下预填的「快速开始」启动提示词。
