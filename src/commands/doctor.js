'use strict';
const { log, color } = require('../utils');
const { doctor } = require('../core/doctor');

module.exports = async function doctorCommand() {
  const report = await doctor();

  console.log(color.bold('SudoType environment check\n'));
  console.log(`  platform : ${report.platform} (${report.arch})`);
  console.log(`  termux   : ${report.termux ? 'yes' : 'no'}\n`);

  for (const c of report.checks) {
    (c.status === 'ok' ? log.ok : c.status === 'warn' ? log.warn : log.error)(c.message);
    if (c.hint) log.warn(c.hint);
  }

  console.log(report.problems ? color.red(`\n${report.problems} problem(s) found.`) : color.green('\nAll good!'));
  process.exit(report.ok ? 0 : 1);
};
