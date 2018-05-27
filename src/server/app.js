// @flow
// @format

import express, {type $Application, type $Response} from 'express';

export function createApp(): $Application {
  const app = express();

  app.get('/', (_, res: $Response) => res.send('Hello World!'));

  return app;
}
