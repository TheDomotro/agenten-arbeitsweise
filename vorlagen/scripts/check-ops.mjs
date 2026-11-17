#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const projectRules = [
  {
    files: /./,
    pattern: /^(<{7}|>{7}) |^={7}$/,
    message: 'Merge-Konfliktmarker. Konflikt auflösen, dann committen.',
  },
];

const commentMarkers = [
  { files: /\.(m?js|cjs|jsx|ts|tsx|rs|go|java|kt|swift|c|h|cpp|hpp|cs|dart|scala|php)$/, markers: ['//', '/*'] },
  { files: /\.(py|sh|bash|zsh|rb|pl|r|ya?ml|toml|tf|ps1|dockerfile)$|(^|\/)(Dockerfile|Makefile|pre-commit|post-merge|post-checkout)$/i, markers: ['#'] },
  { files: /\.(sql|lua|hs|elm)$/, markers: ['--'] },
];
const whyMarker = /^(WARUM|WHY):/;
const allowedCommentContent = /^(!|eslint-|@ts-|prettier-ignore|biome-ignore|noqa|type:\s*ignore|pylint:|mypy:|ruff:|shellcheck|rubocop:|nolint|go:|SPDX-License-Identifier|Copyright|-\*-)/i;

const secretPatterns = /-----BEGIN [A-Z ]*PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{36}\b|\bgithub_pat_[A-Za-z0-9_]{40,}|\bAKIA[0-9A-Z]{16}\b|\bAIza[0-9A-Za-z_-]{35}\b|\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{32,}|\bxox[abprs]-[A-Za-z0-9-]{10,}|\bglpat-[A-Za-z0-9_-]{20,}/;
const secretFiles = /(^|\/)\.env(\.(?!example$)[^/]+)?$|\.(pem|key|p12|pfx)$|(^|\/)id_(rsa|ed25519|ecdsa)$/;

const testSkip = /#\[ignore\]|\b(?:it|test|describe)\.skip\(|\bx(?:it|describe|test)\(|@pytest\.mark\.skip\b(?!\(\s*reason=)|\bt\.Skip\(\)/;

const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
// WARUM: Das Anleitungs-Repository selbst hat README/START-Dateien und Vorlagen statt eigener Projektdoku.
const templateRepo = existsSync(resolve(root, 'START.md')) && existsSync(resolve(root, 'vorlagen/scripts/check-ops.mjs'));
const allowedMarkdown = templateRepo
  ? /^((README|START)(\.en)?\.md|vorlagen\/[^/]+\.md)$/
  : /^(AGENTS|STAND|CLAUDE|README)\.md$/;
const docDir = templateRepo ? 'vorlagen' : '.';
const binary = /\.(png|jpe?g|gif|webp|ico|pdf|zip|gz|woff2?|ttf|otf|mp[34]|mov|wasm)$/i;
const self = /(^|\/)check-ops\.mjs$/;

const tracked = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
const findings = [];
const add = (where, message) => findings.push(`${where}  ${message}`);

for (const file of tracked) {
  if (/\.md$/i.test(file) && !allowedMarkdown.test(file)) add(file, 'Zusätzliche Markdown-Datei. Die Doku lebt in AGENTS.md und STAND.md: Inhalt dorthin oder in eine Commit-Nachricht übertragen, Belege nach .runtime/, dann die Datei löschen.');
  if (secretFiles.test(file)) add(file, 'Schlüssel- oder .env-Datei in Git. Mit `git rm --cached` entfernen und in .gitignore eintragen. Ist der Schlüssel echt, ihn beim Anbieter ersetzen.');
}

for (const file of tracked) {
  if (binary.test(file) || self.test(file) || !existsSync(resolve(root, file))) continue;
  const text = readFileSync(resolve(root, file), 'utf8');
  if (text.includes('\0')) continue;
  const lines = text.split('\n');
  const markers = commentMarkers.find(entry => entry.files.test(file))?.markers ?? [];
  lines.forEach((line, index) => {
    const where = `${file}:${index + 1}`;
    if (secretPatterns.test(line)) add(where, 'Zugangsdaten im Klartext. In Umgebungsvariablen oder einen Ordner außerhalb von Git verschieben. Ist der Schlüssel echt, ihn beim Anbieter ersetzen.');
    for (const rule of projectRules) if (rule.files.test(file) && rule.pattern.test(line)) add(where, rule.message);
    if (testSkip.test(line) && !/ignore\s*=\s*"|reason\s*=/.test(line) && !whyMarker.test(commentText(lines[index - 1] ?? '', markers) ?? '')) {
      add(where, 'Test ausgelassen ohne Begründung. Den Test beheben. Muss er wirklich warten: Grund angeben (#[ignore = "…"], reason="…" oder WARUM:-Kommentar darüber).');
    }
    const comment = commentText(line, markers);
    if (comment === undefined || (index === 0 && line.startsWith('#!'))) return;
    if (!whyMarker.test(comment) && !allowedCommentContent.test(comment) && comment !== '') {
      add(where, 'Kommentar ohne WARUM:. Zeigt der Code das schon, einfach löschen. Gibt es einen Grund, den der Code nicht zeigt, den Kommentar mit „WARUM:“ beginnen. Beschreibt er eine Bedingung („muss so bleiben“), daraus besser einen Test machen.');
    }
  });
}

function commentText(line, markers) {
  const trimmed = line.trim();
  const marker = markers.find(entry => trimmed.startsWith(entry));
  if (!marker) return undefined;
  return trimmed.slice(marker.length).replace(/^[*!/#-]*\s*/, '').replace(/\*\/$/, '').trim();
}

const agentsPath = resolve(root, docDir, 'AGENTS.md');
if (!existsSync(agentsPath)) add(`${docDir}/AGENTS.md`, 'AGENTS.md fehlt. Aus der Vorlage anlegen.');
else {
  const agents = readFileSync(agentsPath, 'utf8');
  const map = agents.split(/^## (?:Wo liegt was|Where things are)$/m)[1]?.split(/^## /m)[0] ?? '';
  for (const [, path] of map.matchAll(/`([^`*<\s]+\/[^`*<\s]*)`/g)) {
    if (!existsSync(resolve(dirname(agentsPath), path))) add('AGENTS.md', `Pfad \`${path}\` aus „Wo liegt was“ existiert nicht. Karte an den Code anpassen.`);
  }
}
const claudePath = resolve(root, docDir, 'CLAUDE.md');
if (existsSync(claudePath) && readFileSync(claudePath, 'utf8').trim() !== '@AGENTS.md') add('CLAUDE.md', 'CLAUDE.md enthält nur `@AGENTS.md`. Regeln stehen in AGENTS.md.');
if (!existsSync(resolve(root, docDir, 'STAND.md'))) add(`${docDir}/STAND.md`, 'STAND.md fehlt. Aus der Vorlage anlegen.');

if (findings.length) {
  console.error(findings.join('\n'));
  console.error(`\n${findings.length} Funde. Jede Zeile nennt Datei, Stelle und was zu tun ist.`);
  process.exit(1);
}
console.log('check-ops: ok');
