var callAsanaApi = function (path, options, callback, request) {
  callback = callback || function (xhttp) {
    console.log(xhttp.response);
  };
  request = request || 'GET';
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', function () {
      callback(this);
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
  var TaskProjectsProjectList = document.querySelector('.TaskProjects-projectList');
  if (TaskProjectsProjectList) return;
  var taskId = findTaskId(url);
  callAsanaApi(`tasks/${taskId}`, {}, function (xhttp) {
    var response = JSON.parse(xhttp.response);
    var taskName = response.data.name;
    var TaskAncestryString = `<div class="TaskAncestry-ancestorProjects"><a class="NavigationLink TaskAncestry-ancestorProject" href="https://app.asana.com/0/0/${taskId}">Asana Navigator is working for: ${taskName}</a></div>`;
    var TaskAncestry = document.querySelector('.TaskAncestry');
    if (!TaskAncestry) {
      TaskAncestry = document.createElement('DIV');
      TaskAncestry.setAttribute('class', 'TaskAncestry');
    }
    TaskAncestry.innerHTML = TaskAncestryString;
    var SingleTaskPaneBody = document.querySelector('.SingleTaskPane-body');
    var SingleTaskPaneTitleRow = document.querySelector('.SingleTaskPane-titleRow');
    SingleTaskPaneBody.insertBefore(TaskAncestry, SingleTaskPaneTitleRow);
  });
};

var displayProjectsOnTop = function () {
  var TaskProjectsProjectList = document.querySelector('.TaskProjects-projectList');
  if (!TaskProjectsProjectList) return;
  var TaskAncestry = document.querySelector('.TaskAncestry');
  if (TaskAncestry) return;
  var taskId = findTaskId(window.location.href);
  var TaskAncestryString = '<div class="TaskAncestry-ancestorProjects">';
  Array.from(TaskProjectsProjectList.children).forEach(function(li) {
    var projectUrl = li.children[0].href;
    var projectId = findProjectId(projectUrl);
    var projectName = li.children[0].children[0].textContent;
    TaskAncestryString += `<a class="NavigationLink TaskAncestry-ancestorProject" href="https://app.asana.com/0/${projectId}/${taskId}">${projectName}</a>`;
  });
  TaskAncestryString += '</div>';
  TaskAncestry = document.createElement('DIV');
  TaskAncestry.setAttribute('class', 'TaskAncestry');
  TaskAncestry.innerHTML = TaskAncestryString;
  var SingleTaskPaneBody = document.querySelector('.SingleTaskPane-body');
  var SingleTaskPaneTitleRow = document.querySelector('.SingleTaskPane-titleRow');
  SingleTaskPaneBody.insertBefore(TaskAncestry, SingleTaskPaneTitleRow);
};

var findTaskId = function (url) {
  var taskIdRegexPatterns = [
    /https:\/\/app\.asana\.com\/0\/\d+\/(\d+)\/?f?/,
    /https:\/\/app\.asana\.com\/0\/inbox\/\d+\/(\d+)\/\d+\/?f?/,
    /https:\/\/app\.asana\.com\/0\/search\/\d+\/(\d+)\/?f?/
  ];
  for (var i = 0; i <= taskIdRegexPatterns.length - 1; i++) {
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
