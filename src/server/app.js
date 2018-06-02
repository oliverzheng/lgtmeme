// @flow
// @format

import express, {type $Application, type $Response} from 'express';
import bodyParser from 'body-parser';
import {graphiqlExpress, graphqlExpress} from 'apollo-server-express';
import {exampleQuery, schema} from './graphql';

export function createApp(): $Application {
  const app = express();

  app.use('/graphql', bodyParser.json(), graphqlExpress({schema: schema}));
  app.use('/', graphiqlExpress({endpointURL: '/graphql', query: exampleQuery}));

  return app;
}
