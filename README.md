<div align="center">

<img src="https://raw.githubusercontent.com/arraynothere/sudotype/main/icon/a/r/r/a/y/icon_sudotype_default.png" alt="SudoType logo" width="140" height="140">

<h1>SudoType</h1>

<p><b>Zero-config TypeScript toolchain for any environment.</b><br>
Run, build, scaffold and type-check TypeScript with a single command, or call the same features from your own code through a fully typed API.</p>

<p>
  <img src="https://raw.githubusercontent.com/arraynothere/sudotype/main/assets/badge-version.svg" alt="version">
  <img src="https://raw.githubusercontent.com/arraynothere/sudotype/main/assets/badge-node.svg" alt="node">
  <img src="https://raw.githubusercontent.com/arraynothere/sudotype/main/assets/badge-platform.svg" alt="platform">
  <img src="https://raw.githubusercontent.com/arraynothere/sudotype/main/assets/badge-runtime.svg" alt="runtime">
  <img src="https://raw.githubusercontent.com/arraynothere/sudotype/main/assets/badge-bundler.svg" alt="bundler">
  <img src="https://raw.githubusercontent.com/arraynothere/sudotype/main/assets/badge-license.svg" alt="license">
</p>

<p>
  <a href="https://github.com/arraynothere/sudotype"><img src="https://raw.githubusercontent.com/arraynothere/sudotype/main/assets/btn-repo.svg" alt="Visit Repository" height="40"></a>
  <a href="https://www.npmjs.com/package/@arraynothere/sudotype"><img src="https://raw.githubusercontent.com/arraynothere/sudotype/main/assets/btn-npm.svg" alt="View on npm" height="40"></a>
  <a href="https://github.com/arraynothere/sudotype/issues"><img src="https://raw.githubusercontent.com/arraynothere/sudotype/main/assets/btn-issues.svg" alt="Report an Issue" height="40"></a>
</p>

<p>
  <a href="#installation">Installation</a> ·
  <a href="#quick-start">Quick Start</a> ·
  <a href="#commands">Commands</a> ·
  <a href="#programmatic-api">API</a> ·
  <a href="#templates">Templates</a> ·
  <a href="#project-structure">Structure</a> ·
  <a href="#troubleshooting">Troubleshooting</a> ·
  <a href="#windows">Windows</a> ·
  <a href="#faq">FAQ</a>
</p>

<img src="https://raw.githubusercontent.com/arraynothere/sudotype/main/assets/stack.svg" alt="Programs used by SudoType: tsx, esbuild, Node.js, TypeScript" width="100%">

</div>

<br>

<h2 id="overview">Overview</h2>

<p>
Setting up TypeScript on a phone usually means writing a <code>tsconfig.json</code> by hand, installing a compiler, and fixing native binaries that do not match the device. SudoType wraps that into one CLI. It uses <a href="https://github.com/privatenumber/tsx">tsx</a> to run files and <a href="https://esbuild.github.io">esbuild</a> to compile them. esbuild ships native <code>android-arm64</code> binaries that work in Termux, and tsx runs on top of it.
</p>

<table>
  <tr>
    <td width="50%"><b>Run without a build step</b><br>Execute <code>.ts</code> files directly, with watch mode.</td>
    <td width="50%"><b>Project scaffolding</b><br>Start from Express, Discord bot, CLI or basic templates.</td>
  </tr>
  <tr>
    <td width="50%"><b>Fast compile</b><br>Bundle to a single JavaScript file with esbuild.</td>
    <td width="50%"><b>Environment check</b><br><code>sudotype doctor</code> reports what is missing.</td>
  </tr>
  <tr>
    <td width="50%"><b>Typed programmatic API</b><br>Import <code>build</code>, <code>init</code>, <code>check</code> and more from TypeScript.</td>
    <td width="50%"><b>Works anywhere</b><br>Termux, Linux, macOS and Windows on Node.js 20.12+.</td>
  </tr>
</table>

<h2 id="requirements">Requirements</h2>

<ul>
  <li>Node.js <code>20.12</code> or newer (the <code>discord</code> template uses <code>process.loadEnvFile()</code>)</li>
  <li>Termux (Android, ARM64), or any Linux / macOS / Windows machine with Node.js</li>
  <li><code>git</code> (optional, used by <code>sudotype init</code>)</li>
</ul>

<h3>Supported platforms</h3>

SudoType is plain JavaScript on top of esbuild and tsx, so it runs anywhere Node.js 20.12+ and esbuild run.

<table>
  <thead>
    <tr><th align="left">Platform</th><th align="left">Status</th></tr>
  </thead>
  <tbody>
    <tr><td>Termux (Android, ARM64)</td><td>Primary target</td></tr>
    <tr><td>Linux (x64, ARM64), WSL, Docker, Raspberry Pi, Codespaces</td><td>Supported</td></tr>
    <tr><td>Linux on Android (proot-distro, UserLAnd, Andronix)</td><td>Supported</td></tr>
    <tr><td>macOS (Intel, Apple Silicon)</td><td>Supported</td></tr>
    <tr><td>Windows (x64, ARM64)</td><td>Supported (see <a href="#windows">Windows notes</a>)</td></tr>
    <tr><td>FreeBSD, OpenBSD, ChromeOS (Crostini)</td><td>Should work, not tested</td></tr>
    <tr><td>iOS (iSH, a-Shell)</td><td>Not supported</td></tr>
  </tbody>
</table>

CI runs the test suite on Ubuntu, macOS and Windows with Node.js 20, 22 and 24.

<h2 id="installation">Installation</h2>

**Termux (Android)**

```sh
pkg update && pkg install nodejs git
npm install -g @arraynothere/sudotype
```

**Linux / macOS / Windows**

```sh
npm install -g @arraynothere/sudotype
```

The npm package is `@arraynothere/sudotype`, and the command it installs is `sudotype`.

Or run it without installing:

```sh
npx @arraynothere/sudotype doctor
```

**As a library** (to use the [API](#programmatic-api) in your own project)

```sh
npm install @arraynothere/sudotype
```

Update or remove it:

```sh
npm update -g @arraynothere/sudotype
npm uninstall -g @arraynothere/sudotype
```

Verify the setup:

```sh
sudotype --version
sudotype doctor
```

<h2 id="why">Why SudoType?</h2>

<p>
You can call <code>tsx</code> and <code>esbuild</code> directly, but you still have to wire up the <code>tsconfig.json</code>, the build flags, the project layout and the environment checks yourself. SudoType puts those behind one command and ships ready-made templates, so a fresh phone goes from zero to a running TypeScript project in a few commands.
</p>

<h2 id="quick-start">Quick Start</h2>

**1. Run a file**

```sh
echo 'console.log("Hello from SudoType");' > hello.ts
sudotype run hello.ts
```

**2. Create a project**

```sh
sudotype init my-api --template express --install
cd my-api
```

**3. Develop, check and build**

```sh
sudotype watch src/index.ts     # restart on change
sudotype check                  # type-check
sudotype build src/index.ts     # output: dist/index.js
```

<h2 id="commands">Commands</h2>

<table>
  <thead>
    <tr><th align="left">Command</th><th align="left">Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>sudotype run &lt;file.ts&gt; [args]</code></td><td>Run a TypeScript file</td></tr>
    <tr><td><code>sudotype watch &lt;file.ts&gt;</code></td><td>Run and restart on file changes</td></tr>
    <tr><td><code>sudotype build [entry]</code></td><td>Bundle to JavaScript with esbuild</td></tr>
    <tr><td><code>sudotype init [name]</code></td><td>Scaffold a new project</td></tr>
    <tr><td><code>sudotype check</code></td><td>Type-check with <code>tsc --noEmit</code></td></tr>
    <tr><td><code>sudotype tsconfig</code></td><td>Write a ready-to-use <code>tsconfig.json</code></td></tr>
    <tr><td><code>sudotype doctor</code></td><td>Diagnose the environment</td></tr>
  </tbody>
</table>

<h3>run / watch</h3>

Arguments after the file name are passed to your program.

```sh
sudotype run src/index.ts --port 8080
sudotype watch src/index.ts
```

<h3>build</h3>

The entry file defaults to `src/index.ts`. Dependencies stay external unless `--bundle-deps` is set.

```sh
sudotype build                              # src/index.ts -> dist/index.js
sudotype build src/cli.ts --minify
sudotype build src/index.ts -f cjs -o out/app.cjs --sourcemap
sudotype build src/index.ts --bundle-deps   # single self-contained file
```

<table>
  <thead>
    <tr><th align="left">Option</th><th align="left">Default</th><th align="left">Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>-o, --out &lt;file&gt;</code></td><td><code>dist/&lt;name&gt;.js</code> (<code>.cjs</code> / <code>.mjs</code> when the format differs from <code>"type"</code>)</td><td>Output file</td></tr>
    <tr><td><code>-f, --format &lt;esm|cjs&gt;</code></td><td>from <code>package.json</code> <code>"type"</code></td><td>Output module format</td></tr>
    <tr><td><code>--target &lt;target&gt;</code></td><td><code>node20</code></td><td>esbuild target</td></tr>
    <tr><td><code>--minify</code></td><td>off</td><td>Minify the output</td></tr>
    <tr><td><code>--sourcemap</code></td><td>off</td><td>Emit a source map</td></tr>
    <tr><td><code>--bundle-deps</code></td><td>off</td><td>Bundle <code>node_modules</code> into the output</td></tr>
  </tbody>
</table>

<h3>init</h3>

Run it without arguments for an interactive prompt, or pass everything as flags.

```sh
sudotype init                                   # interactive
sudotype init my-bot -t discord --install       # flags only
sudotype init my-cli -t cli --no-git
```

<table>
  <thead>
    <tr><th align="left">Option</th><th align="left">Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>-t, --template &lt;name&gt;</code></td><td><code>basic</code>, <code>express</code>, <code>discord</code> or <code>cli</code></td></tr>
    <tr><td><code>-i, --install</code></td><td>Run <code>npm install</code> after scaffolding</td></tr>
    <tr><td><code>--no-git</code></td><td>Skip <code>git init</code></td></tr>
  </tbody>
</table>

<h3>check / tsconfig / doctor</h3>

```sh
sudotype check                  # requires typescript in the project
sudotype tsconfig               # fails if tsconfig.json exists
sudotype tsconfig --force       # overwrite
sudotype doctor                 # exit code 1 if a problem is found
```

<h2 id="programmatic-api">Programmatic API</h2>

Everything the CLI does is also available as a typed API. The package ships its own type definitions, so no `@types/*` package is needed for SudoType itself (your project still needs `@types/node`, which TypeScript projects on Node.js normally have).

```sh
npm install @arraynothere/sudotype
```

```ts
import { build, check, doctor, init, listTemplates, SudoTypeError } from "@arraynothere/sudotype";

// Scaffold a project
const project = await init({ name: "my-api", template: "express", git: false });
console.log(project.directory);

// Bundle a file
const result = await build({ cwd: project.directory, entry: "src/index.ts", minify: true });
console.log(`${result.outfile} (${result.size} bytes in ${result.duration}ms)`);

// Type-check and capture the output
const { success, output } = await check({ cwd: project.directory, silent: true });
if (!success) console.error(output);
```

CommonJS works too:

```js
const { build } = require("@arraynothere/sudotype");
```

Differences from the CLI:

- API functions **never call `process.exit()` and never print**. They return a result or throw a `SudoTypeError`.
- Paths are resolved against the `cwd` option (default `process.cwd()`).
- `build()` is silent by default. Pass `logLevel: "warning"` to see esbuild warnings.
- `init()` does not prompt. Interactive prompts exist only in the CLI.
- Requires Node.js 20.12 or newer, like the CLI.

<h3>Functions</h3>

<table>
  <thead>
    <tr><th align="left">Function</th><th align="left">Returns</th><th align="left">Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>build(options?)</code></td><td><code>Promise&lt;BuildResult&gt;</code></td><td>Bundle a TypeScript entry file with esbuild</td></tr>
    <tr><td><code>check(options?)</code></td><td><code>Promise&lt;CheckResult&gt;</code></td><td>Run <code>tsc --noEmit</code> with the project's TypeScript</td></tr>
    <tr><td><code>doctor(options?)</code></td><td><code>Promise&lt;DoctorReport&gt;</code></td><td>Inspect the environment</td></tr>
    <tr><td><code>init(options)</code></td><td><code>Promise&lt;InitResult&gt;</code></td><td>Scaffold a project from a template</td></tr>
    <tr><td><code>listTemplates()</code></td><td><code>TemplateInfo[]</code></td><td>List the built-in templates</td></tr>
    <tr><td><code>installDependencies(dir, options?)</code></td><td><code>Promise&lt;boolean&gt;</code></td><td>Run <code>npm install</code> in a directory</td></tr>
    <tr><td><code>writeTsconfig(options?)</code></td><td><code>{ path: string }</code></td><td>Write the recommended <code>tsconfig.json</code></td></tr>
    <tr><td><code>run(file, args?, options?)</code></td><td><code>Promise&lt;number&gt;</code></td><td>Run a file with tsx, resolves to the exit code</td></tr>
    <tr><td><code>watch(file, args?, options?)</code></td><td><code>Promise&lt;number&gt;</code></td><td>Run a file and restart on changes</td></tr>
    <tr><td><code>version</code></td><td><code>string</code></td><td>Installed SudoType version</td></tr>
    <tr><td><code>SudoTypeError</code></td><td>class</td><td>Error type thrown by every function</td></tr>
  </tbody>
</table>

<h3>build(options?)</h3>

<table>
  <thead>
    <tr><th align="left">Option</th><th align="left">Type</th><th align="left">Default</th><th align="left">Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>entry</code></td><td><code>string</code></td><td><code>"src/index.ts"</code></td><td>Entry file</td></tr>
    <tr><td><code>out</code></td><td><code>string</code></td><td><code>dist/&lt;name&gt;.js</code></td><td>Output file</td></tr>
    <tr><td><code>format</code></td><td><code>"esm" | "cjs"</code></td><td>from <code>"type"</code></td><td>Module format</td></tr>
    <tr><td><code>target</code></td><td><code>string</code></td><td><code>"node20"</code></td><td>esbuild target</td></tr>
    <tr><td><code>minify</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Minify the output</td></tr>
    <tr><td><code>sourcemap</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Emit a source map</td></tr>
    <tr><td><code>bundleDeps</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Bundle <code>node_modules</code></td></tr>
    <tr><td><code>cwd</code></td><td><code>string</code></td><td><code>process.cwd()</code></td><td>Working directory</td></tr>
    <tr><td><code>logLevel</code></td><td><code>"silent" | "error" | "warning" | "info"</code></td><td><code>"silent"</code></td><td>esbuild log level</td></tr>
  </tbody>
</table>

Result: `{ entry, outfile, format, size, duration }`. `entry` and `outfile` are absolute paths, `size` is in bytes and `duration` in milliseconds.

<h3>check(options?)</h3>

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `cwd` | `string` | `process.cwd()` | Project directory |
| `args` | `string[]` | `[]` | Extra arguments for `tsc` |
| `silent` | `boolean` | `false` | Capture output in `result.output` instead of printing it |

Result: `{ success, exitCode, output }`. A project with type errors resolves with `success: false`. It only rejects when TypeScript is missing or cannot start.

<h3>doctor(options?)</h3>

```ts
const report = await doctor();
// {
//   platform: "linux", arch: "x64", termux: false,
//   ok: true, problems: 0,
//   checks: [{ id: "node", status: "ok", message: "Node.js v22.0.0" }, ...]
// }
```

Each check has an `id` (`node`, `esbuild`, `tsx`, `typescript`, `git`), a `status` (`ok`, `warn` or `error`), a `message` and an optional `hint`. Only `error` counts as a problem.

<h3>init(options)</h3>

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | required | Project and directory name |
| `template` | `"basic" \| "express" \| "discord" \| "cli"` | `"basic"` | Template to use |
| `cwd` | `string` | `process.cwd()` | Parent directory |
| `git` | `boolean` | `true` | Run `git init` |
| `install` | `boolean` | `false` | Run `npm install` afterwards |
| `silent` | `boolean` | `false` | Hide npm output |

Result: `{ name, template, directory, installed }`.

<h3>run / watch</h3>

```ts
import { run, watch } from "@arraynothere/sudotype";

const code = await run("src/index.ts", ["--port", "8080"]);

const controller = new AbortController();
const done = watch("src/index.ts", [], { signal: controller.signal });
controller.abort();          // stop watching
await done.catch(() => {});  // an aborted process rejects with code "ABORTED"
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `cwd` | `string` | `process.cwd()` | Working directory |
| `env` | `NodeJS.ProcessEnv` | `process.env` | Environment variables |
| `stdio` | `"inherit" \| "pipe" \| "ignore"` | `"inherit"` | Child stdio |
| `signal` | `AbortSignal` | none | Stops the process when aborted |
| `onSpawn` | `(child: ChildProcess) => void` | none | Called with the child process after it starts |

<h3>Error handling</h3>

Every function throws (or rejects with) a `SudoTypeError`. Branch on `error.code`, not on the message:

```ts
import { build, SudoTypeError } from "@arraynothere/sudotype";

try {
  await build({ entry: "src/missing.ts" });
} catch (err) {
  if (err instanceof SudoTypeError && err.code === "ENTRY_NOT_FOUND") {
    console.error(err.message);
  } else {
    throw err;
  }
}
```

<table>
  <thead>
    <tr><th align="left">Code</th><th align="left">Thrown by</th><th align="left">Meaning</th></tr>
  </thead>
  <tbody>
    <tr><td><code>ENTRY_NOT_FOUND</code></td><td><code>build</code></td><td>The entry file does not exist</td></tr>
    <tr><td><code>ESBUILD_UNAVAILABLE</code></td><td><code>build</code></td><td>esbuild failed to load (run <code>doctor</code>)</td></tr>
    <tr><td><code>INVALID_FORMAT</code></td><td><code>build</code></td><td><code>format</code> is not <code>"esm"</code> or <code>"cjs"</code></td></tr>
    <tr><td><code>BUILD_FAILED</code></td><td><code>build</code></td><td>esbuild reported errors (see <code>error.cause</code>)</td></tr>
    <tr><td><code>TYPESCRIPT_NOT_INSTALLED</code></td><td><code>check</code></td><td>The project has no <code>typescript</code> package</td></tr>
    <tr><td><code>INVALID_NAME</code></td><td><code>init</code></td><td>Missing or invalid project name</td></tr>
    <tr><td><code>UNKNOWN_TEMPLATE</code></td><td><code>init</code></td><td>The template does not exist</td></tr>
    <tr><td><code>DIRECTORY_NOT_EMPTY</code></td><td><code>init</code></td><td>The target directory already has files</td></tr>
    <tr><td><code>TEMPLATE_MISSING</code></td><td><code>init</code></td><td>Template files are missing, reinstall SudoType</td></tr>
    <tr><td><code>TSCONFIG_EXISTS</code></td><td><code>writeTsconfig</code></td><td><code>tsconfig.json</code> exists and <code>force</code> is not set</td></tr>
    <tr><td><code>FILE_NOT_FOUND</code></td><td><code>run</code>, <code>watch</code></td><td>The file does not exist</td></tr>
    <tr><td><code>INVALID_ARGUMENT</code></td><td><code>run</code>, <code>watch</code></td><td>No file was given</td></tr>
    <tr><td><code>TSX_NOT_FOUND</code></td><td><code>run</code>, <code>watch</code></td><td>tsx is missing, reinstall SudoType</td></tr>
    <tr><td><code>SPAWN_FAILED</code></td><td><code>check</code>, <code>run</code>, <code>watch</code></td><td>The child process could not start</td></tr>
    <tr><td><code>ABORTED</code></td><td><code>run</code>, <code>watch</code></td><td>The <code>signal</code> option aborted the process</td></tr>
  </tbody>
</table>

<h3>TypeScript configuration</h3>

SudoType's types use the `exports` field, so use a modern module resolution mode:

```json
{
  "compilerOptions": {
    "module": "Node16",
    "moduleResolution": "Node16"
  }
}
```

`"moduleResolution": "Bundler"` works as well. The generated `tsconfig.json` from `sudotype tsconfig` already uses a compatible setup. All types (`BuildOptions`, `BuildResult`, `CheckResult`, `DoctorReport`, `InitOptions`, `RunOptions`, `TemplateName`, ...) are exported:

```ts
import type { BuildOptions, DoctorReport } from "@arraynothere/sudotype";
```

<h2 id="templates">Templates</h2>

<table>
  <thead>
    <tr><th align="left">Template</th><th align="left">Description</th><th align="left">Extra dependencies</th></tr>
  </thead>
  <tbody>
    <tr><td><code>basic</code></td><td>Minimal TypeScript project</td><td>none</td></tr>
    <tr><td><code>express</code></td><td>REST API server listening on <code>PORT</code> (default 3000)</td><td><code>express</code></td></tr>
    <tr><td><code>discord</code></td><td>Discord bot with a <code>/ping</code> slash command</td><td><code>discord.js</code> v14</td></tr>
    <tr><td><code>cli</code></td><td>Command-line app using <code>node:util</code> <code>parseArgs</code></td><td>none</td></tr>
  </tbody>
</table>

Every generated project includes these scripts, so the global `sudotype` command must be installed:

```sh
npm start         # sudotype run src/index.ts
npm run dev       # sudotype watch src/index.ts
npm run build     # sudotype build src/index.ts --minify
npm run check     # sudotype check
```

The Discord template reads `DISCORD_TOKEN` and `CLIENT_ID` from `.env`:

```sh
cp .env.example .env            # fill in the values
sudotype run src/deploy-commands.ts
sudotype run src/index.ts
```

<h2 id="project-structure">Project Structure</h2>

<h3>Generated project</h3>

```text
my-api/
├── src/
│   └── index.ts
├── .env.example        (express, discord)
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

The `discord` template also contains `src/deploy-commands.ts`.

<h3>This repository</h3>

```text
sudotype/
├── bin/
│   └── sudotype.js         CLI entry point
├── src/
│   ├── index.js            programmatic API entry (package "main")
│   ├── index.d.ts          type definitions for the API
│   ├── errors.js           SudoTypeError
│   ├── core/               API implementation (no printing, no process.exit)
│   ├── cli.js              command dispatcher
│   ├── utils.js            shared helpers
│   └── commands/           CLI adapters: run, build, init, check, tsconfig, doctor
├── templates/              basic, express, discord, cli
├── test/
│   ├── smoke.test.js       CLI tests
│   ├── api.test.js         programmatic API tests
│   └── types/              type-definition tests (tsc)
├── assets/                 README badges and graphics
├── CHANGELOG.md
├── CONTRIBUTING.md
├── icon/                   project icons
├── tsconfig.base.json
└── package.json
```

<h2 id="troubleshooting">Troubleshooting</h2>

<details>
<summary><b>esbuild fails to start</b></summary>
<br>

```sh
pkg upgrade
npm install -g @arraynothere/sudotype --force
sudotype doctor
```

</details>

<details>
<summary><b>Node.js version is too old</b></summary>
<br>

```sh
pkg upgrade nodejs
node --version      # must be 20.12 or newer
```

</details>

<details>
<summary><b><code>sudotype check</code> says TypeScript is not installed</b></summary>
<br>

`check` uses the TypeScript version of the current project:

```sh
npm install -D typescript @types/node
```

</details>

<details>
<summary><b>The Discord template says <code>Missing DISCORD_TOKEN</code> but my <code>.env</code> is filled in</b></summary>
<br>

`process.loadEnvFile()` needs Node.js 20.12 or newer. Check with `node --version` and upgrade if needed.

</details>

<details>
<summary><b><code>command not found: sudotype</code></b></summary>
<br>

```sh
npm config get prefix           # the bin folder must be in PATH
npm install -g @arraynothere/sudotype
```

</details>

<h2 id="windows">Windows notes</h2>

<ul>
  <li>Use PowerShell, Command Prompt or WSL. All commands work the same way.</li>
  <li><code>sudotype init --install</code> runs <code>npm.cmd</code> through the shell, so Node.js must be on your <code>PATH</code>.</li>
  <li>Press <code>Ctrl+C</code> to stop <code>run</code> and <code>watch</code>.</li>
</ul>

<h2 id="faq">FAQ</h2>

<details>
<summary><b>Why not Bun?</b></summary>
<br>
Bun does not run natively on Termux because it needs glibc. tsx and esbuild work on Android (Bionic) without extra layers.
</details>

<details>
<summary><b>Does it work outside Termux?</b></summary>
<br>
Yes. SudoType runs on any system with Node.js 20.12 or newer, including Linux, macOS and Windows. See <a href="#requirements">Supported platforms</a>.
</details>

<details>
<summary><b>Can I use SudoType from my own code?</b></summary>
<br>
Yes. <code>npm install @arraynothere/sudotype</code> and import the functions, see the <a href="#programmatic-api">Programmatic API</a>. The CLI is a thin layer on top of the same functions.
</details>

<details>
<summary><b>Do I need to install tsx or esbuild myself?</b></summary>
<br>
No. Both are dependencies of SudoType. <code>check</code> is the exception: it uses the <code>typescript</code> package of your own project.
</details>

<h2 id="contributing">Contributing</h2>

```sh
git clone https://github.com/arraynothere/sudotype.git
cd sudotype
npm install
npm test              # CLI and API tests
npm run test:types    # type definitions
node bin/sudotype.js doctor
```

Pull requests and issues are welcome at [github.com/arraynothere/sudotype](https://github.com/arraynothere/sudotype). Maintainers: see [CONTRIBUTING.md](CONTRIBUTING.md) for the release process.

<h2 id="changelog">Changelog</h2>

See [CHANGELOG.md](CHANGELOG.md) for release notes.

<h2 id="license">License</h2>

Released under the [MIT License](LICENSE).

<div align="center">
  <br>
  <sub>Made by <a href="https://github.com/arraynothere">Array</a></sub>
</div>
