// @flow
// @format

import path from 'path';
import appRoot from 'app-root-path';

import {connect, getConnection, urlWithoutPassword} from './db';
import createApp from './app';
import {SERVER_PORT} from './env';

// TODO switch on some env variable for the storage
import LocalFileStorage from './storage/LocalFileStorage';
import LocalFileStorageConfig from './storage/LocalFileStorageConfig';

const HOST = '127.0.0.1';
const PORT = LocalFileStorageConfig.SERVER_PORT;
const DIR = path.join(appRoot.toString(), LocalFileStorageConfig.ROOT_DIR);
const localFileStorage = new LocalFileStorage(DIR, `http://${HOST}:${PORT}`);

async function start() {
  await connect();
  console.log(`Connected to MongoDB at ${urlWithoutPassword}.`); // eslint-disable-line no-console

  createApp(getConnection(), localFileStorage).listen(
    SERVER_PORT,
    () => console.log(`Listening on ${SERVER_PORT}.`), // eslint-disable-line no-console
  );
}

start();
