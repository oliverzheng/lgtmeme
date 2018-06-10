// @flow
// @format

import {config} from 'dotenv';

import fs from 'fs';
import nullthrows from 'nullthrows';

config();

const envFilepath = `${__dirname}/../server/env.json`;

const ENV_VARS_TO_EXPORT = [
  'MONGODB_HOST',
  'MONGODB_PORT',
  'MONGODB_USER',
  'MONGODB_PASS',
  'MONGODB_DB',
  'S3_BUCKET_NAME',
  'S3_REGION',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
];

const envVarsToExport = ENV_VARS_TO_EXPORT.filter(
  varName => process.env[varName] != null,
);

console.log(`Exporting environment variables: ${envVarsToExport.join(', ')}`);

const jsonToWrite = envVarsToExport.reduce((acc, varName) => {
  acc[varName] = nullthrows(process.env[varName]);
  return acc;
}, {});

fs.writeFileSync(envFilepath, JSON.stringify(jsonToWrite, null, '  '));
console.log(`Wrote to ${envFilepath}`);
