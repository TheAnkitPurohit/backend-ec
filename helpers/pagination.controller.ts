import moment from 'moment';

import { escapeRegex } from '@/utils/helper';

import type {
  MakeDateParams,
  MakeParams,
  MakeSearchParams,
  MakeSortParams,
} from '@/types/helpers/pagination.types';

// Get Object and execute all values and return array
export const makeParams: MakeParams = obj =>
  Object.entries(obj).reduce<ReturnType<MakeParams>>((acc, [key, val]) => {
    const value = val instanceof Function ? val() : val;
    acc.push({ $match: value !== undefined ? { [key]: value } : {} });
    return acc;
  }, []);

// Get search text and fields array and return aggregate pipeline
export const makeSearchParams: MakeSearchParams = (search, fields) => {
  if (search && fields) {
    const searchFields = fields.split(',').map(cur => cur.trim());

    return {
      $expr: {
        $or: searchFields.map(val => ({
          $regexFind: {
            input: `$${val}`,
            regex: new RegExp(escapeRegex(search), 'i'),
          },
        })),
      },
    };
  }

  return {};
};

export const makeSortParams: MakeSortParams = (sort, sortBy) => {
  if (sort && sortBy) return { [sortBy]: sort };
  return { createdAt: -1 };
};

export const makeDateParams: MakeDateParams = (dateField, startDate, endDate) => {
  if (startDate && endDate) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const field = dateField || 'createdAt';

    return {
      [field]: {
        $gte: moment(startDate).toDate(),
        $lte: moment(endDate).toDate(),
      },
    };
  }

  return {};
};
