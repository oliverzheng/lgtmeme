// @flow
// @format

import express, {type $Application} from 'express';
import bodyParser from 'body-parser';
import {graphiqlExpress, graphqlExpress} from 'apollo-server-express';
import {exampleQuery, schema} from './graphql';

const createApp = (): $Application => {
  const app = express();

  app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
  app.use('/', graphiqlExpress({endpointURL: '/graphql', query: exampleQuery}));

  return app;
};

export default createApp;
