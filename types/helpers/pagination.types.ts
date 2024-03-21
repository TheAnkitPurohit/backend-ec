import type { PrimitiveType } from '@/types/common.types';
import type { MomentInput } from 'moment/moment';
import type { PipelineStage, Types } from 'mongoose';

type AggregationMatch = PipelineStage.Match['$match'];

type AggregationSort = PipelineStage.Sort['$sort'];

type ParamsType = PrimitiveType | Types.ObjectId | undefined;

export type MakeParams = (
  obj: Partial<Record<string, ParamsType | (() => ParamsType)>>
) => PipelineStage.Match[];

export type MakeSearchParams = (search?: string, fields?: string) => AggregationMatch;

export type MakeDateParams = (
  dateField?: string,
  startDate?: MomentInput,
  endDate?: MomentInput
) => AggregationMatch;

export type MakeSortParams = (sort?: AggregationSort[string], sortBy?: string) => AggregationSort;
