# Second Brain Setup Guide

Personalized for Jen Weigel — Program manager and chief-of-staff style operator for AI enablement

Your second brain is the single place where your working knowledge lives — decisions you've made, things you've learned from meetings, process notes you'll need again, and the context AI needs to actually help you. Without it, every AI conversation starts from zero.

## Where You Are Today

I use a personal KB repo (this-is-fine) with a three-layer memory model: operating model, decisions, and process notes. Meeting notes get processed into structured formats. Decisions are logged with reasoning. But a lot still lives in scattered docs and my head.

## Recommended Setup

**Use a Git repo** (GitHub, Azure DevOps, or local with `git init`).

Why a repo for your work:
- You have high-coordination work that benefits from version history and structured files.
- AI tools (Copilot, Claude) work best when they can read a repo as context.
- You can share specific artifacts without sharing everything.
- Your automatable workflows can write directly to the repo as part of their output pipeline.

## Recommended Structure

```
my-second-brain/              # or a name that works for you
├── README.md                   # What this is, how you use it
├── context/
│   ├── operating-model.md      # How you work: cadences, stakeholders, boundaries
│   ├── decisions.md            # Decisions log: what you decided, why, when
│   └── stakeholders.md         # Key people, their lens, what they care about
├── meetings/
│   ├── _processing-instructions.md  # How to extract value from meeting notes
│   └── (processed meeting notes)
├── process-notes/
│   └── (things you learned doing the work — patterns, lessons, templates)
├── tracking/
│   └── (action items, project status, follow-up lists)
├── writing/
│   ├── _style-guide.md              # Your voice, tone, formatting preferences
│   └── (drafts, templates, past examples worth keeping)
├── prompts/
│   └── (your working prompt library — start with the Prompt Pack output)
└── .instructions.md            # Custom AI instructions (use the output from this session)
```

## What Goes Where

### context/ — Your operating model

This is the foundation. When AI reads your repo, this is the first thing it should understand.

**operating-model.md** should contain:
- Your role: Program manager and chief-of-staff style operator for AI enablement
- Your key accountabilities (from Part A of your interview)
- Your work rhythms: what's daily, weekly, monthly
- What stays human: I keep the final tradeoff calls, relationship management, escalation timing, leadership messaging, and design judgment for new models or frameworks.

**decisions.md** is your decision log. Every time you make a call that you might need to reference later:
- What was decided
- Why (the reasoning, not just the outcome)
- When
- Any exceptions or conditions

### meetings/ — Processed meeting intelligence

Don't dump raw transcripts here. Process each meeting into structured notes.

**_processing-instructions.md** tells AI how to extract value from your meetings. Include:
- What to extract: decisions, action items, open questions, strategic ideas, status changes
- Where action items go (your tracking folder, a project board, etc.)
- How to handle decisions (add to decisions.md)
- What to flag for your attention vs. what to file and forget

### writing/ — Your voice and style

**_style-guide.md** captures how you write so AI drafts match your voice:
- Preferred tone (direct? diplomatic? data-driven?)
- Formatting patterns (headers, bullets, tables — what you default to)
- Words/phrases you use vs. avoid
- Examples of past writing you're proud of

Keep 2-3 past examples of good outputs (a narrative, a status update, a decision brief) so AI can match your style, not just your instructions.

### prompts/ — Your working prompt library

Start by copying the prompts from your Prompt Pack output into this folder. As you use and refine them, save the improved versions here. Over time this becomes your personal toolkit.

## Custom AI Instructions

Copy the **Custom AI Instructions** output from this session into `.instructions.md` at the root of your second brain. This file tells any AI tool that reads your repo who you are, what you do, and how to help you.

If you use multiple AI tools:
- **GitHub Copilot / VS Code:** The `.instructions.md` file is read automatically when you open the folder.
- **ChatGPT:** Paste the system prompt section into Settings → Personalization → Custom Instructions.
- **Claude:** Paste into your Project's custom instructions or use it as a system prompt in the API.
- **M365 Copilot:** Reference key context in your prompt or use Copilot Pages to maintain persistent context.

## Getting Started (Today)

1. **Create the repo.** `mkdir my-second-brain && cd my-second-brain && git init` (or create on GitHub).
2. **Create the structure above.** Copy the folder tree — empty folders are fine to start.
3. **Write operating-model.md first.** Use your interview answers from Part A as the starting draft — they're already structured.
4. **Copy in your outputs.** Move the Custom AI Instructions to `.instructions.md`, Prompt Pack to `prompts/`, and keep your session JSON for reference.
5. **Start capturing.** After your next meeting, process the notes using the structure above. After your next decision, log it. The habit matters more than perfection.

## Growing Your Second Brain

Your second brain gets more valuable as it accumulates context. The key habits:

- **After every meeting:** Process notes into structured format (decisions, actions, open questions).
- **After every decision:** Log it in decisions.md — even small ones. Future-you will thank current-you.
- **After every friction moment:** Note what went wrong in process-notes/. These become your improvement backlog.
- **Monthly:** Review and prune. Remove stale items, promote useful patterns, update your operating model if your work has changed.

When you're ready to go further, this repo structure is the foundation for building a full agent squad — AI agents designed around your work patterns that read this repo as their context. But that's optional. A well-maintained second brain is powerful on its own.
