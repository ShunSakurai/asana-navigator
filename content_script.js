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

var displayLinksToSiblingSubtasks = function () {
  var taskAncestryTaskNames = document.querySelector('.TaskAncestry-taskNames');
  if (!taskAncestryTaskNames) return;
  var taskId = findTaskId(window.location.href);
  var containerId = findProjectId(window.location.href) || '0';

  callAsanaApi('GET', `tasks/${taskId}`, {}, function (response) {
    var parentId = response.data.parent.id;

    callAsanaApi('GET', `tasks/${parentId}/subtasks`, {}, function (response) {
      var subtaskList = response.data;
      var indexCurrent;
      for (var i = 0; i < subtaskList.length; i++) {
        if (subtaskList[i].gid === taskId) {
          indexCurrent = i;
          break;
        }
      }
      var indexPrevious = (indexCurrent > 0)? indexCurrent - 1: null;
      var indexNext = (indexCurrent < subtaskList.length - 1)? indexCurrent + 1: null;
      var singleTaskTitleInputTaskName = document.querySelector('.SingleTaskPane-titleRow');
      var siblingButtons = document.createElement('SPAN');
      var innerHTMLPrevious = (indexPrevious)? `<a href="https://app.asana.com/0/${containerId}/${subtaskList[indexPrevious].gid}" id="arrowPreviousSubtask" class="NoBorderBottom TaskAncestry-ancestorLink" title="Previous sibling subtask (Tab+J)&#13;${subtaskList[indexPrevious].name}">∧</a>`: '';
      var innerHTMLNext = (indexNext)? `<a href="https://app.asana.com/0/${containerId}/${subtaskList[indexNext].gid}" id="arrowNextSubtask" class="NoBorderBottom TaskAncestry-ancestorLink" title="Next sibling subtask (Tab+K)&#13;${subtaskList[indexNext].name}">∨</a>`: '';
      siblingButtons.innerHTML = [innerHTMLPrevious, innerHTMLNext].join('<br>');
      singleTaskTitleInputTaskName.appendChild(siblingButtons);
    });
  });
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
        taskAncestryAncestorProjectSectionSelector.setAttribute('class', 'NoBorderBottom FloatingSelect TaskAncestry-ancestorProject');
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

window.tabKeyIsDown = false;

window.addEventListener('keydown', function (event) {
  if (event.ctrlKey || event.altKey || event.metaKey) return;
  if (event.keyCode === 9) {
      window.tabKeyIsDown = true;
    }
});

window.addEventListener('keyup', function (event) {
  switch (event.keyCode){
    case 9:
      window.tabKeyIsDown = false;
      break;
    case 'J'.charCodeAt(0):
      if (window.tabKeyIsDown) {
        var arrowPreviousSubtask = document.querySelector('#arrowPreviousSubtask');
        if (arrowPreviousSubtask) arrowPreviousSubtask.click();
      }
      break;
    case 'K'.charCodeAt(0):
      if (window.tabKeyIsDown) {
        var arrowNextSubtask = document.querySelector('#arrowNextSubtask');
        if (arrowNextSubtask) arrowNextSubtask.click();
      }
      break;
  }
});

window.addEventListener('load', function () {
  displayLinksToSiblingSubtasks();
  displayProjectsOnTop();
});

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (typeof message.url === 'string' && message.url.includes('https://app.asana.com/0/')) {
      displayLinksToSiblingSubtasks();
      displayProjectsOnTop();
    }
});