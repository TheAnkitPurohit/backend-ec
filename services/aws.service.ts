import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import querystring from 'query-string';

import config from '@/config';

import type {
  S3Delete,
  S3GeneratePath,
  S3Init,
  S3Upload,
  S3UploadSignedUrl,
} from '@/types/services/aws.types';
import type { DeleteObjectCommandInput, PutObjectCommandInput } from '@aws-sdk/client-s3';

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET: ENV_AWS_BUCKET,
  AWS_FOLDER: ENV_AWS_FOLDER,
  AWS_PRIVATE_BUCKET: ENV_AWS_PRIVATE_BUCKET,
  AWS_PRIVATE_FOLDER: ENV_AWS_PRIVATE_FOLDER,
} = config;

const s3Init: S3Init = isPublic => {
  const AWS_BUCKET = isPublic ? ENV_AWS_BUCKET : ENV_AWS_PRIVATE_BUCKET;
  const AWS_FOLDER = isPublic ? ENV_AWS_FOLDER : ENV_AWS_PRIVATE_FOLDER;

  const s3 = new S3Client({
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
    region: AWS_REGION,
  });

  return { s3, AWS_BUCKET, AWS_FOLDER };
};

const generatePath: S3GeneratePath = ({ file, path, AWS_FOLDER }) => {
  const { name } = file;
  const filename = `${new Date().getTime()}-${name}`;
  const documentPath = `${AWS_FOLDER}/${path}/${filename}`;

  const [, s3Path] = querystring.stringify({ url: documentPath }).split('=');
  return { documentPath, s3Path };
};

export const s3Upload: S3Upload = async (file, path, isPublic = true) => {
  try {
    const { s3, AWS_FOLDER, AWS_BUCKET } = s3Init(isPublic);
    const { data, mimetype } = file;
    const { documentPath, s3Path } = generatePath({ file, path, AWS_FOLDER });

    const params: PutObjectCommandInput = {
      Bucket: AWS_BUCKET,
      Key: documentPath,
      Body: data,
      ContentType: mimetype,
      ...(isPublic ? { ACL: 'public-read' } : null),
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
    return { path: s3Path };
  } catch (e) {
    console.log('AWS Upload File Error', e);
    return false;
  }
};

export const s3UploadSignedUrl: S3UploadSignedUrl = async (file, path, isPublic = true) => {
  try {
    const { s3, AWS_FOLDER, AWS_BUCKET } = s3Init(isPublic);
    const { expiresIn = 300 } = file;
    const { documentPath, s3Path } = generatePath({ file, path, AWS_FOLDER });

    const params: PutObjectCommandInput = {
      Bucket: AWS_BUCKET,
      Key: documentPath,
      ContentType: 'image/jpeg',
      ...(isPublic ? { ACL: 'public-read' } : null),
    };

    const command = new PutObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn });
    return { path: s3Path, url };
  } catch (e) {
    console.log('AWS Upload File Error', e);
    return false;
  }
};

export const s3Delete: S3Delete = async (file, isPublic = true) => {
  try {
    const { s3, AWS_BUCKET } = s3Init(isPublic);

    const params: DeleteObjectCommandInput = {
      Bucket: AWS_BUCKET,
      Key: decodeURIComponent(file),
    };

    const command = new DeleteObjectCommand(params);
    const response = await s3.send(command);
    return response.VersionId as string;
  } catch (e) {
    console.log('AWS Delete Error', e);
    return false;
  }
};
