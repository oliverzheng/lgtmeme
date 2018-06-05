// @flow
// @format

import invariant from 'invariant';
import mongoose from 'mongoose';

import {MemeCollectionDoc} from './MemeCollection';
import {ImageSchema, ImageDoc} from './Image';

// Schema
const MemeSchema = new mongoose.Schema(
  {
    macro: {
      type: String,
      required: true,
      unique: true,
    },
    sourceImage: ImageSchema,
  },
  {
    pluralization: false,
  },
);

// Indices
MemeSchema.index({macro: 1});

// For flow
export class MemeDoc /* :: extends Mongoose$Document */ {
  macro: string;
  sourceImage: ImageDoc;
}
MemeSchema.loadClass(MemeDoc);

export function getMemeModelForCollection(
  memeCollection: MemeCollectionDoc,
): typeof MemeDoc {
  invariant(memeCollection.id != null, 'Meme collection must be saved already');
  const collectionID = memeCollection.id.toString();

  const Meme = memeCollection.collection.conn.model(
    `Meme_${collectionID}`,
    MemeSchema,
  );
  return Meme;
}
