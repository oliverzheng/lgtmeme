// @flow
// @format

// This exists so it can ensure the in-memory mongo is downloaded and setup for
// mockgoose before tests are run. Jest runs tests in parallel, which may mess
// things up if they are all trying to setup the in-memory mongo in parallel.

import MongodbMemoryServer from 'mongodb-memory-server';

async function ensure() {
  const mongoServer = new MongodbMemoryServer();
  await mongoServer.getConnectionString();
  await mongoServer.stop();
}

ensure();
