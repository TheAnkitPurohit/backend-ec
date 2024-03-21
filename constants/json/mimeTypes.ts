import type { MimeType, MimeTypes } from '@/types/constants.types';

const mimeTypes: Record<MimeType, MimeTypes> = {
  image: {
    mimeType: 'image/',
    included: true,
    excluded: ['image/svg+xml'],
  },
  video: {
    mimeType: 'video/',
    included: ['video/mp4'],
    excluded: [],
  },
};

export default mimeTypes;
