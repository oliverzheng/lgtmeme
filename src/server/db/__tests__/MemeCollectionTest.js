// @flow
// @format

import invariant from 'invariant';
import {type Connection, connect, disconnect} from './__mocks__/mockmongoose';

// This must be imported after mockgoose wrapper
import {getMemeCollection, MemeCollectionDoc} from '../MemeCollection';

describe('MemeCollection', () => {
  let connection: Connection;
  let MemeCollection: typeof MemeCollectionDoc;

  beforeAll(async () => {
    connection = await connect();
    MemeCollection = getMemeCollection(connection.mongooseConnection);
  });

  afterAll(async () => {
    await disconnect(connection);
  });

  test('should return no doc to start with', async () => {
    // ID must be 24 characters
    const obj = await MemeCollection.findById('123456789012345678901234');
    expect(obj).toBeNull();
  });

  test('should return a saved doc with findById', async () => {
    const collection = new MemeCollection();
    collection.name = 'Ash Ketchum';
    await collection.save();

    expect(collection.id).not.toBeNull();

    const obj: ?MemeCollection = await MemeCollection.findById(collection.id);
    expect(obj).not.toBeNull();
    invariant(obj, 'flow');
    expect(obj.name).toBe('Ash Ketchum');
  });
});
