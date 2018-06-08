// @flow
// @format
import fs from 'fs';
import {GraphQLSchema} from 'graphql';
import {connectionFromArray, fromGlobalId, globalIdField} from 'graphql-relay';
import {makeExecutableSchema} from 'graphql-tools';
import invariant from 'invariant';
import {type MongooseConnection} from 'mongoose';
import path from 'path';
import {MemeDoc, getMemeModelForCollection} from './db/Meme';
import {MemeCollectionDoc, getMemeCollection} from './db/MemeCollection';

const typeDefs = fs.readFileSync(
  path.resolve(__dirname, '../schema.graphql'),
  'utf8',
);

export const createSchema = (connection: MongooseConnection): GraphQLSchema => {
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
      height: (meme: MemeDoc) => meme.sourceImage.height,
      url: async (meme: MemeDoc) => {
        const id = meme.collection.collectionName.replace('Meme_', '');
        const MemeCollection = getMemeCollection(connection);
        const collection = await MemeCollection.findById(id);
        invariant(collection != null, 'Meme collection must be saved already');
        return `http://localhost:3000/${collection.name}/${
          meme.sourceImage.fileID
        }`;
      },
      width: (meme: MemeDoc) => meme.sourceImage.width,
    },
    Meme: {
      image: (meme: MemeDoc) => meme,
    },
    Node: {
      __resolveType: () =>
        // FIXME: this should be derivable from the object state.
        'Collection',
    },
    Query: {
      collection: async (_, {slug}) => {
        const MemeCollection = getMemeCollection(connection);
        const collection = await MemeCollection.findOne({slug});
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
  collection(slug:"lgtmeme") {
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
