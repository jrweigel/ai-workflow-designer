import { generateActionPlan, generateCustomInstructions, generateOutputWalkthrough, generatePromptPack, generateSecondBrainSetup } from "./action-outputs.js";
import { deriveAgentOpportunities, deriveWorkPatterns } from "./patterns.js";
import {
  renderAgentOpportunityMap,
  renderAiLeverageOpportunities,
  renderBucketClassification,
  renderResponsibilityMap,
  renderWorkPatternSummary
} from "./render.js";
import { scoreResponsibilities } from "./scoring.js";

import { workbookSchema } from "../content/workbook-schema.js";

function resolveOutputIds(session) {
  const goal = session.preferences?.goal ?? "start-using-ai";
  const goalDef = workbookSchema.goals.find((g) => g.id === goal);
  return goalDef ? goalDef.outputs : workbookSchema.goals[1].outputs;
}

export function generateOutputs(session) {
  const scoredResponsibilities = scoreResponsibilities(session.responsibilities ?? []);
  const workPatterns = deriveWorkPatterns(session);
  const outputIds = resolveOutputIds(session);
  const agentOpportunities =
    outputIds.includes("agent-opportunity-map") || session.preferences?.includeAgentOpportunityMap
      ? deriveAgentOpportunities(session, scoredResponsibilities)
      : [];

  const format = session.preferences?.outputFormat ?? "markdown";

  const responsibilityMap = renderResponsibilityMap(session, scoredResponsibilities);
  const workPatternSummary = renderWorkPatternSummary(session, workPatterns);
  const aiLeverage = renderAiLeverageOpportunities(scoredResponsibilities);
  const bucketClassification = renderBucketClassification(session, scoredResponsibilities);
  const promptPack = generatePromptPack(session, scoredResponsibilities);
  const actionPlan = generateActionPlan(session, scoredResponsibilities);
  const customInstructions = generateCustomInstructions(session, scoredResponsibilities);
  const secondBrainSetup = generateSecondBrainSetup(session, scoredResponsibilities);
  const agentMap = renderAgentOpportunityMap(agentOpportunities);
  const outputWalkthrough = generateOutputWalkthrough(session, scoredResponsibilities, outputIds);
  const summaryJson = JSON.stringify(
    {
      person: session.person,
      workPatterns,
      responsibilities: scoredResponsibilities,
      agentOpportunities
    },
    null,
    2
  );

  const allMarkdown = {
    "responsibility-map": responsibilityMap,
    "work-pattern-summary": workPatternSummary,
    "bucket-classification": bucketClassification,
    "ai-leverage-opportunities": aiLeverage,
    "prompt-pack": promptPack,
    "ai-action-plan": actionPlan,
    "custom-ai-instructions": customInstructions,
    "second-brain-setup": secondBrainSetup,
    "agent-opportunity-map": agentMap
  };

  const included = Object.fromEntries(
    Object.entries(allMarkdown).filter(([id]) => outputIds.includes(id))
  );

  let files;

  if (format === "single-markdown") {
    const combined = Object.values(included).join("\n---\n\n");

    const personSlug = (session.person?.name ?? "session")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    files = {
      [`${personSlug}-workflow-design.md`]: combined,
      "output-walkthrough.md": outputWalkthrough,
      "session-summary.json": summaryJson
    };
  } else {
    files = {
      "output-walkthrough.md": outputWalkthrough,
      "session-summary.json": summaryJson
    };

    for (const [id, content] of Object.entries(included)) {
      files[`${id}.md`] = content;
    }
  }

  return {
    scoredResponsibilities,
    workPatterns,
    agentOpportunities,
    files,
    markdown: {
      responsibilityMap,
      workPatternSummary,
      bucketClassification,
      aiLeverage,
      promptPack,
      actionPlan,
      customInstructions,
      secondBrainSetup,
      agentMap,
      outputWalkthrough
    }
  };
}