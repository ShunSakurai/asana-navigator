var addReplaceDescriptionToExtraActions = function () {
  var singleTaskPaneExtraActionsButton = document.querySelector('.SingleTaskPaneExtraActionsButton');
  if (singleTaskPaneExtraActionsButton) {
    singleTaskPaneExtraActionsButton.addEventListener('click', function () {
      var replaceDescriptionButton = document.createElement('A');
      replaceDescriptionButton.setAttribute('class', 'menuItem-button menuItem--small SingleTaskPaneExtraActionsButton-replaceDescription SingleTaskPaneExtraActionsButton-menuItem');
      replaceDescriptionButton.addEventListener('click', function () {
        displayReplaceDescriptionDialog();
        closeSingleTaskPaneExtraActionsMenu();
      });
      replaceDescriptionButton.innerHTML = `<span class="menuItem-label"><div class="ExtraActionsMenuItemLabel"><span class="ExtraActionsMenuItemLabel-body">${locStrings['menuButton-replaceDescription']}</span><span class="ExtraActionsMenuItemLabel-shortcut">TAB+E</span></div></span>`;

      setTimeout(function () {
        var nextExtraActionButton = document.querySelector('.SingleTaskPaneExtraActionsButton-makeADuplicate');
        if (nextExtraActionButton) nextExtraActionButton.parentNode.insertBefore(replaceDescriptionButton, nextExtraActionButton);
      }, 100);
    });
  }
};

var addRowToUserReplaceTextList = function () {
  var userTextToReplaceDialogTable = document.querySelector('#UserTextToReplaceDialogTable');
  if (!userTextToReplaceDialogTable) return;
  var newUserTextTr = document.createElement('tr');
  newUserTextTr.setAttribute('class', 'name-row');
  newUserTextTr.innerHTML = `<td class="field-value"><input autocomplete="off" class="generic-input showing" type="text" tabindex="0" value=""></td>
    <td class="field-value"><input autocomplete="off" class="generic-input showing" type="text" tabindex="0" value=""></td>
    <td><a class="delete-row-link">&nbsp;×</a></td>`;
  newUserTextTr.lastElementChild.addEventListener('click', function (event) {deleteUserReplaceTextRow(event.target);});
  userTextToReplaceDialogTable.firstElementChild.appendChild(newUserTextTr);
};

var addSetParentToExtraActions = function () {
  var singleTaskPaneExtraActionsButton = document.querySelector('.SingleTaskPaneExtraActionsButton');
  if (singleTaskPaneExtraActionsButton) {
    singleTaskPaneExtraActionsButton.addEventListener('click', function () {
      var setParentButton = document.createElement('A');
      setParentButton.setAttribute('class', 'menuItem-button menuItem--small SingleTaskPaneExtraActionsButton-setParent SingleTaskPaneExtraActionsButton-menuItem');
      setParentButton.addEventListener('click', function () {
        displaySetParentDrawer();
        closeSingleTaskPaneExtraActionsMenu();
      });
      setParentButton.innerHTML = `<span class="menuItem-label"><div class="ExtraActionsMenuItemLabel"><span class="ExtraActionsMenuItemLabel-body">${locStrings['menuButton-setParent']}</span><span class="ExtraActionsMenuItemLabel-shortcut">TAB+G</span></div></span>`;

      setTimeout(function () {
        var advancedActionsMenuItemButton = document.querySelector('.SingleTaskPaneExtraActionsButton-advancedActionsMenuItem');
        var nextExtraActionButton = advancedActionsMenuItemButton? advancedActionsMenuItemButton.parentNode: document.querySelector('.MenuSeparator');
        if (nextExtraActionButton) nextExtraActionButton.parentNode.insertBefore(setParentButton, nextExtraActionButton);
      }, 100);
    });
  }
};

var addToKeyboardShortcutsList = function () {
  var keyboardShortcutsModal = document.querySelector('.KeyboardShortcutsModal');
  if (!keyboardShortcutsModal) return;
  if (document.querySelector('#KeyboardShortcutsModalANSection')) return;
  var keyboardShortcutsModalANSection = document.createElement('DIV');
  keyboardShortcutsModalANSection.setAttribute('class', 'KeyboardShortcutsModal-section');
  keyboardShortcutsModalANSection.setAttribute('id', 'KeyboardShortcutsModalANSection');
  keyboardShortcutsModalANSection.innerHTML = '<h3 class="KeyboardShortcutsModal-sectionHeader">Asana Navigator</h3>';
  keyboardShortcutsModal.firstElementChild.children[1].lastElementChild.appendChild(keyboardShortcutsModalANSection);
  var separator = 'separator';
  var toTitleCase = function (string) {
    // Should consider if language is German
    return string[0] + string.slice(1).toLowerCase();
  };
  var shortcutsArray = [
    [locStrings['shortcutDescription-siblingSubtasks'], [platStrings['shift'], 'Tab', '↑', separator, platStrings['shift'], 'Tab', '↓']],
    [locStrings['shortcutDescription-subtasksDropdown'], [platStrings['shift'], 'Tab', '→']],
    [toTitleCase(locStrings['menuButton-replaceDescription']).replace('...', ''), ['Tab', 'E']],
    [toTitleCase(locStrings['menuButton-setParent']).replace('...', ''), ['Tab', 'G']],
  ];
  for (var i = 0; i < shortcutsArray.length; i++) {
    var [description, keyList] = shortcutsArray[i];
    var keyboardShortcutsModalRow = document.createElement('DIV');
    keyboardShortcutsModalRow.setAttribute('class', 'KeyboardShortcutsModal-row');
    keyboardShortcutsModalRow.innerHTML = `<span class="KeyboardShortcutsModal-description">${description}</span><span class="KeyboardShortcutsModal-keys">` +
    keyList.map(a => (a === separator)? '/': '<span class="KeyboardShortcutsModal-key">' + a + '</span>').join('') + '</span>';
    keyboardShortcutsModalANSection.appendChild(keyboardShortcutsModalRow);
  }
};

var callAsanaApi = function (request, path, options, data, callback) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', function () {
    callback(JSON.parse(this.response));
  });
  var manifest = chrome.runtime.getManifest();
  var client_name = ['chrome-extension', manifest.version, manifest.name].join(':'); // Be polite to Asana API
  var requestData;
  if (request === 'POST' || request === 'PUT') {
    requestData = JSON.stringify({'data': data});
    options.client_name = client_name;
  } else {
    options.opt_client_name = client_name;
  }
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
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('X-Allow-Asana-Client', '1'); // Required to authenticate for POST & PUT
  xhr.send(requestData);
};

var clickSectionSelector = function (a) {
  var taskProjectsProjectGid = findProjectGid(a.previousSibling.href);
  var taskProjectsProjectList = document.querySelector('.TaskProjects-projectList');
  var floatingSelectLabel;
  for (var i = 0; i < taskProjectsProjectList.children.length; i++) {
    if (findProjectGid(taskProjectsProjectList.children[i].firstElementChild.href) === taskProjectsProjectGid) {
      floatingSelectLabel = taskProjectsProjectList.children[i].children[1];
      break;
    }
  }
  floatingSelectLabel.scrollIntoView(false);
  setTimeout(function () {
      floatingSelectLabel.click();
  }, 100);
};

var closeReplaceDescriptionDialog = function () {
  var replaceDescriptionDialogView = document.querySelector('#ReplaceDescriptionDialogView');
  if (replaceDescriptionDialogView) replaceDescriptionDialogView.remove();
};

var closeSetParentDrawer = function () {
  var setParentDrawer = document.querySelector('.SetParentDrawer');
  if (setParentDrawer) setParentDrawer.remove();
  document.removeEventListener('click', listenToClickToCloseSetParentDropdown);
};

var closeSingleTaskPaneExtraActionsMenu = function () {
  var singleTaskPaneExtraActionsButton = document.querySelector('.SingleTaskPaneExtraActionsButton');
  if (singleTaskPaneExtraActionsButton.classList.contains('CircularButton--active') || singleTaskPaneExtraActionsButton.classList.contains('is-dropdownVisible')) {
    singleTaskPaneExtraActionsButton.click();
  }
};

var createSetParentDropdownContainer = function (input, taskGid, workspaceGid) {
  var singleTaskTitleInput = document.querySelector('.SingleTaskTitleInput-taskName');
  var taskName = (singleTaskTitleInput)? singleTaskTitleInput.children[1].textContent: '';
  var queryValue = input.value || taskName;
  var setParentDropdownContainer = document.querySelector('#SetParentDropdownContainer');
  if (!setParentDropdownContainer) {
    setParentDropdownContainer = document.createElement('DIV');
    setParentDropdownContainer.innerHTML = '<div class="LayerPositioner LayerPositioner--alignLeft LayerPositioner--below"><div class="LayerPositioner-layer"><div class="Dropdown" role="listbox"><div class="scrollable scrollable--vertical TypeaheadSearchScrollable SetParentTypeaheadDropdownContents"><div class="TypeaheadSearchScrollable-contents"></div></div></div></div></div>';
    setParentDropdownContainer.setAttribute('id', 'SetParentDropdownContainer');
    input.parentNode.appendChild(setParentDropdownContainer);
  }
  var potentialTask;
  var potentialTaskGidMatch = /^\d{15}$/.exec(input.value.trim()); // gid spec might change
  var potentialTaskGid = (potentialTaskGidMatch)? potentialTaskGidMatch[0]: findTaskGid(input.value);
  if (potentialTaskGid) {
    callAsanaApi('GET', `tasks/${potentialTaskGid}`, {}, {}, function (response) {
      potentialTask = response.data;
      populateFromTypeahead(taskGid, workspaceGid, queryValue, potentialTask);
    });
  } else {
    populateFromTypeahead(taskGid, workspaceGid, queryValue, potentialTask);
  }
};

var createSiblingSubtasksDropdown = function (subtaskListFiltered, taskGid, containerGid) {
  var completeIcon = '<svg class="SiblingSubtasksIcon CheckCircleFullIcon SiblingSubtasksItem-completedIcon" focusable="false" viewBox="0 0 32 32"><path d="M16,0C7.2,0,0,7.2,0,16s7.2,16,16,16s16-7.2,16-16S24.8,0,16,0z M23.3,13.3L14,22.6c-0.3,0.3-0.7,0.4-1.1,0.4s-0.8-0.1-1.1-0.4L8,18.8c-0.6-0.6-0.6-1.5,0-2.1s1.5-0.6,2.1,0l2.8,2.8l8.3-8.3c0.6-0.6,1.5-0.6,2.1,0S23.9,12.7,23.3,13.3z"></path></svg>';
  var incompleteIcon = '<svg class="SiblingSubtasksIcon CheckCircleIcon SiblingSubtasksItem-incompletedIcon" focusable="false" viewBox="0 0 32 32"><path d="M16,32C7.2,32,0,24.8,0,16S7.2,0,16,0s16,7.2,16,16S24.8,32,16,32z M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z"></path><path d="M12.9,22.6c-0.3,0-0.5-0.1-0.7-0.3l-3.9-3.9C8,18,8,17.4,8.3,17s1-0.4,1.4,0l3.1,3.1l8.6-8.6c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-9.4,9.4C13.4,22.5,13.2,22.6,12.9,22.6z"></path></svg>';
  if (document.querySelector('#SiblingSubtasksDropdownContainer')) return;
  var siblingDropdown = document.createElement('DIV');
  siblingDropdown.setAttribute('id', 'SiblingSubtasksDropdownContainer');
  siblingDropdown.innerHTML = '<div class="LayerPositioner LayerPositioner--alignRight LayerPositioner--below SiblingSubtasksDropdownLayer"><div class="LayerPositioner-layer"><div class="Dropdown scrollable scrollable--vertical SiblingSubtasksDropdownContainer"><div class="menu menu--default">' +
    subtaskListFiltered.map(
      subtask => `<a class="menuItem-button menuItem--small" ${(subtask.name.endsWith(':'))? '': `href="https://app.asana.com/0/${containerGid}/${subtask.gid}`}"><span class="menuItem-label">` +
      `${(subtask.name.endsWith(':'))? '<u>' + subtask.name + '</u>': ((subtask.gid === taskGid)? '<strong id="currentSubtaskMarker">&gt;</strong>&nbsp;': (subtask.completed? completeIcon: incompleteIcon)) + '&nbsp;' + subtask.name}</span></a>`
    ).join('') +
    '</div></div></div>';
  var singleTaskPane = document.querySelector('.SingleTaskPane');
  singleTaskPane.insertBefore(siblingDropdown, singleTaskPane.firstElementChild);
  document.querySelector('#currentSubtaskMarker').scrollIntoView(false);
  siblingDropdown.addEventListener('click', function (event) {
    openPageWithoutRefresh(event.target.href);
  });
  document.addEventListener('click', listenToClickToCloseSiblingSubtasksDropdown);
};

var deleteProjectNamesOnTop = function () {
  var projectNamesOnTop = document.querySelector('#TaskAncestryProjectNamesOnTop');
  if (projectNamesOnTop) projectNamesOnTop.remove();
};

var deleteSetParentTypeaheadDropdown = function () {
  var setParentDropdownContainer = document.querySelector('#SetParentDropdownContainer');
  if (setParentDropdownContainer) setParentDropdownContainer.remove();
};

var deleteSiblingButtons = function () {
  var SiblingButtons = document.querySelector('#SiblingButtons');
  if (SiblingButtons) SiblingButtons.remove();
};

var deleteSiblingSubtasksDropdown = function () {
  var siblingDropdown = document.querySelector('#SiblingSubtasksDropdownContainer');
  if (siblingDropdown) siblingDropdown.remove();
  document.removeEventListener('click', listenToClickToCloseSiblingSubtasksDropdown);
};

var deleteUserReplaceTextRow = function (button) {
  var trToDelete = button.parentNode.parentNode;
  trToDelete.remove();
};

var displayLinksToSiblingSubtasks = function () {
  var taskAncestryTaskLinks = document.querySelectorAll('.NavigationLink.TaskAncestry-ancestorLink');
  if (!taskAncestryTaskLinks.length) return;
  var parentGid = findTaskGid(taskAncestryTaskLinks[taskAncestryTaskLinks.length - 1].href);
  var taskGid = findTaskGid(window.location.href);
  var containerGid = findProjectGid(window.location.href) || '0';

  callAsanaApi('GET', `tasks/${parentGid}/subtasks`, {'opt_fields': 'completed,name'}, {}, function (response) {
    var subtaskList = response.data;
    var subtaskListFiltered = subtaskList.filter(function (subtask) {
      return !subtask.name.endsWith(':') || subtask.gid === taskGid;
    });
    var indexCurrent;
    for (var i = 0; i < subtaskListFiltered.length; i++) {
      if (subtaskListFiltered[i].gid === taskGid) {
        indexCurrent = i;
        break;
      }
    }
    var indexPrevious = (indexCurrent > 0)? indexCurrent - 1: null;
    var indexNext = (indexCurrent < subtaskListFiltered.length - 1)? indexCurrent + 1: null;
    deleteSiblingButtons();
    var siblingButtons = document.createElement('SPAN');
    siblingButtons.setAttribute('id', 'SiblingButtons');
    var singleTaskPaneTitleRow = document.querySelector('.SingleTaskPane-titleRow');
    if (singleTaskPaneTitleRow) singleTaskPaneTitleRow.appendChild(siblingButtons);

    if (indexPrevious || indexPrevious === 0) {
      var divArrowPreviousSubtask = document.createElement('DIV');
      divArrowPreviousSubtask.innerHTML = `<a class="NoBorderBottom TaskAncestry-ancestorLink" href="https://app.asana.com/0/${containerGid}/${subtaskListFiltered[indexPrevious].gid}" id="ArrowPreviousSubtask" title="${locStrings['arrowTitle-previousSubtask']} (${[platStrings['shift'], 'Tab', '↑'].join(platStrings['sep'])})\n${escapeHtml(subtaskListFiltered[indexPrevious].name)}">∧</a>`;
      siblingButtons.appendChild(divArrowPreviousSubtask);
      var arrowPreviousSubtask = document.querySelector('#ArrowPreviousSubtask');
      if (arrowPreviousSubtask) arrowPreviousSubtask.addEventListener('click', function (event) {
        openPageWithoutRefresh(`https://app.asana.com/0/${containerGid}/${subtaskListFiltered[indexPrevious].gid}`);
        event.preventDefault();
      });
    } else {
      siblingButtons.appendChild(document.createElement('BR'));
    }
    var divArrowMiddleSubtask = document.createElement('DIV');
    divArrowMiddleSubtask.innerHTML = `<a class="NoBorderBottom TaskAncestry-ancestorLink" id="ArrowMiddleSubtask" title="${locStrings['arrowTitle-subtasksDropdown']} (${[platStrings['shift'], 'Tab', '→'].join(platStrings['sep'])})">&gt;</a>`;
    siblingButtons.appendChild(divArrowMiddleSubtask);
    var arrowMiddleSubtask = document.querySelector('#ArrowMiddleSubtask');
    if (arrowMiddleSubtask) arrowMiddleSubtask.addEventListener('click', function (event) {
      createSiblingSubtasksDropdown(subtaskList, taskGid, containerGid);
    });
    if (indexNext) {
      var divArrowNextSubtask = document.createElement('DIV');
      divArrowNextSubtask.innerHTML = `<a class="NoBorderBottom TaskAncestry-ancestorLink" href="https://app.asana.com/0/${containerGid}/${subtaskListFiltered[indexNext].gid}" id="ArrowNextSubtask" title="${locStrings['arrowTitle-nextSubtask']} (${[platStrings['shift'], 'Tab', '↓'].join(platStrings['sep'])})\n${escapeHtml(subtaskListFiltered[indexNext].name)}">∨</a>`;
      siblingButtons.appendChild(divArrowNextSubtask);
      var arrowNextSubtask = document.querySelector('#ArrowNextSubtask');
      if (arrowNextSubtask) arrowNextSubtask.addEventListener('click', function (event) {
        openPageWithoutRefresh(`https://app.asana.com/0/${containerGid}/${subtaskListFiltered[indexNext].gid}`);
        event.preventDefault();
      });
    } else {
      siblingButtons.appendChild(document.createElement('BR'));
    }
  });
};

var displayProjectsOnTop = function () {
  var taskProjectsProjectList = document.querySelector('.TaskProjects-projectList');
  if (!taskProjectsProjectList) return;
  var taskAncestry = document.createElement('DIV');
  taskAncestry.setAttribute('class', 'TaskAncestry');
  var taskAncestryAncestorProjects = document.createElement('DIV');
  taskAncestryAncestorProjects.setAttribute('class', 'TaskAncestry-ancestorProjects');
  taskAncestryAncestorProjects.setAttribute('id', 'TaskAncestryProjectNamesOnTop');
  taskAncestry.appendChild(taskAncestryAncestorProjects);

  var taskGid = findTaskGid(window.location.href);
  Array.from(taskProjectsProjectList.children).forEach(function (li) {
    var a = li.firstElementChild;
    var projectUrl = a.href;
    var projectGid = findProjectGid(projectUrl);
    var projectName = a.firstElementChild.textContent;

    var taskAncestryAncestorProject = document.createElement('A');
    taskAncestryAncestorProject.setAttribute('class', 'NavigationLink TaskAncestry-ancestorProject');
    taskAncestryAncestorProject.setAttribute('href', `https://app.asana.com/0/${projectGid}/${taskGid}`);
    taskAncestryAncestorProject.setAttribute('id', 'Project' + projectGid);
    taskAncestryAncestorProject.textContent = projectName;
    taskAncestryAncestorProject.addEventListener('click', function (event) {
      a.click();
      event.preventDefault();
    });
    taskAncestryAncestorProjects.appendChild(taskAncestryAncestorProject);

    // Section selectors as DOM elements are loaded later, so fetching them via API
    callAsanaApi('GET', `projects/${projectGid}/sections`, {}, {}, function (response) {
      if (response.data.length) {
        var taskAncestryAncestorProjectSectionSelector = document.createElement('A');
        taskAncestryAncestorProjectSectionSelector.setAttribute('class', 'NoBorderBottom FloatingSelect TaskAncestry-ancestorProject');
        taskAncestryAncestorProjectSectionSelector.innerHTML = '<svg class="Icon DownIcon FloatingSelect-icon" focusable="false" viewBox="0 0 32 32"><path d="M16,22.5c-0.3,0-0.7-0.1-0.9-0.3l-11-9c-0.6-0.5-0.7-1.5-0.2-2.1c0.5-0.6,1.5-0.7,2.1-0.2L16,19.1l10-8.2c0.6-0.5,1.6-0.4,2.1,0.2c0.5,0.6,0.4,1.6-0.2,2.1l-11,9C16.7,22.4,16.3,22.5,16,22.5z"></path></svg>';
        taskAncestryAncestorProjects.insertBefore(taskAncestryAncestorProjectSectionSelector, taskAncestryAncestorProjects.querySelector('#Project' + projectGid).nextSibling);
        taskAncestryAncestorProjectSectionSelector.addEventListener('click', function () {
          clickSectionSelector(this);
        });
      }
    });
  });
  deleteProjectNamesOnTop();
  var singleTaskPaneBody = document.querySelector('.SingleTaskPane-body');
  var singleTaskPaneTitleRow = document.querySelector('.SingleTaskPane-titleRow');
  if (singleTaskPaneBody) singleTaskPaneBody.insertBefore(taskAncestry, singleTaskPaneTitleRow);
};

var displayReplaceDescriptionDialog = function () {
  var replaceDescriptionDialog = document.createElement('DIV');
  replaceDescriptionDialog.setAttribute('id', 'ReplaceDescriptionDialogView');
  replaceDescriptionDialog.setAttribute('class', 'tab-ring');
  replaceDescriptionDialog.setAttribute('tabindex', '-1');
  replaceDescriptionDialog.innerHTML = returnReplaceDescriptionInnerHTML();
  document.body.appendChild(replaceDescriptionDialog);
  document.querySelector('#CloseReplaceDescriptionDialogButton').addEventListener('click', closeReplaceDescriptionDialog);
  document.querySelectorAll('.delete-row-link').forEach(link => link.addEventListener('click', function (event) {deleteUserReplaceTextRow(event.target);}));
  document.querySelector('#AddRowToUserReplaceTextListLink').addEventListener('click', addRowToUserReplaceTextList);
  document.querySelector('#SaveUserReplaceTextListLink').addEventListener('click', saveUserReplaceTextList);
  addRowToUserReplaceTextList();
  var replaceDescriptionDialogPresetButton = document.querySelector('#ReplaceDescriptionDialogPresetButton');
  replaceDescriptionDialogPresetButton.addEventListener('click', replaceDescriptionPreset);
  var replaceDescriptionDialogUserButton = document.querySelector('#ReplaceDescriptionDialogUserButton');
  replaceDescriptionDialogUserButton.addEventListener('click', replaceDescriptionUserText);
  replaceDescriptionDialogPresetButton.focus();

  replaceDescriptionDialog.addEventListener('keydown', function (event) {
    switch (event.key){
      case 'Enter':
        if (document.activeElement === replaceDescriptionDialogPresetButton) {
          replaceDescriptionDialogPresetButton.click();
        } else if (document.activeElement === replaceDescriptionDialogUserButton) {
          replaceDescriptionDialogUserButton.click();
        }
        break;
      case 'Escape':
        event.preventDefault();
        break;
      case 'Tab':
        document.tabKeyIsDownOnModal = true;
        if (document.activeElement === replaceDescriptionDialogPresetButton && event.shiftKey) {
          replaceDescriptionDialogUserButton.focus();
          event.preventDefault();
        } else if (document.activeElement === replaceDescriptionDialogUserButton && !event.shiftKey) {
          replaceDescriptionDialogPresetButton.focus();
          event.preventDefault();
        }
        event.stopPropagation();
        break;
    }
  });
};

var displaySetParentDrawer = function () {
  if (document.querySelector('.SetParentDrawer')) return;
  var singleTaskPaneBody = document.querySelector('.SingleTaskPane-body');
  if (!singleTaskPaneBody) return;
  var setParentDrawer = document.createElement('DIV');
  setParentDrawer.setAttribute('class', 'Drawer SetParentDrawer');
  setParentDrawer.innerHTML = '<a class="CloseButton Drawer-closeButton" id="SetParentDrawerCloseButton"><svg class="Icon XIcon CloseButton-xIcon" focusable="false" viewBox="0 0 32 32"><path d="M18.1,16l8.9-8.9c0.6-0.6,0.6-1.5,0-2.1c-0.6-0.6-1.5-0.6-2.1,0L16,13.9L7.1,4.9c-0.6-0.6-1.5-0.6-2.1,0c-0.6,0.6-0.6,1.5,0,2.1l8.9,8.9l-8.9,8.9c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path></svg></a>' +
  `<div class="switch-view SetParentSwitchView"><p>${locStrings['drawerLabel-setParent']}</p><p>${locStrings['drawerSwitch-setParent-var-button'].replace('{button}', '&nbsp;<span id="SetParentSwitch" class="switch"></span>&nbsp;')}</p></div><input autocomplete="off" class="textInput textInput--medium SetParentDrawer-typeaheadInput" placeholder="${locStrings['drawerPlaceholder-setParent']}" type="text" role="combobox" value=""><noscript></noscript></div>`;

  var singleTaskPaneTopmostElement = document.querySelector('.SingleTaskPaneBanners') || document.querySelector('.SingleTaskPaneToolbar');
  singleTaskPaneBody.insertBefore(setParentDrawer, singleTaskPaneTopmostElement.nextSibling);

  document.querySelector('#SetParentDrawerCloseButton').addEventListener('click', function () {
    closeSetParentDrawer();
  });
  document.querySelector('#SetParentSwitch').addEventListener('click', function () {
    toggleSetParentSwitch(this);
  });

  var setParentDrawerTypeaheadInput = document.querySelector('.SetParentDrawer-typeaheadInput');
  var taskGid = findTaskGid(window.location.href);
  ['click', 'focus', 'input'].forEach(function (e) {
    setParentDrawerTypeaheadInput.addEventListener(e, function (event) {
      var that = this;
      callAsanaApi('GET', `tasks/${taskGid}`, {}, {}, function (response) {
        var workspaceGid = response.data.workspace.gid;
          createSetParentDropdownContainer(that, taskGid, workspaceGid);
      });
    });
  });
  document.addEventListener('click', listenToClickToCloseSetParentDropdown);
  setParentDrawerTypeaheadInput.focus();
  saveOriginalParent();
};

var displaySuccessToast = function (task, messageVarTask, callback) {
  var toastManager = document.querySelector('.ToastManager');
  if (!toastManager) return;
  var toastDiv = document.createElement('DIV');
  toastDiv.innerHTML = '<div class="ToastManager-toastContainer"><div class="ToastNotification SuccessToast"><div class="ToastNotificationContent"><div class="ToastNotificationContent-firstRow"><div class="ToastNotificationContent-text"><span>' +
  messageVarTask.replace('{task}', `<a class="NavigationLink ToastNotification-link" href="https://app.asana.com/0/0/${task.gid}">${(task.completed)? '✓ ': ''}${escapeHtml(task.name)}</a> `) +
    '</span></div><a class="CloseButton"><svg class="Icon XIcon CloseButton-xIcon" focusable="false" viewBox="0 0 32 32"><path d="M18.1,16l8.9-8.9c0.6-0.6,0.6-1.5,0-2.1c-0.6-0.6-1.5-0.6-2.1,0L16,13.9L7.1,4.9c-0.6-0.6-1.5-0.6-2.1,0c-0.6,0.6-0.6,1.5,0,2.1l8.9,8.9l-8.9,8.9c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path></svg></a></div>' +
    `<div class="Button Button--small Button--secondary" tabindex="0" role="button" aria-disabled="false">${locStrings['toastButtton-undo']}</div></div></div></div>`;
  var closeButton = toastDiv.firstElementChild.firstElementChild.firstElementChild.firstElementChild.children[1];
  closeButton.addEventListener('click', function () {
    toastDiv.remove();
  });
  var undoButton = toastDiv.firstElementChild.firstElementChild.firstElementChild.children[1];
  undoButton.addEventListener('click', function () {
    undoButton.outerText = locStrings['toastButtton-undoing'];
    callback(function () {
      toastDiv.remove();
    });
  });
  toastManager.appendChild(toastDiv);
  setTimeout(function () {
    toastDiv.remove();
  }, 15000);
};

var escapeHtml = function (text) {
  var map = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&apos;'
  };
  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
};

var findProjectGid = function (url) { // gid spec might change
  var projectGidRegexPattern = /https:\/\/app\.asana\.com\/0\/(\d+)\/\d+\/?f?/;
  var findProjectGidMatch = projectGidRegexPattern.exec(url);
  if (findProjectGidMatch) return findProjectGidMatch[1];
};

var findTaskGid = function (url) { // gid spec might change
  var taskGidRegexPatterns = [
    /https:\/\/app\.asana\.com\/0\/\d+\/(\d+)\/?f?/,
    /https:\/\/app\.asana\.com\/0\/inbox\/\d+\/(\d+)\/\d+\/?f?/,
    /https:\/\/app\.asana\.com\/0\/search\/\d+\/(\d+)\/?f?/
  ];
  for (var i = 0; i < taskGidRegexPatterns.length; i++) {
    var pattern = taskGidRegexPatterns[i];
    if (pattern.exec(url)) {
      return pattern.exec(url)[1];
    }
  }
};

var getLocaleAndSetLocalizedStrings = function () {
  var locale = 'en';
  var scriptArray = Array.from(document.scripts);
  for (var i = 0; i < scriptArray.length; i++) {
    var match = /cloudfront\.net\/compressed\/build\/bundles\/[0-9a-f]+\/translations\/([a-z]{2})\.bundle\.js/.exec(scriptArray[i].src);
    if (match) {
      if (localizationStrings.hasOwnProperty(match[1])) locale = match[1];
      break;
    }
  }
  for (var key in localizationStrings.en) {
    if (localizationStrings[locale].hasOwnProperty(key)) {
      locStrings[key] = localizationStrings[locale][key];
    } else {
      locStrings[key] = localizationStrings.en[key];
    }
  }
};

var getPlatformAndSetPlatStrings = function () {
  var platform = 'win';
  if (window.navigator.platform.indexOf('Mac') != -1) platform = 'mac';
  for (var key in platformStrings.win) {
    if (platformStrings[platform].hasOwnProperty(key)) {
      platStrings[key] = platformStrings[platform][key];
    } else {
      platStrings[key] = platformStrings.win[key];
    }
  }
};

var getUserReplaceTextList = function () {
  var userTextToReplaceDialogTable = document.querySelector('#UserTextToReplaceDialogTable');
  if (!userTextToReplaceDialogTable) return;
  var userTextToReplaceDialogTr = userTextToReplaceDialogTable.firstElementChild.children;
  var userReplaceTextList = [];
  for (var i = 1; i < userTextToReplaceDialogTr.length; i++) {
    const element = userTextToReplaceDialogTr[i];
    if (!element.firstElementChild.firstElementChild.value) continue;
    userReplaceTextList.push([element.firstElementChild.firstElementChild.value, element.children[1].firstElementChild.value]);
  }
  return userReplaceTextList;
};

var listenToClickOnKeyboardShortcutList = function () {
  var topbarHelpMenuButton = document.querySelector('.topbarHelpMenuButton');
  if (topbarHelpMenuButton) topbarHelpMenuButton.addEventListener('click', function () {
    setTimeout(function () {
      var menuItems = document.querySelectorAll('.menuItem-button.menuItem--small');
      var helpButtonKeyboardShortcuts;
      for (var i = 0; i < menuItems.length; i++) {
        if (menuItems[i].firstElementChild.innerText === locStrings['helpButton-keyboardShortcuts']) {
          helpButtonKeyboardShortcuts = menuItems[i];
          break;
        }
      }
      helpButtonKeyboardShortcuts.addEventListener('click', function () {
        setTimeout(function () {
          addToKeyboardShortcutsList();
        }, 100);
      });
    }, 100);
  });
};

var listenToClickToCloseSetParentDropdown = function (event) {
  var setParentDrawer = document.querySelector('.SetParentDrawer');
  if (setParentDrawer) {
    if (!setParentDrawer.contains(event.target)) {
      deleteSetParentTypeaheadDropdown();
    }
  }
};

var listenToClickToCloseSiblingSubtasksDropdown = function (event) {
  var siblingButtons = document.querySelector('#SiblingButtons');
  var siblingDropdown = document.querySelector('#SiblingSubtasksDropdownContainer');
  if (siblingDropdown) {
    if (!siblingButtons.contains(event.target) && !siblingDropdown.contains(event.target)) {
        deleteSiblingSubtasksDropdown();
    }
  }
};

var loadUserReplaceTextList = function () {
  chrome.storage.sync.get({
    'anOptionsPairs': []
  }, function (items) {
    document.loadedUserReplaceTextList = items.anOptionsPairs;
  });
};

var openPageWithoutRefresh = function (newUrl) {
  window.history.pushState({}, '', newUrl);
  window.history.back();
  setTimeout(function () {
    window.history.forward();
  }, 100);
};

var populateFromTypeahead = function (taskGid, workspaceGid, queryValue, potentialTask) {
  callAsanaApi('GET', `workspaces/${workspaceGid}/typeahead`, {'type': 'task','query': queryValue, 'opt_fields': 'completed,name,parent.name,projects.name'}, {}, function (response) {
    var typeaheadSearchScrollableContents = document.querySelector('.TypeaheadSearchScrollable-contents');
    while (typeaheadSearchScrollableContents && typeaheadSearchScrollableContents.lastElementChild) {
      typeaheadSearchScrollableContents.lastElementChild.remove();
    }
    if (potentialTask) response.data.unshift(potentialTask);
    for (var i = 0; i < response.data.length; i++) {
      if (response.data[i].gid === taskGid) continue;
      if (response.data[i].name.endsWith(':')) continue;
      var dropdownItem = document.createElement('DIV');
      dropdownItem.innerHTML = returnTypeAheadInnerHTML(response.data[i]);
      typeaheadSearchScrollableContents.appendChild(dropdownItem);
      dropdownItem.addEventListener('mouseover', function () {
        this.firstElementChild.firstElementChild.classList.add('TypeaheadItemStructure--highlighted');
      });
      dropdownItem.addEventListener('mouseout', function () {
        this.firstElementChild.firstElementChild.classList.remove('TypeaheadItemStructure--highlighted');
      });
      dropdownItem.addEventListener('click', function () {
        var parentGid = this.firstElementChild.dataset.taskGid;
        var setParentOptions = {'parent': parentGid};
        if (document.querySelector('#SetParentSwitch').classList.contains('checked')) {
          setParentOptions.insert_before = null;
        } else {
          setParentOptions.insert_after = null;
        }
        setNewParentTask(taskGid, setParentOptions);
      });
    }
    if (!typeaheadSearchScrollableContents.children.length) {
      var dropdownItemHintText = document.createElement('DIV');
      dropdownItemHintText.setAttribute('class', 'HintTextTypeaheadItem');
      dropdownItemHintText.innerText = locStrings['typeaheadItem-NoMatch'];
      typeaheadSearchScrollableContents.appendChild(dropdownItemHintText);
    }
  });
};

var replaceDescription = function (replaceTextList) {
  var taskGid = findTaskGid(window.location.href);
  if (isNaN(taskGid)) return; // gid spec might change
  callAsanaApi('GET', `tasks/${taskGid}`, {'opt_fields': 'html_notes'}, {}, function (response) {
    var htmlNotesOriginal = response.data.html_notes;
    var htmlNotes = htmlNotesOriginal.replace(/^<body>/, '').replace(/<\/body>$/, '');
    for (var i = 0; i < replaceTextList.length; i ++) {
      var pair = replaceTextList[i];
      htmlNotes = htmlNotes.replace(pair[0], pair[1]);
    }
    callAsanaApi('PUT', `tasks/${taskGid}`, {}, {'html_notes': '<body>' + htmlNotes + '</body>'}, function (response) {
      closeSingleTaskPaneExtraActionsMenu();
      closeReplaceDescriptionDialog();
      displaySuccessToast(response.data, locStrings['toastContent-descriptionReplaced-var-task'], function (callback) {
        callAsanaApi('PUT', `tasks/${taskGid}`, {}, {'html_notes': htmlNotesOriginal}, function (response) {
          callback();
        });
      });
    });
  });
};

var replaceDescriptionPreset = function () {
  var replaceTextList = replaceTextListRegex.concat(replaceTextListEntity);
  replaceDescription(replaceTextList);
};

var replaceDescriptionUserText = function () {
  var userReplaceTextList = getUserReplaceTextList().map(a => [new RegExp(escapeHtml(a[0]), 'gm'), escapeHtml(a[1])]);
  if (!userReplaceTextList.length) {
    var replaceDescriptionDialogUserButton = document.querySelector('#ReplaceDescriptionDialogUserButton');
    replaceDescriptionDialogUserButton.classList.add('is-disabled');
    setTimeout(function () {
      replaceDescriptionDialogUserButton.classList.remove('is-disabled');
    }, 2000);
    return;
  }
  replaceDescription(userReplaceTextList);
};

// exclude XML entities: [['&amp;', '&'], ['&gt;', '>'], ['&lt;', '<'], ['&quot;', '"']]
var replaceTextListEntity = [['&Aacute;', 'Á'], ['&aacute;', 'á'], ['&Acirc;', 'Â'], ['&acirc;', 'â'], ['&acute;', '´'], ['&AElig;', 'Æ'], ['&aelig;', 'æ'], ['&Agrave;', 'À'], ['&agrave;', 'à'], ['&Alpha;', 'Α'], ['&alpha;', 'α'], ['&and;', '∧'], ['&ang;', '∠'], ['&apos;', '\''], ['&Aring;', 'Å'], ['&aring;', 'å'], ['&asymp;', '≈'], ['&Atilde;', 'Ã'], ['&atilde;', 'ã'], ['&Auml;', 'Ä'], ['&auml;', 'ä'], ['&bdquo;', '„'], ['&Beta;', 'Β'], ['&beta;', 'β'], ['&brvbar;', '¦'], ['&bull;', '•'], ['&cap;', '∩'], ['&Ccedil;', 'Ç'], ['&ccedil;', 'ç'], ['&cedil;', '¸'], ['&cent;', '¢'], ['&Chi;', 'Χ'], ['&chi;', 'χ'], ['&circ;', 'ˆ'], ['&clubs;', '♣'], ['&cong;', '≅'], ['&copy;', '©'], ['&crarr;', '↵'], ['&cup;', '∪'], ['&curren;', '¤'], ['&dagger;', '†'], ['&Dagger;', '‡'], ['&dArr;', '⇓'], ['&darr;', '↓'], ['&deg;', '°'], ['&Delta;', 'Δ'], ['&delta;', 'δ'], ['&diams;', '♦'], ['&divide;', '÷'], ['&Eacute;', 'É'], ['&eacute;', 'é'], ['&Ecirc;', 'Ê'], ['&ecirc;', 'ê'], ['&Egrave;', 'È'], ['&egrave;', 'è'], ['&empty;', '∅'], ['&emsp;', ' '], ['&ensp;', ' '], ['&Epsilon;', 'Ε'], ['&epsilon;', 'ε'], ['&equiv;', '≡'], ['&Eta;', 'Η'], ['&eta;', 'η'], ['&ETH;', 'Ð'], ['&eth;', 'ð'], ['&Euml;', 'Ë'], ['&euml;', 'ë'], ['&euro;', '€'], ['&exist;', '∃'], ['&fnof;', 'ƒ'], ['&forall;', '∀'], ['&frac12;', '½'], ['&frac14;', '¼'], ['&frac34;', '¾'], ['&Gamma;', 'Γ'], ['&gamma;', 'γ'], ['&ge;', '≥'], ['&hArr;', '⇔'], ['&harr;', '↔'], ['&hearts;', '♥'], ['&hellip;', '…'], ['&Iacute;', 'Í'], ['&iacute;', 'í'], ['&Icirc;', 'Î'], ['&icirc;', 'î'], ['&iexcl;', '¡'], ['&Igrave;', 'Ì'], ['&igrave;', 'ì'], ['&infin;', '∞'], ['&int;', '∫'], ['&Iota;', 'Ι'], ['&iota;', 'ι'], ['&iquest;', '¿'], ['&isin;', '∈'], ['&Iuml;', 'Ï'], ['&iuml;', 'ï'], ['&Kappa;', 'Κ'], ['&kappa;', 'κ'], ['&Lambda;', 'Λ'], ['&lambda;', 'λ'], ['&laquo;', '«'], ['&lArr;', '⇐'], ['&larr;', '←'], ['&lceil;', '⌈'], ['&ldquo;', '“'], ['&le;', '≤'], ['&lfloor;', '⌊'], ['&lowast;', '∗'], ['&loz;', '◊'], ['&lrm;', '‎'], ['&lsaquo;', '‹'], ['&lsquo;', '‘'], ['&macr;', '¯'], ['&mdash;', '—'], ['&micro;', 'µ'], ['&middot;', '·'], ['&minus;', '−'], ['&Mu;', 'Μ'], ['&mu;', 'μ'], ['&nabla;', '∇'], ['&ndash;', '–'], ['&ne;', '≠'], ['&ni;', '∋'], ['&not;', '¬'], ['&notin;', '∉'], ['&nsub;', '⊄'], ['&Ntilde;', 'Ñ'], ['&ntilde;', 'ñ'], ['&Nu;', 'Ν'], ['&nu;', 'ν'], ['&Oacute;', 'Ó'], ['&oacute;', 'ó'], ['&Ocirc;', 'Ô'], ['&ocirc;', 'ô'], ['&OElig;', 'Œ'], ['&oelig;', 'œ'], ['&Ograve;', 'Ò'], ['&ograve;', 'ò'], ['&oline;', '‾'], ['&Omega;', 'Ω'], ['&omega;', 'ω'], ['&Omicron;', 'Ο'], ['&omicron;', 'ο'], ['&oplus;', '⊕'], ['&or;', '∨'], ['&ordf;', 'ª'], ['&ordm;', 'º'], ['&Oslash;', 'Ø'], ['&oslash;', 'ø'], ['&Otilde;', 'Õ'], ['&otilde;', 'õ'], ['&otimes;', '⊗'], ['&Ouml;', 'Ö'], ['&ouml;', 'ö'], ['&para;', '¶'], ['&part;', '∂'], ['&permil;', '‰'], ['&perp;', '⊥'], ['&Phi;', 'Φ'], ['&phi;', 'φ'], ['&Pi;', 'Π'], ['&pi;', 'π'], ['&piv;', 'ϖ'], ['&plusmn;', '±'], ['&pound;', '£'], ['&prime;', '′'], ['&Prime;', '″'], ['&prod;', '∏'], ['&prop;', '∝'], ['&Psi;', 'Ψ'], ['&psi;', 'ψ'], ['&radic;', '√'], ['&raquo;', '»'], ['&rArr;', '⇒'], ['&rarr;', '→'], ['&rceil;', '⌉'], ['&rdquo;', '”'], ['&reg;', '®'], ['&rfloor;', '⌋'], ['&Rho;', 'Ρ'], ['&rho;', 'ρ'], ['&rlm;', '‏'], ['&rsaquo;', '›'], ['&rsquo;', '’'], ['&sbquo;', '‚'], ['&Scaron;', 'Š'], ['&scaron;', 'š'], ['&sdot;', '⋅'], ['&sect;', '§'], ['&Sigma;', 'Σ'], ['&sigma;', 'σ'], ['&sigmaf;', 'ς'], ['&sim;', '∼'], ['&spades;', '♠'], ['&sub;', '⊂'], ['&sube;', '⊆'], ['&sum;', '∑'], ['&sup1;', '¹'], ['&sup2;', '²'], ['&sup3;', '³'], ['&sup;', '⊃'], ['&supe;', '⊇'], ['&szlig;', 'ß'], ['&Tau;', 'Τ'], ['&tau;', 'τ'], ['&there4;', '∴'], ['&Theta;', 'Θ'], ['&theta;', 'θ'], ['&thetasym;', 'ϑ'], ['&thinsp;', ' '], ['&THORN;', 'Þ'], ['&thorn;', 'þ'], ['&tilde;', '˜'], ['&times;', '×'], ['&trade;', '™'], ['&Uacute;', 'Ú'], ['&uacute;', 'ú'], ['&uArr;', '⇑'], ['&uarr;', '↑'], ['&Ucirc;', 'Û'], ['&ucirc;', 'û'], ['&Ugrave;', 'Ù'], ['&ugrave;', 'ù'], ['&uml;', '¨'], ['&upsih;', 'ϒ'], ['&Upsilon;', 'Υ'], ['&upsilon;', 'υ'], ['&Uuml;', 'Ü'], ['&uuml;', 'ü'], ['&Xi;', 'Ξ'], ['&xi;', 'ξ'], ['&Yacute;', 'Ý'], ['&yacute;', 'ý'], ['&yen;', '¥'], ['&Yuml;', 'Ÿ'], ['&yuml;', 'ÿ'], ['&Zeta;', 'Ζ'], ['&zeta;', 'ζ'], ['&zwj;', '‍'], ['&zwnj;', '‌']].map(a => [new RegExp(a[0].replace('&', '&amp;'), 'g'), a[1]]);

var replaceTextListRegex = [[/(?:&lt;|&quot;|')?(<a href=")(mailto:)?([A-Za-z0-9\-:;/._=+&%?!#$'@]+)(">)\3(<\/a>)(\?)?(?:&gt;|&quot;|')? &lt;\2?\1\2\3[\/\s]*\4\3[\/\s]*\5\6&gt;(?:&gt;|&quot;|')?/g, '$1$2$3$4$3$5$6']];

var returnReplaceDescriptionInnerHTML = function () {
  return `<div>
    <div class="dialog-background"></div>
    <div id="ReplaceDescriptionDialog" class="dialog-box FloatCenterDialog">
      <div><div class="dialogView2-closeX borderless-button" id="CloseReplaceDescriptionDialogButton"><svg class="svgIcon" viewBox="0 0 32 32" title="close dialog"><path d="M18.1,16l8.9-8.9c0.6-0.6,0.6-1.5,0-2.1c-0.6-0.6-1.5-0.6-2.1,0L16,13.9L7.1,4.9c-0.6-0.6-1.5-0.6-2.1,0c-0.6,0.6-0.6,1.5,0,2.1l8.9,8.9l-8.9,8.9c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path></svg></div><div class="dialog-title">${locStrings['menuButton-replaceDescription'].replace('...', '')}</div></div>
      <div class="content">
        <div class="loading-boundary">
          <div class="form-view">
            <table>
              <tr class="name-row"><td>${locStrings['dialogLabel-replaceWith-var-text'].replace('{text}', '</td><td>')}</td></tr>
              <tr class="name-row">
                <td class="field-value"><input autocomplete="off" class="generic-input showing" type="text" value="${locStrings['dialogPlaceholder-HTMLEntities']} (${locStrings['snippet-example']}&amp;hearts;)" disabled></td>
                <td class="field-value"><input autocomplete="off" class="generic-input showing" type="text" value="${locStrings['dialogPlaceholder-HTMLSymbols']} (${locStrings['snippet-example']}♥)" disabled></td>
              </tr>
              <tr class="name-row">
                <td class="field-value"><input autocomplete="off" class="generic-input showing" type="text" value="${locStrings['dialogPlaceholder-duplicateLinks']} (${locStrings['snippet-example']}https://app.asana.com/ <https://app.asana.com/>)" disabled></td>
                <td class="field-value"><input autocomplete="off" class="generic-input showing" type="text" value="${locStrings['dialogPlaceholder-singleString']} (${locStrings['snippet-example']}https://app.asana.com/)" disabled></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="buttons"><div class="buttonView new-button new-primary-button buttonView--primary buttonView--large" id="ReplaceDescriptionDialogPresetButton" tabindex="0"><span class="new-button-text">${locStrings['dialogButton-usePreset']}</span></div></div>
      <div class="divider"></div>
      <div class="content scrollable scrollable--vertical ReplaceUserTextSection">
        <div class="ReplaceUserTextSectionDescription">${locStrings['dialogMessage-userStrings']}<br>${locStrings['dialogMessage-regularExpression']}${locStrings['snippet-spacing']}${locStrings['dialogMessage-visitReference-var-link'].replace('{link}', '<a href="https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions" rel="noopener noreferrer" tabindex="-1" target="_blank">MDN</a>')}</div>
        <div class="loading-boundary">
          <div class="form-view">
            <table id="UserTextToReplaceDialogTable">
              <tr class="name-row"><td>${locStrings['dialogLabel-replaceWith-var-text'].replace('{text}', '</td><td>')}</td><td></td></tr>${document.loadedUserReplaceTextList.map(a => `<tr class="name-row">
              <td class="field-value"><input autocomplete="off" class="generic-input showing" type="text" tabindex="0" value="` + escapeHtml(a[0]) + `"></td>
              <td class="field-value"><input autocomplete="off" class="generic-input showing" type="text" tabindex="0" value="` + escapeHtml(a[1]) + `"></td>
              <td><a class="delete-row-link">&nbsp;×</a></td>
            </tr>`).join('')}
            </table>
          </div>
        </div>
        <div>
          <a id="AddRowToUserReplaceTextListLink">+ ${locStrings['dialogLink-addRow']}</a>
          <a class="SaveTextLink" id="SaveUserReplaceTextListLink">${locStrings['snippet-save']}</a>
        </div>
      </div>
      <div class="footer-top"></div>
      <div class="buttons"><div class="buttonView new-button new-primary-button buttonView--primary buttonView--large" tabindex="0" id="ReplaceDescriptionDialogUserButton"><span class="new-button-text">${locStrings['dialogButton-replaceText']}</span></div></div>
    </div>
  </div>`;
};

var returnTypeAheadInnerHTML = function (task) {
  var parentName = (task.parent)? task.parent.name: '';
  var projectNameList = (task.projects)? task.projects.map(a => a.name).join(', '): '';
  return `<div role="option" data-task-gid="${task.gid}" title="` +
  escapeHtml(task.name) + `${(parentName)? '&#13;‹ ' + escapeHtml(parentName): ''}` + `${(projectNameList)? '&#13;(' + escapeHtml(projectNameList) + ')': ''}` +
  '"><div class="TypeaheadItemStructure TypeaheadItemStructure--enabled"><div class="TypeaheadItemStructure-icon">' +
  `${(task.completed)? '<svg class="Icon CheckCircleFullIcon TaskTypeaheadItem-completedIcon" focusable="false" viewBox="0 0 32 32"><path d="M16,0C7.2,0,0,7.2,0,16s7.2,16,16,16s16-7.2,16-16S24.8,0,16,0z M23.3,13.3L14,22.6c-0.3,0.3-0.7,0.4-1.1,0.4s-0.8-0.1-1.1-0.4L8,18.8c-0.6-0.6-0.6-1.5,0-2.1s1.5-0.6,2.1,0l2.8,2.8l8.3-8.3c0.6-0.6,1.5-0.6,2.1,0S23.9,12.7,23.3,13.3z"></path></svg>': '<svg class="Icon CheckCircleIcon TaskTypeaheadItem-incompletedIcon" focusable="false" viewBox="0 0 32 32"><path d="M16,32C7.2,32,0,24.8,0,16S7.2,0,16,0s16,7.2,16,16S24.8,32,16,32z M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z"></path><path d="M12.9,22.6c-0.3,0-0.5-0.1-0.7-0.3l-3.9-3.9C8,18,8,17.4,8.3,17s1-0.4,1.4,0l3.1,3.1l8.6-8.6c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-9.4,9.4C13.4,22.5,13.2,22.6,12.9,22.6z"></path></svg>'}` +
  `</div><div class="TypeaheadItemStructure-label"><div class="TypeaheadItemStructure-title"><span><span>${escapeHtml(task.name)}</span></span>` +
  `${(parentName)? '<span class="TaskTypeaheadItem-parentTask">' + escapeHtml(parentName) + '</span>': ''}`+
  '</div>' +
  `${(projectNameList)? '<div class="TypeaheadItemStructure-subtitle">' + escapeHtml(projectNameList) + '</div>': ''}`+
  '</div></div></div>';
};

var runOptionalFunctionsOnLoad = function () {
  chrome.storage.sync.get({
    'anOptionsProjects': true,
    'anOptionsSubtasks': true,
    'anOptionsShortcuts': true,
    'anOptionsParent': true,
    'anOptionsDescription': true
  }, function (items) {
    if (items.anOptionsProjects) displayProjectsOnTop();
    if (items.anOptionsSubtasks) displayLinksToSiblingSubtasks();
    if (items.anOptionsShortcuts) listenToClickOnKeyboardShortcutList();
    if (items.anOptionsParent) addSetParentToExtraActions();
    if (items.anOptionsDescription) addReplaceDescriptionToExtraActions();
  });
};

var runOptionalFunctionsAfterDelay = function (delay) {
  chrome.storage.sync.get({
    'anOptionsProjects': true,
    'anOptionsSubtasks': true,
    'anOptionsParent': true,
    'anOptionsDescription': true
  }, function (items) {
    setTimeout(function () {
      if (items.anOptionsProjects) displayProjectsOnTop();
      if (items.anOptionsSubtasks) displayLinksToSiblingSubtasks();
      if (items.anOptionsParent) addSetParentToExtraActions();
      if (items.anOptionsDescription) addReplaceDescriptionToExtraActions();
    }, delay);
  });
};

var saveOriginalParent = function () {
  var taskGid = findTaskGid(window.location.href);
  var setParentDrawer = document.querySelector('.SetParentDrawer');
  var taskAncestryTaskLinks = document.querySelectorAll('.NavigationLink.TaskAncestry-ancestorLink');
  if (!taskAncestryTaskLinks.length) {
    setParentDrawer.setAttribute('data-original-parent-gid', null);
    setParentDrawer.setAttribute('data-original-previous-sibling-gid', null);
  } else {
    var originalParentGid = findTaskGid(taskAncestryTaskLinks[taskAncestryTaskLinks.length - 1].href);
    callAsanaApi('GET', `tasks/${originalParentGid}/subtasks`, {}, {}, function (response) {
      var subtaskList = response.data;
      var indexCurrent;
      for (var i = 0; i < subtaskList.length; i++) {
        if (subtaskList[i].gid === taskGid) {
          indexCurrent = i;
          break;
        }
      }
      var originalPreviousSiblingGid = (indexCurrent > 0)? subtaskList[indexCurrent - 1].gid: null;
      setParentDrawer.setAttribute('data-original-parent-gid', originalParentGid);
      setParentDrawer.setAttribute('data-original-previous-sibling-gid', originalPreviousSiblingGid);
    });
  }
};

var saveUserReplaceTextList = function () {
  var userReplaceTextList = getUserReplaceTextList();
  chrome.storage.sync.set({
    'anOptionsPairs': userReplaceTextList
  }, function () {
    document.loadedUserReplaceTextList = userReplaceTextList;
    var saveTextLink = document.querySelector('#SaveUserReplaceTextListLink');
    var savedText = '✓ ';
    saveTextLink.textContent = savedText + saveTextLink.textContent;
    setTimeout(function () {
      saveTextLink.textContent = saveTextLink.textContent.replace(savedText, '');
    }, 2000);
  });
};

var setNewParentTask = function (taskGid, setParentOptions) {
  var setParentDrawer = document.querySelector('.SetParentDrawer');
  var originalParentGid = setParentDrawer.dataset.originalParentGid;
  var originalPreviousSiblingGid = setParentDrawer.dataset.originalPreviousSiblingGid;
  callAsanaApi('POST', `tasks/${taskGid}/setParent`, {}, setParentOptions, function (response) {
    closeSetParentDrawer();
    displaySuccessToast(response.data, locStrings['toastContent-setParent-var-task'], function (callback) {
      callAsanaApi('POST', `tasks/${taskGid}/setParent`, {}, {'parent': originalParentGid, 'insert_after': originalPreviousSiblingGid}, function (response) {
        callback();
        runOptionalFunctionsAfterDelay(100);
      });
    });
    runOptionalFunctionsAfterDelay(100);
  });
};

var toggleSetParentSwitch = function (input) {
  if (input.classList.contains('checked')) {
    input.classList.remove('checked');
  } else {
    input.classList.add('checked');
  }
};

document.tabKeyIsDown = false;
document.tabKeyIsDownOnModal = false;

document.addEventListener('keydown', function (event) {
  switch (event.key){
    case 'Tab':
      document.tabKeyIsDown = true;
      break;
    case '/':
      if (event.metaKey || event.ctrlKey) {
        chrome.storage.sync.get({'anOptionsShortcuts': true}, function (items) {
          if (items.anOptionsShortcuts) addToKeyboardShortcutsList();
        });
      }
      break;
      case 'ArrowDown':
      if (document.tabKeyIsDown && event.shiftKey) {
        var arrowNextSubtask = document.querySelector('#ArrowNextSubtask');
        if (arrowNextSubtask) arrowNextSubtask.click();
      }
      break;
      case 'ArrowRight':
      if (document.tabKeyIsDown && event.shiftKey) {
        if (document.querySelector('#SiblingSubtasksDropdownContainer')) {
          deleteSiblingSubtasksDropdown();
        } else {
          var arrowMiddleSubtask = document.querySelector('#ArrowMiddleSubtask');
          if (arrowMiddleSubtask) arrowMiddleSubtask.click();
        }
      }
      break;
      case 'ArrowUp':
        if (document.tabKeyIsDown && event.shiftKey) {
          var arrowPreviousSubtask = document.querySelector('#ArrowPreviousSubtask');
          if (arrowPreviousSubtask) arrowPreviousSubtask.click();
        }
        break;
    case 'e':
      if (document.tabKeyIsDown || document.tabKeyIsDownOnModal) {
        chrome.storage.sync.get({'anOptionsDescription': true}, function (items) {
          if (items.anOptionsDescription) {
            if (document.querySelector('#ReplaceDescriptionDialogView')) {
              closeReplaceDescriptionDialog();
            } else {
              if (document.querySelector('.SingleTaskPane')) displayReplaceDescriptionDialog();
            }
          }
        });
      }
      break;
    case 'g':
      if (document.tabKeyIsDown) {
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

document.addEventListener('keyup', function (event) {
  if (event.key === 'Tab') {
    document.tabKeyIsDown = false;
    document.tabKeyIsDownOnModal = false;
  }
});

window.addEventListener('blur', function () {
  document.tabKeyIsDown = false;
  document.tabKeyIsDownOnModal = false;
});

window.addEventListener('load', function () {
  getLocaleAndSetLocalizedStrings();
  getPlatformAndSetPlatStrings();
  loadUserReplaceTextList();
  runOptionalFunctionsOnLoad();
});

chrome.runtime.onMessage.addListener(
  function (message, sender, sendResponse) {
    if (message.name && message.name === 'asanaNavigatorOnUpdated' && message.status === 'complete') {
      runOptionalFunctionsAfterDelay(400);
    }
});