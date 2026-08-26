#!/usr/bin/env node
// PostToolUse:Write|Edit|MultiEdit — type-check the edited .ts/.tsx file against the
// nearest tsconfig.json. Blocks (exit 2) and reports diagnostics on type errors.
//
// NOTE: this builds a full TS program for the owning project on every edit, which can be
// slow in a large monorepo. If it becomes a drag, remove this hook from settings.json and
// rely on `pnpm type-check` instead.

const path = require('path')
const fs = require('fs')

const chunks = []
process.stdin.on('data', (c) => chunks.push(c))
process.stdin.on('end', () => {
  let payload = {}
  try {
    payload = JSON.parse(Buffer.concat(chunks).toString() || '{}')
  } catch {
    process.exit(0)
  }

  const file =
    (payload.tool_response && payload.tool_response.filePath) ||
    (payload.tool_input && payload.tool_input.file_path)

  if (!file || !/\.(ts|tsx)$/.test(file)) process.exit(0)

  // Find the nearest tsconfig.json walking up from the edited file.
  let dir = path.dirname(path.resolve(file))
  let configPath = null
  while (dir !== path.dirname(dir)) {
    const candidate = path.join(dir, 'tsconfig.json')
    if (fs.existsSync(candidate)) {
      configPath = candidate
      break
    }
    dir = path.dirname(dir)
  }
  if (!configPath) process.exit(0)

  // Resolve the workspace's TypeScript relative to the edited file. In this pnpm monorepo
  // `typescript` lives in each app's node_modules, not at the repo root.
  let ts
  try {
    ts = require(
      require.resolve('typescript', {
        paths: [path.dirname(configPath), path.dirname(path.resolve(file))],
      }),
    )
  } catch {
    process.exit(0) // typescript not resolvable here — skip silently
  }

  const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
  if (configFile.error) process.exit(0)

  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath),
  )

  const program = ts.createProgram(parsed.fileNames, {
    ...parsed.options,
    noEmit: true,
  })

  // Only report diagnostics for the file that was just edited. Type-checking the whole
  // program would otherwise block this edit over pre-existing, unrelated errors in other
  // files (e.g. test files that rely on Jest globals resolved by a separate config).
  const target = path.resolve(file).replace(/\\/g, '/').toLowerCase()
  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .filter(
      (d) =>
        d.file && d.file.fileName.replace(/\\/g, '/').toLowerCase() === target,
    )

  if (diagnostics.length > 0) {
    const formatHost = {
      getCanonicalFileName: (p) => p,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => ts.sys.newLine,
    }
    console.error(ts.formatDiagnostics(diagnostics, formatHost))
    process.exit(2)
  }

  process.exit(0)
})
