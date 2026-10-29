export type Locale = "en" | "zh";

export const LOCALES: Locale[] = ["en", "zh"];

export function localePath(locale: Locale, path: string): string {
  return locale === "zh" ? `/zh${path}` : path;
}

export function localeOf(pathname: string): Locale {
  return pathname === "/zh" || pathname.startsWith("/zh/") ? "zh" : "en";
}

export function stripLocale(pathname: string): string {
  return pathname.replace(/^\/zh(?=\/|$)/, "") || "/";
}

export const STRINGS = {
  en: {
    htmlLang: "en",
    siteTitle: "Shared RSI Community",
    description: "Shared RSI Community — RSI Benchmark × Evaluation × Algorithm",
    nav: {
      overview: "Overview",
      roadmap: "Roadmap",
      workflow: "Workflow",
      rfc: "RFCs",
      github: "GitHub",
    },
    theme: { label: "Theme", light: "Light", dark: "Dark", system: "Follow system" },
    lang: { label: "Language", en: "English", zh: "中文", switch: "Switch to 中文" },
    docs: {
      title: "Community Docs",
      onThisPage: "On this page",
      previous: "Previous",
      next: "Next",
      edit: "Edit this page on GitHub",
      copy: "Copy Markdown",
      copied: "Copied",
      copyFailed: "Copy failed",
      markdown: "Open as Markdown",
    },
    search: {
      label: "Search",
      placeholder: "Search Roadmap, Workflows, and RFCs…",
      noMatch: "No match.",
      close: "Close",
      keys: { move: "Move", open: "Open", close: "Close" },
    },
    footer: {
      license: "Shared RSI Community is open source under the MIT License, by Prism Shadow.",
      licenseLink: "License",
    },
    externalLink: {
      title: "You're about to open an external link",
      body: "This link goes to a site outside Shared RSI Community and opens in a new tab:",
      cancel: "Cancel",
      open: "Open link",
    },
  },
  zh: {
    htmlLang: "zh-CN",
    siteTitle: "Shared RSI Community",
    description: "Shared RSI Community — RSI Benchmark × Evaluation × Algorithm",
    nav: {
      overview: "概览",
      roadmap: "路线图",
      workflow: "流程",
      rfc: "标准文件",
      github: "GitHub",
    },
    theme: { label: "主题", light: "亮色", dark: "暗色", system: "跟随系统" },
    lang: { label: "语言", en: "English", zh: "中文", switch: "切换到 English" },
    docs: {
      title: "社区文档",
      onThisPage: "本页目录",
      previous: "上一页",
      next: "下一页",
      edit: "在 GitHub 上编辑本页",
      copy: "复制 Markdown",
      copied: "已复制",
      copyFailed: "复制失败",
      markdown: "以 Markdown 打开",
    },
    search: {
      label: "搜索",
      placeholder: "搜索 Roadmap、流程与 RFC…",
      noMatch: "没有匹配的内容。",
      close: "关闭",
      keys: { move: "移动", open: "打开", close: "关闭" },
    },
    footer: {
      license: "Shared RSI Community 由 Prism Shadow 开源，采用 MIT 许可证。",
      licenseLink: "许可证",
    },
    externalLink: {
      title: "即将打开外部链接",
      body: "这个链接指向 Shared RSI Community 之外的网站，会在新标签页中打开：",
      cancel: "取消",
      open: "继续打开",
    },
  },
} as const;

export type Strings = (typeof STRINGS)[Locale];
