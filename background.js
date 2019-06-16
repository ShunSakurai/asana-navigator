chrome.tabs.onUpdated.addListener(
  function (tabId, changeInfo, tab) {
    if (tab.url && tab.url.includes('https://app.asana.com/0/') && changeInfo.status) {
      changeInfo.name = 'asanaNavigatorOnUpdated';
      chrome.tabs.sendMessage(tabId, changeInfo);
    }
  }
);

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
      // } else {
        // chrome.tabs.create({url: 'pages/update-en.html'});
      }
     }
  }
);
