// @flow
// @format

import mongoose, {type MongooseConnection} from 'mongoose';
import MongodbMemoryServer from 'mongodb-memory-server';

mongoose.Promise = global.Promise;

export type Connection = {
  mongooseConnection: MongooseConnection,
  mongoServer: MongodbMemoryServer,
};

export async function connect(): Promise<Connection> {
  const mongoServer = new MongodbMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();

  return new Promise((resolve, reject) => {
    const mongooseConnection = mongoose.createConnection();

    // flow-typed doesn't have the 3-arg type definition :|
    (mongooseConnection.openUri: any)(mongoUri, {useMongoClient: true}, err => {
      if (err) {
        return reject(err);
      }
      return resolve({
        mongooseConnection,
        mongoServer,
      });
    });
  });
}

export async function disconnect(connection: Connection): Promise<void> {
  await connection.mongooseConnection.close();
  await connection.mongoServer.stop();
}
