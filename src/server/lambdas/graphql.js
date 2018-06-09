// @flow
// @format
import '@babel/polyfill';
import {graphqlLambda} from 'apollo-server-lambda';
import type {APIGatewayEvent, Context, ProxyCallback} from 'flow-aws-lambda';
import {connect} from '../db/__tests__/__mocks__/mockmongoose';
import {createSchema} from '../graphql';
import s3Storage from '../storage/__mocks__/mockStorage'; // FIXME: Webpack load error of missing module require("domain")

export async function handler(
  event: APIGatewayEvent,
  context: Context,
  callback: ProxyCallback,
) {
  const connection = await connect();
  const schema = createSchema(connection.mongooseConnection, s3Storage);

  const requestOrigin = event.headers.origin;
  const callbackFilter = (error, output) => {
    if (requestOrigin && requestOrigin.startsWith('chrome-extension://')) {
      const {headers} = output;
      headers['Access-Control-Allow-Origin'] = requestOrigin;
    }
    callback(error, output);
  };
  const graphqlHandler = graphqlLambda({schema});
  return graphqlHandler(event, context, callbackFilter);
}
