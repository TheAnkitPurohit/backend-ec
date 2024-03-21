import type { types } from '@/constants/json';

export type PlatformTypeLabel = keyof typeof types;

export type PlatformType = (typeof types)[PlatformTypeLabel];

export type MimeType = 'image' | 'video';

export interface MimeTypes {
  mimeType: string;
  included: true | string[];
  excluded: string[];
}
