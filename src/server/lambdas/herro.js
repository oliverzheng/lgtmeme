// @flow
// @format

import type {APIGatewayEvent, Context, ProxyCallback} from 'flow-aws-lambda';
import {
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_USER,
  MONGODB_PASS,
  MONGODB_DB,
  S3_BUCKET_NAME,
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
} from '../env';

const obj = {
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_USER,
  MONGODB_PASS,
  MONGODB_DB,
  S3_BUCKET_NAME,
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
};

export function handler(
  event: APIGatewayEvent,
  context: Context,
  callback: ProxyCallback,
) {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      msg: `Herro, World!\n${JSON.stringify(obj, null, ' ')}`,
    }),
  });
}
