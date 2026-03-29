import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.resolve(__dirname, "../cli.js");
const sampleSessionPath = path.resolve(__dirname, "../examples/jen-program-manager.session.json");

function runNode(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: path.resolve(__dirname, "../../.."),
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `Command failed: ${args.join(" ")}`);
  }

  return result;
}

function runNodeIn(cwd, args) {
  const result = spawnSync(process.execPath, args, {
    cwd,
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `Command failed: ${args.join(" ")}`);
  }

  return result;
}

test("CLI init creates a valid starter session and generate emits output files", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "ai-workflow-designer-"));
  const starterPath = path.join(tempRoot, "starter-session.json");
  const outputDir = path.join(tempRoot, "output");

  runNode([cliPath, "init", "--output", starterPath]);

  const starterRaw = await readFile(starterPath, "utf8");
  const starterSession = JSON.parse(starterRaw);

  assert.deepEqual(Object.keys(starterSession), ["person", "summary", "preferences", "responsibilities"]);

  runNode([cliPath, "generate", "--input", sampleSessionPath, "--output", outputDir]);

  const files = (await readdir(outputDir)).sort();
  assert.deepEqual(files, [
    "agent-opportunity-map.md",
    "ai-action-plan.md",
    "ai-leverage-opportunities.md",
    "bucket-classification.md",
    "custom-ai-instructions.md",
    "prompt-pack.md",
    "responsibility-map.md",
    "session-summary.json",
    "work-pattern-summary.md"
  ]);
});

test("CLI setup installs the agent file into .github/agents/", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "ai-workflow-designer-setup-"));

  runNodeIn(tempRoot, [cliPath, "setup"]);

  const agentPath = path.join(tempRoot, ".github", "agents", "workflow-designer.agent.md");
  await access(agentPath);

  const content = await readFile(agentPath, "utf8");
  assert.match(content, /name: "Workflow Designer"/);
  assert.match(content, /npx ai-workflow-designer generate/);
});

test("CLI generate with --goal understand limits output files", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "ai-workflow-designer-goal-"));
  const outputDir = path.join(tempRoot, "output");

  runNode([cliPath, "generate", "--input", sampleSessionPath, "--output", outputDir, "--goal", "understand"]);

  const files = (await readdir(outputDir)).sort();
  assert.deepEqual(files, [
    "bucket-classification.md",
    "responsibility-map.md",
    "session-summary.json",
    "work-pattern-summary.md"
  ]);
});