// @flow
// @format

import invariant from 'invariant';
import mockmongoose from '../mockmongoose';

// This must be imported after mockgoose wrapper
import {connect, disconnect} from '../';
import MemeCollection from '../MemeCollection';

describe('MemeCollection', () => {
  beforeAll(async () => {
    await mockmongoose.prepareStorage();
    await connect();
  });

  afterAll(async () => {
    await disconnect();
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
    expect(collection._id).not.toBeNull();

    const obj: ?MemeCollection = await MemeCollection.findById(collection._id);
    expect(obj).not.toBeNull();
    invariant(obj, 'flow');
    expect(obj.name).toBe('Ash Ketchum');
  });
});
