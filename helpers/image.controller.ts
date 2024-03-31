import fs from 'node:fs';
import path from 'node:path';

import multer from 'multer';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/');
  },
  filename(req, file, cb) {
    console.log({ file });
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

export const deleteUploadedFile = (filename: string | undefined): void => {
  if (!filename) return void console.error('Filename is required');

  const filePath = path.join('public/', filename);
  fs.unlink(filePath, err => {
    if (err) {
      return void console.error('Error deleting file:', err);
    }
    return void console.log('File deleted successfully');
  });
};
