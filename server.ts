import chalk from 'chalk';

import config from '@/config';
import mongooseInit from '@/init/database';
import listener from '@/init/listener';
import Admin from '@/models/user/admin/admin.model';

// UNHANDLED EXCEPTION, WHEN FACE SOME DEVELOPER ERROR
process.on('uncaughtException', err => {
  console.log(chalk.blue(err.name, err.message));
  console.log(`${chalk.cyan('Uncaught Exception!')} ${chalk.gray('SHUTTING DOWN...')}`);
  process.exit(1);
});

mongooseInit()
  .then(async () => {
    console.log(chalk.yellow('DB Connected!'));

    (async () => {
      const email = config.ADMIN_EMAIL;
      const password = config.ADMIN_PASSWORD;

      try {
        const adminDetail = await Admin.findOne({
          email,
          isActive: true,
          isMainAdmin: true,
          isDeleted: false,
        });

        if (adminDetail) {
          return void console.log(chalk.yellow('Admin already exist!'));
        }

        await Admin.create({
          email,
          password,
          isMainAdmin: true,
          isActive: true,
        });
      } catch (error) {
        console.log({ error });
      }
    })();
  })
  .catch(err => console.log(chalk.red('DB Failed to connect -', err)));

const listen = listener();

// UNHANDLED REJECTION, WHEN FACE SOME PROGRAMMATIC ERROR
process.on('unhandledRejection', (err: Error) => {
  console.log(chalk.blue(err.name, err.message));
  console.log(`${chalk.cyan('Unhandled Rejection!')} ${chalk.gray('SHUTTING DOWN...')}`);
  listen.close(() => process.exit(1)); // 0 FOR SUCCESS & 1 FOR UNHANDLED SO CRASHED
});
