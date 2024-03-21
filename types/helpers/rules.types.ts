import type { RecursiveType } from '@/types/common.types';
import type { FieldsKeysWithData, OrgData, ResOptions, RulesData } from '@/types/helpers/fn.types';

export type MapFields = (obj: RulesData, field: RecursiveType<boolean> | undefined) => RulesData;

export interface GetDataParams
  extends Pick<ResOptions, 'pagination' | 'extraFields' | 'addFields'> {
  prefix: FieldsKeysWithData;
  data: OrgData;
}

export type GetData = (args: GetDataParams) => RulesData | undefined;
