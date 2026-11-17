# Grundregeln für alle Projekte

## Sprache

- Antworte in <Sprache des Nutzers>, kurz und verständlich.
- Kurze, aktive Sätze. Für dieselbe Sache immer denselben Begriff. Fachbegriffe nur wenn nötig, dann kurz erklärt. Schaltflächen so nennen, wie sie in der Oberfläche stehen.

## Arbeitsweise

- Setze Aufgaben selbstständig vollständig um und entscheide technische Details selbst.
- Frage nur bei offenen Produktentscheidungen, fehlenden Freigaben oder Informationen, die du nicht selbst ermitteln kannst. Gib dabei eine Empfehlung.
- Committe abgeschlossene Änderungen mit einer Commit-Nachricht, die das Ergebnis nennt.
- Berichte am Ende kurz: Ergebnis, Prüfungen, offene Punkte.
- Beim Einstieg in ein Projekt: Gibt es `scripts/githooks` und ist `git config core.hooksPath` leer, `git config core.hooksPath scripts/githooks` ausführen.

## Agenten

- Der Hauptchat plant, verteilt, prüft und merged auf `main`. Kleines macht er selbst. Lesen, Suchen und Pakete gehen an Sub-Agenten. Er liest große Dateien und lange Ausgaben nicht selbst.
- So viele Builder wie unabhängige Bahnen ohne gemeinsame Dateien. Gemeinsam genutzte Dinge (laufender Dienst, Browser, Merge auf `main`) laufen nacheinander.
- Builder arbeiten in Arbeitskopien (Worktrees) unter `.claude/worktrees/` auf eigenem Zweig. Nach dem Merge entfernen die Git-Hooks Arbeitskopie und Zweig automatisch; der Verlauf steht in Git.
- Je Paket ein Prüfer, nur lesend, mit hoher Denktiefe. Ein gelöschter oder gelockerter Test oder ein ausgelassener Test ohne Begründung ist ein Fund.
- Aufträge an einen zweiten Agenten (zum Beispiel Codex) nur, wenn der Nutzer das möchte.

## Doku und Code

- Der Code ist die Wahrheit. Bei Fragen im Code und in den Tests nachsehen. Widerspricht die Doku dem Code, gilt der Code, und die Doku wird korrigiert.
- Je Projekt genau zwei Doku-Dateien: `AGENTS.md` (Arbeitsweise und grober Aufbau, höchstens 80 Zeilen) und `STAND.md` (offen oder entschieden, aber noch nicht gebaut). `CLAUDE.md` enthält nur `@AGENTS.md`. Dazu höchstens eine `README.md` für Menschen.
- Keine weiteren Markdown-Dateien. Ergebnisse stehen in Commit-Nachrichten, Belege unter `.runtime/` (nicht in Git).
- Eine gebaute Entscheidung kommt erst aus `STAND.md` heraus, wenn ein Test sie festhält. Der Testname nennt die Regel.
- `AGENTS.md` und `STAND.md` ändert nur der Hauptchat auf `main`. Builder und Prüfer nennen nötige Änderungen in ihrem Bericht.
- Jede Regel und jede Tatsache steht genau einmal. Erledigtes sofort aus `STAND.md` löschen; der Verlauf steht in Git.
- Kommentare nur mit `WARUM:` für einen Grund, den der Code nicht zeigt. Ein Kommentar, der eine Bedingung beschreibt („muss so bleiben“), wird ein Test, ein Typ oder eine Prüfung.
- Klare Module, keine Sonderwege und Workarounds.

## Fehler

- Fehler an der Ursache beheben und gleichartige Stellen mit aufräumen. Agenten kopieren, was im Code steht.
- Korrigiert der Nutzer einen Agenten oder tritt derselbe Fehler zweimal auf: Der Agent schlägt von sich aus vor, ihn als Prüfung festzumachen (Lint-Regel, Zeile in `scripts/check-ops.mjs`, Typ oder Test). Die Fehlermeldung führt zur Ursache. Erst wenn das nicht geht, ein Satz in `AGENTS.md`.
- Bei roten Tests die Ursache beheben. Die Ursache kann auch eine falsche Erwartung im Test sein. Nie wiederholen, bis es zufällig grün ist.
- Ist dieselbe Prüfung zweimal rot, anhalten, die Ursache im Ablauf suchen und dem Nutzer in zwei Sätzen berichten.
- Nicht beim ersten Fund aufhören: alle gleichartigen Fehler sammeln und die Freigabe für alles auf einmal holen.
- Einfach halten: Standardwerkzeuge mit Standardeinstellungen, nichts bauen, was heute niemand braucht, kein Schutz gegen erdachte Fälle. Echter Schutz (Datenverlust, Doppelversand, Rechte) bleibt.
- Nach jedem Neustart eines Dienstes prüfen: neuer Prozess, Dienst antwortet.

## Oberflächen

- Vor jedem UI-Bau im vorhandenen Baukasten suchen. Fehlendes im gemeinsamen Baustein ergänzen, keine Einzellösungen.
- Jedes bedienbare Element im Browser prüfen: Normal, Hover, Fokus, Aktiv, Deaktiviert, dazu hell und dunkel. Mit Screenshot belegen.

## Sicherheit

- Pushes, Deployments, Änderungen an Live-Systemen und destruktive Aktionen nur mit Freigabe des Nutzers.
- Keine Zugangsdaten, Schlüssel oder Rohdaten in Git oder Logs. `scripts/check-ops.mjs` sucht danach.
- Konten, Anmeldungen und Passwörter macht der Nutzer selbst.
