// @flow
// @format

import { connectionFromArray, fromGlobalId, globalIdField } from 'graphql-relay';
import { makeExecutableSchema } from 'graphql-tools';

const typeDefs = `

######################
# Root Objects       #
######################

# The query root for LGTMeme.
type Query {
  # Find a collection by its URL segment.
  collection(
    # The URL segment uniquely identifying the collection.
    slug: String!
  ): Collection

  # Find an entity by its global id.
  node(
    # The global id of the entitiy.
    id: ID!
  ): Node
}


######################
# Interfaces         #
######################

# Relay-compliant global identification.
interface Node {
  # The entity's globally unique identifier.
  id: ID!
}


######################
# Query Object Types #
######################

# A grouping of memes that are used together.
type Collection implements Node {
  # A globally unique ID for the collection.
  id: ID!

  # All memes that belong to this collection.
  memes(
    # The number of memes to return.
    first: Int, 

    # An optional offset by cursor.
    after: String
  ): MemeConnection!
}

# An  image.
type Image {
  # The recommended height for the image.
  height: Int!

  # An embeddable link to image content.
  url: URI!

  # The recommended width for the image.
  width: Int!
}

# An idea, behavior, or style that spreads from person to person.
type Meme {
  # The text that this meme replaces.
  macro: String!

  # The meme's insertable image.
  image: Image!
}

# A paginated set of memes.
type MemeConnection {
  # Memes in the paginated set.
  edges: [MemeEdge!]!

  # Pagination metadata.
  pageInfo: PageInfo!
}

# A meme in a connection.
type MemeEdge {
  # The associated Meme.
  node: Meme!

  # A pagination position.
  cursor: String!
}

# Relay-compliant pagination metadata.
type PageInfo {
  # True if there are edges after the last edge.
  hasNextPage: Boolean!

  # True if there are edges before the first edge.
  hasPreviousPage: Boolean!
}


######################
# Scalars            #
######################

# An ISO-8601-compliant string for URLs.
scalar URI

`;

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
    collection: (_parent, { slug }) =>
      // FIXME: this should be a Collection repository lookup.
      idToCollection[slug],
    node: (_parent, { id }) => {
      const { id: databaseId } = fromGlobalId(id);
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
