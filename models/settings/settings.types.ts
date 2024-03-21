import type { AggregatePaginateModel, Model } from 'mongoose';

export interface SettingsSchema {
  type: string;
  isSiteInMaintenance: boolean;
}

type SettingsStatics = AggregatePaginateModel<SettingsSchema>;

export type SettingsCoreModel = Model<SettingsSchema>;

export type SettingsModel = SettingsCoreModel & SettingsStatics;
