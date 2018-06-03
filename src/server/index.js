// @flow
// @format

import {connect, urlWithoutPassword} from './db';
import createApp from './app';
import {SERVER_PORT} from './env';

async function start() {
  await connect();
  console.log(`Connected to MongoDB at ${urlWithoutPassword}.`);

  createApp().listen(SERVER_PORT, () =>
    console.log(`Listening on ${SERVER_PORT}.`),
  );
}

start();
