// @flow
// @format

import fs from 'fs';
import nullthrows from 'nullthrows';

const envFilepath = `${__dirname}/../../.env`;

if (fs.existsSync(envFilepath)) {
  console.log('.env file already exists. Exiting.');
  process.exit(0);
}

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

const fileToWrite = envVarsToExport
  .map(varName => `${varName}=${nullthrows(process.env[varName])}`)
  .join('\n');

fs.writeFileSync(envFilepath, fileToWrite);
console.log('Wrote to .env.');