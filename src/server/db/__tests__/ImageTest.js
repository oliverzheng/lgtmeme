// @flow
// @format

// This must be imported after mockgoose wrapper
import mockStorage from '../../storage/__mocks__/mockStorage';
import {ImageDoc} from '../Image';

describe('Image', () => {
  test('can upload image', async () => {
    const image = await ImageDoc.uploadImage(mockStorage, 'someFile');
    expect(image.fileID).toBeTruthy();
    expect(image.width).toBeTruthy();
    expect(image.height).toBeTruthy();
  });
});
