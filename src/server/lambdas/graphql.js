// @flow
// @format

import '@babel/polyfill';
import {graphqlLambda} from 'apollo-server-lambda';
import type {APIGatewayEvent, Context} from 'flow-aws-lambda';
import {connect, disconnect} from '../db';
import {createSchema} from '../graphql';
import S3Storage from '../storage/S3Storage';
import {
  S3_BUCKET_NAME,
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
} from '../env';

const s3Storage = new S3Storage(
  S3_BUCKET_NAME,
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
);

export async function handler(event: APIGatewayEvent, context: Context) {
  const connection = await connect();
  const schema = createSchema(connection, s3Storage);

  const requestOrigin = event.headers.origin;

  let returnValue = null;
  let returnError = null;
  const callbackFilter = (error, output) => {
    // This gets called before graphqlHandler() resolves
    if (requestOrigin && requestOrigin.startsWith('chrome-extension://')) {
      const {headers} = output;
      headers['Access-Control-Allow-Origin'] = requestOrigin;
    }
    returnError = error;
    returnValue = output;
  };
  const graphqlHandler = graphqlLambda({schema});
  await graphqlHandler(event, context, callbackFilter);

  // Must disconnect, otherwise a lingering outbound connection makes lambda
  // think we aren't done, and not return the request.
  await disconnect();

  if (returnError) {
    throw returnError;
  }
  return returnValue;
}
