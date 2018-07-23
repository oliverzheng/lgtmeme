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

async function replaceHelloWithHerroInNewComments(args: Array<mixed>) {
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
}

function stripHeadersForNewRequest(oldHeaders): Headers {
  const REMOVE_HEADERS = [
    // We don't want to include content-type for a new request, because when
    // a new FormData is added, a new content-type mixed boundary value is auto
    // generated by the browser. Copying the old content-type uses the old
    // boundary, but the form data embedded in the request would have a new
    // boundary, causing a `422 Unprocessable Entity` response.
    'content-type',
    // Ajax should always add this anyway
    'x-requested-with',
  ];
  const newHeaders = new window.Headers();
  Array.from(oldHeaders.entries()).forEach(entry => {
    const [key, value] = entry;
    if (!REMOVE_HEADERS.includes(key.toLowerCase())) {
      newHeaders.append(key, value);
    }
  });
  return newHeaders;
}

async function cloneRequestWithNewFormData(
  oldRequest: Request,
  transform: (oldFormData: FormData) => ?FormData,
): Promise<Request> {
  // Must clone it so that the data field doesn't get touched. Once it's
  // touched, the request cannot be used in fetch.
  const oldFormData = await new Request(oldRequest.clone()).formData();
  const newFormData = transform(oldFormData) || oldFormData;
  return new Request(oldRequest.url, {
    body: newFormData,
    cache: oldRequest.cache,
    credentials: oldRequest.credentials,
    headers: stripHeadersForNewRequest(oldRequest.headers),
    integrity: oldRequest.integrity,
    method: oldRequest.method,
    mode: oldRequest.mode,
    redirect: oldRequest.redirect,
    referrer: oldRequest.referrer,
  });
}

async function replaceHelloWithHerroInPreview(args: Array<mixed>) {
  if (args.length !== 1) {
    return null;
  }
  const req = args[0];
  if (!(req instanceof Request)) {
    return null;
  }
  const URL_REGEX = /https:\/\/github.com\/preview\?markdown_unsupported=false&repository=[\d]+&subject=[\d]+&subject_type=Issue/;
  if (!req.url.match(URL_REGEX)) {
    return null;
  }

  const newReq = await cloneRequestWithNewFormData(req, formData =>
    cloneFormDataWithNewValue(formData, (key, value) => {
      if (key === 'text') {
        return value.replace(/\bhello\b/g, 'herro');
      }
      return null;
    }),
  );
  return [newReq];
}

const ajaxHooks = [
  replaceHelloWithHerroInNewComments,
  replaceHelloWithHerroInPreview,
];

const windowFetch = window.fetch;
async function customFetch(...args) {
  // Uncomment below to debug what goes through ajax
  // console.log(arguments);
  let newArguments = args;
  // Only 1 ajax hook should execute
  for (const ajaxHook of ajaxHooks) {
    // On purpose await for the first non-null response in loop
    // eslint-disable-next-line no-await-in-loop
    const ajaxArguments = await ajaxHook(newArguments);
    if (ajaxArguments) {
      newArguments = ajaxArguments;
      break;
    }
  }
  return windowFetch.apply(this, newArguments);
}
window.fetch = customFetch;