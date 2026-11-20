'use strict';
const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const { SudoTypeError } = require('../errors');

const TEMPLATES_DIR = path.join(__dirname, '..', '..', 'templates');
const DESCRIPTIONS = {
  basic: 'Minimal TypeScript project',
  express: 'Express REST API server',
  discord: 'Discord bot (discord.js v14)',
  cli: 'Command-line app with argument parsing',
};
const RENAMES = { _gitignore: '.gitignore', '_env.example': '.env.example' };

function copyDir(src, dest, name) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const target = path.join(dest, RENAMES[entry.name] || entry.name);
    if (entry.isDirectory()) copyDir(path.join(src, entry.name), target, name);
    else fs.writeFileSync(target, fs.readFileSync(path.join(src, entry.name), 'utf8').replace(/__NAME__/g, name));
  }
}

/** List the available project templates. */
function listTemplates() {
  return Object.keys(DESCRIPTIONS).map((name) => ({ name, description: DESCRIPTIONS[name] }));
}

/** Run `npm install` inside `directory`. Resolves to true on success. */
function installDependencies(directory, options = {}) {
  return new Promise((resolve) => {
    const child = spawn('npm', ['install', '--no-audit', '--no-fund'], {
      cwd: path.resolve(directory),
      stdio: options.silent ? 'ignore' : 'inherit',
      shell: process.platform === 'win32', // npm is npm.cmd on Windows
    });
    child.on('error', () => resolve(false));
    child.on('close', (code) => resolve(code === 0));
  });
}

/** Scaffold a new project from a template. */
async function init(options = {}) {
  const cwd = path.resolve(options.cwd || process.cwd());
  const name = options.name;
  const template = options.template || 'basic';
  const names = Object.keys(DESCRIPTIONS);

  if (!name) throw new SudoTypeError('A project name is required.', 'INVALID_NAME');
  if (!names.includes(template)) {
    throw new SudoTypeError(`Unknown template "${template}". Available: ${names.join(', ')}`, 'UNKNOWN_TEMPLATE');
  }
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(name)) {
    throw new SudoTypeError('Project name may only contain lowercase letters, numbers, ".", "-" and "_".', 'INVALID_NAME');
  }

  const dest = path.resolve(cwd, name);
  if (fs.existsSync(dest) && fs.readdirSync(dest).length > 0) {
    throw new SudoTypeError(`Directory "${name}" already exists and is not empty.`, 'DIRECTORY_NOT_EMPTY');
  }
  if (!fs.existsSync(path.join(TEMPLATES_DIR, template))) {
    throw new SudoTypeError('Template files are missing. Reinstall SudoType.', 'TEMPLATE_MISSING');
  }

  copyDir(path.join(TEMPLATES_DIR, template), dest, name);
  if (options.git !== false) spawnSync('git', ['init', '-q'], { cwd: dest, stdio: 'ignore' });
  const installed = options.install ? await installDependencies(dest, { silent: options.silent }) : false;

  return { name, template, directory: dest, installed };
}

module.exports = { init, listTemplates, installDependencies };
