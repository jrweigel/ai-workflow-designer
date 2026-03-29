import assert from "node:assert/strict";
import test from "node:test";

import { scoreResponsibility } from "../src/scoring.js";

test("scoreResponsibility marks structured repeatable work as high leverage", () => {
  const result = scoreResponsibility({
    title: "Task and accountability operations",
    cadence: "Daily and per-meeting",
    outputs: ["Tracked issues", "Overdue summaries", "Follow-up nudges"],
    painPoints: ["Vague ownership", "Missing due dates", "Manual status hygiene"],
    repeatability: 5,
    judgmentIntensity: 2,
    coordinationLoad: 4,
    artifactStructure: 5
  });

  assert.equal(result.band, "High");
  assert.equal(result.mode, "automate-or-delegate");
  assert.ok(result.score >= 65);
  assert.equal(result.bucket, 1);
  assert.ok(result.bucketLabel.includes("AI Automates"));
});

test("scoreResponsibility keeps ambiguous design work human-led", () => {
  const result = scoreResponsibility({
    title: "Cohort-based AI acceleration design",
    cadence: "Design phase with ad hoc working sessions",
    outputs: ["Operating model draft", "Intake criteria", "Pilot plan"],
    painPoints: ["No precedent", "Need to balance breadth versus depth", "High ambiguity"],
    repeatability: 2,
    judgmentIntensity: 5,
    coordinationLoad: 3,
    artifactStructure: 2
  });

  assert.equal(result.band, "Low");
  assert.equal(result.mode, "human-led");
  assert.ok(result.score < 40);
  assert.equal(result.bucket, 3);
  assert.ok(result.bucketLabel.includes("Human"));
});