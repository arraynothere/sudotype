import type { ChildProcess } from 'node:child_process';

/** Installed SudoType version, e.g. `"1.1.0"`. */
export declare const version: string;

/** Names of the built-in project templates. */
export type TemplateName = 'basic' | 'express' | 'discord' | 'cli';

/** Module format of a bundle. */
export type BuildFormat = 'esm' | 'cjs';

/** Stable identifiers for `SudoTypeError.code`. */
export type SudoTypeErrorCode =
  | 'SUDOTYPE_ERROR'
  | 'ENTRY_NOT_FOUND'
  | 'ESBUILD_UNAVAILABLE'
  | 'INVALID_FORMAT'
  | 'BUILD_FAILED'
  | 'TYPESCRIPT_NOT_INSTALLED'
  | 'SPAWN_FAILED'
  | 'ABORTED'
  | 'INVALID_NAME'
  | 'UNKNOWN_TEMPLATE'
  | 'DIRECTORY_NOT_EMPTY'
  | 'TEMPLATE_MISSING'
  | 'TSCONFIG_EXISTS'
  | 'TSX_NOT_FOUND'
  | 'INVALID_ARGUMENT'
  | 'FILE_NOT_FOUND';

/** Error thrown (or used as rejection) by every SudoType API function. */
export declare class SudoTypeError extends Error {
  readonly name: 'SudoTypeError';
  /** Stable identifier you can branch on. */
  readonly code: SudoTypeErrorCode;
  /** The underlying error, when there is one. */
  cause?: unknown;
  constructor(message: string, code?: SudoTypeErrorCode, options?: { cause?: unknown });
}

/* ------------------------------------------------------------------ build */

export interface BuildOptions {
  /** Entry file, relative to `cwd`. Default: `"src/index.ts"`. */
  entry?: string;
  /** Output file, relative to `cwd`. Default: `dist/<name>.js` (`.cjs`/`.mjs` when the format differs from `"type"`). */
  out?: string;
  /** Output format. Default: based on the `"type"` field of `package.json`. */
  format?: BuildFormat;
  /** esbuild target. Default: `"node20"`. */
  target?: string;
  /** Minify the output. Default: `false`. */
  minify?: boolean;
  /** Emit a source map. Default: `false`. */
  sourcemap?: boolean;
  /** Also bundle `node_modules` into the output. Default: `false` (dependencies stay external). */
  bundleDeps?: boolean;
  /** Working directory. Default: `process.cwd()`. */
  cwd?: string;
  /** esbuild log level. Default: `"silent"`. */
  logLevel?: 'silent' | 'error' | 'warning' | 'info';
}

export interface BuildResult {
  /** Absolute path of the entry file. */
  entry: string;
  /** Absolute path of the generated file. */
  outfile: string;
  format: BuildFormat;
  /** Size of the output in bytes. */
  size: number;
  /** Build time in milliseconds. */
  duration: number;
}

/** Bundle a TypeScript entry file to JavaScript with esbuild. */
export declare function build(options?: BuildOptions): Promise<BuildResult>;

/* ------------------------------------------------------------------ check */

export interface CheckOptions {
  /** Project directory. Default: `process.cwd()`. */
  cwd?: string;
  /** Extra arguments passed to `tsc` (after `--noEmit`). */
  args?: string[];
  /** Capture tsc output in `result.output` instead of printing it. Default: `false`. */
  silent?: boolean;
}

export interface CheckResult {
  /** `true` when tsc found no type errors. */
  success: boolean;
  /** Exit code of tsc. */
  exitCode: number;
  /** Captured tsc output (empty unless `silent` is `true`). */
  output: string;
}

/** Type-check a project with its own TypeScript (`tsc --noEmit`). */
export declare function check(options?: CheckOptions): Promise<CheckResult>;

/* ----------------------------------------------------------------- doctor */

export interface DoctorOptions {
  /** Project directory used to look for `typescript`. Default: `process.cwd()`. */
  cwd?: string;
}

export interface DoctorCheck {
  id: 'node' | 'esbuild' | 'tsx' | 'typescript' | 'git';
  /** `error` counts as a problem, `warn` does not. */
  status: 'ok' | 'warn' | 'error';
  message: string;
  /** Suggested fix, when there is one. */
  hint?: string;
}

export interface DoctorReport {
  platform: string;
  arch: string;
  /** `true` when running inside Termux. */
  termux: boolean;
  /** `true` when no check has status `error`. */
  ok: boolean;
  /** Number of checks with status `error`. */
  problems: number;
  checks: DoctorCheck[];
}

/** Inspect the environment. Never exits the process. */
export declare function doctor(options?: DoctorOptions): Promise<DoctorReport>;

/* ------------------------------------------------------------------- init */

export interface InitOptions {
  /** Project name (also the directory name): lowercase letters, numbers, `.`, `-`, `_`. */
  name: string;
  /** Template to use. Default: `"basic"`. */
  template?: TemplateName;
  /** Parent directory. Default: `process.cwd()`. */
  cwd?: string;
  /** Run `git init`. Default: `true`. */
  git?: boolean;
  /** Run `npm install` after scaffolding. Default: `false`. */
  install?: boolean;
  /** Hide npm output when `install` is `true`. Default: `false`. */
  silent?: boolean;
}

export interface InitResult {
  name: string;
  template: TemplateName;
  /** Absolute path of the new project. */
  directory: string;
  /** `true` when `install` was requested and npm succeeded. */
  installed: boolean;
}

export interface TemplateInfo {
  name: TemplateName;
  description: string;
}

/** Scaffold a new project from a template. */
export declare function init(options: InitOptions): Promise<InitResult>;

/** List the available project templates. */
export declare function listTemplates(): TemplateInfo[];

/** Run `npm install` inside `directory`. Resolves to `true` on success. */
export declare function installDependencies(directory: string, options?: { silent?: boolean }): Promise<boolean>;

/* --------------------------------------------------------------- tsconfig */

export interface TsconfigOptions {
  /** Project directory. Default: `process.cwd()`. */
  cwd?: string;
  /** Overwrite an existing `tsconfig.json`. Default: `false`. */
  force?: boolean;
}

/** Write the recommended `tsconfig.json`. Returns its absolute path. */
export declare function writeTsconfig(options?: TsconfigOptions): { path: string };

/* -------------------------------------------------------------- run/watch */

export interface RunOptions {
  /** Working directory. Default: `process.cwd()`. */
  cwd?: string;
  /** Environment variables for the child process. Default: `process.env`. */
  env?: NodeJS.ProcessEnv;
  /** Child stdio. Default: `"inherit"`. */
  stdio?: 'inherit' | 'pipe' | 'ignore';
  /** Abort signal that stops the child process. */
  signal?: AbortSignal;
  /** Called with the child process right after it starts. */
  onSpawn?: (child: ChildProcess) => void;
}

/** Run a TypeScript file with tsx. Resolves to the exit code. */
export declare function run(file: string, args?: string[], options?: RunOptions): Promise<number>;

/** Run a TypeScript file and restart on changes. Resolves to the exit code when stopped. */
export declare function watch(file: string, args?: string[], options?: RunOptions): Promise<number>;
