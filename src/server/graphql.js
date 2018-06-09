// @flow
// @format

import fs from 'fs';
import {GraphQLSchema} from 'graphql';
import {connectionFromArray, fromGlobalId, globalIdField} from 'graphql-relay';
import {makeExecutableSchema} from 'graphql-tools';
import {type MongooseConnection} from 'mongoose';
import path from 'path';

import {type Storage} from './storage';
import {ImageDoc} from './db/Image';
import {MemeSchema, MemeDoc, getMemeModelForCollection} from './db/Meme';
import {
  MemeCollectionSchema,
  MemeCollectionDoc,
  getMemeCollection,
} from './db/MemeCollection';

const typeDefs = fs.readFileSync(
  path.resolve(process.cwd(), 'src', 'schema.graphql'),
  'utf8',
);

export const createSchema = (
  connection: MongooseConnection,
  storage: Storage,
): GraphQLSchema => {
  const MemeCollection = getMemeCollection(connection);

  const resolvers = {
    Collection: {
      id: globalIdField('collection'),
      memes: async (collection: MemeCollectionDoc, args) => {
        const Meme = getMemeModelForCollection(collection);
        const memes = await Meme.find();
        return connectionFromArray(memes, args);
      },
    },
    Image: {
      height: (image: ImageDoc) => image.height,
      url: (image: ImageDoc) => storage.getFileUrl(image.fileID),
      width: (image: ImageDoc) => image.width,
    },
    Meme: {
      id: globalIdField('meme', (meme: MemeDoc) =>
        meme.getCollectionAndMemeID(),
      ),
      image: (meme: MemeDoc) => meme.sourceImage,
    },
    Node: {
      __resolveType: obj => {
        if (obj.schema === MemeSchema) {
          return 'Meme';
        } else if (obj.schema === MemeCollectionSchema) {
          return 'Collection';
        }
        throw new Error('Do not know the type of obj');
      },
    },
    Query: {
      herro: () => 'Herro world!',
      collection: async (_, {collectionID}) => {
        const {id} = fromGlobalId(collectionID);
        return MemeCollection.findById(id);
      },
      node: async (_parent, {id}) => {
        const {type, id: databaseId} = fromGlobalId(id);
        switch (type) {
          case 'meme': {
            const {memeID, collectionID} = MemeDoc.fromCollectionAndMemeID(
              databaseId,
            );
            const memeCollection = await MemeCollection.findById(collectionID);
            if (!memeCollection) {
              return null;
            }
            const Meme = getMemeModelForCollection(memeCollection);
            return Meme.findById(memeID);
          }

          case 'collection':
            return MemeCollection.findById(databaseId);

          default:
            throw new Error(`Unexpected type ${type}`);
        }
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
  collection(collectionID:"Y29sbGVjdGlvbjo1YjE3MzEzN2Y0NjE5MjBkMDdhYjA5ZTA=") {
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
