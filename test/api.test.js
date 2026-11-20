'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const api = require('../src/index.js');
const tmpdir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'sudotype-api-'));

let hasEsbuild = true;
try { require.resolve('esbuild'); } catch (_) { hasEsbuild = false; }

test('exports the documented API', () => {
  for (const fn of ['build', 'check', 'doctor', 'init', 'installDependencies', 'listTemplates', 'writeTsconfig', 'run', 'watch']) {
    assert.strictEqual(typeof api[fn], 'function', fn);
  }
  assert.strictEqual(api.version, require('../package.json').version);
  assert.strictEqual(typeof api.SudoTypeError, 'function');
});

test('named ESM imports work', async () => {
  const esm = await import('../src/index.js');
  assert.strictEqual(typeof esm.build, 'function');
  assert.strictEqual(typeof esm.SudoTypeError, 'function');
  assert.strictEqual(esm.version, api.version);
});

test('listTemplates lists the four templates', () => {
  assert.deepStrictEqual(api.listTemplates().map((t) => t.name), ['basic', 'express', 'discord', 'cli']);
});

test('init scaffolds a project and returns details', async () => {
  const cwd = tmpdir();
  const r = await api.init({ name: 'demo', template: 'cli', cwd, git: false });
  assert.strictEqual(r.name, 'demo');
  assert.strictEqual(r.template, 'cli');
  assert.strictEqual(r.directory, path.join(cwd, 'demo'));
  assert.strictEqual(r.installed, false);
  assert.ok(fs.existsSync(path.join(r.directory, 'src', 'index.ts')));
  assert.ok(fs.existsSync(path.join(r.directory, '.gitignore')));
});

test('init rejects with SudoTypeError codes', async () => {
  const cwd = tmpdir();
  await assert.rejects(api.init({ name: 'Bad Name', cwd }), { name: 'SudoTypeError', code: 'INVALID_NAME' });
  await assert.rejects(api.init({ name: 'ok', template: 'nope', cwd }), { code: 'UNKNOWN_TEMPLATE' });
  await assert.rejects(api.init({ cwd }), { code: 'INVALID_NAME' });
  fs.mkdirSync(path.join(cwd, 'full'));
  fs.writeFileSync(path.join(cwd, 'full', 'x.txt'), 'x');
  await assert.rejects(api.init({ name: 'full', cwd, git: false }), { code: 'DIRECTORY_NOT_EMPTY' });
});

test('writeTsconfig creates, refuses to overwrite, and force overwrites', () => {
  const cwd = tmpdir();
  const { path: file } = api.writeTsconfig({ cwd });
  assert.strictEqual(file, path.join(cwd, 'tsconfig.json'));
  assert.throws(() => api.writeTsconfig({ cwd }), { code: 'TSCONFIG_EXISTS' });
  assert.doesNotThrow(() => api.writeTsconfig({ cwd, force: true }));
});

test('doctor returns a structured report without exiting', async () => {
  const report = await api.doctor({ cwd: tmpdir() });
  assert.strictEqual(typeof report.ok, 'boolean');
  assert.strictEqual(report.problems, report.checks.filter((c) => c.status === 'error').length);
  assert.ok(report.checks.some((c) => c.id === 'node'));
  for (const c of report.checks) assert.ok(['ok', 'warn', 'error'].includes(c.status));
});

test('run and watch reject on bad input', async () => {
  await assert.rejects(api.run('nope.ts', [], { cwd: tmpdir() }), { code: 'FILE_NOT_FOUND' });
  await assert.rejects(api.watch('nope.ts', [], { cwd: tmpdir() }), { code: 'FILE_NOT_FOUND' });
  await assert.rejects(api.run(''), { code: 'INVALID_ARGUMENT' });
});

// Skipped on machines where TypeScript is globally resolvable (e.g. via NODE_PATH).
const tsEverywhere = (() => {
  try { require('module').createRequire(path.join(os.tmpdir(), 'x.js')).resolve('typescript/package.json'); return true; } catch (_) { return false; }
})();

test('check rejects when TypeScript is not installed in the project', { skip: tsEverywhere }, async () => {
  await assert.rejects(api.check({ cwd: tmpdir(), silent: true }), { code: 'TYPESCRIPT_NOT_INSTALLED' });
});

test('check runs tsc in a project and reports the result', { skip: !tsEverywhere }, async () => {
  const cwd = tmpdir();
  fs.writeFileSync(path.join(cwd, 'tsconfig.json'), '{"compilerOptions":{"strict":true,"noEmit":true},"files":["a.ts"]}');
  fs.writeFileSync(path.join(cwd, 'a.ts'), 'export const a: number = "x";\n');
  const bad = await api.check({ cwd, silent: true });
  assert.strictEqual(bad.success, false);
  assert.match(bad.output, /TS2322/);
  fs.writeFileSync(path.join(cwd, 'a.ts'), 'export const a: number = 1;\n');
  assert.strictEqual((await api.check({ cwd, silent: true })).success, true);
});

test('build rejects when the entry file is missing', async () => {
  await assert.rejects(api.build({ cwd: tmpdir() }), { code: 'ENTRY_NOT_FOUND' });
});

test('build rejects an invalid format', { skip: !hasEsbuild }, async () => {
  const cwd = tmpdir();
  fs.mkdirSync(path.join(cwd, 'src'));
  fs.writeFileSync(path.join(cwd, 'src', 'index.ts'), 'export const a = 1;\n');
  await assert.rejects(api.build({ cwd, format: 'umd' }), { code: 'INVALID_FORMAT' });
});

test('build bundles a file and returns details', { skip: !hasEsbuild }, async () => {
  const cwd = tmpdir();
  fs.mkdirSync(path.join(cwd, 'src'));
  fs.writeFileSync(path.join(cwd, 'src', 'index.ts'), 'const n: number = 1;\nconsole.log(n);\n');
  const r = await api.build({ cwd, minify: true });
  assert.strictEqual(r.outfile, path.join(cwd, 'dist', 'index.js'));
  assert.strictEqual(r.format, 'cjs');
  assert.ok(r.size > 0 && r.duration >= 0);
  assert.ok(fs.existsSync(r.outfile));
});

test('build reports syntax errors as BUILD_FAILED', { skip: !hasEsbuild }, async () => {
  const cwd = tmpdir();
  fs.mkdirSync(path.join(cwd, 'src'));
  fs.writeFileSync(path.join(cwd, 'src', 'index.ts'), 'const = ;\n');
  await assert.rejects(api.build({ cwd }), { code: 'BUILD_FAILED' });
});

test('build honours package.json "type" and --format', { skip: !hasEsbuild }, async () => {
  const cwd = tmpdir();
  fs.mkdirSync(path.join(cwd, 'src'));
  fs.writeFileSync(path.join(cwd, 'src', 'index.ts'), 'export const a = 1;\n');
  fs.writeFileSync(path.join(cwd, 'package.json'), '{"type":"module"}');
  assert.strictEqual((await api.build({ cwd })).outfile, path.join(cwd, 'dist', 'index.js'));
  assert.strictEqual((await api.build({ cwd, format: 'cjs' })).outfile, path.join(cwd, 'dist', 'index.cjs'));
});

test('run rejects with ABORTED when the signal is aborted', { skip: !hasEsbuild }, async () => {
  const cwd = tmpdir();
  fs.writeFileSync(path.join(cwd, 'a.ts'), 'setInterval(() => {}, 1000);\n');
  const ac = new AbortController();
  const p = api.run('a.ts', [], { cwd, stdio: 'ignore', signal: ac.signal });
  ac.abort();
  await assert.rejects(p, { code: 'ABORTED' });
});
