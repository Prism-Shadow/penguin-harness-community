# 插件市场配图

[English](README.md)

本目录存放 PenguinHarness 插件市场（应用内的插件页与 [penguin.ooo/plugins](https://penguin.ooo/plugins/)）的封面与截图，以及 `market.json`：它列出这些图片，并记录维护者的精选。服务端从本仓库拉取这份文档，校验后把图片提供给自己的应用；每个发行版也内置一份副本，在线文档无法获取时由它顶上。文档没有列出的插件照常上架，使用应用依据其名称与图标绘制的封面。

## 目录结构

```
market.json                   市场文档
<folder>/cover.webp           封面，1280x720
<folder>/cover-640.webp       封面缩略图，640x360
<folder>/shot-<n>.webp        第 n 张截图，1600x1000
<folder>/shot-<n>-640.webp    截图缩略图，640x400
<folder>/icon.png             可选，256x256
```

`@penguinharness/*` 的 `<folder>` 是去掉 scope 的包名（`a2ui/`），其他 scope 用 `<scope>__<name>`（`@acme/notes` → `acme__notes/`）。

## 市场文档

```json
{
  "schema": 1,
  "updated": "2026-11-17",
  "hero": ["@penguinharness/a2ui"],
  "selected": ["@penguinharness/a2ui", "@penguinharness/goal"],
  "plugins": {
    "@penguinharness/a2ui": {
      "cover": { "src": "a2ui/cover.webp", "thumb": "a2ui/cover-640.webp", "tone": "#745fac" },
      "screenshots": [
        {
          "src": "a2ui/shot-1.webp",
          "thumb": "a2ui/shot-1-640.webp",
          "caption": "A live weather card drawn inside the reply, with hourly and daily forecasts.",
          "captionZh": "回复里直接画出天气卡片，附逐小时与未来几天的预报。"
        }
      ]
    }
  }
}
```

- **键**是 npm 包名，不是裸插件名：两个 scope 下可能有同名插件。
- **`selected`**：维护者的精选，按展示顺序排列，最多 12 个。**`hero`**：精选中可以领衔轮播的插件，按轮换顺序排列，1 到 5 个，且都必须在 `selected` 中。服务端没有列出的名字会被跳过。
- **`plugins`**：按包名给出 `cover`（`src` 必填；`thumb` 与 `tone` 可选，`tone` 是封面底色，写作 `#rrggbb`）、可选的 `icon`，以及最多 6 张 `screenshots`（`src` 必填；`thumb` 与两种语言的说明可选）。`icon` 只用于索引里列出、尚未安装的插件：这类插件在服务端没有自己的图标。
- **路径**相对于本目录，只用小写 `[a-z0-9._/-]`，必须位于该包自己的目录内，以 `.webp`、`.png` 或 `.jpg` 结尾。
- **`updated`** 是最后一次编辑的日期。服务端把它计入每张图片的缓存键，所以图片有改动时必须更新它；`to-webp.py` 会自动更新。
- 文档中没有任何计数、排名或评分，也没有容纳它们的字段。

读取方忽略不认识的键。`schema` 不是 1 或不符合上述规则的文档整份不用，由发行版内置的副本顶上。

## 图片规格

| 类型 | 比例 | 发布文件 | 缩略图 | 体积上限 |
| --- | --- | --- | --- | --- |
| 封面 | 16:9 | 1280×720，WebP q≈82 | 640×360，WebP q≈80 | ≤ 150 KB / ≤ 45 KB |
| 截图 | 16:10 | 1600×1000，WebP q≈82 | 640×400，WebP q≈80 | ≤ 300 KB / ≤ 45 KB |
| 图标（可选） | 1:1 | 256×256 PNG，透明底，以封面底色绘制 | — | ≤ 30 KB |

- 格式为 WebP（首选）、PNG 或 JPEG，sRGB，不得是动图。不接受 SVG 与 GIF：服务端把这些文件当作自己的图片提供，并从字节判断类型。KB 按 1,000 字节计。
- **封面不带文字**，一张图服务所有语言；标题由应用写在封面下方。只允许与语言无关的字形：缩写、命令提示符、不表示结果的数字。主体放在中央 80 % 范围内。封面上不出现分数、下载量或「第一名」。
- **截图必须真实**：插件运行时自己的界面，1600×1000（最简单的做法是 800×500 视口、设备缩放 2），默认 Frost 浅色主题，与主题相关的插件除外。工作台插件的第一张截图就是它的工作台。
- **截图说明**：每条一句话，最多 80 个字符，两种语言都写或都不写。

## 精选

「精选」（Selected）是维护者的编辑选择，不是热度排名：界面上从不使用「热门」「Top」「趋势」之类的词。入选的条件是：

- 全新安装后开箱即用；
- 有一个用一句提示就能展示其价值的快速开始；
- 有真实截图；
- 仍在维护：带日期的版本持续更新；
- 整个精选集合覆盖各个分类。

市场不设热度榜，因为目前没有能如实衡量插件热度的数据：内置插件是服务端与 CLI 的依赖，产品每被安装一次，npm 就为它们全部计数一次；它们共用一个 GitHub 仓库，Star 数说明不了其中任何一个；服务端也不上报遥测数据。市场改为展示真实的信息：本 Project 有多少个 Agent 在用某个插件，以及它的版本有多新。

## 申请上架

向本仓库提交 Pull Request，加入你的包目录及其封面（如有截图一并加入）、`market.json` 中 `plugins` 下的条目；如果你的包没有随 PenguinHarness 内置，再加一个 `icon.png`。下文的检查必须通过。如果希望入选精选，请在 Pull Request 中说明；维护者按上述条件决定。

## 制作封面

封面是一个家族下的四个系列：一种色相的纯色底（应用着色所用色相的 `oklch(54% 0.12 H)`），白色线条，插件自己的图标放大后作为唯一的背景纹样，产品标志位于左下角：

| 系列 | 用于 | 画面 |
| --- | --- | --- |
| A，插画场景 | 大多数插件 | 描绘插件用途的简洁矢量场景 |
| B，字标 | RSI 工具包 | 方法名作为巨幅字标，前面是版本迭代的循环图 |
| C，真实界面 | 工作台插件，以及产出界面的插件 | 窗口中的真实截图，溢出画面边缘 |
| D，徽记 | 沙箱后端 | 石板灰底，一个徽记 |

封面由 [`scripts/plugin-covers/`](../../scripts/plugin-covers) 中的流水线渲染。它手动运行、不进 CI，需要一份已安装依赖的 PenguinHarness 检出（提供 Playwright、字标字体与产品标志）、Node 和带 Pillow 的 Python 3：

```sh
cd scripts/plugin-covers
# 依据 template/art.json 与 template/scenes/ 渲染 1600x900 母版，同时写出每张封面的底色
node render.mjs --plugins <harness checkout>/plugins --art template/art.json --out <tmp>
# 依据 template/shots.json 从 assets/blog-assets/ 裁出 1600x1000 的截图母版
python3 cut-shots.py template/shots.json --out <tmp>
# 生成符合体积上限的发布尺寸，并连同 tone 写入 market.json
python3 to-webp.py <tmp> --into ../../assets/plugins/
# 白底与近黑底各一张的样张，提交前逐张检查封面
node sheet.mjs ../../assets/plugins <out-prefix> --match '^cover\.webp$' --root <harness checkout>
```

`render.mjs --icons` 还会把每个插件的 `icon.svg` 栅格化为 `icon.png`；`--plugins` 可以指向其他仓库的插件目录。自带母版的插件（1600×900 的 `cover.png`、1600×1000 的 `shot-<n>.png`）把母版放进 `<tmp>/<folder>/`，单独运行 `to-webp.py` 即可。母版从不提交。

## 检查

`node scripts/check-plugin-assets.mjs` 按上述规则检查文档，逐个检查文件的尺寸、格式与体积，并在本目录中出现文档未列出的文件时报错。每个改动本目录的 Pull Request 都会运行它。
