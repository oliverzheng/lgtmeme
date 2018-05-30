// @flow
// @format

import {MongoClient} from 'mongodb';
import assert from 'assert';

import {
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_USER,
  MONGODB_PASS,
  MONGODB_DB,
} from './env';

const url = `mongodb:\/\/${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`;

MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
  assert.equal(null, err);
  console.log('Connected successfully to server');

  const db = client.db(MONGODB_DB);

  client.close();
});

export default function(): number {
  return 0;
}
