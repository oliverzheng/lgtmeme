// @flow
// @format

import type {APIGatewayEvent, Context, ProxyCallback} from 'flow-aws-lambda';

export function handler(
  event: APIGatewayEvent,
  context: Context,
  callback: ProxyCallback,
) {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({msg: `Herro, World!${process.cwd()}`}),
  });
}
