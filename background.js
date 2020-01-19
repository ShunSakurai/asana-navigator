chrome.runtime.onInstalled.addListener(
  function (details) {
    if (details.reason === 'install' || details.reason === 'update') {
      chrome.tabs.query({url: 'https://app.asana.com/*'}, function (arrayOfTabs) {
        arrayOfTabs.forEach(function (tab) {
          chrome.tabs.reload(tab.id);
        });
      });
    }
    // Use only when an important update is made
    if (details.reason === 'update') {
      const browserLanguages = window.navigator.languages;
      if (browserLanguages.indexOf('ja') + 1 || browserLanguages.indexOf('ja-JP') + 1) {
       chrome.tabs.create({url: 'pages/update-ja.html'});
      } else {
        chrome.tabs.create({url: 'pages/update-en.html'});
      }
    }
  }
);

chrome.runtime.onMessage.addListener(
  function(message, sender, callback) {
    if (message.contentScriptQuery != 'callAsanaApi') return;
    const [request, path, options, data] = message.parameters;
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      callback(JSON.parse(this.response));
    });
    const manifest = chrome.runtime.getManifest();
    const client_name = ['chrome-extension', manifest.version, manifest.name].join(':'); // Be polite to Asana API
    let requestData;
    if (request === 'POST' || request === 'PUT') {
      requestData = JSON.stringify({data: data});
      options.client_name = client_name;
    } else {
      options.opt_client_name = client_name;
    }
    let requestUrl = 'https://app.asana.com/api/1.1/' + path;
    if (Object.keys(options).length) {
      let parameters = '';
      for (let key in options) {
        if (options.hasOwnProperty(key)) {
          parameters += [key, '=', options[key], '&'].join('');
        }
      }
      parameters = parameters.slice(0, -1);
      requestUrl += '?' + parameters;
    }
    xhr.open(request, encodeURI(requestUrl));
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Allow-Asana-Client', '1'); // Required to authenticate for POST & PUT
    xhr.send(requestData);
    return true; // Will respond asynchronously.
  }
);

chrome.tabs.onUpdated.addListener(
  function (tabId, changeInfo, tab) {
    if (tab.url && tab.url.includes('https://app.asana.com/0/') && changeInfo.status && changeInfo.status == 'complete') {
      changeInfo.name = 'asanaNavigatorOnUpdated';
      chrome.tabs.sendMessage(tabId, changeInfo);
    }
  }
);