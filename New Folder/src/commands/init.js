'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { parseArgs } = require('node:util');
const { log, fail, color } = require('../utils');

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

async function ask(question) {
  const rl = require('readline/promises').createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

module.exports = async function init(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      template: { type: 'string', short: 't' },
      install: { type: 'boolean', short: 'i', default: false },
      'no-git': { type: 'boolean', default: false },
    },
  });

  const names = Object.keys(DESCRIPTIONS);
  let name = positionals[0];
  let template = values.template;
  const interactive = process.stdin.isTTY;

  if (!name) {
    if (!interactive) fail('Usage: sudotype init <name> [--template basic|express|discord|cli]');
    name = (await ask('Project name: ')) || 'my-app';
  }
  if (!template) {
    if (interactive) {
      names.forEach((n, i) => console.log(`  ${i + 1}) ${color.bold(n)} - ${DESCRIPTIONS[n]}`));
      const pick = await ask('Template [1]: ');
      template = names.includes(pick) ? pick : /^\d+$/.test(pick) ? (names[Number(pick) - 1] || pick) : pick ? pick : names[0];
    } else template = 'basic';
  }

  if (!names.includes(template)) fail(`Unknown template "${template}". Available: ${names.join(', ')}`);
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(name)) fail('Project name may only contain lowercase letters, numbers, ".", "-" and "_".');

  const dest = path.resolve(name);
  if (fs.existsSync(dest) && fs.readdirSync(dest).length > 0) fail(`Directory "${name}" already exists and is not empty.`);
  if (!fs.existsSync(path.join(TEMPLATES_DIR, template))) fail('Template files are missing. Reinstall SudoType.');

  copyDir(path.join(TEMPLATES_DIR, template), dest, name);
  log.ok(`Created ${color.bold(name)} from the "${template}" template`);

  if (!values['no-git']) spawnSync('git', ['init', '-q'], { cwd: dest, stdio: 'ignore' });

  if (values.install) {
    log.info('Installing dependencies...');
    const r = spawnSync('npm', ['install', '--no-audit', '--no-fund'], {
      cwd: dest,
      stdio: 'inherit',
      shell: process.platform === 'win32', // npm is npm.cmd on Windows
    });
    if (r.status !== 0) log.warn('npm install failed. Run it manually inside the project.');
  }

  console.log(`\nNext steps:\n  cd ${name}\n${values.install ? '' : '  npm install\n'}  sudotype run src/index.ts\n`);
};
