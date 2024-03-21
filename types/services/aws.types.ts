import type { S3Client } from '@aws-sdk/client-s3';
import type { UploadedFile } from 'express-fileupload';

export interface S3InitOutput {
  s3: S3Client;
  AWS_FOLDER: string;
  AWS_BUCKET: string;
}

export type S3Init = (isPublic: boolean) => S3InitOutput;

interface SignedFile {
  name: string;
  mimetype?: string;
  expiresIn?: number;
}

interface S3GeneratePathInput extends Pick<S3InitOutput, 'AWS_FOLDER'> {
  file: UploadedFile | SignedFile;
  path: string;
}

interface S3GeneratePathOutput {
  documentPath: string;
  s3Path: string;
}

export type S3GeneratePath = (input: S3GeneratePathInput) => S3GeneratePathOutput;

interface S3UploadOutput {
  path: string;
  url: string;
}

type S3UploadCore<T, O> = (file: T, path: string, isPublic?: boolean) => Promise<O | false>;

export type S3Upload = S3UploadCore<UploadedFile, Omit<S3UploadOutput, 'url'>>;

export type S3UploadSignedUrl = S3UploadCore<SignedFile, S3UploadOutput>;

export type S3Delete = (file: string) => Promise<string | false>;
