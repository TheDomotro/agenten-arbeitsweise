# Ablauf für den Agenten

> [!IMPORTANT]
> **Dein Auftrag**
>
> - **Wer du bist:** ein Coding-Agent (Claude Code, Codex oder ähnlich). Ein Mensch hat dich in seinem Projektordner gestartet und dir diesen Link gegeben.
> - **Dein Ziel:** sein Projekt nach dieser Arbeitsweise einrichten: globale Regeln, `AGENTS.md`, `STAND.md`, Prüfungen, Git-Hooks, Freigaben und CI.
> - **Nie ohne Ja:** etwas ändern vor Schritt 0, Dateien löschen, pushen, ein GitHub-Repository anlegen, GitHub-Einstellungen ändern, globale Regeldateien überschreiben. Konten, Passwörter und Codes macht immer der Mensch.
> - **Vorlagen holen:** einzelne Dateien als Rohtext unter `https://raw.githubusercontent.com/TheDomotro/agenten-arbeitsweise/main/<pfad>`. Oder alles in einen temporären Ordner außerhalb des Projekts: `git clone --depth 1 https://github.com/TheDomotro/agenten-arbeitsweise <temporärer Ordner>`. Kopiere nur einzelne Dateien ins Projekt, nie das ganze Repository.
> - **Fertig, wenn:** `check-ops`, Lint und Tests grün sind, Einrichtung und Aufräumen als zwei Commits vorliegen, der Mensch deinen Bericht aus Schritt 9 hat und der temporäre Ordner gelöscht ist.

Die Vorlagen: `vorlagen/globale-regeln.md`, `vorlagen/global-rules.en.md`, `vorlagen/AGENTS.md`, `vorlagen/STAND.md`, `vorlagen/CLAUDE.md`, `vorlagen/claude-settings.json`, `vorlagen/ci.yml`, `vorlagen/scripts/check-ops.mjs`, `vorlagen/scripts/githooks/pre-commit`, `vorlagen/scripts/githooks/post-merge`, `vorlagen/scripts/githooks/post-checkout`.

Arbeite die Schritte der Reihe nach ab. Sprich in der Sprache des Nutzers, in einfachen Sätzen. Die Regeln selbst stehen in `vorlagen/globale-regeln.md`; dieser Ablauf sagt nur, wie du sie einrichtest.

## 0. Erklären und Erlaubnis holen

Bevor du etwas änderst, erkläre dem Nutzer in 5–8 einfachen Sätzen ohne Fachbegriffe, warum diese Arbeitsweise langfristig hilft. Sinngemäß:

- Viele Kommentare und viel Doku schaden mit Agenten. Sie füllen den Kontext, widersprechen sich und dem Code und veralten. Dann rät der Agent oder nimmt einen alten Kommentar als Ausrede für eine Abkürzung.
- Darum gilt: Der Code ist die einzige Wahrheit.
- Prüfungen im Code (Lint-Regeln, Typen, Tests, Hooks, CI) wirken für Agenten wie Naturgesetze. Sie halten jeden Agenten auf, auch wenn er sich verrennt. Darin kann er sich frei bewegen.
- Jede Korrektur wird eine neue Prüfung. So wird das Projekt mit der Zeit besser, und der Mensch muss weniger nacharbeiten.
- Ehrlich dazu: Am Anfang kostet es Einrichtung und etwas Disziplin. Es ersetzt kein Nachdenken über das Produkt. Prüfungen fangen nur, was einmal als Prüfung festgehalten wurde.

Sage dann in 3–4 Sätzen, was du gleich tust: Fragen stellen, Regeln und Prüfungen anlegen, aufräumen, committen. Sage, dass du vor dem Löschen, Pushen und vor Änderungen auf GitHub fragst. Warte auf ein Ja.

## 1. Umgebung prüfen

Prüfe still und berichte nur das Ergebnis in einer Liste:

- `git --version`, `gh --version`, `node --version` (Node 18 oder neuer für `check-ops`).
- Welcher Agent du bist: Claude Code oder Codex.
- Ist der Ordner ein Git-Repository (`git rev-parse --show-toplevel`)? Gibt es ein Remote (`git remote -v`)?
- Ist `gh` angemeldet (`gh auth status`)?
- Welcher Stack: Paketdateien wie `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`.

Fehlt git oder node: Nenne dem Nutzer den Installationsweg für sein Betriebssystem und warte.

## 2. Höchstens vier Fragen stellen

Stelle alle Fragen in einer Nachricht, jede mit deiner Empfehlung. Lass Fragen weg, die Schritt 1 schon beantwortet.

1. Was ist das Ziel des Projekts, in ein bis zwei Sätzen?
2. Neues oder bestehendes Projekt? Welche Sprache und welcher Stack? (Empfehlung aus Schritt 1 nennen.)
3. GitHub: schon vorhanden? Soll das Repository privat oder öffentlich sein? (Empfehlung: privat.)
4. Wie streng? (Empfehlung: alles, also Hook, CI und Aufräumen.)

## 3. Git und GitHub einrichten

- Kein Repository: `git init -b main`, `.gitignore` des Stacks anlegen, `.runtime/` darin eintragen.
- Kein GitHub-Konto: Den Nutzer anleiten, auf github.com selbst ein Konto anzulegen. Danach führt er `gh auth login` selbst aus. Gib nie selbst Passwörter oder Codes ein.
- Kein Remote: Frage, ob du ein Repository anlegen sollst. Erst nach Ja: `gh repo create <name> --private --source . --remote origin`. Öffentlich nur, wenn der Nutzer das ausdrücklich will.
- Immer: `git config fetch.prune true`. Dann verschwinden auf GitHub gelöschte Zweige auch lokal.
- Gibt es ein GitHub-Repository: Frage, ob GitHub Zweige nach dem Merge selbst löschen soll („Automatically delete head branches“). Erst nach Ja: `gh repo edit --delete-branch-on-merge`.

## 4. Globale Regeln übernehmen

- Die Regeln stehen genau einmal in `~/.codex/AGENTS.md` (Codex liest sie direkt). `~/.claude/CLAUDE.md` enthält nur die Zeile `@~/.codex/AGENTS.md`, damit Claude Code dieselbe Datei liest. Das gilt auch, wenn der Nutzer nur einen der beiden Agenten nutzt.
- Quelle: `vorlagen/globale-regeln.md` (deutsch) oder `vorlagen/global-rules.en.md` (englisch). Platzhalter `<…>` füllen.
- Gibt es die Datei schon: lesen, zusammenführen statt überschreiben, Doppeltes nur einmal behalten. Zeige dem Nutzer die Änderung als Diff und hole ein Ja.

## 5. Projektdoku anlegen

- `AGENTS.md`, `STAND.md` und `CLAUDE.md` aus `vorlagen/` ins Projekt kopieren.
- `AGENTS.md` mit dem füllen, was du im Projekt findest: Aufbau, Startbefehl, Ordner unter „Wo liegt was“, Prüfbefehle. Nichts, was der Code schon zeigt.
- `STAND.md`: Offene Punkte aus bestehenden Notizen übernehmen. Das Ziel aus Frage 1 als ersten Plan mit Paketblöcken eintragen.
- Ist der Nutzer nicht deutschsprachig: Überschriften und Texte in seine Sprache übersetzen. Die Überschrift „Wo liegt was“ dann auch in `check-ops.mjs` anpassen.

## 6. Prüfungen einbauen

- `vorlagen/scripts/check-ops.mjs` nach `scripts/check-ops.mjs` kopieren. Passe nur `commentMarkers` und `projectRules` oben an den Stack an.
- Linter und Formatter des Stacks mit Standardeinstellungen einrichten (zum Beispiel ESLint und Prettier, ruff, clippy und rustfmt, gofmt und go vet).
- `pre-commit`, `post-merge` und `post-checkout` aus `vorlagen/scripts/githooks/` nach `scripts/githooks/` kopieren. In `pre-commit` `<LINT-BEFEHL>` ersetzen. Alle drei ausführbar machen. Dann `git config core.hooksPath scripts/githooks`. Heißt der Hauptzweig nicht `main`: in allen drei anpassen.
- Claude Code: `vorlagen/claude-settings.json` nach `.claude/settings.json` kopieren. Gibt es die Datei schon: zusammenführen. Sie lässt vor Push, Pull Request, Merge und Release fragen und startet Arbeitskopien vom lokalen Stand.
- Codex: Stelle in den Codex-Einstellungen ein, dass Push und Merge nur nach Rückfrage laufen.
- `vorlagen/ci.yml` nach `.github/workflows/ci.yml` kopieren, die Platzhalter durch Setup-, Lint- und Testbefehl ersetzen.
- Jede neue Prüfung hat eine Fehlermeldung, die sagt, was zu tun ist.

## 7. Aufräumen (eigener Commit)

- `node scripts/check-ops.mjs` ausführen. Die Funde zeigen, was aufzuräumen ist.
- Kommentare ohne Warum löschen. Kommentare mit einer Bedingung in einen Test umwandeln. Echte Gründe mit `WARUM:` versehen.
- Weitere Markdown-Dateien: Zeige erst die Liste und wohin der Inhalt kommt (`AGENTS.md`, `STAND.md` oder Commit-Nachricht). Erst nach Ja übertragen und löschen.
- Tote Dateien (nirgends genutzt) nur melden, nicht löschen.
- Ausgelassene Tests ohne Begründung: Test beheben oder Grund eintragen.

## 8. Grün machen

- Alles laufen lassen: `check-ops`, Lint, Tests.
- Rote Funde an der Ursache beheben. Keine Ausnahmen in `check-ops` erfinden, keine Tests lockern.
- Ist dieselbe Prüfung zweimal rot: anhalten und dem Nutzer die Ursache in zwei Sätzen nennen.

## 9. Abschließen

- Committen: erst die Einrichtung, dann das Aufräumen als eigener Commit. Die Commit-Nachricht nennt das Ergebnis.
- Pushen nur nach Ja.
- Bericht an den Nutzer in 3–5 Sätzen: was eingerichtet ist, wie man ab jetzt arbeitet (Ziel nennen, der Agent plant Pakete in `STAND.md`, Korrekturen werden Prüfungen). Dazu der Hinweis auf den ersten Plan in `STAND.md` und offene Punkte.
- Den temporären Ordner mit den Vorlagen löschen.
