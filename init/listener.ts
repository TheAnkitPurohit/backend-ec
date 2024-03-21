import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';

import app from '@/app';
import config from '@/config';
import { rootPath } from '@/utils/helper';

import type { Server as HttpServer } from 'node:http';

const { PORT, SECURE_MODE } = config;

const listener = (): HttpServer => {
  const port = PORT || 8000;

  const log = () => console.log(`Hello From Port ${port}`);

  if (SECURE_MODE === 'ON') {
    const options = {
      key: fs.readFileSync(path.join(rootPath, 'certificates', 'private.key'), 'utf8'),
      cert: fs.readFileSync(path.join(rootPath, 'certificates', 'public.cert'), 'utf8'),
    };

    return https.createServer(options, app).listen(port, log);
  }

  return app.listen(port, log);
};

export default listener;
