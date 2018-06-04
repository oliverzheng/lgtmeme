// @flow
// @format

import nullthrows from 'nullthrows';
import {config} from 'dotenv';

config();

export default {
  SERVER_PORT: nullthrows(process.env.LOCAL_FILE_SERVER_PORT),
  ROOT_DIR: nullthrows(process.env.LOCAL_FILE_SERVER_ROOT_DIR),
};
