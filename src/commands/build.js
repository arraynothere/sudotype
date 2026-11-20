'use strict';
const fs = require('fs');
const path = require('path');
const { parseArgs } = require('node:util');
const { log, fail, readJSON, color } = require('../utils');

module.exports = async function build(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      out: { type: 'string', short: 'o' },
      format: { type: 'string', short: 'f' },
      target: { type: 'string', default: 'node20' },
      minify: { type: 'boolean', default: false },
      sourcemap: { type: 'boolean', default: false },
      'bundle-deps': { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });

  if (values.help) {
    return console.log(`Usage: sudotype build [entry] [options]

  entry                 Entry file (default: src/index.ts)
  -o, --out <file>      Output file (default: dist/<name>.js)
  -f, --format <fmt>    esm | cjs (default: based on package.json "type")
  --target <target>     esbuild target (default: node20)
  --minify              Minify output
  --sourcemap           Emit source map
  --bundle-deps         Also bundle node_modules into the output`);
  }

  const entry = positionals[0] || 'src/index.ts';
  if (!fs.existsSync(entry)) fail(`Entry file not found: ${entry}`);

  let esbuild;
  try {
    esbuild = require('esbuild');
  } catch (e) {
    fail('esbuild failed to load. Run "sudotype doctor" for details.');
  }

  const pkg = readJSON(path.join(process.cwd(), 'package.json')) || {};
  const isModule = pkg.type === 'module';
  const format = values.format || (isModule ? 'esm' : 'cjs');
  if (!['esm', 'cjs'].includes(format)) fail('Format must be "esm" or "cjs".');

  const ext = isModule ? (format === 'esm' ? '.js' : '.cjs') : format === 'cjs' ? '.js' : '.mjs';
  const outfile = values.out || path.join('dist', path.basename(entry).replace(/\.[cm]?[jt]sx?$/, '') + ext);

  const started = Date.now();
  await esbuild.build({
    entryPoints: [entry],
    outfile,
    bundle: true,
    platform: 'node',
    format,
    target: values.target,
    minify: values.minify,
    sourcemap: values.sourcemap,
    packages: values['bundle-deps'] ? undefined : 'external',
    logLevel: 'warning',
  });

  const kb = (fs.statSync(outfile).size / 1024).toFixed(1);
  log.ok(`Built ${color.bold(outfile)} (${kb} KB) in ${Date.now() - started}ms`);
};
