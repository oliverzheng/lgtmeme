// @flow
// @format

import nullthrows from 'nullthrows';

import {connect, urlWithoutPassword} from './db';
import createApp from './app';
import S3Storage from './storage/S3Storage';
import {
  DEBUG_SERVER_PORT,
  S3_BUCKET_NAME,
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
} from './env';

async function start() {
  const s3Storage = new S3Storage(
    S3_BUCKET_NAME,
    S3_REGION,
    S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY,
  );

  console.log(`Using S3 bucket ${S3_BUCKET_NAME}`); // eslint-disable-line no-console

  const connection = await connect();
  console.log(`Connected to MongoDB at ${urlWithoutPassword}`); // eslint-disable-line no-console

  createApp(connection, s3Storage).listen(
    nullthrows(DEBUG_SERVER_PORT),
    () => console.log(`Listening on ${nullthrows(DEBUG_SERVER_PORT)}.`), // eslint-disable-line no-console
  );
}

start();
