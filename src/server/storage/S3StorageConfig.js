// @flow
// @format

import nullthrows from 'nullthrows';
import {config} from 'dotenv';

config();

export default {
  BUCKET_NAME: nullthrows(process.env.S3_BUCKET_NAME),
  REGION: nullthrows(process.env.S3_REGION),
  ACCESS_KEY_ID: nullthrows(process.env.S3_ACCESS_KEY_ID),
  SECRET_ACCESS_KEY: nullthrows(process.env.S3_SECRET_ACCESS_KEY),
};
