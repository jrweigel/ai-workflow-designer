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
  lines.push("- **Set up your second brain.** Use the Second Brain Setup Guide to create your personal knowledge repo from the [Second Work Brain template](https://github.com/gim-home/second-work-brain-template) \u2014 it comes with Copilot instruction files, meeting recap workflows, and Monday briefings built in.");

  return lines.join("\n");
}

export function generateSecondBrainSetup(session, scoredResponsibilities) {
  const person = session.person;
  const summary = session.summary;
  const lines = [];

  const bucket1 = scoredResponsibilities.filter((r) => r.leverage?.bucket === 1);
  const bucket2 = scoredResponsibilities.filter((r) => r.leverage?.bucket === 2);
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
  const usesM365 = (summary?.m365Usage ?? "").trim();

  lines.push("# Second Brain Setup Guide");
  lines.push("");
  lines.push(`Personalized for ${person.name}${person.role ? ` — ${person.role}` : ""}`);
  lines.push("");
  lines.push("Your second brain is where AI meets your workflow — it captures meetings, tracks decisions, manages projects, and keeps you oriented across everything you're working on. Without it, every AI conversation starts from zero.");
  lines.push("");

  if (knowledgeContext) {
    lines.push("## Where You Are Today");
    lines.push("");
    lines.push(knowledgeContext);
    lines.push("");
  }

  // --- Recommended Setup: template-first for repo users ---
  lines.push("## Recommended Setup");
  lines.push("");
  if (useRepo) {
    lines.push("**Use the [Second Work Brain template](https://github.com/gim-home/second-work-brain-template)** — a GitHub template repo pre-configured with GitHub Copilot instructions, project-based organization, and built-in workflows for meeting recaps, weekly briefings, and task tracking.");
    lines.push("");
    lines.push("Why this template for your work:");
    lines.push("- It's designed around how knowledge workers actually operate — projects, meetings, decisions, and contacts.");
    lines.push("- GitHub Copilot reads the repo as context automatically. Instruction files in `.github/instructions/` tell Copilot your role, projects, stakeholders, and preferences.");
    lines.push("- Built-in workflows like **Monday briefing** and **meeting recap** handle the repetitive synthesis your interview identified.");
    if (usesM365) {
      lines.push("- **WorkIQ MCP integration** connects Copilot to your Microsoft 365 data (email, calendar, Teams) — so your second brain can pull from the tools you already use.");
    }
    if (bucket1.length >= 2) {
      lines.push("- Your automatable workflows can write directly to the repo as part of their output pipeline.");
    }
    lines.push("");
    lines.push("### How to get started");
    lines.push("");
    lines.push("1. Go to [github.com/gim-home/second-work-brain-template](https://github.com/gim-home/second-work-brain-template)");
    lines.push('2. Click **"Use this template"** → **Create a new repository**');
    lines.push("3. Name it something personal (e.g., `my-second-brain`, `work-brain`, your alias)");
    lines.push("4. Clone it locally and open in VS Code");
    lines.push('5. Say **"set up my second brain"** in Copilot Chat — the onboarding workflow will walk you through personalizing it');
    lines.push("");
    lines.push("> **No GitHub?** You can also clone the template locally: `git clone https://github.com/gim-home/second-work-brain-template.git my-second-brain`. Everything works except GitHub Issues — action items are tracked in files instead.");
  } else {
    lines.push("**Start with the [Second Work Brain template](https://github.com/gim-home/second-work-brain-template)** — even as a local clone without a GitHub repo.");
    lines.push("");
    lines.push("Why the template works for you:");
    lines.push("- Zero-design. The structure and Copilot instructions are already built.");
    lines.push("- You can use it locally with just `git clone` — no GitHub account required.");
    lines.push("- If you later want GitHub Issues, version history, or collaboration, push it to GitHub in one step.");
    lines.push("");
    lines.push("### How to get started");
    lines.push("");
    lines.push("```");
    lines.push("git clone https://github.com/gim-home/second-work-brain-template.git my-second-brain");
    lines.push("cd my-second-brain");
    lines.push("code .");
    lines.push("```");
    lines.push("");
    lines.push('Then say **"set up my second brain"** in Copilot Chat to personalize it.');
  }

  lines.push("");
  lines.push("## Template Structure");
  lines.push("");
  lines.push("The template organizes your work by **project**. Each project gets its own folder with subfolders for meetings, decisions, and resources. When you process a meeting summary, Copilot automatically routes the notes to the right project folder.");
  lines.push("");
  lines.push("```");
  lines.push("my-second-brain/");
  lines.push("├── .github/instructions/         # Copilot instruction files (customize these)");
  lines.push("│   ├── copilot-instructions.md   # Core operating rules — your role, style, boundaries");
  lines.push("│   ├── task.instructions.md       # Your work areas and task categories");
  lines.push("│   ├── meetingrecap.instructions.md   # Strategic focus lenses for meeting processing");
  lines.push("│   └── mondaybriefing.instructions.md # Key contacts, projects, Teams channels");
  lines.push("├── projects/                      # One folder per active project");
  lines.push("│   └── <project-name>/");
  lines.push("│       ├── README.md              # Project overview, status, goals");
  lines.push("│       ├── decisions/              # Project-specific decisions");
  lines.push("│       ├── meetings/               # Meeting notes routed here automatically");
  lines.push("│       └── resources/              # Links, docs, assets");
  lines.push("├── background/                    # System-level memory and operating model");
  lines.push("│   ├── operating-model.md         # How you work: cadences, stakeholders, boundaries");
  lines.push("│   ├── decisions.md               # Cross-project decisions");
  lines.push("│   └── current.md                 # Recent activity and working memory");
  lines.push("├── contacts/                      # Person-centric notes and working relationships");
  lines.push("├── reviews/                       # Weekly and monthly review summaries");
  lines.push("├── inbox/                         # Staging area for unprocessed notes");
  lines.push("└── archive/                       # Completed or inactive items");
  lines.push("```");

  lines.push("");
  lines.push("## Map Your Interview Outputs to the Template");
  lines.push("");
  lines.push("Here's where each output from this session goes in your second brain:");
  lines.push("");
  lines.push("| Output from this session | Where it goes in the template |");
  lines.push("|---|---|");
  lines.push("| **Custom AI Instructions** | Merge into `.github/instructions/copilot-instructions.md` — this replaces the generic system prompt with your personalized one |");
  lines.push("| **Work Pattern Summary** | Copy to `background/operating-model.md` — this is the foundation Copilot reads first |");
  lines.push("| **Prompt Pack** | Keep in your outputs folder or copy favorites into the repo as reusable prompts |");
  lines.push("| **AI Action Plan** | Reference it as you build habits — it doesn't need to live in the repo |");

  const stakeholders = toArray(summary?.keyStakeholders);
  if (stakeholders.length) {
    lines.push("| **Stakeholder context** | Create a file in `contacts/` for each key stakeholder with their lens and preferences |");
  }

  lines.push("");

  // --- Personalize instruction files ---
  lines.push("## Personalize the Instruction Files");
  lines.push("");
  lines.push("The template includes four instruction files in `.github/instructions/` that control how Copilot works with your second brain. Personalize them with context from your interview:");
  lines.push("");

  lines.push("### copilot-instructions.md");
  lines.push("");
  lines.push("This is the core system prompt. Update it with:");
  lines.push(`- Your role: ${person.role || "(fill in)"}`);
  if (summary?.jobInPlainEnglish) {
    lines.push(`- Your job in plain English: ${summary.jobInPlainEnglish}`);
  }
  lines.push(`- What stays human: ${summary?.humanOnlyWork || "(fill in from your interview)"}`);
  lines.push("");

  if (hasMeetingWork) {
    lines.push("### meetingrecap.instructions.md");
    lines.push("");
    lines.push("Update with your strategic focus lenses — the things you're looking for in every meeting:");

    const patterns = summary?.topRecurringPatterns ?? [];
    if (patterns.length) {
      for (const p of patterns) {
        lines.push(`- ${p}`);
      }
    } else {
      lines.push("- Decisions made and their reasoning");
      lines.push("- Action items and owners");
      lines.push("- Open questions and blockers");
    }
    lines.push("");
  }

  lines.push("### mondaybriefing.instructions.md");
  lines.push("");
  lines.push("Update with:");
  if (stakeholders.length) {
    lines.push("- Your key contacts:");
    for (const s of stakeholders) {
      if (typeof s === "string") {
        lines.push(`  - **${s}**`);
      } else if (s.name) {
        lines.push(`  - **${s.name}**${s.role ? ` (${s.role})` : ""}${s.lens ? ` — ${s.lens}` : ""}`);
      }
    }
  }
  lines.push("- Your active projects and their status");
  lines.push("- Teams channels you monitor");
  lines.push("");

  lines.push("### task.instructions.md");
  lines.push("");
  lines.push("Update with your work areas and how tasks should be categorized. Based on your interview, your key areas include:");

  const areas = [...new Set(scoredResponsibilities.flatMap((r) => toArray(r.tags)))].slice(0, 6);
  if (areas.length) {
    for (const a of areas) {
      lines.push(`- ${a}`);
    }
  } else {
    lines.push("- (Add your work areas from the responsibility map)");
  }
  lines.push("");

  // --- Built-in workflows matched to responsibilities ---
  lines.push("## Built-In Workflows");
  lines.push("");
  lines.push("The template comes with workflows you can trigger from Copilot Chat. Based on your interview, here are the ones most relevant to your work:");
  lines.push("");

  if (hasMeetingWork) {
    lines.push('### Meeting Recap — Say "process meeting summary"');
    lines.push("");
    lines.push("Converts meeting notes into durable context updates, decision records, and GitHub Issues for action items. Notes are automatically routed to the right project folder.");

    const meetingResponsibilities = scoredResponsibilities.filter((r) =>
      toArray(r.tags).some((t) => ["meeting", "standup", "agenda", "recap"].includes(t.toLowerCase()))
    );
    if (meetingResponsibilities.length) {
      lines.push("");
      lines.push("This directly supports your meeting-related work:");
      for (const r of meetingResponsibilities) {
        lines.push(`- **${r.title}**${r.leverage?.recommendation ? ` — ${r.leverage.recommendation}` : ""}`);
      }
    }
    lines.push("");
  }

  lines.push('### Monday Briefing — Say "Monday briefing" or "start the week"');
  lines.push("");
  lines.push("Pulls together:");
  lines.push("- Last week's key meetings and decisions");
  lines.push("- This week's calendar and prep needs");
  lines.push("- Open GitHub Issues and project status");
  lines.push("- Recommended priorities");
  if (usesM365) {
    lines.push("");
    lines.push("With WorkIQ connected, this pulls directly from your M365 calendar and email — no manual input needed.");
  }
  lines.push("");

  if (hasTracking) {
    lines.push('### Session Wrap — Say "wrap this session"');
    lines.push("");
    lines.push("Captures key insights from an AI working session into your second brain so context isn't lost between conversations.");
    lines.push("");
  }

  // --- Getting started with the template ---
  lines.push("## Getting Started (Today)");
  lines.push("");
  if (useRepo) {
    lines.push('1. **Create your repo from the template.** Click "Use this template" on [github.com/gim-home/second-work-brain-template](https://github.com/gim-home/second-work-brain-template).');
  } else {
    lines.push("1. **Clone the template.** `git clone https://github.com/gim-home/second-work-brain-template.git my-second-brain`");
  }
  lines.push("2. **Open in VS Code.** Make sure you have the GitHub Copilot extension and Node.js v18+ installed.");
  lines.push('3. **Run onboarding.** Say **"set up my second brain"** in Copilot Chat. It will walk you through personalizing the system.');
  lines.push("4. **Copy in your outputs.** Merge Custom AI Instructions into `.github/instructions/copilot-instructions.md`, and copy your Work Pattern Summary into `background/operating-model.md`.");

  const projectNames = [...new Set(scoredResponsibilities.flatMap((r) => toArray(r.tags).filter((t) => !["meeting", "standup", "agenda", "recap", "tracking", "monitor", "ops", "follow-up", "program", "narrative", "stakeholder", "communication", "briefing", "comms", "leadership"].includes(t.toLowerCase()))))].slice(0, 3);
  if (projectNames.length) {
    lines.push(`5. **Create your first projects.** Say "create a new project" for each major work area. Based on your interview: ${projectNames.join(", ")}.`);
  } else {
    lines.push('5. **Create your first project.** Say "create a new project" and Copilot will scaffold the folder structure for you.');
  }
  lines.push('6. **Try a workflow.** After your next meeting, say "process meeting summary" and see the notes get routed to the right project folder.');
  lines.push("");

  if (usesM365) {
    lines.push("### Connect Microsoft 365");
    lines.push("");
    lines.push("The template includes a pre-configured WorkIQ MCP server (`.vscode/mcp.json`) that connects Copilot to your M365 data — email, calendar, Teams messages, and documents. This is what powers the Monday briefing and meeting recap workflows.");
    lines.push("");
    lines.push("When you open the repo in VS Code, it will prompt you to authorize the WorkIQ connection. Once connected, Copilot can pull meeting details, recent emails, and Teams activity directly into your workflows.");
    lines.push("");
  }

  lines.push("## Growing Your Second Brain");
  lines.push("");
  lines.push("Your second brain gets more valuable as it accumulates context. The key habits:");
  lines.push("");
  lines.push('- **After every meeting:** Say "process meeting summary" — decisions, actions, and context updates are captured automatically.');
  lines.push("- **After every decision:** Log it in the relevant project's `decisions/` folder, or in `background/decisions.md` for cross-project decisions.");
  lines.push("- **Start each week:** Say \"Monday briefing\" to get oriented — it synthesizes your calendar, open issues, and recent activity.");
  lines.push("- **Monthly:** Check `reviews/` for patterns. Update your operating model if your work has changed.");
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
      what: "A personalized guide for setting up your second brain using the Second Work Brain template \u2014 project-based organization, Copilot instruction files to personalize, built-in workflows (Monday briefing, meeting recap, session management), and a mapping of your interview outputs into the template structure.",
      howToUse: "Follow the Getting Started section today. Create your repo from the template, run the onboarding workflow, and copy in your interview outputs. The guide shows exactly which instruction files to personalize and which workflows match your work.",
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
