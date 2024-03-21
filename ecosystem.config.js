module.exports = {
  apps: [
    {
      name: 'server',
      script: 'server.ts',
      interpreter: './node_modules/.bin/ts-node',
      interpreter_args: '-P ./tsconfig.json',
    },
  ],
};
