// @flow
// @format
import fs from 'fs';
import {GraphQLSchema} from 'graphql';
import {connectionFromArray, fromGlobalId, globalIdField} from 'graphql-relay';
import {makeExecutableSchema} from 'graphql-tools';
import {type MongooseConnection} from 'mongoose';
import path from 'path';
import {MemeDoc, getMemeModelForCollection} from './db/Meme';
import {MemeCollectionDoc, getMemeCollection} from './db/MemeCollection';

const typeDefs = fs.readFileSync(
  path.resolve(__dirname, '../schema.graphql'),
  'utf8',
);

type MemeFromCollection = {meme: MemeDoc, collection: MemeCollectionDoc};

export const createSchema = (connection: MongooseConnection): GraphQLSchema => {
  const resolvers = {
    Collection: {
      id: globalIdField(),
      memes: async (collection: MemeCollectionDoc, args) => {
        const Meme = getMemeModelForCollection(collection);
        const memes = await Meme.find();
        const memesWithSlug: Array<MemeFromCollection> = memes.map(meme => ({
          meme,
          collection,
        }));
        return connectionFromArray(memesWithSlug, args);
      },
    },
    Image: {
      height: ({meme}: MemeFromCollection) => meme.sourceImage.height,
      url: ({meme, collection}: MemeFromCollection) =>
        `http://localhost:3000/${collection.name}/${meme.sourceImage.fileID}`,
      width: ({meme}: MemeFromCollection) => meme.sourceImage.width,
    },
    Meme: {
      image: (memeFromCollection: MemeFromCollection) => memeFromCollection,
      macro: ({meme}: MemeFromCollection) => meme.macro,
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

  return makeExecutableSchema({
    typeDefs,
    resolvers,
  });
};

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
