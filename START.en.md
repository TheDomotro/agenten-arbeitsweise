# Steps for the agent

> [!IMPORTANT]
> **Your job**
>
> - **Who you are:** a coding agent (Claude Code, Codex or similar). A human started you in their project folder and gave you this link.
> - **Your goal:** set up their project in this way of working: global rules, `AGENTS.md`, `STAND.md`, checks, Git hooks, approvals and CI.
> - **Never without a yes:** changing anything before step 0, deleting files, pushing, creating a GitHub repository, changing GitHub settings, overwriting global rule files. Accounts, passwords and codes are always done by the human.
> - **Getting the templates:** single files as raw text at `https://raw.githubusercontent.com/TheDomotro/agenten-arbeitsweise/main/<path>`. Or everything into a temporary folder outside the project: `git clone --depth 1 https://github.com/TheDomotro/agenten-arbeitsweise <temporary folder>`. Copy single files into the project, never the whole repository.
> - **Done when:** `check-ops`, lint and tests are green, setup and cleanup exist as two commits, the human has your report from step 9, and the temporary folder is deleted.

The templates: `vorlagen/globale-regeln.md`, `vorlagen/global-rules.en.md`, `vorlagen/AGENTS.md`, `vorlagen/STAND.md`, `vorlagen/CLAUDE.md`, `vorlagen/claude-settings.json`, `vorlagen/ci.yml`, `vorlagen/scripts/check-ops.mjs`, `vorlagen/scripts/githooks/pre-commit`, `vorlagen/scripts/githooks/post-merge`, `vorlagen/scripts/githooks/post-checkout`.

Do the steps in order. Speak the user's language, in simple sentences. The rules themselves are in `vorlagen/global-rules.en.md`; these steps only say how to set them up. The folder `vorlagen/` means "templates"; its file contents are German, so translate them for the user.

## 0. Explain and ask for permission

Before you change anything, explain to the user in 5–8 simple sentences without technical terms why this way of working helps in the long run. In essence:

- Many comments and a lot of docs hurt when working with agents. They fill the context, contradict each other and the code, and go stale. Then the agent guesses or takes an old comment as an excuse for a shortcut.
- That is why the code is the only truth.
- Checks in the code (lint rules, types, tests, hooks, CI) work like laws of nature for agents. They stop every agent, even one that has lost its way. Inside them it can move freely.
- Every correction becomes a new check. So the project gets better over time, and the human has to rework less.
- Honestly: at the start it takes setup and some discipline. It does not replace thinking about the product. Checks only catch what was once written down as a check.

Then say in 3–4 sentences what you will do: ask questions, add rules and checks, clean up, commit. Say that you will ask before deleting, pushing and changing anything on GitHub. Wait for a yes.

## 1. Check the environment

Check quietly and report only the result as a list:

- `git --version`, `gh --version`, `node --version` (Node 18 or newer for `check-ops`).
- Which agent you are: Claude Code or Codex.
- Is the folder a Git repository (`git rev-parse --show-toplevel`)? Is there a remote (`git remote -v`)?
- Is `gh` logged in (`gh auth status`)?
- Which stack: package files such as `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`.

If git or node is missing: tell the user how to install it on their system and wait.

## 2. Ask at most four questions

Ask all questions in one message, each with your recommendation. Skip questions that step 1 already answers.

1. What is the goal of the project, in one or two sentences?
2. New or existing project? Which language and stack? (Give your recommendation from step 1.)
3. GitHub: already there? Should the repository be private or public? (Recommendation: private.)
4. How strict? (Recommendation: everything, meaning hook, CI and cleanup.)

## 3. Set up Git and GitHub

- No repository: `git init -b main`, add the stack's `.gitignore`, add `.runtime/` to it.
- No GitHub account: guide the user to create an account on github.com themselves. Then they run `gh auth login` themselves. Never type passwords or codes yourself.
- No remote: ask whether you should create a repository. Only after a yes: `gh repo create <name> --private --source . --remote origin`. Public only if the user says so explicitly.
- Always: `git config fetch.prune true`. Then branches deleted on GitHub disappear locally too.
- If there is a GitHub repository: ask whether GitHub should delete branches after the merge ("Automatically delete head branches"). Only after a yes: `gh repo edit --delete-branch-on-merge`.

## 4. Add the global rules

- The rules live exactly once in `~/.codex/AGENTS.md` (Codex reads it directly). `~/.claude/CLAUDE.md` contains only the line `@~/.codex/AGENTS.md`, so Claude Code reads the same file. Do this even if the user only uses one of the two agents.
- Source: `vorlagen/global-rules.en.md` (English) or `vorlagen/globale-regeln.md` (German). Fill the `<…>` placeholders.
- If the file exists: read it, merge instead of overwriting, keep duplicates only once. Show the user the change as a diff and get a yes.

## 5. Create the project docs

- Copy `AGENTS.md`, `STAND.md` and `CLAUDE.md` from `vorlagen/` into the project.
- Fill `AGENTS.md` with what you find in the project: structure, start command, folders under "Wo liegt was", check commands. Nothing the code already shows.
- `STAND.md`: move open points from existing notes. Enter the goal from question 1 as a first plan with package blocks.
- Translate headings and text into the user's language. If you rename "Wo liegt was", change it in `check-ops.mjs` too.

## 6. Add the checks

- Copy `vorlagen/scripts/check-ops.mjs` to `scripts/check-ops.mjs`. Adapt only `commentMarkers` and `projectRules` at the top to the stack. Translate its messages if the user does not read German.
- Set up the stack's linter and formatter with standard settings (for example ESLint and Prettier, ruff, clippy and rustfmt, gofmt and go vet).
- Copy `pre-commit`, `post-merge` and `post-checkout` from `vorlagen/scripts/githooks/` to `scripts/githooks/`. In `pre-commit`, replace `<LINT-BEFEHL>` with the lint command. Make all three executable. Then `git config core.hooksPath scripts/githooks`. If the main branch is not called `main`: adapt all three.
- Claude Code: copy `vorlagen/claude-settings.json` to `.claude/settings.json`. If the file exists: merge. It makes Claude Code ask before push, pull request, merge and release, and starts worktrees from the local state.
- Codex: set up in the Codex settings that push and merge only run after asking.
- Copy `vorlagen/ci.yml` to `.github/workflows/ci.yml`, replace the placeholders with setup, lint and test commands.
- Every new check has an error message that says what to do.

## 7. Clean up (separate commit)

- Run `node scripts/check-ops.mjs`. The findings show what to clean up.
- Delete comments without a reason. Turn comments that state a condition into a test. Mark real reasons with `WHY:`.
- Other Markdown files: first show the list and where the content goes (`AGENTS.md`, `STAND.md` or commit message). Move and delete only after a yes.
- Dead files (used nowhere): report only, do not delete.
- Skipped tests without a reason: fix the test or add the reason.

## 8. Make it green

- Run everything: `check-ops`, lint, tests.
- Fix red findings at the cause. Do not invent exceptions in `check-ops`, do not weaken tests.
- If the same check is red twice: stop and tell the user the cause in two sentences.

## 9. Finish

- Commit: first the setup, then the cleanup as a separate commit. The commit message states the result.
- Push only after a yes.
- Report to the user in 3–5 sentences: what is set up and how to work from now on (state a goal, the agent plans packages in `STAND.md`, corrections become checks). Point to the first plan in `STAND.md` and to open points.
- Delete the temporary folder with the templates.
