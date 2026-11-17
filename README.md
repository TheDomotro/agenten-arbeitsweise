# Agenten-Arbeitsweise

[English](README.en.md)

## Warum?

Ein Projekt mit KI-Agenten ist wie ein Garten. Ohne Pflege breitet sich Unkraut aus: Abkürzungen werden kopiert, und dieselben Fehler kommen wieder. Mit dieser Arbeitsweise wird jede Korrektur zu einer automatischen Prüfung. So wachsen gute Muster, und Unkraut wird jede Woche von selbst gejätet. Am Anfang kostet das etwas Einrichtung, danach wird die Arbeit einfacher statt schwerer.

## Was ist das?

Eine Anleitung für Coding-Agenten (Claude Code oder Codex). Du gibst deinem Agenten den Link. Er richtet dein Projekt nach dieser Arbeitsweise ein: Regeln, Prüfungen, Git-Hooks und CI.

## Die Kernideen

1. **Code ist die Wahrheit.** Klare Module, keine Workarounds. Agenten kopieren, was im Code steht. Ein Workaround wird so schnell zu zehn.
2. **Regeln als Prüfung, nicht als Text.** Jede Korrektur wird eine Lint-Regel, ein Typ, ein Test oder eine Zeile im Prüfskript `check-ops`. Text in einer Doku liest ein Agent vielleicht. Eine Prüfung hält ihn sicher auf.
3. **Fast keine Kommentare.** Erlaubt ist nur ein `WARUM:` für einen Grund, den der Code nicht zeigt. Kommentare veralten und dienen Agenten als Ausrede für Abkürzungen.
4. **Genau zwei Doku-Dateien.** `AGENTS.md` sagt, wie ihr arbeitet. `STAND.md` sagt, was offen ist. Alles andere steht im Code, in Tests oder in Commit-Nachrichten.
5. **Klare Pakete.** Ein Plan in `STAND.md` teilt die Arbeit in Pakete von 30–90 Minuten. Mehrere Agenten arbeiten parallel, ein Prüfer sieht jedes Paket durch.
6. **Prüfen durch Ausführen.** Tests, Browser und Screenshots zeigen, ob es geht. Ein roter Test wird an der Ursache behoben, nicht wiederholt.
7. **Einfach und sicher.** Standardwerkzeuge. Pushes, Deployments und Löschen nur mit deiner Freigabe. Keine Zugangsdaten in Git.

## So nutzt du es

Kopiere diesen Satz in deinen Agenten:

> Richte mein Projekt nach dieser Arbeitsweise ein: https://github.com/TheDomotro/agenten-arbeitsweise. Lies zuerst START.md und folge dem Ablauf.

Der Agent:

- erklärt kurz, was er tut und warum,
- stellt höchstens vier Fragen, jeweils mit Empfehlung,
- richtet Git und GitHub ein, wenn du das möchtest,
- legt Regeln, Prüfungen, Hooks und CI an,
- räumt das Projekt auf und zeigt dir vorher, was er löscht.

Das machst du selbst:

- ein GitHub-Konto anlegen, falls du noch keins hast,
- dich anmelden (`gh auth login`) und Passwörter eingeben,
- Freigaben geben: Repository anlegen, Dateien löschen, Pushen.

## Danach

Du beschreibst ein Ziel. Der Agent schreibt einen Plan mit Paketen in `STAND.md` und arbeitet ihn ab. Korrigierst du ihn, schlägt er eine neue Prüfung vor. So wird das Projekt mit jeder Korrektur stabiler.

## Quelle

Die Idee passt zum Vortrag „Potato“ von Lauren beim AI Engineer Summit: zuerst feste Prüfungen, dann Verifikation, ganz zuletzt Prosa. Die Codebasis ist ein Garten, fast alle Kommentare sind verboten, jede Korrektur wird eine Lint-Regel.

## Lizenz

MIT, siehe [LICENSE](LICENSE).
