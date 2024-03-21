/* eslint-disable */
// @ts-nocheck
import config from '@/config';
import { isObject } from '@/utils/helper';

import type { MapFields } from '@/types/helpers/rules.types';

const { RULES_MODE } = config;

const mapFields: MapFields = (obj, field) => {
  if (!field || RULES_MODE === 'OFF') return obj; // IN DATA CONDITION

  return Object.fromEntries(
    Object.entries(
      Object.entries(field).reduce((acc, [key, val]) => {
        if (!isObject(val) && val) {
          acc[key] = obj[key] === 0 || obj[key] || typeof obj[key] === 'boolean' ? obj[key] : null;
        }

        if (isObject(val)) {
          if (!obj[key]) {
            acc[key] = obj[key];
            return acc;
          }

          acc[key] = Array.isArray(obj[key])
            ? obj[key].map(cur => mapFields(cur, val))
            : mapFields(obj[key], val);
        }

        return acc;
      }, {})
    ).sort()
  );
};

export default mapFields;
