# Grundregeln für alle Projekte

Diese Regeln sind eine Richtschnur für den Alltag. Fest geprüft wird nur, was echten Schaden verhindert. Das steht in `scripts/check-ops.mjs`, in den Git-Hooks und in den Freigaben des Agenten.

## Sprache

- Antworte in <Sprache des Nutzers>, kurz und verständlich.
- Kurze, aktive Sätze. Für dieselbe Sache immer denselben Begriff. Fachbegriffe nur wenn nötig, dann kurz erklärt. Schaltflächen so nennen, wie sie in der Oberfläche stehen.

## Arbeitsweise

- Setze Aufgaben selbstständig vollständig um und entscheide technische Details selbst.
- Frage bei offenen Produktentscheidungen, fehlenden Freigaben oder Informationen, die du nicht selbst ermitteln kannst. Gib dabei eine Empfehlung.
- Committe abgeschlossene Änderungen mit einer Commit-Nachricht, die das Ergebnis nennt.
- Berichte am Ende kurz: Ergebnis, Prüfungen, offene Punkte.
- Beim Einstieg in ein Projekt: Gibt es `scripts/githooks` und ist `git config core.hooksPath` leer, `git config core.hooksPath scripts/githooks` ausführen.

## Agenten

Gilt, wenn dein Werkzeug Sub-Agenten starten kann. Sonst arbeitest du alles selbst nacheinander ab. Pakete sind ein Hilfsmittel für große Vorhaben, keine Pflicht.

- Der Hauptchat plant, verteilt, prüft und merged auf `main`. Kleines macht er selbst. Lesen, Suchen und Pakete gibt er an Sub-Agenten. Große Dateien und lange Ausgaben lässt er besser von Sub-Agenten lesen, damit sein Kontext klein bleibt.
- So viele Builder wie unabhängige Bahnen ohne gemeinsame Dateien. Gemeinsam genutzte Dinge (laufender Dienst, Browser, Merge auf `main`) laufen nacheinander.
- Builder arbeiten in eigenen Arbeitskopien (Worktrees) auf eigenem Zweig. Nach dem Merge entfernen die Git-Hooks gemergte Arbeitskopien und Zweige automatisch; der Verlauf steht in Git.
- Je Paket ein Prüfer, nur lesend, am besten mit hoher Denktiefe. Ein gelöschter oder gelockerter Test oder ein ausgelassener Test ohne Begründung ist ein Fund.
- Builder schreiben nur in ihrer Arbeitskopie und liefern ihr Ergebnis als Commit auf ihrem Zweig: kein Merge, kein Push. Die Commit-Nachricht nennt, was geändert ist, welche Prüfungen liefen und was offen ist. Nur der Hauptchat merged auf `main`.
- `AGENTS.md` und `STAND.md` ändert nur der Hauptchat auf `main`; der Git-Hook lehnt Änderungen auf anderen Zweigen ab. Builder und Prüfer nennen nötige Änderungen in ihrem Bericht. So entstehen keine Konflikte zwischen parallelen Paketen.

## Doku und Code

- Der Code ist die Wahrheit. Bei Fragen im Code und in den Tests nachsehen. Widerspricht die Doku dem Code, gilt der Code, und die Doku wird korrigiert.
- Je Projekt zwei Doku-Dateien: `AGENTS.md` (Arbeitsweise und grober Aufbau) und `STAND.md` (offen oder entschieden, aber noch nicht gebaut). Dazu bei Bedarf eine `README.md` für Menschen. Bei Claude Code kommt `CLAUDE.md` mit nur `@AGENTS.md` dazu, weil Claude Code von sich aus `CLAUDE.md` liest.
- `AGENTS.md` kurz halten, Richtwert unter etwa 200 Zeilen. Was der Code schon zeigt, gehört nicht hinein.
- Statt weiterer Markdown-Dateien: Ergebnisse in Commit-Nachrichten, Belege unter `.runtime/` (nicht in Git).
- Eine gebaute Entscheidung kommt aus `STAND.md` heraus, sobald ein Test sie festhält. Der Testname nennt die Regel.
- Jede Regel und jede Tatsache steht genau einmal. Erledigtes zeitnah aus `STAND.md` löschen; der Verlauf steht in Git.
- Kommentare nur mit `WARUM:` für einen Grund, den der Code nicht zeigt. Ein Kommentar, der eine Bedingung beschreibt („muss so bleiben“), wird besser ein Test, ein Typ oder eine Prüfung.
- Klare Module statt Sonderwege und Workarounds.

## Fehler

- Fehler an der Ursache beheben und gleichartige Stellen mit aufräumen. Agenten kopieren, was im Code steht.
- Korrigiert der Nutzer den Agenten oder tritt derselbe Fehler zweimal auf: Der Agent schlägt von sich aus vor, ihn als Prüfung festzumachen (Lint-Regel, Zeile in `scripts/check-ops.mjs`, Typ oder Test). Die Fehlermeldung sagt freundlich, was stattdessen zu tun ist. Erst wenn das nicht geht, ein Satz in `AGENTS.md`.
- Bei roten Tests die Ursache beheben. Die Ursache kann auch eine falsche Erwartung im Test sein. Nicht wiederholen, bis es zufällig grün ist.
- Ist dieselbe Prüfung zweimal rot: anhalten, die Ursache im Ablauf suchen und dem Nutzer in zwei Sätzen berichten.
- Nicht beim ersten Fund aufhören: gleichartige Fehler sammeln und die Freigabe für alles auf einmal holen.
- Einfach halten: Standardwerkzeuge mit Standardeinstellungen, nichts bauen, was heute niemand braucht, kein Schutz gegen erdachte Fälle. Echter Schutz (Datenverlust, Doppelversand, Rechte) bleibt.
- Nach dem Neustart eines Dienstes kurz prüfen: neuer Prozess, Dienst antwortet.

## Oberflächen

- Vor jedem UI-Bau im vorhandenen Baukasten suchen. Fehlendes im gemeinsamen Baustein ergänzen statt Einzellösungen bauen.
- Bedienbare Elemente im Browser prüfen: Normal, Hover, Fokus, Aktiv, Deaktiviert, dazu hell und dunkel. Ein Screenshot ist der einfachste Beleg.

## Sicherheit

- Pushen, Mergen, Deployments, Änderungen an Live-Systemen und destruktive Aktionen nur mit Freigabe des Nutzers.
- Keine Zugangsdaten, Schlüssel oder Rohdaten in Git oder Logs. `scripts/check-ops.mjs` sucht danach.
- Konten, Anmeldungen und Passwörter macht der Nutzer selbst.
