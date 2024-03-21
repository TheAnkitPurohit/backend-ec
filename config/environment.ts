import type { EnvironmentTypes } from '@/types/config.types';

const environment: EnvironmentTypes = {
  common: '.env',
  development: '.env.development',
  production: '.env.production',
};

// DON'T IMPORT ANYTHING HERE EXCEPT TYPES DUE TO ESM MODULES LIMITATION
const env = (): string => {
  const { NODE_ENV = 'development', ENV_NAME = 'development' } = process.env;

  if (NODE_ENV === 'production') return environment[ENV_NAME as keyof EnvironmentTypes];
  return environment[NODE_ENV as keyof EnvironmentTypes];
};

export default env;
