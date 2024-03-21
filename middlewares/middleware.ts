import path from 'node:path';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';

import config from '@/config';
import { rateLimiter } from '@/middlewares/common.middleware';
import { globalMiddleware as middleware } from '@/middlewares/global.middleware';
import i18nMiddleware from '@/middlewares/i18n.middleware';
import logger from '@/middlewares/logger.middleware';
import maintenanceMode from '@/middlewares/maintenance.middleware';
import { expressJsonParser, fileUploadParser } from '@/middlewares/parser.middleware';
import { isProduction, rootPath } from '@/utils/helper';

const { RATE_LIMIT } = config;
const app = express();

app.use(cors({ credentials: true, origin: true }));
app.options('*', cors());
app.set('view engine', 'pug');
app.set('views', path.join(rootPath, 'views'));
app.use(express.static(path.join(rootPath, 'public'))); // Serving static files

if (!isProduction) app.use(morgan('dev')); // Development logging
if (RATE_LIMIT === 'ON') app.use('/api', rateLimiter()); // Limit requests from same API

app.use(i18nMiddleware); // i18n middleware for localization
app.use(logger.accessLogger); // Winston Logger
app.use(helmet()); // Set security HTTP headers
app.use(expressJsonParser); // Body parser, convert rawBody into req.body json
app.use(cookieParser()); // Body parser, reading data from cookie
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(hpp()); // Prevent parameter pollution
app.use(compression()); // COMPRESS RESPONSE BODY
app.use(fileUploadParser); // file uploads

app.use(middleware); // to set global middleware
app.all('*', maintenanceMode); // Maintenance Mode

export default app;
