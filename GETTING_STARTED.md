# Getting Started with AI Workflow Designer

This guide is for people who may be new to VS Code and GitHub Copilot. It walks you through everything from installation to your first AI-powered workflow design session.

**What you'll do:** Have a 60–90 minute deep guided conversation with an AI agent that maps your actual work and tells you where AI can help. You'll walk away with actionable outputs — prompts you can use immediately, a prioritized action plan, custom AI instructions, and a personalized guide for setting up your own second brain.

**What you'll need:** A computer and about 90 minutes (including setup). The depth is the point — this isn't a speed run, it's a deep exercise in understanding how you actually work.

---

## Step 1: Install VS Code

VS Code is a free code editor from Microsoft. Even if you don't write code, it's the environment where the interview happens.

1. Go to [https://code.visualstudio.com](https://code.visualstudio.com)
2. Download the version for your operating system (Windows, Mac, or Linux)
3. Run the installer with default settings
4. Open VS Code when installation completes

> **Tip:** When the installer asks about adding to PATH or creating a desktop shortcut, say yes to both — it makes things easier later.

## Step 2: Install GitHub Copilot

GitHub Copilot is the AI assistant that powers the interview. You'll need a GitHub account and a Copilot subscription (free tier available).

### Create a GitHub account (if you don't have one)

1. Go to [https://github.com](https://github.com)
2. Click **Sign up** and follow the prompts
3. Verify your email address

> **Microsoft employees:** You already have a GitHub account through your Enterprise Managed User (EMU). Sign in with your `_microsoft` username (e.g., `yourname_microsoft`). If you haven't set this up yet, go to [https://repos.opensource.microsoft.com/link](https://repos.opensource.microsoft.com/link) to link your GitHub account, then follow the EMU setup instructions on the [Microsoft Open Source portal](https://docs.opensource.microsoft.com/tools/github/accounts/index.html). Your EMU account includes GitHub Copilot — skip the "Get GitHub Copilot" section below.

### Get GitHub Copilot

1. Go to [https://github.com/features/copilot](https://github.com/features/copilot)
2. Click **Get started with Copilot** — there is a free tier available
3. Follow the setup steps to activate Copilot on your account

### Install the Copilot extension in VS Code

1. Open VS Code
2. Click the **Extensions** icon in the left sidebar (it looks like four squares)
3. Search for **GitHub Copilot**
4. Click **Install** on the "GitHub Copilot" extension (published by GitHub)
5. VS Code will prompt you to sign in to GitHub — follow the sign-in flow
6. You may also see "GitHub Copilot Chat" as a separate extension — install that too

> **Tip:** After signing in, you should see a Copilot icon in the VS Code status bar at the bottom. If it says "Ready," you're good.

## Step 3: Get the AI Workflow Designer

### Option A: Clone the repo (recommended for beginners)

"Cloning" means downloading a copy of the project to your computer.

1. Open VS Code
2. Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac) to open the **Command Palette**
3. Type `Git: Clone` and select it
4. Paste this URL: `https://github.com/jrweigel/ai-workflow-designer.git`
5. Choose a folder on your computer to save it (your Documents folder is fine)
6. When VS Code asks "Would you like to open the cloned repository?" — click **Open**

> **Don't have Git?** If VS Code says Git is not installed:
> - **Windows:** Download from [https://git-scm.com](https://git-scm.com) and install with defaults
> - **Mac:** Open Terminal and type `xcode-select --install`
> - Then restart VS Code and try the clone step again

### Option B: Add to an existing project

If you already have a VS Code workspace open:

1. Open the terminal in VS Code (`Ctrl+`` ` or **Terminal → New Terminal**)
2. Run: `npx ai-workflow-designer setup`
3. This installs the interview agent into your project

> **Note:** This option requires Node.js. If you don't have Node.js installed, use Option A instead — it doesn't require Node.js for the interview itself.

## Step 4: Start the Interview

1. Make sure you have the AI Workflow Designer folder open in VS Code (you should see files in the left sidebar)
2. Open **Copilot Chat** — click the chat icon in the sidebar, or press `Ctrl+Shift+I` (Windows) / `Cmd+Shift+I` (Mac)
3. In the chat input, type:

```
@workflow-designer
```

4. Press Enter. The Workflow Designer will introduce itself and ask you to pick a goal.

> **If `@workflow-designer` doesn't appear:** Make sure you opened the correct folder in VS Code (the one you cloned in Step 3). The agent only works when VS Code can see the `.github/agents/` folder in the workspace.

## Step 5: Have the Conversation

The interview has three parts:

### Part A — Know Your Work (~20–30 minutes)
The agent asks about 8 themes: your responsibilities, work rhythms, recurring artifacts, friction points, human-only work, AI leverage points, key stakeholders, and how you manage knowledge and context today. For each theme, it probes deeper to surface the real patterns. Just talk naturally — it'll ask follow-up questions.

**Example of what it might ask:**
> "What are you personally on the hook for right now — the outcomes your manager would say you must not drop?"

Just answer honestly in your own words. There are no wrong answers.

### Part B — Map Responsibilities (~20–30 minutes)
The agent proposes a structured view of each responsibility based on what you shared. It'll show you a draft and ask you to confirm or correct it. For each one, it also captures an AI Workflow Potential assessment — your gut-check on how much AI could change how you do this work.

**Example:**
> "Here's what I captured for your first responsibility — does this look right?"
>
> **Title:** Monthly reporting
> **Outcome:** Leadership has accurate project status
> **Cadence:** Monthly
> **Pain points:** Manual data gathering from 4 systems

Correct anything that's off. The more accurate this is, the better your outputs will be.

### Part C — Synthesis and Outputs (~10–15 minutes)
The agent summarizes your work patterns, asks what should always stay human, generates all your outputs, and then walks you through each one — what it is, how to use it, and the recommended sequence to get started.

## Step 6: Use Your Outputs

After the interview, you'll find your generated files in the `.ai-workflow-designer/output/` folder. Here's what to do with each one:

| Output | What to do with it |
|--------|--------------------|
| **Output Walkthrough** | Start here — it explains every output and gives you a recommended action sequence |
| **3-Bucket Classification** | The fastest way to see the big picture — which work AI can own, assist with, or should leave alone |
| **Prompt Pack** | Open it, copy any prompt, paste it into ChatGPT / Copilot / Claude / M365 Copilot and try it |
| **AI Action Plan** | Your to-do list — start with the "This Week" items |
| **Custom AI Instructions** | Copy the system prompt block and paste it into ChatGPT's custom instructions (Settings → Personalization → Custom instructions) or equivalent in your AI tool |
| **Second Brain Setup Guide** | Follow the getting-started steps to set up your personal knowledge repo or folder — for capturing decisions, meeting notes, and process knowledge |
| **Responsibility Map** | Keep this as your reference — it's the structured view of your work with AI Workflow Potential scoring |

### Try a prompt right now

1. Open `prompt-pack.md` from the output folder
2. Find a Bucket 1 prompt (these are the easiest wins)
3. Copy it
4. Open ChatGPT, M365 Copilot, or any AI assistant
5. Paste the prompt and see what happens

That's the fastest way to see the value.

## What's Next?

- **Edit and regenerate:** Your session is saved as `session.json`. Edit it any time and regenerate outputs to see updated results.
- **Try different goals:** Re-run with `--goal full-audit` to see the agent opportunity map.
- **Build a squad:** If you want to go further and design a full team of AI agents around your work, install [agency-squad](https://github.com/gim-home/agency-squad) (`npx agency-squad setup`), then type `@squad-designer` in Copilot Chat — it picks up right where you left off.

## Troubleshooting

**"@workflow-designer" doesn't show up in Copilot Chat**
- Make sure you opened the folder that contains `.github/agents/workflow-designer.agent.md`
- Make sure the GitHub Copilot Chat extension is installed and you're signed in
- Try closing and reopening VS Code

**The interview feels stuck or the agent isn't responding**
- Copilot Chat sometimes has latency — wait a few seconds
- If it truly stops, you can start a new chat and type `@workflow-designer` again. If you previously saved progress, it'll pick up where you left off.

**"npx ai-workflow-designer" gives an error**
- Make sure Node.js is installed: [https://nodejs.org](https://nodejs.org) (LTS version recommended)
- Try running `node --version` in the terminal. If it shows a version number, Node.js is installed.

**I want to start over**
- Delete the `.ai-workflow-designer/` folder in your workspace
- Type `@workflow-designer` in Copilot Chat to restart from scratch

## FAQ

**Do I need to know how to code?**
No. The interview is a conversation. You talk about your work, and the tool generates everything.

**Does my data leave my computer?**
The interview runs through GitHub Copilot (which processes conversation through GitHub's AI infrastructure). The session file and generated outputs are saved locally on your machine. Nothing is uploaded to a shared server.

**Can I use this with my team?**
Yes. Each person runs their own interview and gets their own outputs. The session files are portable — they can share them or keep them private.

**How long does the interview take?**
About 60–90 minutes for the conversation, plus a few minutes to review outputs. The depth is intentional — it produces much better results than a quick surface-level pass.

**What if my work changes?**
Re-run the interview. Edit your session file and regenerate, or start fresh. Your work evolves — your outputs should too.
