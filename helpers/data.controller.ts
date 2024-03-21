import constants from '@/constants/constants';
import fields from '@/helpers/fields.controller';
import mapFields from '@/helpers/rules.controller';
import { isObject } from '@/utils/helper';

import type { ActualFieldsKeys } from '@/types/helpers/fn.types';
import type { GetData } from '@/types/helpers/rules.types';

export const PREFIX = 'Data';

const getData: GetData = ({ prefix, pagination, data, extraFields, addFields }) => {
  const moduleName = constants.FORMAT(prefix) as Uppercase<Exclude<ActualFieldsKeys, 'pagination'>>;

  const rules =
    moduleName === PREFIX.toUpperCase() ? undefined : { ...fields[moduleName], ...addFields };

  if (moduleName) {
    if (pagination) {
      return {
        // ORDER MATTERS
        // @ts-expect-error data lossy type problem
        docs: data.docs.map(cur => mapFields(cur, rules)),
        ...extraFields,
        ...mapFields(data, fields.pagination),
      };
    }

    if (isObject(data)) return mapFields(data, rules);

    if (Array.isArray(data) && data.length) return data.map(cur => mapFields(cur, rules));

    return undefined;
  }

  return undefined;
};

export default getData;
