'use strict';
const { log } = require('../utils');
const { writeTsconfig } = require('../core/tsconfig');

module.exports = async function tsconfigCommand(argv) {
  const force = argv.includes('--force') || argv.includes('-f');
  writeTsconfig({ force });
  log.ok('Created tsconfig.json');
};
