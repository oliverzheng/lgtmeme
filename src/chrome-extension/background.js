// @flow
// @format

import ApolloClient, {ApolloQueryResult} from 'apollo-boost';
import gql from 'graphql-tag';
import {type Chrome} from './chrome';
import {type GetCollectionByIDQuery} from './graphql';

const CollectionQuery = gql`
  query GetCollectionByID {
    collection(
      collectionID: "Y29sbGVjdGlvbjo1YjE3MzEzN2Y0NjE5MjBkMDdhYjA5ZTA="
    ) {
      id
      memes(first: 10) {
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

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
});
const fetch = async (): Promise<ApolloQueryResult<GetCollectionByIDQuery>> =>
  client.query({
    query: CollectionQuery,
  });

declare var chrome: Chrome;
chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostSuffix: 'github.com'},
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Listener handler expects returning true if a promise will be run, instead of returning a promise.
  // See: https://developer.chrome.com/extensions/messaging#simple
  fetch().then(response => sendResponse({data: response.data}));
  return true;
});
