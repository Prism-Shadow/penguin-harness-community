import assert from "node:assert/strict";
import test from "node:test";
import { renderQuestDescription } from "./quest-markdown.ts";

test("renders Markdown structure and rejects executable HTML and unsafe links", () => {
  const html = renderQuestDescription([
    '**TuringBench** in `penguin-harness-benchmark`.', '',
    '1. Deliverable', '   - Nested requirement', '',
    '| Name | Score |', '| --- | --- |', '| Task | 1 |', '',
    '```python', 'print("example")', '```', '',
    '[Paper](https://example.com/paper)', '',
    '<script>alert(1)</script>', '',
    '<img src=x onerror="alert(1)">', '',
    '[Unsafe](javascript:alert(1))', '',
  ].join('\n'));
  for (const tag of ['<strong>TuringBench</strong>', '<code>penguin-harness-benchmark</code>', '<ol>', '<ul>', '<table>', '<pre>', 'href="https://example.com/paper"']) {
    assert.ok(html.includes(tag), tag);
  }
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('<img src=x'));
  assert.ok(!html.includes('href="javascript:'));
});

test("renders emphasis next to Chinese punctuation while preserving literal code", () => {
  const html = renderQuestDescription([
    '还需给出可操作的**“AI 味破绽归因诊断”**（定位具体问题）。', '',
    '**该句以标点结束。**这是后续文字。', '',
    '`**“代码中的标记”**`', '',
    '```markdown', '**“代码块中的标记”**', '```', '',
    '\\*\\*“转义的标记”\\*\\*',
  ].join('\n'));
  assert.ok(html.includes('<strong>“AI 味破绽归因诊断”</strong>'));
  assert.ok(html.includes('<strong>该句以标点结束。</strong>'));
  assert.ok(html.includes('<code>**“代码中的标记”**</code>'));
  assert.ok(html.includes('**“代码块中的标记”**'));
  assert.ok(html.includes('**“转义的标记”**'));
  assert.equal((html.match(/<strong>/g) || []).length, 2);
});
