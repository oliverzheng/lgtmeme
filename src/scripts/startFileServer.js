// @flow
// @format

import {createServer} from 'http-server';
import path from 'path';
import mkdirp from 'mkdirp';
import appRoot from 'app-root-path';

import LocalFileStorageConfig from '../server/storage/LocalFileStorageConfig';

const HOST = '0.0.0.0';
const PORT = LocalFileStorageConfig.SERVER_PORT;
const DIR = path.join(appRoot.toString(), LocalFileStorageConfig.ROOT_DIR);

mkdirp.sync(DIR);

const server = createServer({root: DIR});
server.listen(PORT, HOST, () => {
  console.log(`Listening on ${HOST}:${PORT}, serving ${DIR}`);
});
