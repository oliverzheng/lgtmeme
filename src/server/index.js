// @flow
// @format

import {connect, urlWithoutPassword} from './db';
import createApp from './app';
import {SERVER_PORT} from './env';
import S3Storage from './storage/S3Storage';
import S3StorageConfig from './storage/S3StorageConfig';

async function start() {
  const s3Storage = new S3Storage(
    S3StorageConfig.BUCKET_NAME,
    S3StorageConfig.REGION,
    S3StorageConfig.ACCESS_KEY_ID,
    S3StorageConfig.SECRET_ACCESS_KEY,
  );

  console.log(`Using S3 bucket ${S3StorageConfig.BUCKET_NAME}`); // eslint-disable-line no-console

  const connection = await connect();
  console.log(`Connected to MongoDB at ${urlWithoutPassword}`); // eslint-disable-line no-console

  createApp(connection, s3Storage).listen(
    SERVER_PORT,
    () => console.log(`Listening on ${SERVER_PORT}.`), // eslint-disable-line no-console
  );
}

start();
