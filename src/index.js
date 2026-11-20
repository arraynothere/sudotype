'use strict';
const { build } = require('./core/build');
const { check } = require('./core/check');
const { doctor } = require('./core/doctor');
const { init, listTemplates, installDependencies } = require('./core/init');
const { writeTsconfig } = require('./core/tsconfig');
const { run, watch } = require('./core/run');
const { SudoTypeError } = require('./errors');
const { version } = require('../package.json');

module.exports = {
  version,
  build,
  check,
  doctor,
  init,
  listTemplates,
  installDependencies,
  writeTsconfig,
  run,
  watch,
  SudoTypeError,
};
