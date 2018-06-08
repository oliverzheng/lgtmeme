// @flow
// @format

import {graphql} from 'graphql';
import {
  type Connection,
  connect,
  disconnect,
} from '../db/__tests__/__mocks__/mockmongoose';
import {createSchema, exampleQuery} from '../graphql';
import {type Storage} from '../storage';
import mockStorage from '../storage/__mocks__/mockStorage';

describe('GraphQL', () => {
  let mongoose: Connection;
  const storage: Storage = mockStorage;

  beforeAll(async () => {
    mongoose = await connect();
  });

  afterAll(async () => {
    await disconnect(mongoose);
  });

  test('validates query response', async () => {
    const expectedExecutionResult = {
      data: {
        collection: null,
      },
    };

    const schema = createSchema(mongoose.mongooseConnection, storage);
    const actualExecutionResult = await graphql(schema, exampleQuery);
    expect(actualExecutionResult).toEqual(expectedExecutionResult);
  });
});
