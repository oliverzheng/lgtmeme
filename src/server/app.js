// @flow
// @format

import cors from 'cors';
import express, {type $Application} from 'express';
import bodyParser from 'body-parser';
import {graphiqlExpress, graphqlExpress} from 'apollo-server-express';
import {exampleQuery, schema} from './graphql';

const createApp = (): $Application => {
  const app = express();

  app.use(
    cors({
      origin: (req: ?string, callback) => {
        if (req && req.startsWith('chrome-extension://')) {
          callback(null, {origin: true});
        } else {
          callback(null, {origin: false});
        }
      },
      methods: ['POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: false,
    }),
  );
  app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
  app.use('/', graphiqlExpress({endpointURL: '/graphql', query: exampleQuery}));

  return app;
};

export default createApp;
