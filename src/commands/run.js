'use strict';
const { fail } = require('../utils');
const core = require('../core/run');

function forwardSignals(child) {
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => child.kill(sig));
}

async function run(args) {
  if (!args[0]) fail('Usage: sudotype run <file.ts> [args...]');
  process.exit(await core.run(args[0], args.slice(1), { onSpawn: forwardSignals }));
}

async function watch(args) {
  if (!args[0]) fail('Usage: sudotype watch <file.ts> [args...]');
  process.exit(await core.watch(args[0], args.slice(1), { onSpawn: forwardSignals }));
}

module.exports = { run, watch };
