#!/usr/bin/env node
// PostToolUse:Write|Edit|MultiEdit — when a dependency manifest is edited, run a
// security audit and block (exit 2) if high/critical vulnerabilities are present.
// This is a pnpm monorepo, so it uses `pnpm audit`. Reads the file path from stdin JSON.

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const NPM_MANIFESTS = ['package.json', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock'];

const chunks = [];
process.stdin.on('data', (c) => chunks.push(c));
process.stdin.on('end', () => {
  let payload = {};
  try {
    payload = JSON.parse(Buffer.concat(chunks).toString() || '{}');
  } catch {
    process.exit(0);
  }

  const file =
    (payload.tool_input && payload.tool_input.file_path) ||
    (payload.tool_response && payload.tool_response.filePath);

  if (!file) process.exit(0);
  if (!NPM_MANIFESTS.includes(path.basename(file))) process.exit(0); // only npm-ecosystem manifests

  // Walk up to the nearest directory containing a package.json.
  let dir = path.dirname(path.resolve(file));
  while (dir !== path.dirname(dir) && !fs.existsSync(path.join(dir, 'package.json'))) {
    dir = path.dirname(dir);
  }

  const res = spawnSync('pnpm', ['audit', '--json'], {
    cwd: dir,
    encoding: 'utf8',
    shell: true,
  });

  let high = 0;
  let critical = 0;
  try {
    const report = JSON.parse(res.stdout || '{}');
    const v = (report.metadata && report.metadata.vulnerabilities) || {};
    high = v.high || 0;
    critical = v.critical || 0;
  } catch {
    process.exit(0); // couldn't parse audit output (e.g. audit unavailable) — fail open
  }

  if (high + critical > 0) {
    console.error(
      `Dependency vulnerabilities after editing ${file}: ${critical} critical, ${high} high.`,
    );
    console.error(`Run \`pnpm audit\` in ${dir} and upgrade the affected packages before committing.`);
    process.exit(2);
  }

  process.exit(0);
});
