'use strict';
const fs = require('fs');
const path = require('path');
const { log, fail } = require('../utils');

module.exports = async function tsconfig(argv) {
  const force = argv.includes('--force') || argv.includes('-f');
  if (fs.existsSync('tsconfig.json') && !force) {
    fail('tsconfig.json already exists. Use --force to overwrite.');
  }
  fs.copyFileSync(path.join(__dirname, '..', '..', 'tsconfig.base.json'), 'tsconfig.json');
  log.ok('Created tsconfig.json');
};
