// @flow
// @format

import window from 'global/window';

const replaceHerpWithDerpInNewComments = (args: Array<mixed>) => {
  if (args.length !== 2) {
    return null;
  }
  const url = args[0];
  const params = args[1];
  if (typeof url !== 'string' || params == null || typeof params !== 'object') {
    return null;
  }

  const URL_REGEX = /https:\/\/github.com\/[^/]+\/[^/]+\/issue_comments$/;
  if (!url.match(URL_REGEX)) {
    return null;
  }

  const oldFormData = params.body;
  if (!(oldFormData instanceof window.FormData)) {
    return null;
  }

  const newParams = {...params};
  const newFormData = new window.FormData();
  Array.from(oldFormData.entries()).forEach(entry => {
    const key = entry[0];
    let value = entry[1];
    if (key === 'comment[body]') {
      value = value.replace(/\bhello\b/g, 'herro');
    }
    newFormData.append(key, value);
  });
  newParams.body = newFormData;
  return [url, newParams];
};

const ajaxHooks = [replaceHerpWithDerpInNewComments];

const windowFetch = window.fetch;
function customFetch(...args) {
  // Uncomment below to debug what goes through ajax
  // console.log(arguments);
  let newArguments = args;
  ajaxHooks.forEach(ajaxHook => {
    const ajaxArguments = ajaxHook(newArguments);
    if (ajaxArguments) {
      newArguments = ajaxArguments;
    }
  });
  return windowFetch.apply(this, newArguments);
}
window.fetch = customFetch;
