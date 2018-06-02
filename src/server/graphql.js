// @flow
// @format

import {makeExecutableSchema} from 'graphql-tools';

const typeDefs = `
  # The query root for LGTMeme.
  type Query {
    # ItS SheRAmiE ![rageface](https://user-images.githubusercontent.com/526858/40877498-a7df8ec2-6636-11e8-848d-88fd1af1e65f.jpg)
    hello: String!
  }
`;

const resolvers = {
  Query: {
    hello: (_parent, _args) => 'world!',
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const exampleQuery = `
{
  hello
}
`;
