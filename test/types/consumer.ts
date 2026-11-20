import {
  build,
  check,
  doctor,
  init,
  installDependencies,
  listTemplates,
  run,
  SudoTypeError,
  version,
  watch,
  writeTsconfig,
  type BuildResult,
  type DoctorReport,
  type TemplateName,
} from '@arraynothere/sudotype';

async function main(): Promise<void> {
  const v: string = version;
  const built: BuildResult = await build({ entry: 'src/index.ts', minify: true, format: 'esm' });
  const kb: number = built.size / 1024;

  const checked = await check({ args: ['--pretty', 'false'], silent: true });
  const ok: boolean = checked.success;

  const report: DoctorReport = await doctor();
  for (const c of report.checks) {
    const status: 'ok' | 'warn' | 'error' = c.status;
    void status;
  }

  const template: TemplateName = listTemplates()[0].name;
  const created = await init({ name: 'demo', template, git: false });
  const dir: string = created.directory;
  const installed: boolean = await installDependencies(dir, { silent: true });

  const tsconfigPath: string = writeTsconfig({ force: true }).path;

  const code: number = await run('src/index.ts', ['--port', '8080'], { stdio: 'pipe' });
  const ac = new AbortController();
  const done: Promise<number> = watch('src/index.ts', [], { signal: ac.signal, onSpawn: (child) => void child.pid });

  try {
    await build();
  } catch (err) {
    if (err instanceof SudoTypeError && err.code === 'ENTRY_NOT_FOUND') console.error(err.message);
  }

  void [v, kb, ok, installed, tsconfigPath, code, done];
}

// @ts-expect-error - unknown template names are rejected at compile time
void init({ name: 'x', template: 'nope' });
// @ts-expect-error - "name" is required
void init({});
// @ts-expect-error - unknown format
void build({ format: 'umd' });

void main();
