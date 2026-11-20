'use strict';
const path = require('path');
const { parseArgs } = require('node:util');
const { log, color } = require('../utils');
const { build } = require('../core/build');

module.exports = async function buildCommand(argv) {
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

  const result = await build({
    entry: positionals[0],
    out: values.out,
    format: values.format,
    target: values.target,
    minify: values.minify,
    sourcemap: values.sourcemap,
    bundleDeps: values['bundle-deps'],
    logLevel: 'warning',
  });

  const shown = values.out || path.relative(process.cwd(), result.outfile);
  const kb = (result.size / 1024).toFixed(1);
  log.ok(`Built ${color.bold(shown)} (${kb} KB) in ${result.duration}ms`);
};
