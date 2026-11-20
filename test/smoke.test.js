'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const BIN = path.join(__dirname, '..', 'bin', 'sudotype.js');
const sh = (args, cwd) => spawnSync(process.execPath, [BIN, ...args], { cwd, encoding: 'utf8' });

test('prints version', () => {
  const r = sh(['--version']);
  assert.strictEqual(r.stdout.trim(), require('../package.json').version);
});

test('help lists commands', () => {
  assert.match(sh(['help']).stdout, /scaffold/i);
});

test('unknown command fails', () => {
  assert.notStrictEqual(sh(['nope']).status, 0);
});

for (const t of ['basic', 'express', 'discord', 'cli']) {
  test(`init scaffolds "${t}" template`, () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sudotype-'));
    const r = sh(['init', 'demo', '-t', t, '--no-git'], tmp);
    assert.strictEqual(r.status, 0, r.stderr);
    for (const f of ['package.json', 'tsconfig.json', '.gitignore', 'src/index.ts']) {
      assert.ok(fs.existsSync(path.join(tmp, 'demo', f)), `${f} missing`);
    }
    const pkg = JSON.parse(fs.readFileSync(path.join(tmp, 'demo', 'package.json'), 'utf8'));
    assert.strictEqual(pkg.name, 'demo');
  });
}

test('init refuses invalid names', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sudotype-'));
  assert.notStrictEqual(sh(['init', 'Bad Name', '-t', 'basic'], tmp).status, 0);
});

test('tsconfig creates, refuses to overwrite, and --force overwrites', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sudotype-'));
  assert.strictEqual(sh(['tsconfig'], tmp).status, 0);
  assert.ok(fs.existsSync(path.join(tmp, 'tsconfig.json')));
  assert.notStrictEqual(sh(['tsconfig'], tmp).status, 0);
  assert.strictEqual(sh(['tsconfig', '--force'], tmp).status, 0);
});

test('init refuses unknown template and non-empty directory', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sudotype-'));
  assert.notStrictEqual(sh(['init', 'demo', '-t', 'nope'], tmp).status, 0);
  fs.mkdirSync(path.join(tmp, 'full'));
  fs.writeFileSync(path.join(tmp, 'full', 'x.txt'), 'x');
  assert.notStrictEqual(sh(['init', 'full', '-t', 'basic', '--no-git'], tmp).status, 0);
});

test('run fails on a missing file', () => {
  assert.notStrictEqual(sh(['run', 'does-not-exist.ts']).status, 0);
});

let hasEsbuild = true;
try { require.resolve('esbuild'); } catch (_) { hasEsbuild = false; }

test('build bundles a TypeScript file', { skip: !hasEsbuild }, () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sudotype-'));
  fs.mkdirSync(path.join(tmp, 'src'));
  fs.writeFileSync(path.join(tmp, 'src', 'index.ts'), 'const n: number = 1;\nconsole.log(n);\n');
  const r = sh(['build'], tmp);
  assert.strictEqual(r.status, 0, r.stderr);
  assert.ok(fs.existsSync(path.join(tmp, 'dist', 'index.js')));
});

test('doctor runs and reports Node.js', { skip: !hasEsbuild }, () => {
  const r = sh(['doctor']);
  assert.match(r.stdout, /Node\.js/);
});
