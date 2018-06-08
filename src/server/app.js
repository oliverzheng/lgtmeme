// @flow
// @format

import cors from 'cors';
import express, {type $Application} from 'express';
import bodyParser from 'body-parser';
import {graphiqlExpress, graphqlExpress} from 'apollo-server-express';
import {type MongooseConnection} from 'mongoose';
import {createSchema, exampleQuery} from './graphql';

const createApp = (connection: MongooseConnection): $Application => {
  const schema = createSchema(connection);
  const app = express();

  app.use(
    cors({
      origin: (req: ?string, callback) => {
        if (req && req.startsWith('chrome-extension://')) {
          callback(null, true);
        } else {
          callback(null, false);
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
