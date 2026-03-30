# AI Workflow Designer

A guided conversation that helps you understand your work and find where AI creates real leverage.

You sit down with an AI interviewer for 15–25 minutes. It maps your responsibilities, identifies what AI should automate vs. assist vs. leave alone, and generates actionable outputs you can use immediately — ready-to-paste prompts, an action plan, custom AI instructions, and more.

## What you walk away with

| Output | What it is |
|--------|-----------|
| **Responsibility Map** | Structured inventory of the work you own, what it produces, and what still requires your judgment |
| **3-Bucket Classification** | Each responsibility sorted into AI Automates / AI Assists / Human |
| **Prompt Pack** | Ready-to-use prompts for M365 Copilot, ChatGPT, Claude — one per responsibility, matched to its bucket |
| **AI Action Plan** | Prioritized guide: what to try this week, what to build toward, what stays with you |
| **Custom AI Instructions** | Personalized system prompt you can paste into any AI tool |
| **Work Pattern Summary** | Short synthesis of your recurring patterns and friction |
| **AI Leverage Opportunities** | Scored recommendations for where AI fits |
| **Agent Opportunity Map** | Optional clustering of work into potential AI agent roles |

You choose your goal upfront and only get the outputs that match:

| Goal | What you get |
|------|-------------|
| **Understand my work** | Responsibility Map, Work Pattern Summary, 3-Bucket Classification |
| **Start using AI** *(default)* | Everything above + Prompt Pack, Action Plan, Custom Instructions, Leverage Scoring |
| **Full audit** | Everything above + Agent Opportunity Map |

## Quick start

### Option 1: Clone this repo (best for beginners)

If you've never used VS Code or GitHub Copilot, start with [GETTING_STARTED.md](GETTING_STARTED.md) — it walks you through everything from installation to your first interview.

```
git clone https://github.com/jrweigel/ai-workflow-designer.git
cd ai-workflow-designer
code .
```

Then open GitHub Copilot Chat and type `@workflow-designer`.

### Option 2: Add to an existing repo

```
npx ai-workflow-designer setup
```

This copies the `@workflow-designer` Copilot Chat agent into your `.github/agents/` folder. Open Copilot Chat and type `@workflow-designer` to start.

### Option 3: CLI only (no VS Code required)

```
npx ai-workflow-designer init --output session.json
# Fill in session.json manually or with any LLM
npx ai-workflow-designer generate --input session.json --output ./output
```

## CLI reference

```
ai-workflow-designer setup                    Install the Copilot Chat agent into your repo
ai-workflow-designer init --output <file>     Create a blank session file
ai-workflow-designer generate                 Generate outputs from a completed session
  --input <file>
  --output <dir>
  [--format markdown|single-markdown|json]
  [--goal understand|start-using-ai|full-audit]
```

## How it works

The interview follows a structured method:

1. **Part A — Know Your Work:** 6 themes explored conversationally (accountability, work rhythms, recurring artifacts, friction, human-only work, AI leverage points)
2. **Part B — Map Responsibilities:** Each major responsibility captured with outcome, cadence, inputs, outputs, pain points, scoring dimensions, and remaining human role
3. **Part C — Synthesize and Generate:** Job summary, pattern detection, scoring, and automatic output generation

Everything is stored in a portable `session.json` file. You can re-run the generator any time, edit your session and regenerate, or hand the JSON to other tools.

## Going further: build a squad

Your workflow design session is the starting point for a full agent squad — a team of AI agents designed around your actual work. If you're interested, the **Squad Designer** picks up right where the Workflow Designer left off, skipping straight to agent design.

## Session format

The session JSON is portable and tool-agnostic:

```json
{
  "person": { "name": "", "role": "", "team": "", "goal": "" },
  "summary": { "jobInPlainEnglish": "", "frictionMap": "", "..." : "" },
  "preferences": { "goal": "start-using-ai", "outputFormat": "markdown" },
  "responsibilities": [
    {
      "title": "", "outcome": "", "cadence": "",
      "inputs": [], "outputs": [], "painPoints": [],
      "repeatability": 3, "judgmentIntensity": 3,
      "coordinationLoad": 3, "artifactStructure": 3
    }
  ]
}
```

## License

MIT