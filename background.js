chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    if (typeof changeInfo.url === 'string' && changeInfo.url.includes('https://app.asana.com/0/')) {
      changeInfo.name = 'asanaNavigatorOnUpdated';
      chrome.tabs.sendMessage(tabId, changeInfo);
    }
  }
);

// Use only when an important update is made
chrome.runtime.onInstalled.addListener(
  function(details) {
    if (details.reason === 'update') {
      chrome.tabs.create({url: 'update.html'});
    }
  }
);
