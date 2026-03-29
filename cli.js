#!/usr/bin/env node

import { mkdir, readFile, writeFile, copyFile, access } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { createStarterSession, generateOutputs, workbookSchema } from "./src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getArg(flag, args) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}

function printHelp() {
  console.log(`ai-workflow-designer\n\nCommands:\n  setup                                    Install the @workflow-designer Copilot Chat agent into your repo\n  init --output <file>                     Create a blank session file\n  generate --input <file> --output <dir>   Generate outputs from a completed session\n    [--format markdown|single-markdown|json]\n    [--goal understand|start-using-ai|full-audit]\n\nGoals (controls which outputs are generated):\n  ${workbookSchema.goals.map((g) => `${g.id}: ${g.description}`).join("\n  ")}\n\nOutputs:\n  ${workbookSchema.outputs.map((output) => `${output.id}: ${output.title} — ${output.description}`).join("\n  ")}\n\nFormats:\n  ${workbookSchema.formats.map((fmt) => `${fmt.id}: ${fmt.description}`).join("\n  ")}\n\nQuick start:\n  npx ai-workflow-designer setup       # adds @workflow-designer to your repo\n  npx ai-workflow-designer init --output session.json\n  npx ai-workflow-designer generate --input session.json --output ./output\n`);
}

async function run() {
  const [, , command, ...args] = process.argv;

  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "setup") {
    const agentSource = path.join(__dirname, "agent", "workflow-designer.agent.md");
    const targetDir = path.join(process.cwd(), ".github", "agents");
    const targetPath = path.join(targetDir, "workflow-designer.agent.md");

    try {
      await access(targetPath);
      console.log(`Agent already installed at ${path.relative(process.cwd(), targetPath)}`);
      console.log("To update it, delete the file and run setup again.");
      return;
    } catch {
      // File doesn't exist — proceed with install
    }

    await mkdir(targetDir, { recursive: true });
    await copyFile(agentSource, targetPath);
    console.log(`Installed @workflow-designer agent to ${path.relative(process.cwd(), targetPath)}`);
    console.log("\nNext steps:");
    console.log("  1. Open this repo in VS Code with GitHub Copilot");
    console.log("  2. Open Copilot Chat and type: @workflow-designer");
    console.log("  3. The interview will start — it takes about 15-25 minutes");
    console.log("\nOr run the CLI directly:");
    console.log("  npx ai-workflow-designer init --output session.json");
    return;
  }

  if (command === "init") {
    const outputPath = getArg("--output", args);

    if (!outputPath) {
      throw new Error("Missing --output for init command.");
    }

    const session = createStarterSession();
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(session, null, 2)}\n`, "utf8");
    console.log(`Created starter session at ${outputPath}`);
    return;
  }

  if (command === "generate") {
    const inputPath = getArg("--input", args);
    const outputDir = getArg("--output", args);

    if (!inputPath || !outputDir) {
      throw new Error("Missing --input or --output for generate command.");
    }

    const raw = await readFile(inputPath, "utf8");
    const session = JSON.parse(raw);
    const formatArg = getArg("--format", args);
    const goalArg = getArg("--goal", args);

    if (formatArg) {
      session.preferences = session.preferences ?? {};
      session.preferences.outputFormat = formatArg;
    }

    if (goalArg) {
      session.preferences = session.preferences ?? {};
      session.preferences.goal = goalArg;
    }

    const outputs = generateOutputs(session);

    await mkdir(outputDir, { recursive: true });

    await Promise.all(
      Object.entries(outputs.files).map(([fileName, content]) =>
        writeFile(path.join(outputDir, fileName), `${content.endsWith("\n") ? content : `${content}\n`}`, "utf8")
      )
    );

    console.log(`Generated ${Object.keys(outputs.files).length} files in ${outputDir}`);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});