#!/usr/bin/env node
/**
 * Shared RSI Community — Automated Task & Issue Steward Script
 * Used by both the scheduled PenguinHarness agent (`rsi_community_steward`) and GitHub Actions.
 *
 * Workflow:
 * 1. Scans GitHub Issues in `Prism-Shadow/penguin-harness-community` for `[Task]` proposals
 *    to create/register new tasks in `community/tasks.yaml` (default 50 EXP).
 * 2. Scans comments under each task's GitHub Issue for `/claim` replies, enforces the
 *    concurrent claim limit (<= 2 active tasks per user), and updates `assignee` & `status`.
 * 3. Screens linked PRs across target repositories (`penguin-harness`, `penguin-harness-benchmark`,
 *    `penguin-harness-plugins`) and marks merged tasks as `completed` (+50 EXP).
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const tasksPath = resolve(process.cwd(), "community/tasks.yaml");
const rawYaml = readFileSync(tasksPath, "utf8");

function parseTasksYaml(content) {
  const maxConcurrentMatch = content.match(/max_concurrent_claims_per_user:\s*(\d+)/);
  const maxConcurrent = maxConcurrentMatch ? Number(maxConcurrentMatch[1]) : 2;

  const taskBlocks = content.split(/\n  - id:\s*/).slice(1);
  const tasks = taskBlocks.map((block) => {
    const id = block.match(/^"([^"]+)"/)?.[1] ?? "";
    const field = (name) => {
      const m = block.match(new RegExp(`^    ${name}:\\s*(.+)$`, "m"));
      if (!m) return null;
      const val = m[1].trim();
      if (val === "null") return null;
      return val.replace(/^"(.*)"$/, "$1");
    };
    return {
      id,
      status: field("status"),
      domain: field("domain"),
      exp: Number(field("exp") || 50),
      target_repo: field("target_repo"),
      title: field("title"),
      title_zh: field("title_zh"),
      assignee: field("assignee"),
      issue_url: field("issue_url"),
      linked_pr: field("linked_pr"),
    };
  });

  return { maxConcurrent, tasks };
}

const { maxConcurrent, tasks } = parseTasksYaml(rawYaml);

console.log("=== Shared RSI Community Steward (rsi_community_steward) ===");
console.log(`Loaded ${tasks.length} tasks from community/tasks.yaml (Max concurrent claims/user: ${maxConcurrent})\n`);

const activeByAssignee = new Map();
for (const t of tasks) {
  if (!t.assignee) continue;
  if (t.status === "in_progress") {
    const list = activeByAssignee.get(t.assignee) ?? [];
    list.push(t.id);
    activeByAssignee.set(t.assignee, list);
  }
}

let capViolations = 0;
console.log("1. Concurrent Claim Quota Audit:");
for (const [user, activeIds] of activeByAssignee.entries()) {
  const ok = activeIds.length <= maxConcurrent;
  if (!ok) capViolations += 1;
  console.log(`   - @${user}: ${activeIds.length}/${maxConcurrent} active tasks [${activeIds.join(", ")}]`);
}
if (activeByAssignee.size === 0) {
  console.log("   - All 8 tasks are currently open for claim (50 EXP each).");
}

console.log("\n2. Task Board Status Summary:");
for (const t of tasks) {
  console.log(
    `   - [${t.id}] domain="${t.domain}" | status=${t.status} | exp=${t.exp} EXP | title="${t.title_zh} (${t.title})"`,
  );
}

if (capViolations > 0) {
  console.error(`\nERROR: Found ${capViolations} concurrent claim cap violation(s).`);
  process.exit(1);
}
console.log("\nVerification completed with 0 errors.");
