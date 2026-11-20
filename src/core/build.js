'use strict';
const fs = require('fs');
const path = require('path');
const { readJSON } = require('../utils');
const { SudoTypeError } = require('../errors');

/** Bundle a TypeScript entry file to JavaScript with esbuild. */
async function build(options = {}) {
  const cwd = path.resolve(options.cwd || process.cwd());
  const entry = options.entry || 'src/index.ts';
  const entryPath = path.resolve(cwd, entry);
  if (!fs.existsSync(entryPath)) throw new SudoTypeError(`Entry file not found: ${entry}`, 'ENTRY_NOT_FOUND');

  let esbuild;
  try {
    esbuild = require('esbuild');
  } catch (cause) {
    throw new SudoTypeError('esbuild failed to load. Run "sudotype doctor" for details.', 'ESBUILD_UNAVAILABLE', { cause });
  }

  const pkg = readJSON(path.join(cwd, 'package.json')) || {};
  const isModule = pkg.type === 'module';
  const format = options.format || (isModule ? 'esm' : 'cjs');
  if (!['esm', 'cjs'].includes(format)) throw new SudoTypeError('Format must be "esm" or "cjs".', 'INVALID_FORMAT');

  const ext = isModule ? (format === 'esm' ? '.js' : '.cjs') : format === 'cjs' ? '.js' : '.mjs';
  const outfile = options.out || path.join('dist', path.basename(entry).replace(/\.[cm]?[jt]sx?$/, '') + ext);
  const outPath = path.resolve(cwd, outfile);

  const started = Date.now();
  try {
    await esbuild.build({
      absWorkingDir: cwd,
      entryPoints: [entryPath],
      outfile: outPath,
      bundle: true,
      platform: 'node',
      format,
      target: options.target || 'node20',
      minify: Boolean(options.minify),
      sourcemap: Boolean(options.sourcemap),
      packages: options.bundleDeps ? undefined : 'external',
      logLevel: options.logLevel || 'silent',
    });
  } catch (cause) {
    throw new SudoTypeError(cause && cause.message ? cause.message : String(cause), 'BUILD_FAILED', { cause });
  }

  return {
    entry: entryPath,
    outfile: outPath,
    format,
    size: fs.statSync(outPath).size,
    duration: Date.now() - started,
  };
}

module.exports = { build };
