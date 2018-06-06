// @flow
// @format

import cors from 'cors';
import express, {
  type $Application,
  type $Request,
  type $Response,
} from 'express';
import bodyParser from 'body-parser';
import {graphiqlExpress, graphqlExpress} from 'apollo-server-express';

import {exampleQuery, schema} from './graphql';
import {getMemeCollection} from './db/MemeCollection';
import {getMemeModelForCollection} from './db/Meme';
import {type Storage, ALLOWED_EXTENSIONS} from './storage';

const createApp = (
  connection: Mongoose$Connection,
  storage: Storage,
): $Application => {
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
  app.use(
    '^/$',
    graphiqlExpress({endpointURL: '/graphql', query: exampleQuery}),
  );

  // Get meme image
  app.get(
    new RegExp(`^/([\\w/]+)/(\\w+)(${ALLOWED_EXTENSIONS.join('|')})$`),
    async (req: $Request, res: $Response) => {
      const collectionSlug = req.params['0'];
      const macro = req.params['1'];

      const MemeCollection = getMemeCollection(connection);
      const memeCollection = await MemeCollection.findOne({
        slug: collectionSlug,
      });
      if (!memeCollection) {
        res.status(404).end('Macro not found');
        return;
      }

      const Meme = getMemeModelForCollection(memeCollection);
      const meme = await Meme.findOne({macro});
      if (!meme) {
        res.status(404).end('Macro not found');
        return;
      }

      const imageUrl = await storage.getFileUrl(meme.sourceImage.fileID);
      res.redirect(imageUrl);
    },
  );

  return app;
};

export default createApp;
