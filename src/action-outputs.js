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

  const stakeholders = toArray(summary?.keyStakeholders);
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
  lines.push("- **Set up your second brain.** Use the Second Brain Setup Guide to create a personal knowledge repo or folder that captures decisions, meeting takeaways, and process notes so nothing lives only in your head.");

  return lines.join("\n");
}

export function generateSecondBrainSetup(session, scoredResponsibilities) {
  const person = session.person;
  const summary = session.summary;
  const lines = [];

  const bucket1 = scoredResponsibilities.filter((r) => r.leverage?.bucket === 1);
  const bucket2 = scoredResponsibilities.filter((r) => r.leverage?.bucket === 2);
  const allOutputs = [...new Set(scoredResponsibilities.flatMap((r) => toArray(r.outputs)))];
  const hasLeadershipComms = scoredResponsibilities.some((r) =>
    toArray(r.tags).some((t) => ["narrative", "stakeholder", "communication", "briefing", "comms", "leadership"].includes(t.toLowerCase()))
  );
  const hasMeetingWork = scoredResponsibilities.some((r) =>
    toArray(r.tags).some((t) => ["meeting", "standup", "agenda", "recap"].includes(t.toLowerCase()))
  );
  const hasTracking = scoredResponsibilities.some((r) =>
    toArray(r.tags).some((t) => ["tracking", "monitor", "ops", "follow-up", "program"].includes(t.toLowerCase()))
  );
  const knowledgeContext = (summary?.knowledgeManagement ?? "").trim();
  const needsCollaboration = scoredResponsibilities.some((r) => (r.coordinationLoad ?? 0) >= 4);
  const useRepo = needsCollaboration || bucket1.length >= 2 || hasLeadershipComms;

  lines.push("# Second Brain Setup Guide");
  lines.push("");
  lines.push(`Personalized for ${person.name}${person.role ? ` — ${person.role}` : ""}`);
  lines.push("");
  lines.push("Your second brain is the single place where your working knowledge lives — decisions you've made, things you've learned from meetings, process notes you'll need again, and the context AI needs to actually help you. Without it, every AI conversation starts from zero.");
  lines.push("");

  if (knowledgeContext) {
    lines.push("## Where You Are Today");
    lines.push("");
    lines.push(knowledgeContext);
    lines.push("");
  }

  lines.push("## Recommended Setup");
  lines.push("");
  if (useRepo) {
    lines.push("**Use a Git repo** (GitHub, Azure DevOps, or local with `git init`).");
    lines.push("");
    lines.push("Why a repo for your work:");
    lines.push("- You have high-coordination work that benefits from version history and structured files.");
    lines.push("- AI tools (Copilot, Claude) work best when they can read a repo as context.");
    lines.push("- You can share specific artifacts without sharing everything.");
    if (bucket1.length >= 2) {
      lines.push("- Your automatable workflows can write directly to the repo as part of their output pipeline.");
    }
  } else {
    lines.push("**Start with a local folder** — you can always upgrade to a repo later.");
    lines.push("");
    lines.push("Why a folder works for now:");
    lines.push("- Your work is primarily individual — you don't need collaboration features yet.");
    lines.push("- A folder is zero-setup. Create it today, start capturing immediately.");
    lines.push("- If you later want version history or AI integration, `git init` converts it in one command.");
  }

  lines.push("");
  lines.push("## Recommended Structure");
  lines.push("");
  lines.push("```");
  if (useRepo) {
    lines.push(`my-second-brain/              # or a name that works for you`);
  } else {
    lines.push(`~/Documents/second-brain/     # or wherever you keep working files`);
  }
  lines.push("├── README.md                   # What this is, how you use it");
  lines.push("├── context/");
  lines.push("│   ├── operating-model.md      # How you work: cadences, stakeholders, boundaries");
  lines.push("│   ├── decisions.md            # Decisions log: what you decided, why, when");
  lines.push("│   └── stakeholders.md         # Key people, their lens, what they care about");

  if (hasMeetingWork) {
    lines.push("├── meetings/");
    lines.push("│   ├── _processing-instructions.md  # How to extract value from meeting notes");
    lines.push("│   └── (processed meeting notes)");
  }

  lines.push("├── process-notes/");
  lines.push("│   └── (things you learned doing the work — patterns, lessons, templates)");

  if (hasTracking) {
    lines.push("├── tracking/");
    lines.push("│   └── (action items, project status, follow-up lists)");
  }

  if (hasLeadershipComms) {
    lines.push("├── writing/");
    lines.push("│   ├── _style-guide.md              # Your voice, tone, formatting preferences");
    lines.push("│   └── (drafts, templates, past examples worth keeping)");
  }

  lines.push("├── prompts/");
  lines.push("│   └── (your working prompt library — start with the Prompt Pack output)");
  lines.push("└── .instructions.md            # Custom AI instructions (use the output from this session)");
  lines.push("```");

  lines.push("");
  lines.push("## What Goes Where");
  lines.push("");

  lines.push("### context/ — Your operating model");
  lines.push("");
  lines.push("This is the foundation. When AI reads your repo, this is the first thing it should understand.");
  lines.push("");
  lines.push("**operating-model.md** should contain:");
  lines.push(`- Your role: ${person.role || "(fill in)"}`);
  lines.push(`- Your key accountabilities (from Part A of your interview)`);
  lines.push(`- Your work rhythms: what's daily, weekly, monthly`);
  lines.push(`- What stays human: ${summary?.humanOnlyWork || "(fill in from your interview)"}`);
  lines.push("");
  lines.push("**decisions.md** is your decision log. Every time you make a call that you might need to reference later:");
  lines.push("- What was decided");
  lines.push("- Why (the reasoning, not just the outcome)");
  lines.push("- When");
  lines.push("- Any exceptions or conditions");
  lines.push("");

  const stakeholders = toArray(summary?.keyStakeholders);
  if (stakeholders.length) {
    lines.push("**stakeholders.md** should capture your key stakeholders and their lens:");
    lines.push("");
    for (const s of stakeholders) {
      if (typeof s === "string") {
        lines.push(`- **${s}**`);
      } else if (s.name) {
        lines.push(`- **${s.name}**${s.role ? ` (${s.role})` : ""}${s.lens ? ` — ${s.lens}` : ""}`);
      }
    }
    lines.push("");
    lines.push("When AI drafts anything for a specific audience, it should reference this file.");
    lines.push("");
  }

  if (hasMeetingWork) {
    lines.push("### meetings/ — Processed meeting intelligence");
    lines.push("");
    lines.push("Don't dump raw transcripts here. Process each meeting into structured notes.");
    lines.push("");
    lines.push("**_processing-instructions.md** tells AI how to extract value from your meetings. Include:");
    lines.push("- What to extract: decisions, action items, open questions, strategic ideas, status changes");
    lines.push("- Where action items go (your tracking folder, a project board, etc.)");
    lines.push("- How to handle decisions (add to decisions.md)");
    lines.push("- What to flag for your attention vs. what to file and forget");
    lines.push("");
  }

  if (hasLeadershipComms) {
    lines.push("### writing/ — Your voice and style");
    lines.push("");
    lines.push("**_style-guide.md** captures how you write so AI drafts match your voice:");
    lines.push("- Preferred tone (direct? diplomatic? data-driven?)");
    lines.push("- Formatting patterns (headers, bullets, tables — what you default to)");
    lines.push("- Words/phrases you use vs. avoid");
    lines.push("- Examples of past writing you're proud of");
    lines.push("");
    lines.push("Keep 2-3 past examples of good outputs (a narrative, a status update, a decision brief) so AI can match your style, not just your instructions.");
    lines.push("");
  }

  lines.push("### prompts/ — Your working prompt library");
  lines.push("");
  lines.push("Start by copying the prompts from your Prompt Pack output into this folder. As you use and refine them, save the improved versions here. Over time this becomes your personal toolkit.");
  lines.push("");

  lines.push("## Custom AI Instructions");
  lines.push("");
  lines.push("Copy the **Custom AI Instructions** output from this session into `.instructions.md` at the root of your second brain. This file tells any AI tool that reads your repo who you are, what you do, and how to help you.");
  lines.push("");
  lines.push("If you use multiple AI tools:");
  lines.push("- **GitHub Copilot / VS Code:** The `.instructions.md` file is read automatically when you open the folder.");
  lines.push("- **ChatGPT:** Paste the system prompt section into Settings → Personalization → Custom Instructions.");
  lines.push("- **Claude:** Paste into your Project's custom instructions or use it as a system prompt in the API.");
  lines.push("- **M365 Copilot:** Reference key context in your prompt or use Copilot Pages to maintain persistent context.");
  lines.push("");

  lines.push("## Getting Started (Today)");
  lines.push("");
  if (useRepo) {
    lines.push("1. **Create the repo.** `mkdir my-second-brain && cd my-second-brain && git init` (or create on GitHub).");
  } else {
    lines.push("1. **Create the folder.** `mkdir ~/Documents/second-brain` (or wherever you keep working files).");
  }
  lines.push("2. **Create the structure above.** Copy the folder tree — empty folders are fine to start.");
  lines.push("3. **Write operating-model.md first.** Use your interview answers from Part A as the starting draft — they're already structured.");
  lines.push("4. **Copy in your outputs.** Move the Custom AI Instructions to `.instructions.md`, Prompt Pack to `prompts/`, and keep your session JSON for reference.");
  lines.push("5. **Start capturing.** After your next meeting, process the notes using the structure above. After your next decision, log it. The habit matters more than perfection.");
  lines.push("");

  lines.push("## Growing Your Second Brain");
  lines.push("");
  lines.push("Your second brain gets more valuable as it accumulates context. The key habits:");
  lines.push("");
  lines.push("- **After every meeting:** Process notes into structured format (decisions, actions, open questions).");
  lines.push("- **After every decision:** Log it in decisions.md — even small ones. Future-you will thank current-you.");
  lines.push("- **After every friction moment:** Note what went wrong in process-notes/. These become your improvement backlog.");
  lines.push("- **Monthly:** Review and prune. Remove stale items, promote useful patterns, update your operating model if your work has changed.");
  lines.push("");
  if (useRepo) {
    lines.push("When you're ready to go further, this repo structure is the foundation for building a full agent squad — AI agents designed around your work patterns that read this repo as their context. But that's optional. A well-maintained second brain is powerful on its own.");
  }

  return lines.join("\n");
}

export function generateOutputWalkthrough(session, scoredResponsibilities, outputIds) {
  const person = session.person;
  const lines = [];

  lines.push("# Your Outputs — What They Are and How to Use Them");
  lines.push("");
  lines.push(`Generated for ${person.name}${person.role ? ` — ${person.role}` : ""}`);
  lines.push("");
  lines.push("Here's what was generated from your interview, what each output is for, and a recommended order to work through them.");
  lines.push("");

  lines.push("## Recommended Flow");
  lines.push("");
  lines.push("Don't try to use everything at once. Follow this sequence:");
  lines.push("");
  lines.push("1. **Read the 3-Bucket Classification first.** It's the fastest way to see the big picture — which work AI can own, which it assists with, and which stays with you.");
  lines.push("2. **Review the Responsibility Map.** This is your structured inventory. Confirm it looks right — everything else builds on it.");
  lines.push("3. **Try one prompt from the Prompt Pack.** Pick a Bucket 1 task (AI can handle it end-to-end) and try the prompt today. See what happens.");
  lines.push("4. **Set up your Custom AI Instructions.** Paste them into your preferred AI tool so every future conversation starts with your context.");
  lines.push("5. **Set up your Second Brain.** Follow the setup guide to create a place for decisions, meeting notes, and process knowledge.");
  lines.push("6. **Follow the AI Action Plan.** It's a prioritized week-by-week guide for building AI into your workflow.");
  lines.push("");

  lines.push("## Output Guide");
  lines.push("");

  const outputGuide = [
    {
      id: "responsibility-map",
      title: "Responsibility Map",
      what: "A structured inventory of everything you own — what it produces, what triggers it, where the pain points are, and the AI workflow potential for each one.",
      howToUse: "Reference this when someone asks 'what do you do?' or when you're planning where to invest time in AI. Update it when responsibilities change.",
      format: "responsibility-map.md"
    },
    {
      id: "work-pattern-summary",
      title: "Work Pattern Summary",
      what: "A narrative synthesis of your work patterns — your job in plain English, what shapes your work, where friction lives, and what should stay human.",
      howToUse: "Share this with your manager if they ask what you're working on. Use it as context when onboarding someone to your role. It's also the foundation of your second brain's operating-model.md.",
      format: "work-pattern-summary.md"
    },
    {
      id: "bucket-classification",
      title: "3-Bucket Classification",
      what: "Sorts every responsibility into one of three buckets: AI Automates (AI does it), AI Assists (AI + You), or Human (only you). The simplest view of where AI fits.",
      howToUse: "Start here. It's intentionally visual. Use it to decide which prompt to try first (Bucket 1) and which work to protect from over-automation (Bucket 3).",
      format: "bucket-classification.md"
    },
    {
      id: "ai-leverage-opportunities",
      title: "AI Leverage Opportunities",
      what: "Detailed scoring for each responsibility — the computed leverage score, recommended mode (automate, assist, human-led), and specific recommendation.",
      howToUse: "When you want to go deeper than the 3-bucket view. Use the scores to prioritize where to invest in AI tooling or prompt development.",
      format: "ai-leverage-opportunities.md"
    },
    {
      id: "prompt-pack",
      title: "Prompt Pack",
      what: "Ready-to-use prompts for every responsibility — matched to its bucket. Bucket 1 prompts produce final output; Bucket 2 prompts start a collaboration; Bucket 3 prompts help you prepare.",
      howToUse: "Copy a prompt, paste it into your AI tool, and go. These are starting points — save the ones that work, edit the ones that don't. Move your favorites to your second brain's prompts/ folder.",
      format: "prompt-pack.md"
    },
    {
      id: "ai-action-plan",
      title: "AI Action Plan",
      what: "A prioritized getting-started guide: what to try this week, what to build toward this month, what stays human, and what to do after you've built confidence.",
      howToUse: "Follow it in order. The first section is 'try one thing this week.' The goal is momentum, not perfection.",
      format: "ai-action-plan.md"
    },
    {
      id: "custom-ai-instructions",
      title: "Custom AI Instructions",
      what: "A personalized system prompt capturing your role, work patterns, stakeholder lenses, friction points, and boundaries. Paste this into any AI tool so it knows your context.",
      howToUse: "Paste into ChatGPT's custom instructions, Claude's project instructions, or save as .instructions.md in your repo/folder for Copilot to read automatically.",
      format: "custom-ai-instructions.md"
    },
    {
      id: "second-brain-setup",
      title: "Second Brain Setup Guide",
      what: "A personalized guide for creating your own knowledge management system — folder structure, what goes where, custom AI instructions for processing meetings and decisions, and whether to use a repo or local folder.",
      howToUse: "Follow the Getting Started section today. Create the structure, copy in your outputs, and start the capture habit with your next meeting or decision.",
      format: "second-brain-setup.md"
    },
    {
      id: "agent-opportunity-map",
      title: "Agent Opportunity Map",
      what: "Shows how your responsibilities cluster into potential AI agent roles — for people who want to go beyond prompts and build a dedicated AI operating model.",
      howToUse: "This is optional and advanced. Look at it when you're ready to move from 'using AI tools' to 'building AI workflows.' Each cluster is a candidate agent with a defined job.",
      format: "agent-opportunity-map.md"
    }
  ];

  for (const guide of outputGuide) {
    if (!outputIds.includes(guide.id)) continue;
    lines.push(`### ${guide.title}`);
    lines.push("");
    lines.push(`**What it is:** ${guide.what}`);
    lines.push("");
    lines.push(`**How to use it:** ${guide.howToUse}`);
    lines.push("");
    lines.push(`📄 File: \`${guide.format}\``);
    lines.push("");
  }

  lines.push("## What's Next");
  lines.push("");

  const bucket1 = scoredResponsibilities.filter((r) => r.leverage?.bucket === 1);
  if (bucket1.length) {
    lines.push(`**Your single best next step:** Open your Prompt Pack, find the prompt for **${bucket1[0].title}**, and try it right now. Don't plan — just try.`);
  } else {
    const bucket2 = scoredResponsibilities.filter((r) => r.leverage?.bucket === 2);
    if (bucket2.length) {
      lines.push(`**Your single best next step:** Open your Prompt Pack, find the prompt for **${bucket2[0].title}**, and try it. AI will draft, you'll refine — see how it feels.`);
    } else {
      lines.push("**Your single best next step:** Set up your second brain using the setup guide. Even without AI automation, having your knowledge organized pays off immediately.");
    }
  }
  lines.push("");
  lines.push("After that first experiment, come back to the AI Action Plan and work through it at your own pace.");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("*These outputs were generated from your Workflow Design Interview session. You can re-run the generator any time — edit your session.json and regenerate to see different results.*");

  return lines.join("\n");
}
