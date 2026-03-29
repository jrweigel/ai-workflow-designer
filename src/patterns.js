const patternDefinitions = [
  {
    id: "coordination-and-follow-through",
    title: "Coordination and Follow-Through",
    matchers: ["coordination", "follow-up", "followup", "routing", "triage", "alignment", "program", "ops", "owner"]
  },
  {
    id: "synthesis-and-briefing",
    title: "Synthesis and Briefing",
    matchers: ["summary", "brief", "briefing", "recap", "status", "narrative", "digest", "report", "memo"]
  },
  {
    id: "monitoring-and-signal-detection",
    title: "Monitoring and Signal Detection",
    matchers: ["monitor", "tracking", "tracker", "dashboard", "signal", "metric", "adoption", "health", "deadline"]
  },
  {
    id: "planning-and-design",
    title: "Planning and Design",
    matchers: ["planning", "plan", "roadmap", "design", "strategy", "model", "cohort", "curriculum"]
  },
  {
    id: "meetings-and-operating-rhythm",
    title: "Meetings and Operating Rhythm",
    matchers: ["meeting", "standup", "agenda", "review", "pre-read", "preread", "facilitation"]
  },
  {
    id: "stakeholder-communications",
    title: "Stakeholder Communications",
    matchers: ["stakeholder", "communication", "comms", "leadership", "email", "talking points", "audience"]
  }
];

function toSearchBlob(responsibility) {
  return [
    responsibility.title,
    responsibility.outcome,
    responsibility.cadence,
    ...(responsibility.tags ?? []),
    ...(responsibility.outputs ?? []),
    ...(responsibility.painPoints ?? [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export function deriveWorkPatterns(session) {
  const hits = new Map();

  for (const definition of patternDefinitions) {
    hits.set(definition.id, {
      ...definition,
      count: 0,
      evidence: []
    });
  }

  for (const responsibility of session.responsibilities ?? []) {
    const blob = toSearchBlob(responsibility);

    for (const definition of patternDefinitions) {
      const matched = definition.matchers.some((matcher) => blob.includes(matcher));

      if (!matched) {
        continue;
      }

      const current = hits.get(definition.id);
      current.count += 1;
      current.evidence.push(responsibility.title);
    }
  }

  const ranked = [...hits.values()]
    .filter((entry) => entry.count > 0)
    .sort((left, right) => right.count - left.count)
    .slice(0, 5)
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      count: entry.count,
      evidence: unique(entry.evidence)
    }));

  const explicitPatterns = session.summary?.topRecurringPatterns ?? [];

  for (const pattern of explicitPatterns) {
    if (!ranked.some((entry) => entry.title.toLowerCase() === pattern.toLowerCase())) {
      ranked.push({
        id: pattern.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: pattern,
        count: 1,
        evidence: []
      });
    }
  }

  return ranked.slice(0, 5);
}

const agentTemplates = {
  "coordination-and-follow-through": {
    roleName: "Workflow Operator",
    jtbd: "Keep follow-through visible by turning scattered commitments into tracked work, nudges, and status checks."
  },
  "synthesis-and-briefing": {
    roleName: "Synthesis Partner",
    jtbd: "Turn messy inputs into briefings, summaries, and decision-ready artifacts without losing the important nuance."
  },
  "monitoring-and-signal-detection": {
    roleName: "Signal Monitor",
    jtbd: "Watch deadlines, dashboards, and workstream signals so the human sees what changed before it becomes a problem."
  },
  "planning-and-design": {
    roleName: "Planning Builder",
    jtbd: "Help shape plans, models, and structured working drafts so the human starts from a solid frame instead of a blank page."
  },
  "meetings-and-operating-rhythm": {
    roleName: "Meeting Intelligence Lead",
    jtbd: "Prepare for recurring meetings, capture what changed, and carry action items forward into the next operating cycle."
  },
  "stakeholder-communications": {
    roleName: "Narrative and Comms Partner",
    jtbd: "Draft audience-aware updates and stress-test messaging before the human sends anything externally."
  }
};

export function deriveAgentOpportunities(session, scoredResponsibilities) {
  const patterns = deriveWorkPatterns(session);
  const grouped = new Map();

  for (const responsibility of scoredResponsibilities) {
    const blob = toSearchBlob(responsibility);
    const strongestPattern = patterns.find((pattern) => {
      const definition = patternDefinitions.find((entry) => entry.id === pattern.id);
      return definition?.matchers.some((matcher) => blob.includes(matcher));
    });

    if (!strongestPattern) {
      continue;
    }

    const current = grouped.get(strongestPattern.id) ?? [];
    current.push(responsibility);
    grouped.set(strongestPattern.id, current);
  }

  return patterns
    .filter((pattern) => grouped.has(pattern.id))
    .map((pattern) => {
      const template = agentTemplates[pattern.id] ?? {
        roleName: pattern.title,
        jtbd: "Support this work pattern with focused AI assistance."
      };
      const responsibilities = grouped.get(pattern.id);

      return {
        pattern: pattern.title,
        roleName: template.roleName,
        jobToBeDone: template.jtbd,
        responsibilities: responsibilities.map((item) => item.title),
        outputs: unique(responsibilities.flatMap((item) => item.outputs ?? [])).slice(0, 6),
        humanReview: unique(responsibilities.map((item) => item.humanRoleLeft)).slice(0, 3),
        leverageBands: unique(responsibilities.map((item) => item.leverage.band))
      };
    });
}