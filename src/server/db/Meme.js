// @flow
// @format

import invariant from 'invariant';
import mongoose from 'mongoose';

import {MemeCollectionDoc} from './MemeCollection';
import {ImageSchema, ImageDoc} from './Image';

// Schema
export const MemeSchema = new mongoose.Schema(
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
  isMeme: boolean = true;

  macro: string;
  sourceImage: ImageDoc;

  getMemeCollectionID(): string {
    const collectionName = this.collection.name;
    return collectionName.substr('Meme_'.length);
  }

  getCollectionAndMemeID(): string {
    return `${this.getMemeCollectionID()}:${this.id}`;
  }

  static fromCollectionAndMemeID(
    ids: string,
  ): {collectionID: string, memeID: string} {
    const parts = ids.split(':');
    invariant(parts.length === 2, 'There must be 2 parts');
    return {
      collectionID: parts[0],
      memeID: parts[1],
    };
  }
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
