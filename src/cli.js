'use strict';
const pkg = require('../package.json');
const { color, fail } = require('./utils');

const HELP = `
${color.bold('SudoType')} v${pkg.version} - zero-config TypeScript toolchain for any environment

${color.bold('Usage')}
  sudotype <command> [options]

${color.bold('Commands')}
  run <file.ts> [args...]   Run a TypeScript file instantly (powered by tsx)
  watch <file.ts>           Run and restart automatically on file changes
  build [entry]             Compile/bundle to JavaScript (powered by esbuild)
  init [name]               Scaffold a new project (basic, express, discord, cli)
  check                     Type-check the project with tsc --noEmit
  tsconfig                  Write a ready-to-use tsconfig.json
  doctor                    Diagnose your environment
  help                      Show this help

${color.bold('Options')}
  -v, --version             Print version
  -h, --help                Show help

${color.bold('Examples')}
  sudotype run hello.ts
  sudotype init my-bot --template discord
  sudotype build src/index.ts --minify
`;

const commands = {
  run: () => require('./commands/run').run,
  watch: () => require('./commands/run').watch,
  build: () => require('./commands/build'),
  init: () => require('./commands/init'),
  check: () => require('./commands/check'),
  tsconfig: () => require('./commands/tsconfig'),
  doctor: () => require('./commands/doctor'),
};

const COMMAND_HELP = {
  run: 'Usage: sudotype run <file.ts> [args...]\n\n  Run a TypeScript file. Arguments after the file name are passed to your program.',
  watch: 'Usage: sudotype watch <file.ts> [args...]\n\n  Run a TypeScript file and restart it on file changes.',
  init: 'Usage: sudotype init [name] [options]\n\n  -t, --template <name>   basic | express | discord | cli\n  -i, --install           Run npm install after scaffolding\n  --no-git                Skip git init',
  check: 'Usage: sudotype check [tsc options]\n\n  Type-check the project with tsc --noEmit (needs typescript in the project).',
  tsconfig: 'Usage: sudotype tsconfig [--force]\n\n  Write a ready-to-use tsconfig.json. Use --force to overwrite an existing one.',
  doctor: 'Usage: sudotype doctor\n\n  Diagnose the environment. Exits with code 1 if a problem is found.',
};

async function main(argv) {
  const [cmd, ...rest] = argv;
  if (!cmd || cmd === 'help' || cmd === '-h' || cmd === '--help') return console.log(HELP);
  if (cmd === '-v' || cmd === '--version') return console.log(pkg.version);
  if (!commands[cmd]) {
    console.log(HELP);
    fail(`Unknown command: "${cmd}"`);
  }
  // `build` prints its own help; for the others, only a leading flag counts
  // so that arguments meant for the user's program are never swallowed.
  if (cmd !== 'build' && (rest[0] === '-h' || rest[0] === '--help')) return console.log(COMMAND_HELP[cmd]);
  try {
    await commands[cmd]()(rest);
  } catch (err) {
    fail(err && err.message ? err.message : String(err));
  }
}

module.exports = { main };
