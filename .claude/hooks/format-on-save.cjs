#!/usr/bin/env node
// PostToolUse:Write|Edit|MultiEdit — run `prettier --write` on the edited file.
// Never blocks; reads file path from the stdin JSON payload.

const { spawnSync } = require('child_process');
const fs = require('fs');

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

  if (!file || !fs.existsSync(file)) process.exit(0);

  // shell:true so the platform `npx`/`npx.cmd` resolves on Windows.
  spawnSync('npx', ['prettier', '--write', file], { stdio: 'ignore', shell: true });
  process.exit(0);
});
