// @flow
// @format

import {config} from 'dotenv';

import fs from 'fs';
import type {APIGatewayEvent, Context, ProxyCallback} from 'flow-aws-lambda';

config();

export function handler(
  event: APIGatewayEvent,
  context: Context,
  callback: ProxyCallback,
) {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      msg: `Herro, World! ${fs.readdirSync('.').join(' ')}`,
    }),
  });
}
