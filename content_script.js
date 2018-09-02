var addReplaceNotesToExtraActions = function () {
  if (document.querySelector('.SingleTaskPaneExtraActionsButton')) {
    document.querySelector('.SingleTaskPaneExtraActionsButton').addEventListener('click', function () {
      var replaceNotesButton = document.createElement('A');
      replaceNotesButton.setAttribute('class', 'menuItem-button menuItem--small SingleTaskPaneExtraActionsButton-replaceNotes SingleTaskPaneExtraActionsButton-menuItem');
      replaceNotesButton.addEventListener('click', function () {
        replaceNotes();
        var layerPositionerLayer = document.querySelector('.LayerPositioner-layer');
        if (layerPositionerLayer) layerPositionerLayer.remove();
      });
      replaceNotesButton.innerHTML = '<span class="menuItem-label"><div class="ExtraActionsMenuItemLabel"><span class="ExtraActionsMenuItemLabel-body">Clean up Notes</span><span class="ExtraActionsMenuItemLabel-shortcut">TAB+E</span></div></span>';

      setTimeout(function() {
        var nextExtraActionButton = document.querySelector('.SingleTaskPaneExtraActionsButton-makeADuplicate');
        nextExtraActionButton.parentNode.insertBefore(replaceNotesButton, nextExtraActionButton);
      }, 100);
    });
  }
};

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

var displaySuccessToast = function (task, messagesBeforeAfter, callback) {
  var toastManager = document.querySelector('.ToastManager');
  if (!toastManager) return;
  var toastDiv = document.createElement('DIV');
  toastDiv.innerHTML = '<div class="ToastManager-toastContainer"><div class="ToastNotification SuccessToast"><div class="ToastNotificationContent"><div class="ToastNotificationContent-firstRow"><div class="ToastNotificationContent-text"><span>' +
    `${messagesBeforeAfter[0]} <a class="NavigationLink ToastNotification-link" href="https://app.asana.com/0/0/${task.id}">${(task.completed)? '✓ ': ''}${task.name}</a>${messagesBeforeAfter[1]}` +
    '</span></div><a class="CloseButton"><svg class="Icon XIcon CloseButton-xIcon" focusable="false" viewBox="0 0 32 32"><path d="M18.1,16l8.9-8.9c0.6-0.6,0.6-1.5,0-2.1c-0.6-0.6-1.5-0.6-2.1,0L16,13.9L7.1,4.9c-0.6-0.6-1.5-0.6-2.1,0c-0.6,0.6-0.6,1.5,0,2.1l8.9,8.9l-8.9,8.9c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path></svg></a></div><div class="Button Button--small Button--secondary" tabindex="0" role="button" aria-disabled="false">Undo</div></div></div></div>';
  var closeButton = toastDiv.firstChild.firstChild.firstChild.firstChild.children[1];
  closeButton.addEventListener('click', function () {
    toastDiv.remove();
  });
  var undoButton = toastDiv.firstChild.firstChild.firstChild.children[1];
  undoButton.addEventListener('click', function () {
    undoButton.outerText = '(Undoing...)';
    callback(function () {
      toastDiv.remove();
    });
  });
  toastManager.appendChild(toastDiv);
  setTimeout(function() {
    toastDiv.remove();
  }, 15000);
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
  callAsanaApi('GET', `workspaces/${workspaceId}/typeahead`, {'type': 'task','query': input.value, 'opt_fields': 'completed,name,parent.name,projects.name'}, {}, function (response) {
    var typeaheadSearchScrollableContents = document.querySelector('.TypeaheadSearchScrollable-contents');
    while (typeaheadSearchScrollableContents && typeaheadSearchScrollableContents.lastChild) {
      typeaheadSearchScrollableContents.lastChild.remove();
    }
    if (potentialTask) response.data.unshift(potentialTask);
    for (i = 0; i < response.data.length; i++) {
      if (response.data[i].id === Number(taskId)) continue;
      var dropdownItem = document.createElement('DIV');
      dropdownItem.innerHTML = returnTypeAheadInnerHTML(response.data[i]);
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

var replaceNotes = function () {
  var taskId = findTaskId(window.location.href);
  callAsanaApi('GET', `tasks/${taskId}`, {'opt_fields': 'html_notes'}, {}, function (response) {
    var htmlNotesOriginal = response.data.html_notes;
    var htmlNotes = htmlNotesOriginal;
    var replaceTextList = replaceRegexList.concat(replaceEntityList);
    for (var i = 0; i < replaceTextList.length; i ++) {
      var pair = replaceTextList[i];
      htmlNotes = htmlNotes.replace(pair[0],pair[1]);
    }
    callAsanaApi('PUT', `tasks/${taskId}`, {}, {'html_notes': htmlNotes}, function (response) {
      displaySuccessToast(response.data, ['Notes replaced:', ''], function (callback) {
        callAsanaApi('PUT', `tasks/${taskId}`, {}, {'html_notes': htmlNotesOriginal}, function (response) {
          callback();
        });
      });
    });
  });
};

var replaceRegexList = [[/(<a href=")(mailto:)?([A-Za-z0-9\-:;/._=+&%?!#@]+)(">)\3(<\/a>) &lt;\2\1\2\3[\/\s]*\4\3[\/\s]*\5&gt;/g, '$1$2$3$4$3$5']];

// exclude XML entities: [['&amp;', '&'], ['&apos;', '\''], ['&gt;', '>'], ['&lt;', '<'], ['&quot;', '"']]
var replaceEntityList = [['&Aacute;', 'Á'], ['&aacute;', 'á'], ['&Acirc;', 'Â'], ['&acirc;', 'â'], ['&acute;', '´'], ['&AElig;', 'Æ'], ['&aelig;', 'æ'], ['&Agrave;', 'À'], ['&agrave;', 'à'], ['&Aring;', 'Å'], ['&aring;', 'å'], ['&asymp;', '≈'], ['&Atilde;', 'Ã'], ['&atilde;', 'ã'], ['&Auml;', 'Ä'], ['&auml;', 'ä'], ['&bdquo;', '„'], ['&brvbar;', '¦'], ['&bull;', '•'], ['&Ccedil;', 'Ç'], ['&ccedil;', 'ç'], ['&cedil;', '¸'], ['&cent;', '¢'], ['&circ;', 'ˆ'], ['&copy;', '©'], ['&curren;', '¤'], ['&dagger;', '†'], ['&Dagger;', '‡'], ['&deg;', '°'], ['&divide;', '÷'], ['&Eacute;', 'É'], ['&eacute;', 'é'], ['&Ecirc;', 'Ê'], ['&ecirc;', 'ê'], ['&Egrave;', 'È'], ['&egrave;', 'è'], ['&ETH;', 'Ð'], ['&eth;', 'ð'], ['&Euml;', 'Ë'], ['&euml;', 'ë'], ['&euro;', '€'], ['&frac12;', '½'], ['&frac14;', '¼'], ['&frac34;', '¾'], ['&ge;', '≥'], ['&hellip;', '…'], ['&Iacute;', 'Í'], ['&iacute;', 'í'], ['&Icirc;', 'Î'], ['&icirc;', 'î'], ['&iexcl;', '¡'], ['&Igrave;', 'Ì'], ['&igrave;', 'ì'], ['&iquest;', '¿'], ['&Iuml;', 'Ï'], ['&iuml;', 'ï'], ['&laquo;', '«'], ['&ldquo;', '“'], ['&le;', '≤'], ['&lsaquo;', '‹'], ['&lsquo;', '‘'], ['&macr;', '¯'], ['&mdash;', '—'], ['&micro;', 'µ'], ['&middot;', '·'], ['&ndash;', '–'], ['&ne;', '≠'], ['&not;', '¬'], ['&Ntilde;', 'Ñ'], ['&ntilde;', 'ñ'], ['&Oacute;', 'Ó'], ['&oacute;', 'ó'], ['&Ocirc;', 'Ô'], ['&ocirc;', 'ô'], ['&OElig;', 'Œ'], ['&oelig;', 'œ'], ['&Ograve;', 'Ò'], ['&ograve;', 'ò'], ['&ordf;', 'ª'], ['&ordm;', 'º'], ['&Oslash;', 'Ø'], ['&oslash;', 'ø'], ['&Otilde;', 'Õ'], ['&otilde;', 'õ'], ['&Ouml;', 'Ö'], ['&ouml;', 'ö'], ['&para;', '¶'], ['&permil;', '‰'], ['&plusmn;', '±'], ['&pound;', '£'], ['&prime;', '′'], ['&Prime;', '″'], ['&raquo;', '»'], ['&rdquo;', '”'], ['&reg;', '®'], ['&rsaquo;', '›'], ['&rsquo;', '’'], ['&sbquo;', '‚'], ['&Scaron;', 'Š'], ['&scaron;', 'š'], ['&sect;', '§'], ['&sup1;', '¹'], ['&sup2;', '²'], ['&sup3;', '³'], ['&szlig;', 'ß'], ['&THORN;', 'Þ'], ['&thorn;', 'þ'], ['&tilde;', '˜'], ['&times;', '×'], ['&trade;', '™'], ['&trade;', '™'], ['&Uacute;', 'Ú'], ['&uacute;', 'ú'], ['&Ucirc;', 'Û'], ['&ucirc;', 'û'], ['&Ugrave;', 'Ù'], ['&ugrave;', 'ù'], ['&uml;', '¨'], ['&Uuml;', 'Ü'], ['&uuml;', 'ü'], ['&Yacute;', 'Ý'], ['&yacute;', 'ý'], ['&yen;', '¥'], ['&Yuml;', 'Ÿ'], ['&yuml;', 'ÿ']].map(a => [new RegExp(a[0].replace('&', '&amp;'), 'g'), a[1]]);

var returnTypeAheadInnerHTML = function (task) {
  var parentName = (task.parent)? task.parent.name: '';
  var projectNameList = (task.projects)? task.projects.map(a => a.name).join(', '): '';
  return `<div role="option" data-id="${task.id}" title="` +
  task.name + `${(parentName)? '&#13;‹ ' + parentName: ''}` + `${(projectNameList)? '&#13;(' + projectNameList + ')': ''}` +
  `"><div class="TypeaheadItemStructure TypeaheadItemStructure--enabled"><div class="TypeaheadItemStructure-icon">` +
  `${(task.completed)? '<svg class="Icon CheckCircleFullIcon TaskTypeaheadItem-completedIcon" focusable="false" viewBox="0 0 32 32"><path d="M16,0C7.2,0,0,7.2,0,16s7.2,16,16,16s16-7.2,16-16S24.8,0,16,0z M23.3,13.3L14,22.6c-0.3,0.3-0.7,0.4-1.1,0.4s-0.8-0.1-1.1-0.4L8,18.8c-0.6-0.6-0.6-1.5,0-2.1s1.5-0.6,2.1,0l2.8,2.8l8.3-8.3c0.6-0.6,1.5-0.6,2.1,0S23.9,12.7,23.3,13.3z"></path></svg>': '<svg class="Icon CheckCircleIcon TaskTypeaheadItem-incompletedIcon" focusable="false" viewBox="0 0 32 32"><path d="M16,32C7.2,32,0,24.8,0,16S7.2,0,16,0s16,7.2,16,16S24.8,32,16,32z M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z"></path><path d="M12.9,22.6c-0.3,0-0.5-0.1-0.7-0.3l-3.9-3.9C8,18,8,17.4,8.3,17s1-0.4,1.4,0l3.1,3.1l8.6-8.6c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-9.4,9.4C13.4,22.5,13.2,22.6,12.9,22.6z"></path></svg>'}` +
  `</div><div class="TypeaheadItemStructure-label"><div class="TypeaheadItemStructure-title"><span><span>${task.name}</span></span>` +
  `${(parentName)? '<span class="TaskTypeaheadItem-parentTask">' + parentName + '</span>': ''}`+
  '</div>' +
  `${(projectNameList)? '<div class="TypeaheadItemStructure-subtitle">' + projectNameList + '</div>': ''}`+
  '</div></div></div>';
};

var runAllFunctionsIfEnabled = function () {
  chrome.storage.sync.get({
    'anOptionsSubtasks': true,
    'anOptionsProjects': true,
    'anOptionsParent': true,
    'anOptionsNotes': true
  }, function (items) {
    if (items.anOptionsSubtasks) displayLinksToSiblingSubtasks();
    if (items.anOptionsProjects) displayProjectsOnTop();
    if (items.anOptionsParent) addSetParentToExtraActions();
    if (items.anOptionsNotes) addReplaceNotesToExtraActions();
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
    case 'E'.charCodeAt(0):
      if (window.tabKeyIsDown) {
          chrome.storage.sync.get({'anOptionsNotes': true}, function (items) {
            if (items.anOptionsNotes) replaceNotes();
        });
      }
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