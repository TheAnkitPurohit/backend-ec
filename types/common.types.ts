import type { validator } from '@/utils/helper';
import type { Types } from 'mongoose';
import type { UnionToIntersection } from 'type-fest';

export type PrimitiveType = string | number | boolean;

export type Obj<T = unknown> = Record<string, T>;

export type NonNullish<T = unknown> = NonNullable<T>;

export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

export type ValidationType = Record<string, ReturnType<typeof validator>>;

export type RemoveUnderscore<T extends string> = T extends `${infer L1}_${infer L2}${infer R}`
  ? `${L1} ${L2}${RemoveUnderscore<R>}`
  : T;

export type CapitalizeStrict<T extends string> = T extends `${infer L1} ${infer R}`
  ? `${Capitalize<Lowercase<L1>>} ${CapitalizeStrict<R>}`
  : Capitalize<Lowercase<T>>;

export interface RecursiveType<T> {
  [key: string]: T | RecursiveType<T>;
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type ReverseObjType<T> = {
  [K in keyof T as T[K] extends string | number ? T[K] : never]: K;
};

export interface ObjectId {
  _id: Types.ObjectId;
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type AggregateType<T> = T & ObjectId;
