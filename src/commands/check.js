'use strict';
const fs = require('fs');
const { log } = require('../utils');
const { check } = require('../core/check');

module.exports = async function checkCommand(argv) {
  if (!fs.existsSync('tsconfig.json')) {
    log.warn('No tsconfig.json found. Create one with: sudotype tsconfig');
  }
  const result = await check({ args: argv });
  if (result.success) log.ok('No type errors found.');
  process.exit(result.exitCode);
};
