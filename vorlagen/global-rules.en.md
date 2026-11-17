# Base rules for all projects

These rules are guidance for everyday work. Only what prevents real damage is enforced. That lives in `scripts/check-ops.mjs`, in the Git hooks and in the agent's approval settings.

## Language

- Answer in <the user's language>, short and clear.
- Short, active sentences. Always the same word for the same thing. Technical terms only when needed, then explain them briefly. Name buttons exactly as the interface shows them.

## Way of working

- Finish tasks fully on your own and decide technical details yourself.
- Ask about open product decisions, missing approvals or information you cannot find out yourself. Give a recommendation.
- Commit finished changes with a commit message that states the result.
- Report briefly at the end: result, checks, open points.
- When you enter a project: if `scripts/githooks` exists and `git config core.hooksPath` is empty, run `git config core.hooksPath scripts/githooks`.

## Agents

Applies if your tool can start sub-agents. Otherwise you do everything yourself, one step after another. Packages are a tool for large projects, not a must.

- The main chat plans, delegates, reviews and merges to `main`. It does small things itself. Reading, searching and work packages go to sub-agents. Large files and long output are better read by sub-agents, so the main chat's context stays small.
- As many builders as there are independent lanes without shared files. Shared things (running service, browser, merge to `main`) run one after another.
- Builders work in their own worktrees on their own branch. After the merge, the Git hooks remove merged worktrees and branches automatically; Git keeps the history.
- One reviewer per package, read-only, ideally with high reasoning effort. A deleted or weakened test, or a skipped test without a reason, is a finding.
- Builders write only in their worktree and deliver their result as a commit on their branch: no merge, no push. The commit message says what changed, which checks ran and what is open. Only the main chat merges to `main`.
- `AGENTS.md` and `STAND.md` are changed only by the main chat on `main`; the Git hook rejects changes on other branches. Builders and reviewers name needed changes in their report. This avoids conflicts between parallel packages.

## Docs and code

- The code is the truth. For questions, look in the code and the tests. If the docs contradict the code, the code wins and the docs get fixed.
- Two doc files per project: `AGENTS.md` (way of working and rough structure) and `STAND.md` (open or decided, but not built yet). If needed, a `README.md` for humans. With Claude Code, add `CLAUDE.md` containing only `@AGENTS.md`, because Claude Code reads `CLAUDE.md` on its own.
- Keep `AGENTS.md` short, as a guide under about 200 lines. What the code already shows does not belong in it.
- Instead of more Markdown files: results go into commit messages, evidence into `.runtime/` (not in Git).
- A built decision leaves `STAND.md` as soon as a test holds it. The test name states the rule.
- Every rule and every fact exists exactly once. Delete finished items from `STAND.md` soon; Git keeps the history.
- Comments only with `WHY:` (or `WARUM:`) for a reason the code does not show. A comment that states a condition ("must stay like this") is better turned into a test, a type or a check.
- Clear modules instead of special paths and workarounds.

## Errors

- Fix errors at the cause and clean up similar places too. Agents copy what is in the code.
- If the user corrects the agent or the same error happens twice: the agent proposes on its own to turn it into a check (lint rule, line in `scripts/check-ops.mjs`, type or test). The error message says kindly what to do instead. Only if that is not possible, one sentence in `AGENTS.md`.
- With red tests, fix the cause. The cause can also be a wrong expectation in the test. Do not rerun until it turns green by chance.
- If the same check is red twice: stop, look for the cause in the process and tell the user in two sentences.
- Do not stop at the first finding: collect similar errors and get approval for all of them at once.
- Keep it simple: standard tools with standard settings, nothing nobody needs today, no protection against imagined cases. Real protection (data loss, running something twice, permissions, security) stays.
- After restarting a service, check briefly: new process, service answers.

## User interfaces (only if the project has one)

- Before building UI, search the existing component kit. Add missing features to the shared component instead of building one-off solutions.
- Check interactive elements in the browser: normal, hover, focus, active, disabled, plus light and dark. A screenshot is the easiest proof.

## Safety

- Pushing, merging, deployments, changes to live systems and destructive actions only with the user's approval.
- No credentials, keys or raw data in Git or logs. `scripts/check-ops.mjs` scans for them.
- Accounts, logins and passwords are done by the user.
