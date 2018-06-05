// @flow
// @format

import {type Storage, type FileID, type LocalFilePath, type URL} from '../';

const mockStorage: Storage = {
  async putFile(_: LocalFilePath): Promise<FileID> {
    return 'fileID';
  },

  async getFileUrl(_: FileID): Promise<URL> {
    return 'http://lgtmeme.com/fileID.jpg';
  },
};

export default mockStorage;
