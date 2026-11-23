import assert from "node:assert/strict";
import test from "node:test";
import { parseQuestRegistry } from "./quest-registry.ts";

// Match the sync script's serialized strings, including literal newlines.
const quote = (value: string) => `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

test("preserves complete Markdown without interpreting its code as registry fields", () => {
  const description = 'A **task** with `code`.\n\n```yaml\n  - id: "example"\n    assignee: "wrong-user"\n    references:\n      - "https://wrong.example"\n```\n\nFinal paragraph.';
  const chinese = '完整描述："引号"、C:\\models\\test 和\t制表符。\n\n1. 要求一\n2. 要求二';
  const tasks = parseQuestRegistry([
    'tasks:',
    '  - id: "RSI-1"',
    '    exp: 150',
    `    description: ${quote(description)}`,
    `    description_zh: ${quote(chinese)}`,
    '    references:',
    '      - "https://example.com/paper"',
    '      - "https://example.com/code"',
    '    assignee: null',
    '  - id: "RSI-2"',
    '    description: ""',
    '    references: []',
    '    assignee: "actual-user"',
  ].join('\n'));
  assert.equal(tasks.length, 2);
  assert.equal(tasks[0].fields.description, description);
  assert.equal(tasks[0].fields.description_zh, chinese);
  assert.equal(tasks[0].fields.exp, "150");
  assert.equal(tasks[0].fields.assignee, undefined);
  assert.deepEqual(tasks[0].references, ["https://example.com/paper", "https://example.com/code"]);
  assert.equal(tasks[1].fields.description, "");
  assert.equal(tasks[1].fields.assignee, "actual-user");
  assert.deepEqual(tasks[1].references, []);
});
