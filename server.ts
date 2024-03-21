import chalk from 'chalk';

import mongooseInit from '@/init/database';
import listener from '@/init/listener';

// UNHANDLED EXCEPTION, WHEN FACE SOME DEVELOPER ERROR
process.on('uncaughtException', err => {
  console.log(chalk.blue(err.name, err.message));
  console.log(`${chalk.cyan('Uncaught Exception!')} ${chalk.gray('SHUTTING DOWN...')}`);
  process.exit(1);
});

mongooseInit()
  .then(() => console.log(chalk.yellow('DB Connected!')))
  .catch(err => console.log(chalk.red('DB Failed to connect -', err)));

const listen = listener();

// UNHANDLED REJECTION, WHEN FACE SOME PROGRAMMATIC ERROR
process.on('unhandledRejection', (err: Error) => {
  console.log(chalk.blue(err.name, err.message));
  console.log(`${chalk.cyan('Unhandled Rejection!')} ${chalk.gray('SHUTTING DOWN...')}`);
  listen.close(() => process.exit(1)); // 0 FOR SUCCESS & 1 FOR UNHANDLED SO CRASHED
});
