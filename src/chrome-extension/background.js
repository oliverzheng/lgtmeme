// @flow
// @format
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

const CollectionQuery = gql`
  query CollectionQuery {
    collection(slug: "1") {
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
const fetch = async (): Promise<any> =>
  client.query({
    query: CollectionQuery,
  });

declare var chrome: any;
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
