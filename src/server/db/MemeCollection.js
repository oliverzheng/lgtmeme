// @flow
// @format

import mongoose, {type MongooseConnection} from 'mongoose';

// Schema
const MemeCollectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },

  // Put permissioning stuff here in the future
});

// Indices
MemeCollectionSchema.index({slug: 1});

// For flow
export class MemeCollectionDoc /* :: extends Mongoose$Document */ {
  name: string;
  slug: string;
}
MemeCollectionSchema.loadClass(MemeCollectionDoc);

export function getMemeCollection(
  connection: MongooseConnection,
): typeof MemeCollectionDoc {
  return connection.model('MemeCollection', MemeCollectionSchema);
}
