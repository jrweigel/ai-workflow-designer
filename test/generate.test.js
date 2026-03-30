import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { generateOutputs } from "../src/generate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sampleSessionPath = path.resolve(__dirname, "../examples/jen-program-manager.session.json");

async function loadSampleSession() {
  const raw = await readFile(sampleSessionPath, "utf8");
  return JSON.parse(raw);
}

test("generateOutputs returns the expected artifact set for the sample session", async () => {
  const session = await loadSampleSession();
  const result = generateOutputs(session);

  assert.deepEqual(Object.keys(result.files).sort(), [
    "agent-opportunity-map.md",
    "ai-action-plan.md",
    "ai-leverage-opportunities.md",
    "bucket-classification.md",
    "custom-ai-instructions.md",
    "output-walkthrough.md",
    "prompt-pack.md",
    "responsibility-map.md",
    "second-brain-setup.md",
    "session-summary.json",
    "work-pattern-summary.md"
  ]);

  assert.match(result.files["responsibility-map.md"], /^# Responsibility Map/m);
  assert.match(result.files["responsibility-map.md"], /Jen Weigel - Program manager and chief-of-staff style operator for AI enablement/);
  assert.match(result.files["ai-leverage-opportunities.md"], /Task and accountability operations/);
  assert.match(result.files["work-pattern-summary.md"], /# Personal Work Pattern Summary/);
  assert.match(result.files["bucket-classification.md"], /# 3-Bucket Classification/);
  assert.match(result.files["prompt-pack.md"], /# Prompt Pack/);
  assert.match(result.files["ai-action-plan.md"], /# AI Action Plan/);
  assert.match(result.files["custom-ai-instructions.md"], /# Custom AI Instructions/);
  assert.ok(result.workPatterns.length > 0);
  assert.ok(result.agentOpportunities.length > 0);

  const summary = JSON.parse(result.files["session-summary.json"]);
  assert.equal(summary.person.name, "Jen Weigel");
  assert.equal(summary.responsibilities.length, session.responsibilities.length);
});

test("goal 'understand' produces only foundational outputs", async () => {
  const session = await loadSampleSession();
  session.preferences.goal = "understand";
  const result = generateOutputs(session);

  const fileNames = Object.keys(result.files).sort();
  assert.deepEqual(fileNames, [
    "bucket-classification.md",
    "output-walkthrough.md",
    "responsibility-map.md",
    "session-summary.json",
    "work-pattern-summary.md"
  ]);

  assert.equal(result.files["prompt-pack.md"], undefined);
  assert.equal(result.files["agent-opportunity-map.md"], undefined);
});

test("goal 'start-using-ai' includes action outputs but not agent map", async () => {
  const session = await loadSampleSession();
  session.preferences.goal = "start-using-ai";
  const result = generateOutputs(session);

  assert.ok(result.files["prompt-pack.md"]);
  assert.ok(result.files["ai-action-plan.md"]);
  assert.ok(result.files["custom-ai-instructions.md"]);
  assert.ok(result.files["second-brain-setup.md"]);
  assert.equal(result.files["agent-opportunity-map.md"], undefined);
});