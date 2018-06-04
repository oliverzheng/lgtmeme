// @flow
// @format

/* eslint import/prefer-default-export: 0 */

export type FileID = string;
export type LocalFilePath = string;
export type URL = string;

export interface Storage {
  putFile(localFilepath: LocalFilePath): Promise<FileID>;
  getFileUrl(fileID: FileID): Promise<URL>;
}

export const ALLOWED_EXTENSIONS = ['.gif', '.jpg', '.jpeg', '.png'];
