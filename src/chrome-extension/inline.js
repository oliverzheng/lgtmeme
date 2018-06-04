// @flow
// @format

declare var chrome: any;
declare var document: Document;

if (document.body) {
  document.body.style.background = // eslint-disable-line no-param-reassign
    'url(https://user-images.githubusercontent.com/526858/40891491-753b1a1c-673b-11e8-818f-1f6045779700.png)';
}

chrome.runtime.sendMessage({text: 'hello'}, response => {
  document.title = JSON.stringify(response.data);
});
