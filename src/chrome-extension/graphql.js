/* @flow */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type GetCollectionBySlugQuery = {|
  // Find a collection by its URL segment.
  collection: ?{|
    __typename: 'Collection',
    // The ID of an object
    id: string,
    // All memes that belong to this collection.
    memes: {|
      __typename: 'MemeConnection',
      // Memes in the paginated set.
      edges: Array<{|
        __typename: 'MemeEdge',
        // The associated Meme.
        node: {|
          __typename: 'Meme',
          // The text that this meme replaces.
          macro: string,
          // The meme's insertable image.
          image: {|
            __typename: 'Image',
            // The recommended height for the image.
            height: number,
            // The recommended width for the image.
            width: number,
            // An embeddable link to image content.
            url: any,
          |},
        |},
        // A pagination position.
        cursor: string,
      |}>,
      // Pagination metadata.
      pageInfo: {|
        __typename: 'PageInfo',
        // True if there are edges after the last edge.
        hasNextPage: boolean,
        // True if there are edges before the first edge.
        hasPreviousPage: boolean,
      |},
    |},
  |},
|};
