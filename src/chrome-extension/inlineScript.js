// @flow
// @format

import window from 'global/window';

function cloneFormDataWithNewValue(
  oldFormData: FormData,
  transform: (key: string, value: string) => ?string,
): FormData {
  const newFormData = new window.FormData();
  Array.from(oldFormData.entries()).forEach(entry => {
    const key = entry[0];
    let value = entry[1];
    if (typeof value === 'string') {
      const newValue = transform(key, value);
      if (newValue != null) {
        value = newValue;
      }
    }
    newFormData.append(key, value);
  });
  return newFormData;
}

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
  const newFormData = cloneFormDataWithNewValue(oldFormData, (key, value) => {
    if (key === 'comment[body]') {
      return value.replace(/\bhello\b/g, 'herro');
    }
    return null;
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
