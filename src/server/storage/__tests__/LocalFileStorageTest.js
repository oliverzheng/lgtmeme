// @flow
// @format

import fs from 'fs';
import path from 'path';
import tmp from 'tmp';

import LocalFileStorage from '../LocalFileStorage';

const SERVER_BASE_PATH = 'http://myman.com/files';

describe('LocalFileStorage', () => {
  let rootDirPath: string;
  let removeTmpDir: () => void;
  let localFileStorage: LocalFileStorage;

  beforeEach(() => {
    const {name, removeCallback} = tmp.dirSync({
      discardDescriptor: true,
      unsafeCleanup: true,
    });
    rootDirPath = name;
    removeTmpDir = removeCallback;

    localFileStorage = new LocalFileStorage(rootDirPath, SERVER_BASE_PATH);
  });

  afterEach(() => {
    removeTmpDir();
  });

  test('can put file', async () => {
    const localFilepath = `${__dirname}/__fixtures__/herpderp.png`;
    const storedFilepath = await localFileStorage.putFile(localFilepath);

    expect(path.dirname(storedFilepath)).toEqual(rootDirPath);

    const filenames = fs.readdirSync(rootDirPath);
    expect(filenames).toHaveLength(1);
    expect(filenames[0]).toEqual(expect.stringMatching(/\.png$/));

    const localFileSize = fs.statSync(localFilepath).size;
    const storedFileSize = fs.statSync(storedFilepath).size;
    expect(storedFileSize).toEqual(localFileSize);
  });

  test('cannot upload non images', async () => {
    const nonsense = `${__dirname}/__fixtures__/plyometrics.mp4`;
    await expect(localFileStorage.putFile(nonsense)).rejects.toThrow();
  });

  test('can get file', async () => {
    const localFilepath = `${__dirname}/__fixtures__/herpderp.png`;
    const storedFilepath = await localFileStorage.putFile(localFilepath);

    const url = await localFileStorage.getFileUrl(storedFilepath);
    expect(url).toEqual(
      expect.stringMatching(new RegExp(`^${SERVER_BASE_PATH}`)),
    );
    expect(url).toEqual(
      expect.stringMatching(new RegExp(`${path.basename(storedFilepath)}$`)),
    );
  });

  test('can not get nonsense file', async () => {
    const localFilepath = `${__dirname}/__fixtures__/herpderp.png`;
    await localFileStorage.putFile(localFilepath);

    await expect(
      localFileStorage.getFileUrl('/definitely/wont/exist.gif'),
    ).rejects.toThrow();
  });
});
