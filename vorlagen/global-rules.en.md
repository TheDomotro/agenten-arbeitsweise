# Base rules for all projects

## Language

- Answer in <the user's language>, short and clear.
- Short, active sentences. Always the same word for the same thing. Technical terms only when needed, then explain them briefly. Name buttons exactly as the interface shows them.

## Way of working

- Finish tasks on your own and decide technical details yourself.
- Ask only about open product decisions, missing approvals or information you cannot find yourself. Give a recommendation.
- Commit finished changes with a commit message that states the result.
- Report briefly at the end: result, checks, open points.
- When you enter a project: if `scripts/githooks` exists and `git config core.hooksPath` is empty, run `git config core.hooksPath scripts/githooks`.

## Agents

- The main chat plans, delegates, reviews and merges to `main`. It does small things itself. Reading, searching and work packages go to sub-agents. It does not read large files or long output itself.
- As many builders as there are independent lanes without shared files. Shared things (running service, browser, merge to `main`) run one after another.
- Builders work in worktrees under `.claude/worktrees/` on their own branch. After the merge, remove the worktree and keep the branch.
- One reviewer per package, read-only, with high reasoning effort. A deleted or weakened test, or a skipped test without a reason, is a finding.
- Jobs for a second agent (for example Codex) only when the user wants that.

## Docs and code

- The code is the truth. For questions, look in the code and the tests. If the docs contradict the code, the code wins and the docs get fixed.
- Exactly two doc files per project: `AGENTS.md` (way of working and rough structure, at most 80 lines) and `STAND.md` (open or decided, but not built yet). `CLAUDE.md` contains only `@AGENTS.md`. At most one `README.md` for humans.
- No other Markdown files. Results go into commit messages, evidence into `.runtime/` (not in Git).
- A built decision leaves `STAND.md` only when a test holds it. The test name states the rule.
- Only the main chat on `main` changes `AGENTS.md` and `STAND.md`. Builders and reviewers name needed changes in their report.
- Every rule and every fact exists exactly once. Delete finished items from `STAND.md` at once; Git keeps the history.
- Comments only with `WHY:` (or `WARUM:`) for a reason the code does not show. A comment that states a condition ("must stay like this") becomes a test, a type or a check.
- Clear modules, no special paths and no workarounds.

## Errors

- Fix errors at the cause and clean up similar places too. Agents copy what is in the code.
- If the user corrects an agent or the same error happens twice: the agent proposes on its own to turn it into a check (lint rule, line in `scripts/check-ops.mjs`, type or test). The error message leads to the cause. Only if that is impossible, one sentence in `AGENTS.md`.
- With red tests, fix the cause. The cause can be a wrong expectation in the test. Never rerun until it turns green by chance.
- If the same check is red twice, stop, look for the cause in the process and tell the user in two sentences.
- Do not stop at the first finding: collect all similar errors and get approval for all of them at once.
- Keep it simple: standard tools with standard settings, nothing nobody needs today, no protection against imagined cases. Real protection (data loss, double sending, permissions) stays.
- After every restart of a service, check: new process, service answers.

## Interfaces

- Before building UI, search the existing component kit. Add missing features to the shared component, no one-off solutions.
- Check every interactive element in the browser: normal, hover, focus, active, disabled, plus light and dark. Prove it with a screenshot.

## Safety

- Pushes, deployments, changes to live systems and destructive actions only with the user's approval.
- No credentials, keys or raw data in Git or logs. `scripts/check-ops.mjs` scans for them.
- Accounts, logins and passwords are always done by the user.
