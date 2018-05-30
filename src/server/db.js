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
export const urlWithoutPassword = `mongodb:\/\/${MONGODB_USER}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`;

export async function connect(): Promise<void> {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
      if (err) {
        return reject(err);
      }

      const db = client.db(MONGODB_DB);

      client.close();

      resolve();
    });
  });
}
