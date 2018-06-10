// @flow
// @format

import {config} from 'dotenv';

import '@babel/polyfill';
import {type MongooseConnection} from 'mongoose';
import {graphqlLambda} from 'apollo-server-lambda';
import type {APIGatewayEvent, Context, ProxyCallback} from 'flow-aws-lambda';
import {connect} from '../db';
import {createSchema} from '../graphql';
import s3Storage from '../storage/__mocks__/mockStorage';

config();

// Connect just once
let connection: ?MongooseConnection = null;
const connectPromise: Promise<MongooseConnection> = (async () => {
  connection = await connect();
  return connection;
})();

async function handleRequest(
  conn: MongooseConnection,
  event: APIGatewayEvent,
  context: Context,
  callback: ProxyCallback,
) {
  const schema = createSchema(conn, s3Storage);

  const requestOrigin = event.headers.origin;
  const callbackFilter = (error, output) => {
    if (requestOrigin && requestOrigin.startsWith('chrome-extension://')) {
      const {headers} = output;
      headers['Access-Control-Allow-Origin'] = requestOrigin;
    }
    callback(error, output);
  };
  const graphqlHandler = graphqlLambda({schema});
  graphqlHandler(event, context, callbackFilter);
}

export function handler(
  event: APIGatewayEvent,
  context: Context,
  callback: ProxyCallback,
) {
  if (connection) {
    handleRequest(connection, event, context, callback);
  } else {
    connectPromise.then(conn => handleRequest(conn, event, context, callback));
  }
}
