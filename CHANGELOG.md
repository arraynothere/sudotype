# Changelog

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
