// @flow
// @format

import {graphql} from 'graphql';
import {exampleQuery, schema} from '../graphql';

test('validates fixture query', () => {
  const expectedExecutionResult = {
    data: {
      collection: {
        id: 'Collection/1',
        memes: {
          edges: [
            {
              node: {
                image: {
                  height: 300,
                  url:
                    'https://user-images.githubusercontent.com/526858/40877498-a7df8ec2-6636-11e8-848d-88fd1af1e65f.jpg',
                  width: 200,
                },
                macro: 'ItS SheRAmiE',
              },
            },
          ],
          pageInfo: {hasNextPage: false, hasPreviousPage: false},
        },
      },
    },
  };
  expect(graphql(schema, exampleQuery)).resolves.toEqual(
    expectedExecutionResult,
  );
});
