// @flow
// @format

import mongoose from 'mongoose';

// Schema
const MemeCollectionSchema = new mongoose.Schema({
  name: String,

  // Put permissioning stuff here in the future
});

// Indices
MemeCollectionSchema.index({name: 1});

// For flow
class MemeCollectionDoc /* :: extends Mongoose$Document */ {
  name: string;
}
MemeCollectionSchema.loadClass(MemeCollectionDoc);

const MemeCollection = mongoose.model('MemeCollection', MemeCollectionSchema);

export default MemeCollection;
