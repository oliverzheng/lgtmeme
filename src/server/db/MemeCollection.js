// @flow
// @format

import mongoose, {type MongooseConnection} from 'mongoose';

// Schema
export const MemeCollectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  // Put permissioning stuff here in the future
});

// Indices
MemeCollectionSchema.index({name: 1});

// For flow
export class MemeCollectionDoc /* :: extends Mongoose$Document */ {
  isMemeCollection: boolean = true;

  name: string;
}
MemeCollectionSchema.loadClass(MemeCollectionDoc);

export function getMemeCollection(
  connection: MongooseConnection,
): typeof MemeCollectionDoc {
  return connection.model('MemeCollection', MemeCollectionSchema);
}
