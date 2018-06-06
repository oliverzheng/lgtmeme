// @flow
// @format

import fs from 'fs';
import path from 'path';
import tmp from 'tmp';

import LocalFileStorage from '../LocalFileStorage';

const SERVER_BASE_PATH = 'http://myman.com/files';

const HERPDERP_FILEPATH = `${__dirname}/../../__tests__/__fixtures__/herpderp.png`;

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
    const storedFilename = await localFileStorage.putFile(HERPDERP_FILEPATH);

    // Should only be a single file name without path
    expect(path.dirname(storedFilename)).toEqual('.');

    const filenames = fs.readdirSync(rootDirPath);
    expect(filenames).toHaveLength(1);
    expect(filenames[0]).toEqual(expect.stringMatching(/\.png$/));

    const localFileSize = fs.statSync(HERPDERP_FILEPATH).size;
    const storedFileSize = fs.statSync(path.join(rootDirPath, storedFilename))
      .size;

    expect(storedFileSize).toEqual(localFileSize);
  });

  test('cannot upload non images', async () => {
    const nonsense = `${__dirname}/__fixtures__/plyometrics.mp4`;
    await expect(localFileStorage.putFile(nonsense)).rejects.toThrow();
  });

  test('can get file', async () => {
    const storedFilename = await localFileStorage.putFile(HERPDERP_FILEPATH);

    const url = await localFileStorage.getFileUrl(storedFilename);
    expect(url).toEqual(
      expect.stringMatching(new RegExp(`^${SERVER_BASE_PATH}`)),
    );
    expect(url).toEqual(
      expect.stringMatching(new RegExp(`${path.basename(storedFilename)}$`)),
    );
  });

  test('can not get nonsense file', async () => {
    await localFileStorage.putFile(HERPDERP_FILEPATH);

    await expect(
      localFileStorage.getFileUrl('/definitely/wont/exist.gif'),
    ).rejects.toThrow();
  });
});
