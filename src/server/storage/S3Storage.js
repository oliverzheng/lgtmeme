// @flow
// @format

import path from 'path';
import uuidv4 from 'uuid/v4';
import s3 from 's3';

import {
  ALLOWED_EXTENSIONS,
  type Storage,
  type FileID,
  type LocalFilePath,
  type URL,
} from './index';

export default class S3Storage implements Storage {
  _client: Object;
  _region: string;
  _bucket: string;

  constructor(
    bucketName: string,
    region: string,
    accessKeyID: string,
    secretAccessKey: string,
  ) {
    this._client = s3.createClient({
      s3Options: {
        accessKeyId: accessKeyID,
        secretAccessKey,
        region,
      },
    });
    this._region = region;
    this._bucket = bucketName;
  }

  async putFile(localFilepath: LocalFilePath): Promise<FileID> {
    const ext = path.extname(localFilepath);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new Error(
        `Cannot store file with non-whitelisted extension: ${ext}`,
      );
    }

    const filename = uuidv4() + ext;
    return new Promise((resolve, reject) => {
      const uploader = this._client.uploadFile({
        localFile: localFilepath,
        s3Params: {
          Bucket: this._bucket,
          Key: filename,
          ACL: 'public-read',
        },
      });
      uploader.on('error', err => {
        reject(err);
      });
      uploader.on('end', () => {
        resolve(filename);
      });
    });
  }

  async getFileUrl(fileID: FileID): Promise<URL> {
    return s3.getPublicUrl(this._bucket, fileID, this._region);
  }
}
