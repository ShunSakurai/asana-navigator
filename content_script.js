var callAsanaApi = function (request, path, options, callback) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', function () {
      callback(JSON.parse(this.response));
  });
  var requestUrl = 'https://app.asana.com/api/1.1/' + path;
  if (options) {
    var parameters = '';
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        parameters += [key, '=', options[key], '&'].join('');
      }
    }
    parameters = parameters.slice(0, -1);
    requestUrl += '?' + parameters;
  }
  xhr.open(request, encodeURI(requestUrl));
  xhr.send();
};

var displayHealthStatus = function (url) {
  var taskProjectsProjectList = document.querySelector('.TaskProjects-projectList');
  if (taskProjectsProjectList) return;
  var taskId = findTaskId(url);
  callAsanaApi('GET', `tasks/${taskId}`, {}, function (response) {
    var taskName = response.data.name;
    var taskAncestryString = `<div class="TaskAncestry-ancestorProjects"><a class="NavigationLink TaskAncestry-ancestorProject" href="https://app.asana.com/0/0/${taskId}">Asana Navigator is working for: ${taskName}</a></div>`;
    var taskAncestry = document.querySelector('.TaskAncestry');
    if (!taskAncestry) {
      taskAncestry = document.createElement('DIV');
      taskAncestry.setAttribute('class', 'TaskAncestry');
    }
    taskAncestry.innerHTML = taskAncestryString;
    var singleTaskPaneBody = document.querySelector('.SingleTaskPane-body');
    var singleTaskPaneTitleRow = document.querySelector('.SingleTaskPane-titleRow');
    singleTaskPaneBody.insertBefore(taskAncestry, singleTaskPaneTitleRow);
  });
};

var displayProjectsOnTop = function () {
  var taskProjectsProjectList = document.querySelector('.TaskProjects-projectList');
  if (!taskProjectsProjectList) return;
  var taskAncestry = document.querySelector('.TaskAncestry');
  if (taskAncestry) return;
  var taskId = findTaskId(window.location.href);
  var taskAncestryString = '<div class="TaskAncestry-ancestorProjects">';
  Array.from(taskProjectsProjectList.children).forEach(function(li) {
    var projectUrl = li.children[0].href;
    var projectId = findProjectId(projectUrl);
    var projectName = li.children[0].children[0].textContent;
    taskAncestryString += `<a class="NavigationLink TaskAncestry-ancestorProject" href="https://app.asana.com/0/${projectId}/${taskId}">${projectName}</a>`;
  });
  taskAncestryString += '</div>';
  taskAncestry = document.createElement('DIV');
  taskAncestry.setAttribute('class', 'TaskAncestry');
  taskAncestry.innerHTML = taskAncestryString;
  var singleTaskPaneBody = document.querySelector('.SingleTaskPane-body');
  var singleTaskPaneTitleRow = document.querySelector('.SingleTaskPane-titleRow');
  singleTaskPaneBody.insertBefore(taskAncestry, singleTaskPaneTitleRow);
};

var findTaskId = function (url) {
  var taskIdRegexPatterns = [
    /https:\/\/app\.asana\.com\/0\/\d+\/(\d+)\/?f?/,
    /https:\/\/app\.asana\.com\/0\/inbox\/\d+\/(\d+)\/\d+\/?f?/,
    /https:\/\/app\.asana\.com\/0\/search\/\d+\/(\d+)\/?f?/
  ];
  for (var i = 0; i < taskIdRegexPatterns.length; i++) {
    var pattern = taskIdRegexPatterns[i];
    if (pattern.exec(url)) {
      return pattern.exec(url)[1];
    }
  }
};

var findProjectId = function (url) {
  var projectIdRegexPattern = /https:\/\/app\.asana\.com\/0\/(\d+)\/\d+\/?f?/;
  return projectIdRegexPattern.exec(url)[1];
};

window.addEventListener('load', function () {
  displayHealthStatus(window.location.href);
  displayProjectsOnTop();
});

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (typeof message.url === 'string' && message.url.includes('https://app.asana.com/0/')) {
      displayHealthStatus(message.url);
      displayProjectsOnTop();
    }
});
