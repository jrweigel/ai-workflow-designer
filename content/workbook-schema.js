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
    notes: ""
  }
];

export const workbookSchema = {
  id: "ai-workflow-designer",
  version: "0.1.0",
  positioning: {
    promise: "Understand your work and find AI leverage.",
    primaryOutput: "Responsibility map",
    secondaryOutputs: [
      "Personal work pattern summary",
      "AI leverage opportunities",
      "Agent opportunity map",
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
      description: "Everything in 'understand' plus actionable prompts, an action plan, custom AI instructions, and leverage scoring.",
      outputs: ["responsibility-map", "work-pattern-summary", "bucket-classification", "ai-leverage-opportunities", "prompt-pack", "ai-action-plan", "custom-ai-instructions"]
    },
    {
      id: "full-audit",
      title: "Full audit",
      description: "The complete picture — everything above plus agent opportunity mapping for people considering a squad.",
      outputs: ["responsibility-map", "work-pattern-summary", "bucket-classification", "ai-leverage-opportunities", "prompt-pack", "ai-action-plan", "custom-ai-instructions", "agent-opportunity-map"]
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
    {
      id: "agent-opportunity-map",
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
          responseType: "long-text"
        },
        {
          id: "A2",
          title: "Work Rhythms",
          prompt: "What recurring cadences shape your work: daily, weekly, monthly, quarterly, or ad hoc?",
          responseType: "long-text"
        },
        {
          id: "A3",
          title: "Recurring Artifacts",
          prompt: "What do you create repeatedly, and which artifacts are mostly synthesis versus high-judgment work?",
          responseType: "long-text"
        },
        {
          id: "A4",
          title: "Friction Map",
          prompt: "Where do you lose time to coordination, context switching, formatting, or chasing information?",
          responseType: "long-text"
        },
        {
          id: "A5",
          title: "Human-Only Work",
          prompt: "What work should remain human-led because it depends on taste, trust, persuasion, or high-stakes judgment?",
          responseType: "long-text"
        },
        {
          id: "A6",
          title: "AI Leverage Points",
          prompt: "If AI took real work off your plate, what should it own end-to-end, and what should it only assist with?",
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
      recurringArtifacts: "",
      frictionMap: "",
      humanOnlyWork: "",
      aiLeveragePoints: "",
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