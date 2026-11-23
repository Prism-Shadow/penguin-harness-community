import MarkdownIt from "markdown-it";
import cjkFriendly from "markdown-it-cjk-friendly";

// Task descriptions come from GitHub Issues. Keep raw HTML disabled and use
// markdown-it's URL validation rather than trusting HTML supplied by an author.
const markdown = new MarkdownIt({ html: false, linkify: true }).use(cjkFriendly);

export function renderQuestDescription(description: string): string {
  return markdown.render(description);
}
