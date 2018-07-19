// @flow
// @format
import nullthrows from 'nullthrows';

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

const macroMatcher = new RegExp(Object.keys(memeCollection).join('|'), 'gi');

function keyEventHandler(event) {
  const element = event.target;
  element.value = element.value.replace(
    macroMatcher,
    macro => `![](${memeCollection[macro.trim().toUpperCase()].image.url})`,
  );
}

if (document.body) {
  document.body.style.background = // eslint-disable-line no-param-reassign
    'url(https://user-images.githubusercontent.com/526858/40891491-753b1a1c-673b-11e8-818f-1f6045779700.png)';

  const els = document.querySelectorAll('textarea.comment-form-textarea');

  els.forEach(el => {
    const element = el;
    element.onkeyup = keyEventHandler;
  });
}

chrome.runtime.sendMessage({text: 'hello'}, response => {
  const responseData: GetCollectionByIDQuery = response.data;
  document.title = JSON.stringify(responseData);
});

// We need to execute JS within the context of the page. The only way to do so
// is to embed a <script> tag explicitly.
// https://stackoverflow.com/questions/9602022/chrome-extension-retrieving-global-variable-from-webpage/9636008#9636008
const s = document.createElement('script');
s.src = chrome.extension.getURL('inlineScript.bundle.js');
s.onload = function onLoad() {
  this.remove();
};
nullthrows(document.head).appendChild(s);
