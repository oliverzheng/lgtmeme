// @flow
// @format
import fs from 'fs';
import {connectionFromArray, fromGlobalId, globalIdField} from 'graphql-relay';
import {makeExecutableSchema} from 'graphql-tools';
import path from 'path';
import {connection} from 'mongoose';
import {MemeDoc, getMemeModelForCollection} from './db/Meme';
import {MemeCollectionDoc, getMemeCollection} from './db/MemeCollection';
import {ImageDoc} from './db/Image';

const typeDefs = fs.readFileSync(
  path.resolve(__dirname, '../schema.graphql'),
  'utf8',
);

const resolvers = {
  Collection: {
    id: globalIdField(),
    memes: async (collection: MemeCollectionDoc, args) => {
      const Meme = getMemeModelForCollection(collection);
      const memes = await Meme.find();
      return connectionFromArray(memes, args);
    },
  },
  Image: {
    url: (sourceImage: ImageDoc) =>
      `http://localhost:3000/${sourceImage.fileID}`,
  },
  Meme: {
    image: (meme: MemeDoc) => meme.sourceImage,
  },
  Node: {
    __resolveType: () =>
      // FIXME: this should be derivable from the object state.
      'Collection',
  },
  Query: {
    collection: async (_, {slug}) => {
      const MemeCollection = getMemeCollection(connection);
      const collection = await MemeCollection.findById(slug);
      return collection;
    },
    node: (_parent, {id}) => {
      const {id: databaseId} = fromGlobalId(id);
      const MemeCollection = getMemeCollection(connection);
      return MemeCollection.findById(databaseId);
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const exampleQuery = `
query CollectionQuery {
  collection(slug:"5b173137f461920d07ab09e0") {
    id
    memes(first:10) {
      edges {
        node {
          macro
          image {
            height
            width
            url
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
}
`;
