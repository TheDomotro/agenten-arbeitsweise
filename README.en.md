# Agent way of working

[Deutsch](README.md)

## Why?

A project with AI agents is like a garden. Without care, weeds spread: shortcuts get copied, and the same mistakes come back. With this way of working, every correction becomes an automatic check. Good patterns grow, and weeds get pulled automatically every week. It takes some setup at the start; after that, the work gets easier instead of harder.

## What is this?

A guide for coding agents (Claude Code or Codex). You give your agent the link. It sets up your project in this way of working: rules, checks, Git hooks and CI.

## Core ideas

1. **Code is the truth.** Clear modules, no workarounds. Agents copy what is in the code. One workaround quickly becomes ten.
2. **Rules as checks, not as text.** Every correction becomes a lint rule, a type, a test or a line in the check script `check-ops`. An agent may read a doc. A check stops it for sure.
3. **Almost no comments.** Only a `WHY:` for a reason the code does not show. Comments go stale and give agents an excuse for shortcuts.
4. **Exactly two doc files.** `AGENTS.md` says how you work. `STAND.md` says what is open. Everything else lives in code, tests or commit messages.
5. **Clear packages.** A plan in `STAND.md` splits the work into packages of 30–90 minutes. Several agents work in parallel, a reviewer checks every package.
6. **Verify by running.** Tests, browser and screenshots show whether it works. A red test gets fixed at the cause, not rerun.
7. **Simple and safe.** Standard tools. Pushes, deployments and deletions only with your approval. No credentials in Git.

## How to use it

Copy this sentence into your agent:

> Set up my project in this way of working: https://github.com/TheDomotro/agenten-arbeitsweise. Read START.en.md first and follow the steps.

The agent:

- explains briefly what it does and why,
- asks at most four questions, each with a recommendation,
- sets up Git and GitHub if you want that,
- adds rules, checks, hooks and CI,
- cleans up the project and shows you first what it deletes.

You do this yourself:

- create a GitHub account if you do not have one,
- log in (`gh auth login`) and type passwords,
- give approvals: create the repository, delete files, push.

## After that

You describe a goal. The agent writes a plan with packages in `STAND.md` and works through it. When you correct it, it proposes a new check. So the project gets more stable with every correction.

## Source

The idea matches the talk "Potato" by Lauren at the AI Engineer Summit: deterministic checks first, then verification, prose last. The codebase is a garden, almost all comments are banned, every correction becomes a lint rule.

## License

MIT, see [LICENSE](LICENSE).
