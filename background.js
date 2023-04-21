// Use only when an important update is made
// chrome.runtime.onInstalled.addListener(
//   function (details) {
//     if (details.reason === 'update') {
//       const browserLanguages = window.navigator.languages;
//       if (browserLanguages.indexOf('ja') + 1 || browserLanguages.indexOf('ja-JP') + 1) {
//        chrome.tabs.create({url: 'pages/update-ja.html'});
//       } else {
//         chrome.tabs.create({url: 'pages/update-en.html'});
//       }
//     }
//   }
// );

chrome.runtime.onMessage.addListener(
  function(message, sender, callback) {
    if (message.contentScriptQuery != 'callAsanaApi') return;
    const [method, path, options, data] = message.parameters;

    const manifest = chrome.runtime.getManifest();
    const client_name = ['chrome-extension', manifest.version, manifest.name].join(':'); // Be polite to Asana API
    let requestData;
    if (method === 'POST' || method === 'PUT') {
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

    fetch(requestUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Allow-Asana-Client': '1'
      },
      body: requestData
    })
    .then(response => {return response.json();})
    .then(responseJson => callback(responseJson));

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

chrome.commands.onCommand.addListener((command) => {
    if (command === 'displaySubtasksDropdown' || command === 'replaceTextInDescription') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { command: command });
        }
      );
    }
  }
);
