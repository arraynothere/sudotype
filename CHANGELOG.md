# Changelog

## 1.1.1
- Release workflow fix: npm publish now authenticates with NPM_TOKEN.

## 1.1.0
- New: typed programmatic API. `import { build, check, doctor, init, listTemplates, installDependencies, writeTsconfig, run, watch, SudoTypeError, version } from "sudotype"` (ESM and CommonJS).
- New: bundled type definitions (`src/index.d.ts`) and an `exports` map. `package.json` `main` now points to the API instead of the CLI.
- New: `SudoTypeError` with stable `code` values.
- The npm package is published as `@arraynothere/sudotype` (the unscoped name was taken). The CLI command is still `sudotype`; install with `npm install -g @arraynothere/sudotype`.
- CLI behaviour is unchanged. Commands are now thin adapters over `src/core/`, which never prints or calls `process.exit()`.
- Fix: `init` template prompt accepts names and numbers, and reports invalid choices clearly.
- Fix: `--help` works for every command.
- Fix: `doctor` no longer crashes when a dependency's `package.json` is unreadable.
- Help text and README now say "any environment" instead of "Termux & Android".
- README: Programmatic API section, error code table, corrected default output extension.
- CI: type-definition tests (`npm run test:types`).

## 1.0.1
- Fix: `init --install` now works on Windows.
- Raise minimum Node.js to 20.12 (required by the `discord` template, Node 18 is EOL). Default build target is now `node20`.
- `doctor` checks the Node.js minor version.
- Replace placeholder author in `LICENSE` and placeholder links in template READMEs.
- CI runs on Ubuntu, macOS and Windows with Node.js 20, 22 and 24.
- README: platform table, `npx`, update/uninstall, Windows notes, "Why SudoType?"; release steps moved to `CONTRIBUTING.md`.
- More tests (`tsconfig`, `init` edge cases, `build`, `doctor`).

## 1.0.0
- Initial release: `run`, `watch`, `build`, `init`, `check`, `tsconfig`, `doctor`.
- Templates: basic, express, discord, cli.
