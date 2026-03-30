function toArray(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function inferCadenceWeight(cadence = "") {
  const normalized = cadence.toLowerCase();

  if (normalized.includes("daily") || normalized.includes("continuous")) {
    return 5;
  }

  if (normalized.includes("weekly") || normalized.includes("per-meeting")) {
    return 4;
  }

  if (normalized.includes("monthly")) {
    return 3;
  }

  if (normalized.includes("quarterly") || normalized.includes("seasonal")) {
    return 2;
  }

  return 3;
}

function deriveAiWorkflowPotential(band, mode, responsibility) {
  const explicit = (responsibility.aiWorkflowPotential ?? "").trim();
  if (explicit) return explicit;

  if (band === "High" && mode === "automate-or-delegate") {
    return "High — AI can own this workflow end-to-end with a light approval gate.";
  }
  if (band === "High") {
    return "High — AI handles drafting, assembly, and monitoring. You review and decide.";
  }
  if (band === "Medium") {
    return "Medium — AI reduces prep and coordination load. You own synthesis and decisions.";
  }
  return "Low — Human-led. AI can assist with research, note cleanup, or structured prep.";
}

export function scoreResponsibility(responsibility) {
  const repeatability = clamp(
    Number(responsibility.repeatability) || inferCadenceWeight(responsibility.cadence),
    1,
    5
  );
  const judgmentIntensity = clamp(Number(responsibility.judgmentIntensity) || 3, 1, 5);
  const coordinationLoad = clamp(Number(responsibility.coordinationLoad) || 3, 1, 5);
  const artifactStructure = clamp(Number(responsibility.artifactStructure) || 3, 1, 5);
  const outputCount = clamp(toArray(responsibility.outputs).length, 0, 5);
  const painPointCount = clamp(toArray(responsibility.painPoints).length, 0, 5);

  const automationPotential = repeatability * 5 + artifactStructure * 4 + outputCount * 2 + painPointCount * 2;
  const collaborationPotential = coordinationLoad * 5 + painPointCount * 2;
  const judgmentPenalty = judgmentIntensity * 6;
  const score = clamp(Math.round(automationPotential + collaborationPotential - judgmentPenalty), 0, 100);

  let band = "Low";
  let recommendation = "Keep human-led. Use AI for note cleanup or targeted research only.";
  let mode = "human-led";
  let bucket = 3;
  let bucketLabel = "Human (Only you)";

  if (score >= 65) {
    band = "High";
    if (judgmentIntensity >= 4) {
      mode = "copilot-assist";
      bucket = 2;
      bucketLabel = "AI Assists (AI + You)";
      recommendation = "AI drafts, assembles, and monitors. You review, decide, and approve.";
    } else {
      mode = "automate-or-delegate";
      bucket = 1;
      bucketLabel = "AI Automates (AI does it)";
      recommendation = "Strong candidate for end-to-end AI with a light approval gate.";
    }
  } else if (score >= 40) {
    band = "Medium";
    mode = "assist-first";
    bucket = 2;
    bucketLabel = "AI Assists (AI + You)";
    recommendation = "AI reduces prep, aggregation, and coordination load. You own synthesis and decisions.";
  }

  return {
    score,
    band,
    bucket,
    bucketLabel,
    mode,
    recommendation,
    aiWorkflowPotential: deriveAiWorkflowPotential(band, mode, responsibility),
    dimensions: {
      repeatability,
      judgmentIntensity,
      coordinationLoad,
      artifactStructure
    }
  };
}

export function scoreResponsibilities(responsibilities = []) {
  return responsibilities.map((responsibility) => ({
    ...responsibility,
    leverage: scoreResponsibility(responsibility)
  }));
}