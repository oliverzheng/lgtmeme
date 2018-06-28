// @flow
// @format
import {type Chrome} from './chrome';
import {type GetCollectionByIDQuery} from './graphql';

declare var chrome: Chrome;
declare var document: Document;

const memeCollection = {
  FUUU: {
    image: {
      url:
        'https://user-images.githubusercontent.com/526858/40897022-7226c9ca-676d-11e8-95e0-7d35ff2ad4ce.png',
    },
  },
  LGTM: {
    image: {
      url:
        'https://user-images.githubusercontent.com/526858/40896863-84ce611a-676c-11e8-8efe-d4383e187132.png',
    },
  },
  OHYOU: {
    image: {
      url:
        'https://user-images.githubusercontent.com/526858/40896996-44c01eb4-676d-11e8-9326-4f2fb0db2e98.jpeg',
    },
  },
};

const macroMatcher = new RegExp(
  Object.keys(memeCollection)
    .map(m => `\\b${m}\\b`)
    .join('|'),
  'gi',
);

if (document.body) {
  document.body.style.background = // eslint-disable-line no-param-reassign
    'url(https://user-images.githubusercontent.com/526858/40891491-753b1a1c-673b-11e8-818f-1f6045779700.png)';

  const els = document.querySelectorAll('.comment-body');
  els.forEach(el => {
    const element = el;
    element.innerHTML = element.innerHTML.replace(
      macroMatcher,
      macro =>
        `<img src='${
          memeCollection[macro.trim().toUpperCase()].image.url
        }' title='${macro}' style='display: inline-block; height:40px' />`,
    );
  });
}

chrome.runtime.sendMessage({text: 'hello'}, response => {
  const responseData: GetCollectionByIDQuery = response.data;
  document.title = JSON.stringify(responseData);
});
