'use strict';
const { parseArgs } = require('node:util');
const { log, fail, color } = require('../utils');
const { init, listTemplates, installDependencies } = require('../core/init');

async function ask(question) {
  const rl = require('readline/promises').createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

module.exports = async function initCommand(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      template: { type: 'string', short: 't' },
      install: { type: 'boolean', short: 'i', default: false },
      'no-git': { type: 'boolean', default: false },
    },
  });

  const templates = listTemplates();
  const names = templates.map((t) => t.name);
  let name = positionals[0];
  let template = values.template;
  const interactive = process.stdin.isTTY;

  if (!name) {
    if (!interactive) fail('Usage: sudotype init <name> [--template basic|express|discord|cli]');
    name = (await ask('Project name: ')) || 'my-app';
  }
  if (!template) {
    if (interactive) {
      templates.forEach((t, i) => console.log(`  ${i + 1}) ${color.bold(t.name)} - ${t.description}`));
      const pick = await ask('Template [1]: ');
      template = names.includes(pick) ? pick : /^\d+$/.test(pick) ? (names[Number(pick) - 1] || pick) : pick ? pick : names[0];
    } else template = 'basic';
  }

  await init({ name, template, git: !values['no-git'] });
  log.ok(`Created ${color.bold(name)} from the "${template}" template`);

  if (values.install) {
    log.info('Installing dependencies...');
    const ok = await installDependencies(name);
    if (!ok) log.warn('npm install failed. Run it manually inside the project.');
  }

  console.log(`\nNext steps:\n  cd ${name}\n${values.install ? '' : '  npm install\n'}  sudotype run src/index.ts\n`);
};
