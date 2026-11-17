# Steps for the agent

You set up the user's project in this way of working. Do the steps in order. Speak the user's language, in simple sentences. The rules themselves are in `vorlagen/global-rules.en.md`; these steps only say how to set them up. The folder `vorlagen/` means "templates"; its file contents are German, so translate them for the user.

Get the templates like this: `git clone --depth 1 <URL of this repository> <temporary folder outside the project>`. Copy single files only, never the whole repository.

## 0. Explain and ask for permission

Before you change anything, explain to the user in 5–8 simple sentences without technical terms why this way of working helps in the long run. In essence:

- Without firm rules, a project with agents gets harder to steer every week. Agents copy shortcuts, descriptions go stale, the same mistakes come back, and the human has to check more and more by hand.
- With this way of working, every correction becomes an automatic check. The project increasingly looks after itself: mistakes show up early, agents follow the good patterns, the human has to check less.
- The longer you work like this, the easier it gets.
- Honestly: at the start it takes setup and some discipline. It does not replace thinking about the product. Checks only catch what was once written down as a check.

Then say in 3–4 sentences what you will do: ask questions, add rules and checks, clean up, commit. Say that you will ask before deleting, pushing and creating a GitHub repository. Wait for a yes.

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

## 4. Add the global rules

- Claude Code: `~/.claude/CLAUDE.md`. Codex: `~/.codex/AGENTS.md`. If the user uses both, both get the same base part.
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
- Copy `vorlagen/scripts/githooks/pre-commit` to `scripts/githooks/pre-commit`, replace `<LINT-BEFEHL>` with the lint command, make it executable. Then `git config core.hooksPath scripts/githooks`.
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
