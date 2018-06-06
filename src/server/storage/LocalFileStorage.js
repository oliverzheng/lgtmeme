// @flow
// @format

import path from 'path';
import fs from 'fs-extra';
import tmp from 'tmp';

import {
  ALLOWED_EXTENSIONS,
  type Storage,
  type FileID,
  type LocalFilePath,
  type URL,
} from './index';

export default class LocalFileStorage implements Storage {
  _rootPath: string;
  _serverBaseUrl: string;

  constructor(rootDirAbsolutePath: string, serverBaseUrl: string) {
    this._rootPath = rootDirAbsolutePath;
    this._serverBaseUrl = serverBaseUrl;
  }

  getRootPath(): string {
    return this._rootPath;
  }

  async putFile(localFilepath: LocalFilePath): Promise<FileID> {
    const ext = path.extname(localFilepath);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new Error(
        `Cannot store file with non-whitelisted extension: ${ext}`,
      );
    }

    // Allocate the tmp file first to make sure our filename won't get taken by
    // someone else
    const tmpobj = tmp.fileSync({
      dir: this._rootPath,
      prefix: 'image_',
      postfix: ext,
      discardDescriptor: true,
      keep: true,
    });

    fs.copySync(localFilepath, tmpobj.name);
    return path.basename(tmpobj.name);
  }

  async getFileUrl(fileID: FileID): Promise<URL> {
    if (path.dirname(fileID) !== '.') {
      throw new Error('Must be a file name without path');
    }
    return `${this._serverBaseUrl}/${fileID}`;
  }
}
