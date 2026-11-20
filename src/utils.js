'use strict';
const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (n) => (s) => (useColor ? `\x1b[${n}m${s}\x1b[0m` : String(s));
const color = { red: paint(31), green: paint(32), yellow: paint(33), cyan: paint(36), dim: paint(2), bold: paint(1) };

const log = {
  info: (m) => console.log(color.cyan('›'), m),
  ok: (m) => console.log(color.green('✔'), m),
  warn: (m) => console.log(color.yellow('!'), m),
  error: (m) => console.error(color.red('✖'), m),
};

function fail(msg, code = 1) {
  log.error(msg);
  process.exit(code);
}

function isTermux() {
  return Boolean(process.env.TERMUX_VERSION || (process.env.PREFIX || '').includes('com.termux'));
}

/** Locate an installed package root, resolving from `fromDir`. Returns null if missing. */
function findPackageRoot(name, fromDir = __dirname) {
  const req = createRequire(path.join(fromDir, 'noop.js'));
  try {
    return path.dirname(req.resolve(`${name}/package.json`));
  } catch (_) {
    /* package.json may not be exported; fall back to walking up from the entry point */
  }
  try {
    let dir = path.dirname(req.resolve(name));
    while (dir !== path.dirname(dir)) {
      const pj = path.join(dir, 'package.json');
      if (fs.existsSync(pj) && JSON.parse(fs.readFileSync(pj, 'utf8')).name === name) return dir;
      dir = path.dirname(dir);
    }
  } catch (_) {
    /* not installed */
  }
  return null;
}

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (_) {
    return null;
  }
}

module.exports = { color, log, fail, isTermux, findPackageRoot, readJSON };
