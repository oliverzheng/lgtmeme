// @flow
// @format

import mongoose from 'mongoose';

import {
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_USER,
  MONGODB_PASS,
  MONGODB_DB,
} from '../env';

mongoose.Promise = global.Promise;

const url = `mongodb://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`;
export const urlWithoutPassword = `mongodb://${MONGODB_USER}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`;

// Ideally, this would give you back an opaque object so that you can operate on
// different connections in the same node session. Herpderply, flow doesn't know
// about any times if it's not created through the main mongoose object.
export async function connect(): Promise<void> {
  return new Promise((resolve, reject) => {
    // flow-typed doesn't have the 3-arg type definition :|
    (mongoose.connect: any)(url, {useMongoClient: true}, err => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

export async function disconnect(): Promise<void> {
  return new Promise(resolve => {
    mongoose.disconnect(resolve);
  });
}

export function getConnection(): Mongoose$Connection {
  return mongoose.connection;
}
