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
       chrome.tabs.create({url: 'update.html'});
     }
  }
);
