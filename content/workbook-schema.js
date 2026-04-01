const starterResponsibilities = [
  {
    title: "",
    outcome: "",
    cadence: "",
    triggers: [],
    inputs: [],
    outputs: [],
    stakeholders: [],
    decisions: [],
    painPoints: [],
    humanRoleLeft: "",
    tags: [],
    repeatability: 3,
    judgmentIntensity: 3,
    coordinationLoad: 3,
    artifactStructure: 3,
    aiWorkflowPotential: "",
    notes: ""
  }
];

export const workbookSchema = {
  id: "ai-workflow-designer",
  version: "0.2.0",
  positioning: {
    promise: "Understand your work deeply and take immediate action with AI.",
    primaryOutput: "Responsibility map",
    secondaryOutputs: [
      "Personal work pattern summary",
      "AI leverage opportunities",
      "Agent opportunity map",
      "Second brain setup guide",
      "Portable structured session JSON"
    ]
  },
  goals: [
    {
      id: "understand",
      title: "Understand my work",
      description: "See your work on paper — a structured inventory, pattern summary, and 3-bucket classification.",
      outputs: ["responsibility-map", "work-pattern-summary", "bucket-classification"]
    },
    {
      id: "start-using-ai",
      title: "Start using AI",
      description: "Everything in 'understand' plus actionable prompts, an action plan, custom AI instructions, leverage scoring, and a second brain setup guide.",
      outputs: ["responsibility-map", "work-pattern-summary", "bucket-classification", "ai-leverage-opportunities", "prompt-pack", "ai-action-plan", "custom-ai-instructions", "second-brain-setup"]
    },
    {
      id: "full-audit",
      title: "Full audit",
      description: "The complete picture — everything above plus agent opportunity mapping for people considering a squad.",
      outputs: ["responsibility-map", "work-pattern-summary", "bucket-classification", "ai-leverage-opportunities", "prompt-pack", "ai-action-plan", "custom-ai-instructions", "second-brain-setup", "agent-opportunity-map"]
    }
  ],
  formats: [
    {
      id: "markdown",
      title: "Markdown files",
      description: "Individual .md files — great for committing to a repo or reading in VS Code."
    },
    {
      id: "single-markdown",
      title: "Single combined markdown file",
      description: "All outputs in one .md file — easy to share, paste, or attach."
    },
    {
      id: "docx",
      title: "Word document (.docx)",
      description: "A polished Word doc — good for sharing with people who don't use repos."
    },
    {
      id: "json",
      title: "Structured JSON",
      description: "Machine-readable session summary — useful for feeding into other tools or automation."
    }
  ],
  outputs: [
    {
      id: "responsibility-map",
      title: "Responsibility Map",
      description: "Structured inventory of the work someone owns, what it produces, and what still requires human judgment."
    },
    {
      id: "work-pattern-summary",
      title: "Personal Work Pattern Summary",
      description: "Short synthesis of recurring work patterns, friction, and what should remain human-led."
    },
    {
      id: "bucket-classification",
      title: "3-Bucket Classification",
      description: "Sorts each responsibility into AI Automates / AI Assists / Human — a clear visual of where AI fits and where it doesn't."
    },
    {
      id: "ai-leverage-opportunities",
      title: "AI Leverage Opportunities",
      description: "Heuristic scoring and recommendations for where AI should automate, assist, or stay out of the loop."
    },
    {
      id: "prompt-pack",
      title: "Prompt Pack",
      description: "Ready-to-use starter prompts for M365 Copilot, ChatGPT, Claude, or any AI assistant — one per responsibility, matched to its bucket."
    },
    {
      id: "ai-action-plan",
      title: "AI Action Plan",
      description: "Prioritized getting-started guide: what to try this week, what to build toward, and what stays with you."
    },
    {
      id: "custom-ai-instructions",
      title: "Custom AI Instructions",
      description: "Personalized system prompt you can paste into ChatGPT, Claude, or Copilot so the AI knows your role, work patterns, and boundaries."
    },
    {      id: "second-brain-setup",
      title: "Second Brain Setup Guide",
      description: "A personalized guide for setting up your second brain using the Second Work Brain template — with project-based organization, Copilot instruction files, built-in workflows (Monday briefing, meeting recap), and guidance for mapping your interview outputs into the template structure."
    },
    {      id: "agent-opportunity-map",
      title: "Agent Opportunity Map",
      description: "Optional clustering of responsibilities into potential agent roles for people who want to build a larger operating model."
    }
  ],
  parts: [
    {
      id: "A",
      title: "Know Your Work",
      sections: [
        {
          id: "A1",
          title: "Accountability and Outcomes",
          prompt: "What are you personally on the hook for this quarter? What must not get dropped?",
          probes: [
            "What outcomes are you personally accountable for this quarter?",
            "What would your manager say you must not drop?",
            "What are the few things only you can really own or decide?"
          ],
          responseType: "long-text"
        },
        {
          id: "A2",
          title: "Work Rhythms",
          prompt: "What recurring cadences shape your work: daily, weekly, monthly, quarterly, or ad hoc?",
          probes: [
            "What work do you do daily? Weekly? Monthly? Quarterly?",
            "What recurring meetings, reviews, or reporting cycles shape your workload?",
            "Where do you spend time preparing, following up, or translating across groups?"
          ],
          responseType: "long-text"
        },
        {
          id: "A3",
          title: "Recurring Artifacts",
          prompt: "What do you create repeatedly, and which artifacts are mostly synthesis versus high-judgment work?",
          probes: [
            "What do you create repeatedly — recaps, updates, decks, plans, trackers, issue lists, agendas, briefs?",
            "Which of those feel annoying but necessary?",
            "Which require real judgment vs. mostly assembly and synthesis?"
          ],
          responseType: "long-text"
        },
        {
          id: "A4",
          title: "Friction Map",
          prompt: "Where do you lose time to coordination, context switching, formatting, or chasing information?",
          probes: [
            "Where do you repeatedly chase information from other people?",
            "Where do you lose time to context switching, formatting, or stitching together fragmented inputs?",
            "What do you wish someone had already prepared before you walk into a meeting?"
          ],
          responseType: "long-text"
        },
        {
          id: "A5",
          title: "Human-Only Work",
          prompt: "What work should remain human-led because it depends on taste, trust, persuasion, or high-stakes judgment?",
          probes: [
            "What work is high-stakes enough that you don't want AI making the call?",
            "Where is persuasion, taste, or organizational judgment the real job?",
            "What would you never fully delegate, even if the AI got pretty good?"
          ],
          responseType: "long-text"
        },
        {
          id: "A6",
          title: "AI Leverage Points",
          prompt: "If AI took real work off your plate, what should it own end-to-end, and what should it only assist with?",
          probes: [
            "If you had one AI assistant next week, what would you want it to own end-to-end?",
            "What would a 'chief of staff' AI do for you?",
            "What would a 'research / synthesis' AI do for you?",
            "What would a 'workflow operator' AI do for you?",
            "What's the most boring but frequent work that should disappear first?"
          ],
          responseType: "long-text"
        },
        {
          id: "A7",
          title: "Key Stakeholders",
          prompt: "Who are the 3-5 people who matter most across your work? For each: what's their role and what's their lens — what do they push back on, care about, or look for?",
          probes: [
            "Who are the people whose reaction matters most when you produce something?",
            "For each person, what do they typically push back on? (Be specific — 'too vague' is useful, 'might not like it' is not.)",
            "Do any of your outputs go to leadership or cross-team audiences?"
          ],
          responseType: "long-text"
        },
        {
          id: "A8",
          title: "Knowledge and Context Management",
          prompt: "How do you currently capture and organize what you learn — decisions, meeting takeaways, process notes, strategic thinking? Where does that knowledge live today?",
          probes: [
            "Do you have a system for capturing decisions, open questions, and process notes — or does it live in your head and scattered docs?",
            "When you need to find something you learned or decided three weeks ago, where do you look?",
            "What types of information do you wish you could find faster — decisions, meeting outcomes, task context, stakeholder preferences, writing examples?",
            "How much of your information flow runs through Microsoft 365 — Outlook email, Teams messages, calendar invites, SharePoint/OneDrive docs?",
            "Do you use GitHub today — for code, issues, project tracking, or anything else?"
          ],
          responseType: "long-text"
        }
      ]
    },
    {
      id: "B",
      title: "Map Responsibilities",
      sections: [
        {
          id: "B1",
          title: "Responsibility Inventory",
          prompt: "Capture each major responsibility with its outcome, cadence, inputs, outputs, pain points, and remaining human role.",
          responseType: "responsibility-list"
        }
      ]
    },
    {
      id: "C",
      title: "Synthesize Patterns",
      sections: [
        {
          id: "C1",
          title: "Job In Plain English",
          prompt: "Describe the job in 3-5 sentences using the person's own language.",
          responseType: "long-text"
        },
        {
          id: "C2",
          title: "Recurring Work Patterns",
          prompt: "List the top recurring work patterns that show up across responsibilities.",
          responseType: "string-list"
        },
        {
          id: "C3",
          title: "What Stays With Me",
          prompt: "What decisions, relationships, and judgment calls remain human — even if AI handles everything around them?",
          responseType: "long-text"
        }
      ]
    }
  ],
  starterSession: {
    person: {
      name: "",
      role: "",
      team: "",
      goal: "Understand my work and find AI leverage"
    },
    summary: {
      jobInPlainEnglish: "",
      accountabilityAndOutcomes: "",
      workRhythms: "",
      keyStakeholders: [],
      recurringArtifacts: "",
      frictionMap: "",
      humanOnlyWork: "",
      aiLeveragePoints: "",
      knowledgeManagement: "",
      m365Usage: "",
      whatStaysWithMe: "",
      topRecurringPatterns: []
    },
    preferences: {
      goal: "start-using-ai",
      includeAgentOpportunityMap: true,
      outputFormat: "markdown",
      outputPath: ""
    },
    responsibilities: starterResponsibilities
  }
};

export function createStarterSession(overrides = {}) {
  return {
    ...structuredClone(workbookSchema.starterSession),
    ...overrides,
    person: {
      ...structuredClone(workbookSchema.starterSession.person),
      ...(overrides.person ?? {})
    },
    summary: {
      ...structuredClone(workbookSchema.starterSession.summary),
      ...(overrides.summary ?? {})
    },
    preferences: {
      ...structuredClone(workbookSchema.starterSession.preferences),
      ...(overrides.preferences ?? {})
    },
    responsibilities: overrides.responsibilities ?? structuredClone(starterResponsibilities)
  };
}