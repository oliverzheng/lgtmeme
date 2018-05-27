// @flow
// @format

import {MongoClient} from 'mongodb';
import assert from 'assert';

const url = 'mongodb://localhost:27017';
const dbName = 'lgtmeme';

MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
  assert.equal(null, err);
  console.log('Connected successfully to server');

  const db = client.db(dbName);

  client.close();
});

export default function(): number {
  return 0;
}
