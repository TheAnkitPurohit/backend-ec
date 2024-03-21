import chalk from 'chalk';
import mongoose from 'mongoose';

import config from '@/config';

import type { Connection } from 'mongoose';

const { DB_URI, NODE_ENV } = config;

if (NODE_ENV === 'production' && !DB_URI) {
  console.log(chalk.blue('THIS COMMAND IS NOT MADE FOR DEVELOPMENT'));
  console.log(chalk.red('SERVER ERROR - ENV NOT FOUND'));
  process.exit(0);
}

const mongooseInit = async (): Promise<Connection['db']> => {
  const res = await mongoose.connect(DB_URI);
  return res.connection.db;
};

export default mongooseInit;
