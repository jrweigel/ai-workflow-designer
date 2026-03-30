function toArray(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return [];
}

function promptForBucket1(responsibility) {
  const outputs = toArray(responsibility.outputs);
  const inputs = toArray(responsibility.inputs);

  const lines = [];

  if (outputs.length) {
    lines.push(`Create a ${outputs[0].toLowerCase()} based on the following inputs.`);
  } else {
    lines.push(`Help me with: ${responsibility.title}.`);
  }

  if (inputs.length) {
    lines.push(`Sources to use: ${inputs.join(", ")}.`);
  }

  if (responsibility.cadence) {
    lines.push(`This is ${responsibility.cadence.toLowerCase()} work.`);
  }

  lines.push("Format the output so it's ready to share with minimal editing.");

  return lines.join(" ");
}

function promptForBucket2(responsibility) {
  const outputs = toArray(responsibility.outputs);
  const painPoints = toArray(responsibility.painPoints);

  const lines = [];
  lines.push(`I need to work on: ${responsibility.title}.`);

  if (responsibility.outcome) {
    lines.push(`The goal is: ${responsibility.outcome.toLowerCase()}.`);
  }

  if (painPoints.length) {
    lines.push(`My main friction points are: ${painPoints.join("; ")}.`);
  }

  if (outputs.length) {
    lines.push(`Help me draft a ${outputs[0].toLowerCase()}.`);
  } else {
    lines.push("Help me think through this and draft a starting point.");
  }

  lines.push("Ask me clarifying questions if you need more context before drafting.");

  return lines.join(" ");
}

function promptForBucket3(responsibility) {
  const lines = [];
  lines.push(`I'm preparing for: ${responsibility.title}.`);

  if (responsibility.outcome) {
    lines.push(`The outcome I need: ${responsibility.outcome.toLowerCase()}.`);
  }

  const stakeholders = toArray(responsibility.stakeholders);
  if (stakeholders.length) {
    lines.push(`Key people involved: ${stakeholders.join(", ")}.`);
  }

  lines.push("Help me organize my thinking. Give me a structured outline or checklist I can use as a starting frame, but don't try to make the decisions for me.");

  return lines.join(" ");
}

function generatePrompt(responsibility) {
  const bucket = responsibility.leverage?.bucket ?? 3;

  if (bucket === 1) {
    return promptForBucket1(responsibility);
  }

  if (bucket === 2) {
    return promptForBucket2(responsibility);
  }

  return promptForBucket3(responsibility);
}

export function generatePromptPack(session, scoredResponsibilities) {
  const person = session.person;
  const lines = [];

  lines.push("# Prompt Pack");
  lines.push("");
  lines.push(`Generated for ${person.name}${person.role ? ` — ${person.role}` : ""}`);
  lines.push("");
  lines.push("Ready-to-use prompts for M365 Copilot, ChatGPT, Claude, or any AI assistant. Each prompt is matched to a responsibility from your workflow design session.");
  lines.push("");

  const bucket1 = scoredResponsibilities.filter((r) => r.leverage?.bucket === 1);
  const bucket2 = scoredResponsibilities.filter((r) => r.leverage?.bucket === 2);
  const bucket3 = scoredResponsibilities.filter((r) => r.leverage?.bucket === 3);

  if (bucket1.length) {
    lines.push("## Bucket 1: AI Automates (AI does it)");
    lines.push("");
    lines.push("These are your highest-leverage prompts. AI can handle these end-to-end with light review from you.");
    lines.push("");

    for (const responsibility of bucket1) {
      lines.push(`### ${responsibility.title}`);
      lines.push("");
      lines.push("```");
      lines.push(generatePrompt(responsibility));
      lines.push("```");
      lines.push("");
    }
  }

  if (bucket2.length) {
    lines.push("## Bucket 2: AI Assists (AI + You)");
    lines.push("");
    lines.push("AI drafts, assembles, or analyzes. You review, refine, and decide.");
    lines.push("");

    for (const responsibility of bucket2) {
      lines.push(`### ${responsibility.title}`);
      lines.push("");
      lines.push("```");
      lines.push(generatePrompt(responsibility));
      lines.push("```");
      lines.push("");
    }
  }

  if (bucket3.length) {
    lines.push("## Bucket 3: Human (Only you)");
    lines.push("");
    lines.push("These stay with you. AI can help you prepare and organize, but the real work is judgment, trust, and presence.");
    lines.push("");

    for (const responsibility of bucket3) {
      lines.push(`### ${responsibility.title}`);
      lines.push("");
      lines.push("```");
      lines.push(generatePrompt(responsibility));
      lines.push("```");
      lines.push("");
    }
  }

  return lines.join("\n");
}

export function generateCustomInstructions(session, scoredResponsibilities) {
  const person = session.person;
  const summary = session.summary;

  const bucket1Titles = scoredResponsibilities
    .filter((r) => r.leverage?.bucket === 1)
    .map((r) => r.title);
  const bucket2Titles = scoredResponsibilities
    .filter((r) => r.leverage?.bucket === 2)
    .map((r) => r.title);
  const humanWorkDescription = summary?.humanOnlyWork || "strategic decisions, stakeholder relationships, and judgment calls";

  const lines = [];
  lines.push("# Custom AI Instructions");
  lines.push("");
  lines.push(`Personalized system prompt for ${person.name}${person.role ? ` (${person.role})` : ""}. Paste this into the custom instructions or system prompt field of your preferred AI tool.`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## System Prompt");
  lines.push("");
  lines.push("```");
  lines.push(`You are an AI assistant for ${person.name}${person.role ? `, who works as ${person.role}` : ""}.`);
  lines.push("");

  if (summary?.jobInPlainEnglish) {
    lines.push(`Context: ${summary.jobInPlainEnglish}`);
    lines.push("");
  }

  if (bucket1Titles.length) {
    lines.push(`For these tasks, you can work end-to-end and produce final-quality output: ${bucket1Titles.join(", ")}.`);
    lines.push("");
  }

  if (bucket2Titles.length) {
    lines.push(`For these tasks, draft a strong starting point and ask clarifying questions before finalizing: ${bucket2Titles.join(", ")}.`);
    lines.push("");
  }

  lines.push(`Never make final decisions about: ${humanWorkDescription}.`);
  lines.push("");

  const stakeholders = summary?.keyStakeholders ?? [];
  if (stakeholders.length) {
    lines.push("Key stakeholders and what they care about:");
    for (const s of stakeholders) {
      if (typeof s === "string") {
        lines.push(`- ${s}`);
      } else if (s.name) {
        lines.push(`- ${s.name}${s.role ? ` (${s.role})` : ""}${s.lens ? `: ${s.lens}` : ""}`);
      }
    }
    lines.push("When drafting content for any of these people, match their lens.");
    lines.push("");
  }

  if (summary?.frictionMap) {
    lines.push(`Key friction to help reduce: ${summary.frictionMap}`);
    lines.push("");
  }

  const patterns = summary?.topRecurringPatterns ?? [];
  if (patterns.length) {
    lines.push(`Recurring work patterns to be aware of: ${patterns.join("; ")}.`);
    lines.push("");
  }

  lines.push("When in doubt, ask rather than guess. Prefer structured output (tables, numbered lists, clear sections) over prose.");
  lines.push("```");

  return lines.join("\n");
}

export function generateActionPlan(session, scoredResponsibilities) {
  const person = session.person;

  const sorted = [...scoredResponsibilities].sort((a, b) => {
    const bucketDiff = (a.leverage?.bucket ?? 3) - (b.leverage?.bucket ?? 3);
    if (bucketDiff !== 0) return bucketDiff;
    return (b.leverage?.score ?? 0) - (a.leverage?.score ?? 0);
  });

  const lines = [];
  lines.push("# AI Action Plan");
  lines.push("");
  lines.push(`For ${person.name}${person.role ? ` — ${person.role}` : ""}`);
  lines.push("");
  lines.push("A prioritized guide to getting started with AI based on your workflow design session. Start at the top — these are your highest-leverage, lowest-risk starting points.");
  lines.push("");

  lines.push("## Start Here (This Week)");
  lines.push("");
  lines.push("These are Bucket 1 tasks — AI can handle them end-to-end. Try one prompt from your prompt pack and see how it goes.");
  lines.push("");

  const bucket1 = sorted.filter((r) => r.leverage?.bucket === 1);
  if (bucket1.length) {
    for (const r of bucket1) {
      lines.push(`- **${r.title}** — ${r.leverage.recommendation}`);
    }
  } else {
    lines.push("- No fully automatable tasks identified yet. Start with the Bucket 2 items below.");
  }

  lines.push("");
  lines.push("## Build Toward (This Month)");
  lines.push("");
  lines.push("These are Bucket 2 tasks — AI + You. Use AI to reduce prep time, draft starting points, and surface patterns. You still own the final call.");
  lines.push("");

  const bucket2 = sorted.filter((r) => r.leverage?.bucket === 2);
  if (bucket2.length) {
    for (const r of bucket2) {
      lines.push(`- **${r.title}** — ${r.leverage.recommendation}`);
    }
  } else {
    lines.push("- No AI-assist tasks identified yet.");
  }

  lines.push("");
  lines.push("## Keep Human (Always)");
  lines.push("");
  lines.push("These stay with you. AI can help you prepare, but the real work is judgment, relationships, and taste.");
  lines.push("");

  const bucket3 = sorted.filter((r) => r.leverage?.bucket === 3);
  if (bucket3.length) {
    for (const r of bucket3) {
      lines.push(`- **${r.title}** — ${r.leverage.recommendation}`);
    }
  } else {
    lines.push("- All tasks have some AI leverage potential.");
  }

  lines.push("");
  lines.push("## Going Further");
  lines.push("");
  lines.push("Once you've tested the prompts and built confidence with Buckets 1 and 2:");
  lines.push("");
  lines.push("- **Refine your prompts.** Save the ones that work. Edit the ones that don't. Build a personal prompt library.");
  lines.push("- **Set up custom instructions.** Use the Custom AI Instructions output to personalize your AI tools so they know your context.");
  lines.push("- **Consider agents.** If you have multiple Bucket 1 and 2 tasks that share inputs or cadences, the Agent Opportunity Map shows how they could cluster into dedicated AI agents with defined roles.");
  lines.push("- **Revisit quarterly.** Your work changes. Re-run this interview when your responsibilities shift, and your prompts and leverage map will update with it.");

  return lines.join("\n");
}
