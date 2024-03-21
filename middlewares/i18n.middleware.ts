import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';

import { rootPath } from '@/utils/helper';

import type { FsBackendOptions } from 'i18next-fs-backend';

const languages = ['en', 'de'];

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init<FsBackendOptions>({
    initImmediate: false,
    backend: {
      loadPath: `${rootPath}/locales/{{lng}}.json`,
      addPath: `${rootPath}/locales/{{lng}}.missing.json`,
    },
    detection: {
      order: ['querystring', 'cookie'],
      caches: ['cookie'],
    },
    fallbackLng: languages,
    preload: languages,
    saveMissing: true,
    saveMissingTo: 'all',
    parseMissingKeyHandler: (key, defaultValue) =>
      `${key} is ${defaultValue} so please update the localization`,
    missingInterpolationHandler: () => '{{variable is undefined}}',
  });

const i18nMiddleware = i18nextMiddleware.handle(i18next);

export default i18nMiddleware;
