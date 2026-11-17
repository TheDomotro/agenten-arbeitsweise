# <Projektname>

<Ein Satz: was das Projekt ist und für wen.>

Diese Datei sagt nur, wie wir arbeiten und wie das System grob aufgebaut ist. Regeln für alle Projekte stehen in den globalen Regeln. Produktregeln stehen im Code und in Tests. Offenes und Entschiedenes, das noch nicht gebaut ist, steht in STAND.md.

## Aufbau und Start

- <Teile des Systems und wie sie zusammenhängen, in 2–4 Punkten.>
- Starten: `<START-BEFEHL>`. Erreichbar unter <Adresse, zum Beispiel http://127.0.0.1:3000>.

## Wo liegt was

Nur Ordner und Namensmuster, keine Einzeldateien. `node scripts/check-ops.mjs` prüft, dass jeder Pfad hier existiert.

- `scripts/`: Prüfungen und Hilfsskripte, Einstieg `scripts/check-ops.mjs`.
- `<ordner>/`: <was dort liegt>.

## Agenten

- Hauptchat: plant, schneidet Pakete aus STAND.md, verteilt, prüft und merged auf `main`.
- Builder: je Paket ein Zweig und eine eigene Arbeitskopie (Worktree). Bekommt nur den gemeinsamen Teil und seinen Paketblock aus STAND.md.
- Prüfer: je Paket einer, nur lesend.

## Prüfen

- Alles: `node scripts/check-ops.mjs`, `<LINT-BEFEHL>`, `<TEST-BEFEHL>`.
- Oberflächen: `<BROWSERPRÜFUNG, zum Beispiel npx playwright test>`.
- <Projektbesonderheit, die der Code nicht zeigt, zum Beispiel: welche Dienste lokal laufen müssen.>
