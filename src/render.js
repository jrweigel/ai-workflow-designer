function bullets(items = []) {
  return items.filter(Boolean).map((item) => `- ${item}`).join("\n");
}

function tableCell(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ") || "-";
  }

  return String(value ?? "-").replace(/\|/g, "\\|");
}

export function renderResponsibilityMap(session, scoredResponsibilities) {
  const rows = scoredResponsibilities.map((responsibility) => [
    responsibility.title,
    responsibility.outcome,
    responsibility.cadence,
    responsibility.outputs,
    responsibility.painPoints,
    responsibility.humanRoleLeft,
    `${responsibility.leverage.band} (${responsibility.leverage.score})`,
    responsibility.leverage.aiWorkflowPotential
  ]);

  return `# Responsibility Map\n\n${session.person.name} - ${session.person.role}\n\n| Responsibility | Outcome | Cadence | Output artifacts | Pain points | Human role left | AI leverage | AI Workflow Potential |\n|---|---|---|---|---|---|---|---|\n${rows
    .map((row) => `| ${row.map((cell) => tableCell(cell)).join(" | ")} |`)
    .join("\n")}\n`;
}

export function renderWorkPatternSummary(session, patterns) {
  const summary = session.summary;

  return `# Personal Work Pattern Summary\n\n## Job In Plain English\n${summary.jobInPlainEnglish || "No summary provided yet."}\n\n## What Shapes The Work\n${summary.accountabilityAndOutcomes || "No accountability summary provided yet."}\n\n## Friction\n${summary.frictionMap || "No friction summary provided yet."}\n\n## What Should Stay Human\n${summary.humanOnlyWork || "No human-only constraints provided yet."}\n\n## What Stays With Me\n${summary.whatStaysWithMe || summary.humanOnlyWork || "No synthesis provided yet."}\n\n## Top Recurring Patterns\n${bullets(patterns.map((pattern) => `${pattern.title}${pattern.evidence.length ? ` - shows up in ${pattern.evidence.join(", ")}` : ""}`))}\n`;
}

export function renderAiLeverageOpportunities(scoredResponsibilities) {
  return `# AI Leverage Opportunities\n\n| Responsibility | Leverage | Recommended mode | Why this fits |\n|---|---|---|---|\n${scoredResponsibilities
    .map(
      (responsibility) =>
        `| ${tableCell(responsibility.title)} | ${tableCell(`${responsibility.leverage.band} (${responsibility.leverage.score})`)} | ${tableCell(responsibility.leverage.mode)} | ${tableCell(responsibility.leverage.recommendation)} |`
    )
    .join("\n")}\n`;
}

export function renderBucketClassification(session, scoredResponsibilities) {
  const person = session.person;
  const bucket1 = scoredResponsibilities.filter((r) => r.leverage?.bucket === 1);
  const bucket2 = scoredResponsibilities.filter((r) => r.leverage?.bucket === 2);
  const bucket3 = scoredResponsibilities.filter((r) => r.leverage?.bucket === 3);

  const section = (items) =>
    items.length
      ? items
          .map(
            (r) =>
              `| ${tableCell(r.title)} | ${tableCell(r.leverage.mode)} | ${tableCell(r.leverage.recommendation)} |`
          )
          .join("\n")
      : "| (none) | - | - |";

  return `# 3-Bucket Classification

${person.name}${person.role ? ` — ${person.role}` : ""}

## Bucket 1: AI Automates (AI does it)

Routine, repeatable, well-defined work. AI can handle these end-to-end with light review.

| Responsibility | Mode | Recommendation |
|---|---|---|
${section(bucket1)}

## Bucket 2: AI Assists (AI + You)

AI drafts, assembles, or analyzes. You review, refine, and decide.

| Responsibility | Mode | Recommendation |
|---|---|---|
${section(bucket2)}

## Bucket 3: Human (Only you)

Judgment, trust, ambiguity, presence. AI can prep, but you do the work.

| Responsibility | Mode | Recommendation |
|---|---|---|
${section(bucket3)}
`;
}

export function renderAgentOpportunityMap(agentOpportunities) {
  if (!agentOpportunities.length) {
    return "# Agent Opportunity Map\n\nAgent opportunity generation is disabled for this session.\n";
  }

  return `# Agent Opportunity Map\n\n${agentOpportunities
    .map(
      (agent) => `## ${agent.roleName}\n\n- Pattern: ${agent.pattern}\n- Job to be done: ${agent.jobToBeDone}\n- Responsibilities: ${agent.responsibilities.join(", ")}\n- Likely outputs: ${agent.outputs.join(", ") || "-"}\n- Human review still needed for: ${agent.humanReview.join(", ") || "-"}\n- Leverage bands in cluster: ${agent.leverageBands.join(", ") || "-"}\n`
    )
    .join("\n")}`;
}