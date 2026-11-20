import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

test("syncs Issue authors independently of claimants and body fields", () => {
  const dir = mkdtempSync(join(tmpdir(), "quest-authors-"));
  try {
    mkdirSync(join(dir, "community"));
    writeFileSync(join(dir, "community/tasks.yaml"), "max_concurrent_claims_per_user: 2\ntasks:\n");
    const body = "### Title (English)\n\nExample task\n\n### Description (English)\n\nExample description.\n\n### Author\n\nforged-user\n";
    const now = new Date().toISOString();
    const fixture = [
      { number: 101, user: { login: "lzh368", html_url: "https://github.com/lzh368" }, comments: 1 },
      { number: 102, user: { login: "hiyouga", html_url: "https://github.com/hiyouga" }, comments: 0 },
      { number: 103, user: { login: "github-actions[bot]", html_url: "https://github.com/apps/github-actions" }, comments: 0 },
    ].map((issue) => ({ ...issue, body, state: "open", created_at: now, updated_at: now }));
    writeFileSync(join(dir, "issues.json"), JSON.stringify(fixture));
    writeFileSync(join(dir, "mock-github.mjs"), `
      import { readFileSync } from "node:fs";
      const issues = JSON.parse(readFileSync(new URL("./issues.json", import.meta.url), "utf8"));
      globalThis.fetch = async (input, options = {}) => {
        if (options.method && options.method !== "GET") throw new Error("Unexpected GitHub mutation");
        const url = new URL(input);
        let result;
        if (url.pathname.endsWith("/issues")) result = issues;
        else if (url.pathname.endsWith("/issues/101/comments")) {
          result = [{ body: "/claim", user: { login: "contributor" }, created_at: ${JSON.stringify(now)} }];
        } else throw new Error("Unexpected request: " + url.pathname);
        return new Response(JSON.stringify(result), { status: 200 });
      };
    `);
    const env = { ...process.env, GITHUB_REPOSITORY: "Prism-Shadow/penguin-harness-community" };
    delete env.GH_TOKEN;
    delete env.GITHUB_TOKEN;
    const script = fileURLToPath(new URL("./community-agent-sync.mjs", import.meta.url));
    execFileSync(process.execPath, ["--import", join(dir, "mock-github.mjs"), script, "--sync", "--out", "out"], { cwd: dir, env });
    const { tasks } = JSON.parse(readFileSync(join(dir, "out/quests.json"), "utf8"));
    assert.equal(tasks.length, 3);
    assert.equal(tasks[0].author, "lzh368");
    assert.equal(tasks[0].assignee, "contributor");
    assert.equal(tasks[0].status, "in_progress");
    assert.equal(tasks[1].author, "hiyouga");
    assert.equal(tasks[1].assignee, null);
    assert.equal(tasks[2].author, "github-actions[bot]");
    const yaml = readFileSync(join(dir, "out/tasks.yaml"), "utf8");
    assert.ok(yaml.includes('author: "lzh368"'));
    assert.ok(yaml.includes('author: "github-actions[bot]"'));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
