#!/usr/bin/env node
// PostToolUse:Write|Edit|MultiEdit — run `eslint --fix` on the edited JS/TS file.
// Never blocks (lint fixes are best-effort); reads file path from the stdin JSON payload.

const { spawnSync } = require('child_process');

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

  if (!file || !/\.(js|jsx|ts|tsx)$/.test(file)) process.exit(0);

  // shell:true so the platform `npx`/`npx.cmd` resolves on Windows.
  spawnSync('npx', ['eslint', '--fix', file], { stdio: 'ignore', shell: true });
  process.exit(0);
});
