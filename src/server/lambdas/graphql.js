// @flow
// @format

import '@babel/polyfill';
import {graphqlLambda} from 'apollo-server-lambda';
import type {APIGatewayEvent, Context, ProxyCallback} from 'flow-aws-lambda';
import {connect, disconnect} from '../db';
import {createSchema} from '../graphql';
import s3Storage from '../storage/__mocks__/mockStorage'; // FIXME: Webpack load error of missing module require("domain")

async function handleRequest(
  event: APIGatewayEvent,
  context: Context,
  callback: ProxyCallback,
) {
  const connection = await connect();
  const schema = createSchema(connection, s3Storage);

  const requestOrigin = event.headers.origin;
  const callbackFilter = (error, output) => {
    // This gets called before graphqlHandler() resolves
    if (requestOrigin && requestOrigin.startsWith('chrome-extension://')) {
      const {headers} = output;
      headers['Access-Control-Allow-Origin'] = requestOrigin;
    }
    callback(error, output);
  };
  const graphqlHandler = graphqlLambda({schema});
  await graphqlHandler(event, context, callbackFilter);

  // Must disconnect, otherwise a lingering outbound connection makes lambda
  // think we aren't done, and not return the request.
  await disconnect();
}

export function handler(
  event: APIGatewayEvent,
  context: Context,
  callback: ProxyCallback,
) {
  // handler cannot return a Promise - otherwise the callback data gets janky.
  // That means handler cannot be an async function. Its content is pulled to
  // handleRequest.
  handleRequest(event, context, callback);
}
