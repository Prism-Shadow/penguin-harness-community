# RFC-0003 Plugin

[中文版](RFC-0003-plugin.zh.md)

A Plugin is a pluggable component of PenguinHarness that can bundle server modules, Skills, Hooks, and Workbenches. Unlike Benchmarks and Evaluations, a Plugin must be a standard **NPM package**.

Through this pluggable Plugin architecture, PenguinHarness can adapt to an unlimited variety of RSI algorithms simultaneously. Typically, we implement each RSI algorithm as a standalone Plugin. We built the open-source [PenguinHarness Plugins](https://github.com/Prism-Shadow/penguin-harness-plugins) repository to curate all community Plugins.

## Directory Structure

Each Plugin is stored under `<plugin-id>/`. The file structure of the repository is organized as follows:

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

- `skills/<skill-id>/SKILL.md`: Skill definitions contributed by the plugin (optional; may contain one or more Skills).
- `hooks/*.mjs`: Lifecycle hook scripts contributed by the plugin (optional; e.g., `stop.mjs`).
- `workbenches/<workbench-id>/`: Custom UI workbench packages contributed by the plugin (optional).
- `icon.svg`: SVG icon file for the plugin (optional).
- `package.json`: Standard NPM package manifest, augmented with a `penguin` field that provides display and quick-start metadata in PenguinHarness.

Example: [opro-rsi-toolkit/package.json](https://github.com/Prism-Shadow/penguin-harness/blob/main/plugins/opro-rsi-toolkit/package.json)

## Adding a Plugin

To add a new Plugin to the repository, organize its files as follows:

1. Create a `<plugin-id>` directory and organize `skills/`, `hooks/`, `workbenches/`, and an optional `icon.svg` according to the plugin's capabilities.
2. Create a `package.json` file inside `<plugin-id>/` containing standard NPM fields together with the `penguin` metadata block:

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

### `package.json` Specification

Standard NPM fields:

- `name` — NPM package name (e.g., `"@penguinharness/<plugin-id>"` or `"<plugin-id>"`). The unscoped name is `<plugin-id>` and may contain only letters, digits, and hyphens `-`.
- `version` — Plugin version in standard `x.y.z` SemVer format (e.g., `"0.1.0"`).
- `description` — English description of the NPM package.
- `license` — Open-source license identifier (e.g., `"Apache-2.0"` or `"MIT"`).
- `repository` — Repository metadata object (`type`, `url`, `directory`).
- `files` — Array of files and directories included when publishing the NPM package (e.g., `["icon.svg", "skills", "hooks", "workbenches"]`).
- `publishConfig` — NPM publishing configuration (typically `{ "access": "public" }`).

`penguin` extension fields (required):

- `penguin.title` — English display name shown in PenguinHarness.
- `penguin.description` — Full English description shown in the plugin detail view.
- `penguin.short_description` — One-line English summary shown on the plugin card.
- `penguin.category` — Plugin category; set to `"rsi"` for RSI algorithm plugins.
- `penguin.preinstall` — Whether the plugin is preinstalled by default; set to `false` for community plugins.
- `penguin.quick_start` — Quick-start configuration object that pre-fills a new chat draft:
  - `prompt` — Pre-filled English starter prompt (required).
  - `skills` — Array of Skill IDs pre-selected when starting the prompt (required, array of strings).

`penguin` extension fields (optional):

- `penguin.title_zh` — Chinese display name shown in the Chinese UI.
- `penguin.description_zh` — Full Chinese description shown in the plugin detail view.
- `penguin.short_description_zh` — One-line Chinese summary shown on the plugin card.
- `penguin.icon` — Relative path to the SVG icon inside the package (e.g., `"icon.svg"`).
- `penguin.quick_start.prompt_zh` — Pre-filled Chinese starter prompt in the Chinese UI.
