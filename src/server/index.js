// @flow
// @format

import {connect, urlWithoutPassword} from './db';
import createApp from './app';
import {SERVER_PORT} from './env';

async function start() {
  const connection = await connect();
  console.log(`Connected to MongoDB at ${urlWithoutPassword}.`); // eslint-disable-line no-console

  createApp(connection).listen(
    SERVER_PORT,
    () => console.log(`Listening on ${SERVER_PORT}.`), // eslint-disable-line no-console
  );
}

start();
