'use strict';
const os = require('os');
const { spawnSync } = require('child_process');
const { log, color, isTermux, findPackageRoot, readJSON } = require('../utils');
const path = require('path');

module.exports = async function doctor() {
  let problems = 0;
  const ok = (m) => log.ok(m);
  const bad = (m) => { problems++; log.error(m); };

  console.log(color.bold('SudoType environment check\n'));
  console.log(`  platform : ${process.platform} (${os.arch()})`);
  console.log(`  termux   : ${isTermux() ? 'yes' : 'no'}\n`);

  const [major, minor] = process.versions.node.split('.').map(Number);
  const nodeOk = major > 20 || (major === 20 && minor >= 12);
  nodeOk ? ok(`Node.js ${process.version}`) : bad(`Node.js ${process.version} is too old (need >= 20.12)`);

  try {
    const esbuild = require('esbuild');
    esbuild.transformSync('const a: number = 1', { loader: 'ts' });
    ok(`esbuild ${esbuild.version} works`);
  } catch (e) {
    bad(`esbuild failed: ${e.message.split('\n')[0]}`);
    if (isTermux()) log.warn('Try: pkg upgrade && npm install -g sudotype --force');
  }

  const tsxRoot = findPackageRoot('tsx');
  if (tsxRoot) ok(`tsx ${readJSON(path.join(tsxRoot, 'package.json')).version}`);
  else bad('tsx not found');

  const tsRoot = findPackageRoot('typescript', process.cwd());
  tsRoot ? ok(`typescript ${readJSON(path.join(tsRoot, 'package.json')).version} (project)`) : log.warn('typescript not installed in this project (only needed for "sudotype check")');

  spawnSync('git', ['--version']).status === 0 ? ok('git available') : log.warn('git not found (pkg install git)');

  console.log(problems ? color.red(`\n${problems} problem(s) found.`) : color.green('\nAll good!'));
  process.exit(problems ? 1 : 0);
};
