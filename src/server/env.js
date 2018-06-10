// @flow
// @format

import nullthrows from 'nullthrows';
import {config} from 'dotenv';

config();

export const {DEBUG_SERVER_PORT} = process.env;

export const MONGODB_HOST: string = nullthrows(process.env.MONGODB_HOST);
export const MONGODB_PORT: string = nullthrows(process.env.MONGODB_PORT);
export const MONGODB_USER: string = nullthrows(process.env.MONGODB_USER);
export const MONGODB_PASS: string = nullthrows(process.env.MONGODB_PASS);
export const MONGODB_DB: string = nullthrows(process.env.MONGODB_DB);

export const S3_BUCKET_NAME = nullthrows(process.env.S3_BUCKET_NAME);
export const S3_REGION = nullthrows(process.env.S3_REGION);
export const S3_ACCESS_KEY_ID = nullthrows(process.env.S3_ACCESS_KEY_ID);
export const S3_SECRET_ACCESS_KEY = nullthrows(
  process.env.S3_SECRET_ACCESS_KEY,
);
