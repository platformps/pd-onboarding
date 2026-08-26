#!/usr/bin/env node
// PreToolUse:Bash — block known-destructive commands; allow everything else.
// Claude Code passes the hook payload as JSON on stdin: { tool_input: { command } }.
// Exit 2 = block the tool call and feed stderr back to Claude. Exit 0 = allow.

const chunks = [];
process.stdin.on('data', (c) => chunks.push(c));
process.stdin.on('end', () => {
  let payload = {};
  try {
    payload = JSON.parse(Buffer.concat(chunks).toString() || '{}');
  } catch {
    process.exit(0); // unparseable payload — fail open, don't block
  }

  const command = (payload.tool_input && payload.tool_input.command) || '';

  const DENY = [
    /rm\s+-rf\s+\//i,
    /rm\s+-rf\s+~/i,
    /rm\s+-rf\s+\.(\s|$)/i,
    /git\s+push\b[^\n]*--force/i,
    /git\s+reset\s+--hard/i,
    /git\s+clean\s+-fd/i,
    /drop\s+table/i,
    /drop\s+database/i,
    /\btruncate\b/i,
    />\s*\/dev\/sd/i,
    /\bmkfs\./i,
    /\bdd\s+if=/i,
    /chmod\s+-R\s+777/i,
  ];

  for (const re of DENY) {
    if (re.test(command)) {
      console.error(
        `BLOCKED: destructive command pattern detected (${re}). This requires explicit user approval.`,
      );
      process.exit(2);
    }
  }

  process.exit(0);
});
