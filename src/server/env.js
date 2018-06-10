// @flow
// @format

import nullthrows from 'nullthrows';
import {config} from 'dotenv';

config();

export const {DEBUG_SERVER_PORT} = process.env;

// All the PROD_ prefixes are for netlify's environment.
// This is all because Netlify does not support environment variables at
// runtime. It does support loading environment variables from netlify.toml,
// which means we'll have to write to it at build time on each deploy. However,
// the dev environment also uses netlify.toml but we don't want to modify
// netlify.toml in dev. Thus, we have 2 variables for each value - one that is
// used at dev time populated by .env, and one used on Netlify, populated by
// netlify.toml and the script that writes to it.

export const MONGODB_HOST: string = nullthrows(
  process.env.MONGODB_HOST || process.env.PROD_MONGODB_HOST,
);
export const MONGODB_PORT: string = nullthrows(
  process.env.MONGODB_PORT || process.env.PROD_MONGODB_PORT,
);
export const MONGODB_USER: string = nullthrows(
  process.env.MONGODB_USER || process.env.PROD_MONGODB_USER,
);
export const MONGODB_PASS: string = nullthrows(
  process.env.MONGODB_PASS || process.env.PROD_MONGODB_PASS,
);
export const MONGODB_DB: string = nullthrows(
  process.env.MONGODB_DB || process.env.PROD_MONGODB_DB,
);

export const S3_BUCKET_NAME = nullthrows(
  process.env.S3_BUCKET_NAME || process.env.PROD_S3_BUCKET_NAME,
);
export const S3_REGION = nullthrows(
  process.env.S3_REGION || process.env.PROD_S3_REGION,
);
export const S3_ACCESS_KEY_ID = nullthrows(
  process.env.S3_ACCESS_KEY_ID || process.env.PROD_S3_ACCESS_KEY_ID,
);
export const S3_SECRET_ACCESS_KEY = nullthrows(
  process.env.S3_SECRET_ACCESS_KEY || process.env.PROD_S3_SECRET_ACCESS_KEY,
);
