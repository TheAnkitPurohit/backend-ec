import { Schema, model } from 'mongoose';

import { schemaOptions } from '@/models/shared/schema';

import type {
  SettingsCoreModel,
  SettingsModel,
  SettingsSchema,
} from '@/models/settings/settings.types';

const settingsSchema = new Schema<SettingsSchema, SettingsCoreModel>(
  {
    type: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    isSiteInMaintenance: {
      type: Boolean,
      required: true,
    },
  },
  schemaOptions
);

const Settings = model<SettingsSchema, SettingsModel>('Settings', settingsSchema);

export default Settings;
