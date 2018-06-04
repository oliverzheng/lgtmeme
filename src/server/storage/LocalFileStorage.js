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
      postfix: ext,
      discardDescriptor: true,
      keep: true,
    });

    fs.copySync(localFilepath, tmpobj.name);
    return tmpobj.name;
  }

  async getFileUrl(fileID: FileID): Promise<URL> {
    const dirname = path.dirname(fileID);
    if (dirname !== this._rootPath) {
      throw new Error(
        `Unmatching base fileID: expected ${this._rootPath}, got ${dirname}`,
      );
    }
    const basename = path.basename(fileID);
    return `${this._serverBaseUrl}/${basename}`;
  }
}
