// @flow
// @format

// This must be imported after mockgoose wrapper
import mockStorage from '../../storage/__mocks__/mockStorage';
import {ImageDoc} from '../Image';

const HERPDERP_FILEPATH = `${__dirname}/../../__tests__/__fixtures__/herpderp.png`;

describe('Image', () => {
  test('can upload image', async () => {
    const image = await ImageDoc.uploadImage(mockStorage, HERPDERP_FILEPATH);
    expect(image.fileID).toBeTruthy();
    expect(image.width).toEqual(226);
    expect(image.height).toEqual(240);
  });
});
