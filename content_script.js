var callAsanaApi = function (request, path, options, callback) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', function () {
      callback(JSON.parse(this.response));
  });
  var requestUrl = 'https://app.asana.com/api/1.1/' + path;
  if (Object.keys(options).length) {
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

var clickSectionSelector = function (a) {
  var taskProjectsProjectId = findProjectId(a.previousSibling.href);
  var taskProjectsProjectList = document.querySelector('.TaskProjects-projectList');
  var floatingSelectLabel;
  for (var i = 0; i < taskProjectsProjectList.children.length; i++) {
    if (findProjectId(taskProjectsProjectList.children[i].children[0].href) === taskProjectsProjectId) {
      floatingSelectLabel = taskProjectsProjectList.children[i].children[1];
      break;
    }
  }
  floatingSelectLabel.scrollIntoView(false);
  setTimeout(function () {
      floatingSelectLabel.click();
  }, 100);
};

var displayProjectsOnTop = function () {
  var taskProjectsProjectList = document.querySelector('.TaskProjects-projectList');
  if (!taskProjectsProjectList) return;
  var taskAncestryTaskNames = document.querySelector('.TaskAncestry-taskNames');
  if (taskAncestryTaskNames) return;
  taskAncestry = document.createElement('DIV');
  taskAncestry.setAttribute('class', 'TaskAncestry');
  var taskAncestryAncestorProjects = document.createElement('DIV');
  taskAncestryAncestorProjects.setAttribute('class', 'TaskAncestry-ancestorProjects');
  taskAncestry.appendChild(taskAncestryAncestorProjects);

  var taskId = findTaskId(window.location.href);
  Array.from(taskProjectsProjectList.children).forEach(function(li) {
    var projectUrl = li.children[0].href;
    var projectId = findProjectId(projectUrl);
    var projectName = li.children[0].children[0].textContent;

    callAsanaApi('GET', `projects/${projectId}/sections`, {}, function (response) {
      var taskAncestryAncestorProject = document.createElement('A');
      taskAncestryAncestorProject.setAttribute('class', 'NavigationLink TaskAncestry-ancestorProject');
      taskAncestryAncestorProject.setAttribute('href', `https://app.asana.com/0/${projectId}/${taskId}`);
      taskAncestryAncestorProject.textContent = projectName;
      taskAncestryAncestorProjects.appendChild(taskAncestryAncestorProject);

      if (response.data.length) {
        var taskAncestryAncestorProjectSectionSelector = document.createElement('A');
        taskAncestryAncestorProjectSectionSelector.setAttribute('class', 'FloatingSelect TaskAncestry-ancestorProject');
        taskAncestryAncestorProjectSectionSelector.innerHTML = '<svg class="Icon DownIcon FloatingSelect-icon" focusable="false" viewBox="0 0 32 32"><path d="M16,22.5c-0.3,0-0.7-0.1-0.9-0.3l-11-9c-0.6-0.5-0.7-1.5-0.2-2.1c0.5-0.6,1.5-0.7,2.1-0.2L16,19.1l10-8.2c0.6-0.5,1.6-0.4,2.1,0.2c0.5,0.6,0.4,1.6-0.2,2.1l-11,9C16.7,22.4,16.3,22.5,16,22.5z"></path></svg>';
        taskAncestryAncestorProjects.appendChild(taskAncestryAncestorProjectSectionSelector);
        taskAncestryAncestorProjectSectionSelector.addEventListener('click', function () {
          clickSectionSelector(this);
        });
      }
    });
  });

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
  displayProjectsOnTop();
});

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (typeof message.url === 'string' && message.url.includes('https://app.asana.com/0/')) {
      displayProjectsOnTop();
    }
});
