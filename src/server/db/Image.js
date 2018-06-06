// @flow
// @format

import mongoose from 'mongoose';
import sizeOf from 'image-size';

import {type Storage, type LocalFilePath} from '../storage';

/* There is an implicit dependency on the underlying storage. The storage used
 * to store the files is expected to work the same way when memes are accessed
 * from mongodb. A different storage can be used at read time than the one used
 * at write time, but it must have all the same files with the same fileIDs.
 */
export const ImageSchema = new mongoose.Schema({
  fileID: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
});

export class ImageDoc /* :: extends Mongoose$Document */ {
  fileID: string;
  width: number;
  height: number;

  static async uploadImage(
    storage: Storage,
    localFilePath: LocalFilePath,
  ): Promise<ImageDoc> {
    const fileID = await storage.putFile(localFilePath);
    const dimensions = sizeOf(localFilePath);

    const image = new ImageDoc();
    image.fileID = fileID;
    image.width = dimensions.width;
    image.height = dimensions.height;

    return image;
  }
}
ImageSchema.loadClass(ImageDoc);
