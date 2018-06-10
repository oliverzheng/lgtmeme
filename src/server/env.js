// @flow
// @format

import nullthrows from 'nullthrows';
import {config} from 'dotenv';

import envJSON from './env.json';

config();

export const SERVER_PORT: string = nullthrows(process.env.SERVER_PORT);

export const MONGODB_HOST: string =
  envJSON.MONGODB_HOST || nullthrows(process.env.MONGODB_HOST);
export const MONGODB_PORT: string =
  envJSON.MONGODB_PORT || nullthrows(process.env.MONGODB_PORT);
export const MONGODB_USER: string =
  envJSON.MONGODB_USER || nullthrows(process.env.MONGODB_USER);
export const MONGODB_PASS: string =
  envJSON.MONGODB_PASS || nullthrows(process.env.MONGODB_PASS);
export const MONGODB_DB: string =
  envJSON.MONGODB_DB || nullthrows(process.env.MONGODB_DB);

export const S3_BUCKET_NAME: string =
  envJSON.S3_BUCKET_NAME || nullthrows(process.env.S3_BUCKET_NAME);
export const S3_REGION: string =
  envJSON.S3_REGION || nullthrows(process.env.S3_REGION);
export const S3_ACCESS_KEY_ID: string =
  envJSON.S3_ACCESS_KEY_ID || nullthrows(process.env.S3_ACCESS_KEY_ID);
export const S3_SECRET_ACCESS_KEY: string =
  envJSON.S3_SECRET_ACCESS_KEY || nullthrows(process.env.S3_SECRET_ACCESS_KEY);
