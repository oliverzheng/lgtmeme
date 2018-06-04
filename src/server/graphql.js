// @flow
// @format
import fs from 'fs';
import {connectionFromArray, fromGlobalId, globalIdField} from 'graphql-relay';
import {makeExecutableSchema} from 'graphql-tools';

const typeDefs = fs.readFileSync('./schema.graphql', 'utf8');

const idToCollection = {
  '1': {
    id: '1',
  },
};

const allMemes = [
  {
    image: {
      height: 300,
      width: 200,
      url:
        'https://user-images.githubusercontent.com/526858/40877498-a7df8ec2-6636-11e8-848d-88fd1af1e65f.jpg',
    },
    macro: 'ItS SheRAmiE',
  },
];

const resolvers = {
  Collection: {
    id: globalIdField(),
    memes: (_parent, args) =>
      // FIXME: this should be a Meme repository lookup.
      connectionFromArray(allMemes, args),
  },
  Node: {
    __resolveType: () =>
      // FIXME: this should be derivable from the object state.
      'Collection',
  },
  Query: {
    collection: (_parent, {slug}) =>
      // FIXME: this should be a Collection repository lookup.
      idToCollection[slug],
    node: (_parent, {id}) => {
      const {id: databaseId} = fromGlobalId(id);
      // FIXME this should be a repository lookup based on type.
      return idToCollection[databaseId];
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const exampleQuery = `
query CollectionQuery {
  collection(slug:"1") {
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
