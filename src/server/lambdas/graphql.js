// @flow
// @format

import '@babel/polyfill';
import {graphqlLambda} from 'apollo-server-lambda';
import type {APIGatewayEvent, Context} from 'flow-aws-lambda';
import {connect, disconnect} from '../db';
import {createSchema} from '../graphql';
import s3Storage from '../storage/__mocks__/mockStorage'; // FIXME: Webpack load error of missing module require("domain")

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
