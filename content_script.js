var addSetParentToExtraActions = function () {
  if (document.querySelector('.SingleTaskPaneExtraActionsButton')) {
    document.querySelector('.SingleTaskPaneExtraActionsButton').addEventListener('click', function () {
      var setParentButton = document.createElement('A');
      setParentButton.setAttribute('class', 'menuItem-button menuItem--small SingleTaskPaneExtraActionsButton-setParent SingleTaskPaneExtraActionsButton-menuItem');
      setParentButton.addEventListener('click', function () {
        displaySetParentDrawer();
        var layerPositionerLayer = document.querySelector('.LayerPositioner-layer');
        if (layerPositionerLayer) layerPositionerLayer.remove();
      });
      setParentButton.innerHTML = '<span class="menuItem-label"><div class="ExtraActionsMenuItemLabel"><span class="ExtraActionsMenuItemLabel-body">Convert to a Subtask...</span><span class="ExtraActionsMenuItemLabel-shortcut">TAB+R</span></div></span>';

      setTimeout(function() {
        var nextExtraActionButton = document.querySelector('.SingleTaskPaneExtraActionsButton-convertToProject') || document.querySelector('.SingleTaskPaneExtraActionsButton-print');
        nextExtraActionButton.parentNode.insertBefore(setParentButton, nextExtraActionButton);
      }, 100);
    });
  }
};

var callAsanaApi = function (request, path, options, data, callback) {
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
  var manifest = chrome.runtime.getManifest();
  var client_name = ["chrome-extension", manifest.version, manifest.name].join(":"); // Be polite to Asana API
  var requestData;
  if (request === 'POST' || request === 'PUT') {
    requestData = JSON.stringify({'data': data});
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Allow-Asana-Client', '1'); // Required to authenticate
    options.client_name = client_name;
  } else {
    options.opt_client_name = client_name;
  }
  xhr.send(requestData);
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

var closeSetParentDrawer = function () {
  var setParentDrawer = document.querySelector('.SetParentDrawer');
  if (setParentDrawer) setParentDrawer.remove();
};

var deleteSiblingButtons = function () {
  var siblingButtonsToDelete = document.querySelector('#SiblingButtons');
  if (siblingButtonsToDelete) siblingButtonsToDelete.remove();
};

var displayLinksToSiblingSubtasks = function () {
  var taskAncestryTaskLinks = document.querySelectorAll('.NavigationLink.TaskAncestry-ancestorLink');
  if (!taskAncestryTaskLinks.length) {
    deleteSiblingButtons();
    return;
  }
  var parentId = findTaskId(taskAncestryTaskLinks[taskAncestryTaskLinks.length - 1].href);
  var taskId = findTaskId(window.location.href);
  var containerId = findProjectId(window.location.href) || '0';

  callAsanaApi('GET', `tasks/${parentId}/subtasks`, {}, {}, function (response) {
    var subtaskList = response.data;
    var subtaskListFiltered = subtaskList.filter(function (subtask) {
      return !subtask.name.endsWith(':') || subtask.gid === taskId;
    });
    var indexCurrent;
    for (var i = 0; i < subtaskListFiltered.length; i++) {
      if (subtaskListFiltered[i].gid === taskId) {
        indexCurrent = i;
        break;
      }
    }
    var indexPrevious = (indexCurrent > 0)? indexCurrent - 1: null;
    var indexNext = (indexCurrent < subtaskListFiltered.length - 1)? indexCurrent + 1: null;
    deleteSiblingButtons();
    var siblingButtons = document.createElement('SPAN');
    siblingButtons.setAttribute('id', 'SiblingButtons');
    var innerHTMLPrevious = (indexPrevious || indexPrevious === 0)? `<a href="https://app.asana.com/0/${containerId}/${subtaskListFiltered[indexPrevious].gid}" id="arrowPreviousSubtask" class="NoBorderBottom TaskAncestry-ancestorLink" title="Previous sibling subtask (Tab+J)&#13;${subtaskListFiltered[indexPrevious].name}">∧</a>`: '';
    var innerHTMLNext = (indexNext)? `<a href="https://app.asana.com/0/${containerId}/${subtaskListFiltered[indexNext].gid}" id="arrowNextSubtask" class="NoBorderBottom TaskAncestry-ancestorLink" title="Next sibling subtask (Tab+K)&#13;${subtaskListFiltered[indexNext].name}">∨</a>`: '';
    siblingButtons.innerHTML = [innerHTMLPrevious, innerHTMLNext].join('<br>');
    var singleTaskPaneTitleRow = document.querySelector('.SingleTaskPane-titleRow');
    singleTaskPaneTitleRow.appendChild(siblingButtons);
  });
};

var displaySetParentDrawer = function () {
  var setParentDrawer = document.createElement('DIV');
  setParentDrawer.setAttribute('class', 'Drawer SetParentDrawer');
  setParentDrawer.innerHTML = `<a class="CloseButton Drawer-closeButton" id="setParentDrawerCloseButton"><svg class="Icon XIcon CloseButton-xIcon" focusable="false" viewBox="0 0 32 32"><path d="M18.1,16l8.9-8.9c0.6-0.6,0.6-1.5,0-2.1c-0.6-0.6-1.5-0.6-2.1,0L16,13.9L7.1,4.9c-0.6-0.6-1.5-0.6-2.1,0c-0.6,0.6-0.6,1.5,0,2.1l8.9,8.9l-8.9,8.9c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path></svg></a><div class="switch-view SetParentSwitchView">Make this task a subtask of other task. Insert at: Top&nbsp;<span id="SetParentSwitch" class="switch"></span>&nbsp;Bottom</div><input autocomplete="off" class="textInput textInput--medium SetParentDrawer-typeaheadInput" placeholder="Find a task by its name or ID" type="text" role="combobox" value=""><noscript></noscript></div>`;

  var singleTaskPaneBody = document.querySelector('.SingleTaskPane-body');
  var singleTaskPaneTopmostElement = document.querySelector('.SingleTaskPaneBanners') || document.querySelector('.SingleTaskPaneToolbar');
  singleTaskPaneBody.insertBefore(setParentDrawer, singleTaskPaneTopmostElement.nextSibling);

  document.querySelector('#setParentDrawerCloseButton').addEventListener('click', function () {
    closeSetParentDrawer();
  });
  document.querySelector('#SetParentSwitch').addEventListener('click', function () {
    toggleSetParentSwitch(this);
  });
  document.querySelector('.SetParentDrawer-typeaheadInput').addEventListener('focus', function () {
    selectNewParentTask(this);
  });
  document.querySelector('.SetParentDrawer-typeaheadInput').focus();
};

var displayProjectsOnTop = function () {
  var taskProjectsProjectList = document.querySelector('.TaskProjects-projectList');
  var taskAncestryTaskLinks = document.querySelectorAll('.NavigationLink.TaskAncestry-ancestorLink');
  if (!taskProjectsProjectList || taskAncestryTaskLinks.length) {
    var taskAncestryProjectNameOnTop = document.querySelector('#TaskAncestryProjectNameOnTop');
    if (taskAncestryProjectNameOnTop) taskAncestryProjectNameOnTop.remove();
    return;
  }
  var taskAncestry = document.createElement('DIV');
  taskAncestry.setAttribute('class', 'TaskAncestry');
  var taskAncestryAncestorProjects = document.createElement('DIV');
  taskAncestryAncestorProjects.setAttribute('class', 'TaskAncestry-ancestorProjects');
  taskAncestryAncestorProjects.setAttribute('id', 'TaskAncestryProjectNameOnTop');
  taskAncestry.appendChild(taskAncestryAncestorProjects);

  var taskId = findTaskId(window.location.href);
  Array.from(taskProjectsProjectList.children).forEach(function(li) {
    var projectUrl = li.children[0].href;
    var projectId = findProjectId(projectUrl);
    var projectName = li.children[0].children[0].textContent;

    callAsanaApi('GET', `projects/${projectId}/sections`, {}, {}, function (response) {
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
  var findProjectIdMatch = projectIdRegexPattern.exec(url);
  if (findProjectIdMatch) return findProjectIdMatch[1];
};

var populateFromTypeahead = function (taskId, workspaceId, input, potentialTask) {
  callAsanaApi('GET', `workspaces/${workspaceId}/typeahead`, {'type': 'task','query': input.value}, {}, function (response) {
    var typeaheadSearchScrollableContents = document.querySelector('.TypeaheadSearchScrollable-contents');
    while (typeaheadSearchScrollableContents && typeaheadSearchScrollableContents.lastChild) {
      typeaheadSearchScrollableContents.lastChild.remove();
    }
    if (potentialTask) response.data.unshift(potentialTask);
    for (i = 0; i < response.data.length; i++) {
      if (response.data[i].id === Number(taskId)) continue;
      var dropdownItem = document.createElement('DIV');
      dropdownItem.innerHTML = `<div role="option" data-id="${response.data[i].id}"><div class="TypeaheadItemStructure TypeaheadItemStructure--enabled"><div class="TypeaheadItemStructure-label"><div class="TypeaheadItemStructure-title"><span>${response.data[i].name}</span></div></div></div></div>`;
      typeaheadSearchScrollableContents.appendChild(dropdownItem);
      dropdownItem.addEventListener('mouseover', function () {
        this.firstChild.firstChild.classList.add('TypeaheadItemStructure--highlighted');
      });
      dropdownItem.addEventListener('mouseout', function () {
        this.firstChild.firstChild.classList.remove('TypeaheadItemStructure--highlighted');
      });
      dropdownItem.addEventListener('click', function () {
        var parentId = this.children[0].dataset.id;
        var setParentOptions = {'parent': parentId};
        if (document.querySelector('#SetParentSwitch').classList.contains('checked')) {
          setParentOptions.insert_before = null;
        } else {
          setParentOptions.insert_after = null;
        }
        callAsanaApi('POST', `tasks/${taskId}/setParent`, {}, setParentOptions, function (response) {
          closeSetParentDrawer();
          window.dispatchEvent(new Event('load'));
        });
      });
    }
  });
};

var runAllFunctionsIfEnabled = function () {
  chrome.storage.sync.get({
    'anOptionsSubtasks': true,
    'anOptionsProjects': true,
    'anOptionsParent': true
  }, function (items) {
    if (items.anOptionsSubtasks) displayLinksToSiblingSubtasks();
    if (items.anOptionsProjects) displayProjectsOnTop();
    if (items.anOptionsParent) addSetParentToExtraActions();
  });
};

var selectNewParentTask = function (input) {
  var taskId = findTaskId(window.location.href);
  callAsanaApi('GET', `tasks/${taskId}`, {}, {}, function (response) {
    var workspaceId = response.data.workspace.id;
    input.addEventListener('input', function () {
      if (!document.querySelector('#DropdownContainer')) {
        var dropdownContainer = document.createElement('DIV');
        dropdownContainer.innerHTML = '<div class="LayerPositioner LayerPositioner--alignLeft LayerPositioner--below"><div class="LayerPositioner-layer"><div class="Dropdown" role="listbox"><div class="scrollable scrollable--vertical TypeaheadSearchScrollable AddDependencyTypeaheadDropdownContents"><div class="TypeaheadSearchScrollable-contents"></div></div></div></div></div>';
        dropdownContainer.setAttribute('id', 'DropdownContainer');
        input.parentNode.appendChild(dropdownContainer);
      }
      var potentialTask;
      var potentialTaskIdMatch = /^\d{15}$/.exec(input.value.trim());
      var potentialTaskId = (potentialTaskIdMatch)? potentialTaskIdMatch[0]: findTaskId(input.value);
      if (potentialTaskId) {
        callAsanaApi('GET', `tasks/${potentialTaskId}`, {}, {}, function (response) {
          potentialTask = response.data;
          populateFromTypeahead(taskId, workspaceId, input, potentialTask);
        });
      } else {
        populateFromTypeahead(taskId, workspaceId, input, potentialTask);
      }
    });
  });
};

var toggleSetParentSwitch = function (input) {
  if (input.classList.contains('checked')) {
    input.classList.remove('checked');
  } else {
    input.classList.add('checked');
  }
};

window.tabKeyIsDown = false;

window.addEventListener('keydown', function (event) {
  if (event.ctrlKey || event.altKey || event.metaKey) return;
  if (event.keyCode === 9) window.tabKeyIsDown = true;
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
    case 'R'.charCodeAt(0):
      if (window.tabKeyIsDown) {
        if (document.querySelector('.SetParentDrawer')) {
          closeSetParentDrawer();
        } else {
          chrome.storage.sync.get({'anOptionsParent': true}, function (items) {
            if (items.anOptionsParent) displaySetParentDrawer();
          });
        }
      }
      break;
  }
});

window.addEventListener('load', function () {
  runAllFunctionsIfEnabled();
});

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (message.name && message.name === 'asanaNavigatorOnUpdated') {
      setTimeout(function() { // We can only receive "loading" status, not "complete"
        runAllFunctionsIfEnabled();
      }, 500);
    }
});