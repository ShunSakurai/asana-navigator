var displayHealthStatus = function () {
  console.log('displayHealthStatus loaded');
  var TaskAncestryString = '<div class="TaskAncestry-ancestorProjects"><a class="NavigationLink TaskAncestry-ancestorProject" href="https://app.asana.com/0/0/0">Asana Navigator is working</a></div>';
  var TaskAncestry = document.querySelector('.TaskAncestry');
  if (!TaskAncestry) {
    TaskAncestry = document.createElement('DIV');
    TaskAncestry.setAttribute('class', 'TaskAncestry');
  }
  TaskAncestry.innerHTML = TaskAncestryString;
  var SingleTaskPaneBody = document.querySelector('.SingleTaskPane-body');
  var SingleTaskPaneTitleRow = document.querySelector('.SingleTaskPane-titleRow');
  SingleTaskPaneBody.insertBefore(TaskAncestry, SingleTaskPaneTitleRow);
};

window.addEventListener('load', function () {
  console.log('window load detected');
  displayHealthStatus();
});

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (typeof message.url === 'string' && message.url.includes('https://app.asana.com/0/')) {
      console.log('event detected');
      displayHealthStatus();
    }
});
