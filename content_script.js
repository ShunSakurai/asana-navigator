var addReplaceNotesToExtraActions = function () {
  var singleTaskPaneExtraActionsButton = document.querySelector('.SingleTaskPaneExtraActionsButton');
  if (singleTaskPaneExtraActionsButton) {
    singleTaskPaneExtraActionsButton.addEventListener('click', function () {
      var replaceNotesButton = document.createElement('A');
      replaceNotesButton.setAttribute('class', 'menuItem-button menuItem--small SingleTaskPaneExtraActionsButton-replaceNotes SingleTaskPaneExtraActionsButton-menuItem');
      replaceNotesButton.addEventListener('click', function () {
        displayReplaceNotesDialog();
        closeSingleTaskPaneExtraActionsMenu();
      });
      replaceNotesButton.innerHTML = `<span class="menuItem-label"><div class="ExtraActionsMenuItemLabel"><span class="ExtraActionsMenuItemLabel-body">${locStrings['menuButton-replaceNotes']}</span><span class="ExtraActionsMenuItemLabel-shortcut">TAB+E</span></div></span>`;

      setTimeout(function() {
        var nextExtraActionButton = document.querySelector('.SingleTaskPaneExtraActionsButton-makeADuplicate');
        if (nextExtraActionButton) nextExtraActionButton.parentNode.insertBefore(replaceNotesButton, nextExtraActionButton);
      }, 100);
    });
  }
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
      setParentButton.innerHTML = `<span class="menuItem-label"><div class="ExtraActionsMenuItemLabel"><span class="ExtraActionsMenuItemLabel-body">${locStrings['menuButton-setParent']}</span><span class="ExtraActionsMenuItemLabel-shortcut">TAB+R</span></div></span>`;

      setTimeout(function() {
        var nextExtraActionButton = document.querySelector('.SingleTaskPaneExtraActionsButton-convertToProject') || document.querySelector('.SingleTaskPaneExtraActionsButton-print');
        if (nextExtraActionButton) nextExtraActionButton.parentNode.insertBefore(setParentButton, nextExtraActionButton);
      }, 100);
    });
  }
};

var addToKeyboardShortcutsList = function () {
  var keyboardShortcutsModal = document.querySelector('.KeyboardShortcutsModal');
  if (!keyboardShortcutsModal) return;
  var keyboardShortcutsModalANSection = document.createElement('DIV');
  keyboardShortcutsModalANSection.innerHTML = '<h3 class="KeyboardShortcutsModal-sectionHeader">Asana Navigator</h3>';
  keyboardShortcutsModal.firstChild.children[1].lastChild.appendChild(keyboardShortcutsModalANSection);
  var separator = 'separator';
  var shortcutsArray = [
    [locStrings['shortcutDescription-siblingSubtasks'], ['Tab', 'G', separator, 'Tab', 'J']],
    [locStrings['shortcutDescription-subtasksDropdown'], ['Tab', 'N']],
    [locStrings['menuButton-replaceNotes'].replace('...', ''), ['Tab', 'E']],
    [locStrings['menuButton-setParent'].replace('...', ''), ['Tab', 'R']],
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
    if (findProjectGid(taskProjectsProjectList.children[i].children[0].href) === taskProjectsProjectGid) {
      floatingSelectLabel = taskProjectsProjectList.children[i].children[1];
      break;
    }
  }
  floatingSelectLabel.scrollIntoView(false);
  setTimeout(function () {
      floatingSelectLabel.click();
  }, 100);
};

var closeReplaceNotesDialog = function () {
  var replaceNotesDialogView = document.querySelector('#ReplaceNotesDialogView');
  if (replaceNotesDialogView) replaceNotesDialogView.remove();
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
      populateFromTypeahead(taskGid, workspaceGid, input, potentialTask);
    });
  } else {
    populateFromTypeahead(taskGid, workspaceGid, input, potentialTask);
  }
};

var createSiblingSubtasksDropdown = function (subtaskListFiltered, taskGid, containerGid) {
  var siblingDropdown = document.createElement('DIV');
  siblingDropdown.setAttribute('id', 'SiblingSubtasksDropdownContainer');
  siblingDropdown.innerHTML = '<div class="LayerPositioner LayerPositioner--alignRight LayerPositioner--below"><div class="LayerPositioner-layer"><div class="Dropdown scrollable scrollable--vertical SiblingSubtasksDropdownContainer"><div class="menu menu--default">' +
    subtaskListFiltered.map(
      subtask => `<a class="menuItem-button menuItem--small" ${(subtask.name.endsWith(':'))? '': `href="https://app.asana.com/0/${containerGid}/${subtask.gid}`}"><span class="menuItem-label">` +
      `${(subtask.gid === taskGid)? '<strong>&gt;</strong>&nbsp;': ''}${(subtask.name.endsWith(':'))? '<strong><u>' + subtask.name + '</u></strong>': subtask.name}</span></a>`
    ).join('') +
    '</div></div></div>';
  document.querySelector('.SingleTaskPane').appendChild(siblingDropdown);
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

var displayLinksToSiblingSubtasks = function () {
  var taskAncestryTaskLinks = document.querySelectorAll('.NavigationLink.TaskAncestry-ancestorLink');
  if (!taskAncestryTaskLinks.length) {
    deleteSiblingButtons();
    return;
  }
  var parentGid = findTaskGid(taskAncestryTaskLinks[taskAncestryTaskLinks.length - 1].href);
  var taskGid = findTaskGid(window.location.href);
  var containerGid = findProjectGid(window.location.href) || '0';

  callAsanaApi('GET', `tasks/${parentGid}/subtasks`, {}, {}, function (response) {
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
    var innerHTMLPrevious = (indexPrevious || indexPrevious === 0)? `<a href="https://app.asana.com/0/${containerGid}/${subtaskListFiltered[indexPrevious].gid}" id="arrowPreviousSubtask" class="NoBorderBottom TaskAncestry-ancestorLink" title="${locStrings['arrowTitle-previousSubtask']} (Tab+G)&#13;${escapeHtml(subtaskListFiltered[indexPrevious].name)}">∧</a>`: '';
    var innerHTMLMiddle = `<a id="arrowMiddleSubtask" class="NoBorderBottom TaskAncestry-ancestorLink" title="${locStrings['arrowTitle-subtasksDropdown']} (Tab+N)">&gt;</a>`;
    var innerHTMLNext = (indexNext)? `<a href="https://app.asana.com/0/${containerGid}/${subtaskListFiltered[indexNext].gid}" id="arrowNextSubtask" class="NoBorderBottom TaskAncestry-ancestorLink" title="${locStrings['arrowTitle-nextSubtask']} (Tab+J)&#13;${escapeHtml(subtaskListFiltered[indexNext].name)}">∨</a>`: '';
    siblingButtons.innerHTML = [innerHTMLPrevious, innerHTMLMiddle, innerHTMLNext].join('<br>');
    var singleTaskPaneTitleRow = document.querySelector('.SingleTaskPane-titleRow');
    singleTaskPaneTitleRow.appendChild(siblingButtons);
    document.querySelector('#arrowMiddleSubtask').addEventListener('click', function () {createSiblingSubtasksDropdown(subtaskList, taskGid, containerGid);
    });
  });
};

var displayProjectsOnTop = function () {
  var taskProjectsProjectList = document.querySelector('.TaskProjects-projectList');
  var taskAncestryTaskLinks = document.querySelectorAll('.NavigationLink.TaskAncestry-ancestorLink');
  if (!taskProjectsProjectList || taskAncestryTaskLinks.length) {
    deleteProjectNamesOnTop();
    return;
  }
  var taskAncestry = document.createElement('DIV');
  taskAncestry.setAttribute('class', 'TaskAncestry');
  var taskAncestryAncestorProjects = document.createElement('DIV');
  taskAncestryAncestorProjects.setAttribute('class', 'TaskAncestry-ancestorProjects');
  taskAncestryAncestorProjects.setAttribute('id', 'TaskAncestryProjectNamesOnTop');
  taskAncestry.appendChild(taskAncestryAncestorProjects);

  var taskGid = findTaskGid(window.location.href);
  Array.from(taskProjectsProjectList.children).forEach(function(li) {
    var projectUrl = li.children[0].href;
    var projectGid = findProjectGid(projectUrl);
    var projectName = li.children[0].children[0].textContent;

    var taskAncestryAncestorProject = document.createElement('A');
    taskAncestryAncestorProject.setAttribute('class', 'NavigationLink TaskAncestry-ancestorProject');
    taskAncestryAncestorProject.setAttribute('href', `https://app.asana.com/0/${projectGid}/${taskGid}`);
    taskAncestryAncestorProject.textContent = projectName;
    taskAncestryAncestorProject.id = 'project' + projectGid;
    taskAncestryAncestorProjects.appendChild(taskAncestryAncestorProject);

    // Section selectors as DOM elements are loaded later, so fetching them via API
    callAsanaApi('GET', `projects/${projectGid}/sections`, {}, {}, function (response) {
      if (response.data.length) {
        var taskAncestryAncestorProjectSectionSelector = document.createElement('A');
        taskAncestryAncestorProjectSectionSelector.setAttribute('class', 'NoBorderBottom FloatingSelect TaskAncestry-ancestorProject');
        taskAncestryAncestorProjectSectionSelector.innerHTML = '<svg class="Icon DownIcon FloatingSelect-icon" focusable="false" viewBox="0 0 32 32"><path d="M16,22.5c-0.3,0-0.7-0.1-0.9-0.3l-11-9c-0.6-0.5-0.7-1.5-0.2-2.1c0.5-0.6,1.5-0.7,2.1-0.2L16,19.1l10-8.2c0.6-0.5,1.6-0.4,2.1,0.2c0.5,0.6,0.4,1.6-0.2,2.1l-11,9C16.7,22.4,16.3,22.5,16,22.5z"></path></svg>';
        taskAncestryAncestorProjects.insertBefore(taskAncestryAncestorProjectSectionSelector, taskAncestryAncestorProjects.querySelector('#project' + projectGid).nextSibling);
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

var displayReplaceNotesDialog = function () {
  var replaceNotesDialog = document.createElement('DIV');
  replaceNotesDialog.setAttribute('id', 'ReplaceNotesDialogView');
  replaceNotesDialog.setAttribute('class', 'tab-ring');
  replaceNotesDialog.setAttribute('tabindex', '-1');
  replaceNotesDialog.innerHTML = `<div>
    <div class="dialog-background"></div>
    <div id="replace_notes_dialog" class="dialog-box" style="position: fixed; top: 150px;">
      <div><div class="dialogView2-closeX borderless-button" onclick="closeReplaceNotesDialog()"><svg class="svgIcon" viewBox="0 0 32 32" title="close dialog"><path d="M18.1,16l8.9-8.9c0.6-0.6,0.6-1.5,0-2.1c-0.6-0.6-1.5-0.6-2.1,0L16,13.9L7.1,4.9c-0.6-0.6-1.5-0.6-2.1,0c-0.6,0.6-0.6,1.5,0,2.1l8.9,8.9l-8.9,8.9c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path></svg></div><div class="dialog-title">${locStrings['menuButton-replaceNotes'].replace('...', '')}</div></div>
      <div class="content">
        <div class="loading-boundary">
          <div class="form-view">
            <table>
              <tr class="name-row"><td>${locStrings['dialogLabel-replaceWith-list'].join('</td><td>')}</td></tr>
              <tr class="name-row">
                <td class="field-value"><input autocomplete="off" class="generic-input showing" type="text" id="replace_notes_name_input" tabindex="0" value="${locStrings['dialogPlaceholder-HTMLEntities']} (${locStrings['snippet-example']}&amp;hearts;)" disabled></td>
                <td class="field-value"><input autocomplete="off" class="generic-input showing" type="text" id="replace_notes_name_input" tabindex="0" value="${locStrings['dialogPlaceholder-HTMLSymbols']} (${locStrings['snippet-example']}♥)" disabled></td>
              </tr>
              <tr class="name-row">
                <td class="field-value"><input autocomplete="off" class="generic-input showing" type="text" id="replace_notes_name_input" tabindex="0" value="${locStrings['dialogPlaceholder-duplicateLinks']} (${locStrings['snippet-example']}https://app.asana.com/ <https://app.asana.com/>)" disabled></td>
                <td class="field-value"><input autocomplete="off" class="generic-input showing" type="text" id="replace_notes_name_input" tabindex="0" value="${locStrings['dialogPlaceholder-singleString']} (${locStrings['snippet-example']}https://app.asana.com/)" disabled></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="buttons"><div id="replace_notes_dialog_preset_submit" class="buttonView new-button new-primary-button buttonView--primary buttonView--large" tabindex="0" onclick="replaceNotesPreset()"><span class="new-button-text">${locStrings['dialogButton-usePreset']}</span></div></div>
      <div class="content">
        <div class="loading-boundary">
          <div class="form-view">
            <table>
              <tr class="name-row"><td>${locStrings['dialogLabel-replaceWith-list'].join('</td><td>')}</td><td></td></tr>
              <tr class="name-row">
                <td class="field-value"><input autocomplete="off" class="generic-input showing" type="text" id="replace_notes_name_input" tabindex="0"></td>
                <td class="field-value"><input autocomplete="off" class="generic-input showing" type="text" id="replace_notes_name_input" tabindex="0"></td>
                <td><a class="delete-row-link">&nbsp;×</a></td>
              </tr>
            </table>
          </div>
        </div>
        <div><a class="add-row-link">+ ${locStrings['dialogLink-addRow']}</a></div>
      </div>
      <div class="footer-top"></div>
      <div class="buttons"><div id="replace_notes_dialog_replace_submit" class="buttonView new-button new-primary-button buttonView--primary buttonView--large" tabindex="0" disabled><span class="new-button-text">${locStrings['dialogButton-replaceText']}</span></div></div>
    </div>
  </div>`;
  document.body.appendChild(replaceNotesDialog);
};

var displaySetParentDrawer = function () {
  if (document.querySelector('.SetParentDrawer')) return;
  var singleTaskPaneBody = document.querySelector('.SingleTaskPane-body');
  if (!singleTaskPaneBody) return;
  var setParentDrawer = document.createElement('DIV');
  setParentDrawer.setAttribute('class', 'Drawer SetParentDrawer');
  setParentDrawer.innerHTML = '<a class="CloseButton Drawer-closeButton" id="setParentDrawerCloseButton"><svg class="Icon XIcon CloseButton-xIcon" focusable="false" viewBox="0 0 32 32"><path d="M18.1,16l8.9-8.9c0.6-0.6,0.6-1.5,0-2.1c-0.6-0.6-1.5-0.6-2.1,0L16,13.9L7.1,4.9c-0.6-0.6-1.5-0.6-2.1,0c-0.6,0.6-0.6,1.5,0,2.1l8.9,8.9l-8.9,8.9c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path></svg></a>' +
  `<div class="switch-view SetParentSwitchView"><p>${locStrings['drawerLabel-setParent']}</p><p>${locStrings['drawerSwitch-setParent-list'][0]}&nbsp;<span id="SetParentSwitch" class="switch"></span>&nbsp;${locStrings['drawerSwitch-setParent-list'][1]}</p></div><input autocomplete="off" class="textInput textInput--medium SetParentDrawer-typeaheadInput" placeholder="${locStrings['drawerPlaceholder-setParent']}" type="text" role="combobox" value=""><noscript></noscript></div>`;

  var singleTaskPaneTopmostElement = document.querySelector('.SingleTaskPaneBanners') || document.querySelector('.SingleTaskPaneToolbar');
  singleTaskPaneBody.insertBefore(setParentDrawer, singleTaskPaneTopmostElement.nextSibling);

  document.querySelector('#setParentDrawerCloseButton').addEventListener('click', function () {
    closeSetParentDrawer();
  });
  document.querySelector('#SetParentSwitch').addEventListener('click', function () {
    toggleSetParentSwitch(this);
  });
  var setParentDrawerTypeaheadInput = document.querySelector('.SetParentDrawer-typeaheadInput');
  setParentDrawerTypeaheadInput.addEventListener('focus', function () {
    var taskGid = findTaskGid(window.location.href);
    callAsanaApi('GET', `tasks/${taskGid}`, {}, {}, function (response) {
      var workspaceGid = response.data.workspace.gid;
      setParentDrawerTypeaheadInput.addEventListener('input', function () {
        createSetParentDropdownContainer(this, taskGid, workspaceGid);
      });
      setParentDrawerTypeaheadInput.addEventListener('click', function () {
        createSetParentDropdownContainer(this, taskGid, workspaceGid);
      });
    });
  });
  document.addEventListener('click', listenToClickToCloseSetParentDropdown);
  setParentDrawerTypeaheadInput.focus();
  saveOriginalParent();
};

var displaySuccessToast = function (task, messagesBeforeAfter, callback) {
  var toastManager = document.querySelector('.ToastManager');
  if (!toastManager) return;
  var toastDiv = document.createElement('DIV');
  toastDiv.innerHTML = '<div class="ToastManager-toastContainer"><div class="ToastNotification SuccessToast"><div class="ToastNotificationContent"><div class="ToastNotificationContent-firstRow"><div class="ToastNotificationContent-text"><span>' +
    `${messagesBeforeAfter[0]} <a class="NavigationLink ToastNotification-link" href="https://app.asana.com/0/0/${task.gid}">${(task.completed)? '✓ ': ''}${escapeHtml(task.name)}</a> ${messagesBeforeAfter[1]}` +
    '</span></div><a class="CloseButton"><svg class="Icon XIcon CloseButton-xIcon" focusable="false" viewBox="0 0 32 32"><path d="M18.1,16l8.9-8.9c0.6-0.6,0.6-1.5,0-2.1c-0.6-0.6-1.5-0.6-2.1,0L16,13.9L7.1,4.9c-0.6-0.6-1.5-0.6-2.1,0c-0.6,0.6-0.6,1.5,0,2.1l8.9,8.9l-8.9,8.9c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path></svg></a></div>' +
    `<div class="Button Button--small Button--secondary" tabindex="0" role="button" aria-disabled="false">${locStrings['toastButtton-undo']}</div></div></div></div>`;
  var closeButton = toastDiv.firstChild.firstChild.firstChild.firstChild.children[1];
  closeButton.addEventListener('click', function () {
    toastDiv.remove();
  });
  var undoButton = toastDiv.firstChild.firstChild.firstChild.children[1];
  undoButton.addEventListener('click', function () {
    undoButton.outerText = locStrings['toastButtton-undoing'];
    callback(function () {
      toastDiv.remove();
    });
  });
  toastManager.appendChild(toastDiv);
  setTimeout(function() {
    toastDiv.remove();
  }, 15000);
};

var escapeHtml = function (text) {
  var map = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&apos;'
  };
  return text.replace(/[&<>"']/g, function(m) {
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

var listenToClickOnKeyboardShortcutList = function () {
  var topbarHelpMenuButton = document.querySelector('.topbarHelpMenuButton');
  if (topbarHelpMenuButton) topbarHelpMenuButton.addEventListener('click', function () {
    setTimeout(function() {
      var menuItems = document.querySelectorAll('.menuItem-button.menuItem--small');
      var helpButtonKeyboardShortcuts;
      for (var i = 0; i < menuItems.length; i++) {
        if (menuItems[i].firstChild.innerText === locStrings['helpButton-keyboardShortcuts']) {
          helpButtonKeyboardShortcuts = menuItems[i];
          break;
        }
      }
      helpButtonKeyboardShortcuts.addEventListener('click', function () {
        setTimeout(function() {
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

var populateFromTypeahead = function (taskGid, workspaceGid, input, potentialTask) {
  callAsanaApi('GET', `workspaces/${workspaceGid}/typeahead`, {'type': 'task','query': input.value, 'opt_fields': 'completed,name,parent.name,projects.name'}, {}, function (response) {
    var typeaheadSearchScrollableContents = document.querySelector('.TypeaheadSearchScrollable-contents');
    while (typeaheadSearchScrollableContents && typeaheadSearchScrollableContents.lastChild) {
      typeaheadSearchScrollableContents.lastChild.remove();
    }
    if (potentialTask) response.data.unshift(potentialTask);
    if (!response.data.length) {
      var dropdownItemHintText = document.createElement('DIV');
      dropdownItemHintText.setAttribute('class', 'HintTextTypeaheadItem');
      dropdownItemHintText.innerText = locStrings['typeaheadItem-NoMatch'];
      typeaheadSearchScrollableContents.appendChild(dropdownItemHintText);
    }
    for (var i = 0; i < response.data.length; i++) {
      if (response.data[i].gid === taskGid) continue;
      if (response.data[i].name.endsWith(':')) continue;
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
        var parentGid = this.children[0].dataset.taskGid;
        var setParentOptions = {'parent': parentGid};
        if (document.querySelector('#SetParentSwitch').classList.contains('checked')) {
          setParentOptions.insert_before = null;
        } else {
          setParentOptions.insert_after = null;
        }
        setNewParentTask(taskGid, setParentOptions);
      });
    }
  });
};

var replaceNotes = function (replaceTextList) {
  var taskGid = findTaskGid(window.location.href);
  if (isNaN(taskGid)) return; // gid spec might change
  callAsanaApi('GET', `tasks/${taskGid}`, {'opt_fields': 'html_notes'}, {}, function (response) {
    var htmlNotesOriginal = response.data.html_notes;
    var htmlNotes = htmlNotesOriginal;
    for (var i = 0; i < replaceTextList.length; i ++) {
      var pair = replaceTextList[i];
      htmlNotes = htmlNotes.replace(pair[0], pair[1]);
    }
    callAsanaApi('PUT', `tasks/${taskGid}`, {}, {'html_notes': htmlNotes}, function (response) {
      closeSingleTaskPaneExtraActionsMenu();
      closeReplaceNotesDialog();
      displaySuccessToast(response.data, locStrings['toastContent-notesReplaced-list'], function (callback) {
        callAsanaApi('PUT', `tasks/${taskGid}`, {}, {'html_notes': htmlNotesOriginal}, function (response) {
          callback();
        });
      });
    });
  });
};

var replaceNotesPreset = function () {
  var replaceTextList = replaceTextListRegex.concat(replaceTextListEntity);
  replaceNotes(replaceTextList);
};

// exclude XML entities: [['&amp;', '&'], ['&gt;', '>'], ['&lt;', '<'], ['&quot;', '"']]
var replaceTextListEntity = [['&Aacute;', 'Á'], ['&aacute;', 'á'], ['&Acirc;', 'Â'], ['&acirc;', 'â'], ['&acute;', '´'], ['&AElig;', 'Æ'], ['&aelig;', 'æ'], ['&Agrave;', 'À'], ['&agrave;', 'à'], ['&Alpha;', 'Α'], ['&alpha;', 'α'], ['&and;', '∧'], ['&ang;', '∠'], ['&apos;', '\''], ['&Aring;', 'Å'], ['&aring;', 'å'], ['&asymp;', '≈'], ['&Atilde;', 'Ã'], ['&atilde;', 'ã'], ['&Auml;', 'Ä'], ['&auml;', 'ä'], ['&bdquo;', '„'], ['&Beta;', 'Β'], ['&beta;', 'β'], ['&brvbar;', '¦'], ['&bull;', '•'], ['&cap;', '∩'], ['&Ccedil;', 'Ç'], ['&ccedil;', 'ç'], ['&cedil;', '¸'], ['&cent;', '¢'], ['&Chi;', 'Χ'], ['&chi;', 'χ'], ['&circ;', 'ˆ'], ['&clubs;', '♣'], ['&cong;', '≅'], ['&copy;', '©'], ['&crarr;', '↵'], ['&cup;', '∪'], ['&curren;', '¤'], ['&dagger;', '†'], ['&Dagger;', '‡'], ['&dArr;', '⇓'], ['&darr;', '↓'], ['&deg;', '°'], ['&Delta;', 'Δ'], ['&delta;', 'δ'], ['&diams;', '♦'], ['&divide;', '÷'], ['&Eacute;', 'É'], ['&eacute;', 'é'], ['&Ecirc;', 'Ê'], ['&ecirc;', 'ê'], ['&Egrave;', 'È'], ['&egrave;', 'è'], ['&empty;', '∅'], ['&emsp;', ' '], ['&ensp;', ' '], ['&Epsilon;', 'Ε'], ['&epsilon;', 'ε'], ['&equiv;', '≡'], ['&Eta;', 'Η'], ['&eta;', 'η'], ['&ETH;', 'Ð'], ['&eth;', 'ð'], ['&Euml;', 'Ë'], ['&euml;', 'ë'], ['&euro;', '€'], ['&exist;', '∃'], ['&fnof;', 'ƒ'], ['&forall;', '∀'], ['&frac12;', '½'], ['&frac14;', '¼'], ['&frac34;', '¾'], ['&Gamma;', 'Γ'], ['&gamma;', 'γ'], ['&ge;', '≥'], ['&hArr;', '⇔'], ['&harr;', '↔'], ['&hearts;', '♥'], ['&hellip;', '…'], ['&Iacute;', 'Í'], ['&iacute;', 'í'], ['&Icirc;', 'Î'], ['&icirc;', 'î'], ['&iexcl;', '¡'], ['&Igrave;', 'Ì'], ['&igrave;', 'ì'], ['&infin;', '∞'], ['&int;', '∫'], ['&Iota;', 'Ι'], ['&iota;', 'ι'], ['&iquest;', '¿'], ['&isin;', '∈'], ['&Iuml;', 'Ï'], ['&iuml;', 'ï'], ['&Kappa;', 'Κ'], ['&kappa;', 'κ'], ['&Lambda;', 'Λ'], ['&lambda;', 'λ'], ['&laquo;', '«'], ['&lArr;', '⇐'], ['&larr;', '←'], ['&lceil;', '⌈'], ['&ldquo;', '“'], ['&le;', '≤'], ['&lfloor;', '⌊'], ['&lowast;', '∗'], ['&loz;', '◊'], ['&lrm;', '‎'], ['&lsaquo;', '‹'], ['&lsquo;', '‘'], ['&macr;', '¯'], ['&mdash;', '—'], ['&micro;', 'µ'], ['&middot;', '·'], ['&minus;', '−'], ['&Mu;', 'Μ'], ['&mu;', 'μ'], ['&nabla;', '∇'], ['&ndash;', '–'], ['&ne;', '≠'], ['&ni;', '∋'], ['&not;', '¬'], ['&notin;', '∉'], ['&nsub;', '⊄'], ['&Ntilde;', 'Ñ'], ['&ntilde;', 'ñ'], ['&Nu;', 'Ν'], ['&nu;', 'ν'], ['&Oacute;', 'Ó'], ['&oacute;', 'ó'], ['&Ocirc;', 'Ô'], ['&ocirc;', 'ô'], ['&OElig;', 'Œ'], ['&oelig;', 'œ'], ['&Ograve;', 'Ò'], ['&ograve;', 'ò'], ['&oline;', '‾'], ['&Omega;', 'Ω'], ['&omega;', 'ω'], ['&Omicron;', 'Ο'], ['&omicron;', 'ο'], ['&oplus;', '⊕'], ['&or;', '∨'], ['&ordf;', 'ª'], ['&ordm;', 'º'], ['&Oslash;', 'Ø'], ['&oslash;', 'ø'], ['&Otilde;', 'Õ'], ['&otilde;', 'õ'], ['&otimes;', '⊗'], ['&Ouml;', 'Ö'], ['&ouml;', 'ö'], ['&para;', '¶'], ['&part;', '∂'], ['&permil;', '‰'], ['&perp;', '⊥'], ['&Phi;', 'Φ'], ['&phi;', 'φ'], ['&Pi;', 'Π'], ['&pi;', 'π'], ['&piv;', 'ϖ'], ['&plusmn;', '±'], ['&pound;', '£'], ['&prime;', '′'], ['&Prime;', '″'], ['&prod;', '∏'], ['&prop;', '∝'], ['&Psi;', 'Ψ'], ['&psi;', 'ψ'], ['&radic;', '√'], ['&raquo;', '»'], ['&rArr;', '⇒'], ['&rarr;', '→'], ['&rceil;', '⌉'], ['&rdquo;', '”'], ['&reg;', '®'], ['&rfloor;', '⌋'], ['&Rho;', 'Ρ'], ['&rho;', 'ρ'], ['&rlm;', '‏'], ['&rsaquo;', '›'], ['&rsquo;', '’'], ['&sbquo;', '‚'], ['&Scaron;', 'Š'], ['&scaron;', 'š'], ['&sdot;', '⋅'], ['&sect;', '§'], ['&Sigma;', 'Σ'], ['&sigma;', 'σ'], ['&sigmaf;', 'ς'], ['&sim;', '∼'], ['&spades;', '♠'], ['&sub;', '⊂'], ['&sube;', '⊆'], ['&sum;', '∑'], ['&sup1;', '¹'], ['&sup2;', '²'], ['&sup3;', '³'], ['&sup;', '⊃'], ['&supe;', '⊇'], ['&szlig;', 'ß'], ['&Tau;', 'Τ'], ['&tau;', 'τ'], ['&there4;', '∴'], ['&Theta;', 'Θ'], ['&theta;', 'θ'], ['&thetasym;', 'ϑ'], ['&thinsp;', ' '], ['&THORN;', 'Þ'], ['&thorn;', 'þ'], ['&tilde;', '˜'], ['&times;', '×'], ['&trade;', '™'], ['&Uacute;', 'Ú'], ['&uacute;', 'ú'], ['&uArr;', '⇑'], ['&uarr;', '↑'], ['&Ucirc;', 'Û'], ['&ucirc;', 'û'], ['&Ugrave;', 'Ù'], ['&ugrave;', 'ù'], ['&uml;', '¨'], ['&upsih;', 'ϒ'], ['&Upsilon;', 'Υ'], ['&upsilon;', 'υ'], ['&Uuml;', 'Ü'], ['&uuml;', 'ü'], ['&Xi;', 'Ξ'], ['&xi;', 'ξ'], ['&Yacute;', 'Ý'], ['&yacute;', 'ý'], ['&yen;', '¥'], ['&Yuml;', 'Ÿ'], ['&yuml;', 'ÿ'], ['&Zeta;', 'Ζ'], ['&zeta;', 'ζ'], ['&zwj;', '‍'], ['&zwnj;', '‌']].map(a => [new RegExp(a[0].replace('&', '&amp;'), 'g'), a[1]]);

var replaceTextListRegex = [[/(?:&lt;|&quot;|')?(<a href=")(mailto:)?([A-Za-z0-9\-:;/._=+&%?!#$'@]+)(">)\3(<\/a>)(\?)?(?:&gt;|&quot;|')? &lt;\2?\1\2\3[\/\s]*\4\3[\/\s]*\5\6&gt;(?:&gt;|&quot;|')?/g, '$1$2$3$4$3$5$6']];

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

var runAllFunctionsIfEnabled = function (retry) {
  chrome.storage.sync.get({
    'anOptionsProjects': true,
    'anOptionsSubtasks': true,
    'anOptionsShortcuts': true,
    'anOptionsParent': true,
    'anOptionsNotes': true
  }, function (items) {
    if (retry) { // on "loading"
      if (items.anOptionsProjects) {
        var retryProjects = setInterval(function () {
          displayProjectsOnTop();
          if (document.querySelector('#TaskAncestryProjectNamesOnTop') || document.querySelectorAll('.NavigationLink.TaskAncestry-ancestorLink').length) clearInterval(retryProjects);
        }, 100);
      }
      if (items.anOptionsSubtasks) {
        var retrySubtasks = setInterval(function () {
          displayLinksToSiblingSubtasks();
          if (document.querySelectorAll('.NavigationLink.TaskAncestry-ancestorLink').length) clearInterval(retrySubtasks);
        }, 100);
      }
      setTimeout(function() {
        if (items.anOptionsParent) addSetParentToExtraActions();
        if (items.anOptionsNotes) addReplaceNotesToExtraActions();
      }, 500);
    } else { // on "load"
      if (items.anOptionsProjects) displayProjectsOnTop();
      if (items.anOptionsSubtasks) displayLinksToSiblingSubtasks();
      if (items.anOptionsShortcuts) listenToClickOnKeyboardShortcutList();
      if (items.anOptionsParent) addSetParentToExtraActions();
      if (items.anOptionsNotes) addReplaceNotesToExtraActions();
    }
  });
};

var runFunctionsThatCreateElementsIfEnabled = function () {
  chrome.storage.sync.get({
    'anOptionsProjects': true,
    'anOptionsSubtasks': true
  }, function (items) {
    if (items.anOptionsProjects) displayProjectsOnTop();
    if (items.anOptionsSubtasks) displayLinksToSiblingSubtasks();
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

var setNewParentTask = function (taskGid, setParentOptions) {
  var setParentDrawer = document.querySelector('.SetParentDrawer');
  var originalParentGid = setParentDrawer.dataset.originalParentGid;
  var originalPreviousSiblingGid = setParentDrawer.dataset.originalPreviousSiblingGid;
  callAsanaApi('POST', `tasks/${taskGid}/setParent`, {}, setParentOptions, function (response) {
    closeSetParentDrawer();
    displaySuccessToast(response.data, locStrings['toastContent-setParent-list'], function (callback) {
      callAsanaApi('POST', `tasks/${taskGid}/setParent`, {}, {'parent': originalParentGid, 'insert_after': originalPreviousSiblingGid}, function (response) {
        callback();
        setTimeout(function() {
          runFunctionsThatCreateElementsIfEnabled();
        }, 100);
      });
    });
    setTimeout(function() {
      runFunctionsThatCreateElementsIfEnabled();
    }, 100);
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
    case 'e':
      if (document.tabKeyIsDown) {
        chrome.storage.sync.get({'anOptionsNotes': true}, function (items) {
          if (items.anOptionsNotes) {
            if (document.querySelector('#ReplaceNotesDialogView')) {
              closeReplaceNotesDialog();
            } else {
              displayReplaceNotesDialog();
            }
          }
        });
      }
      break;
    case 'j':
      if (document.tabKeyIsDown) {
        var arrowNextSubtask = document.querySelector('#arrowNextSubtask');
        if (arrowNextSubtask) arrowNextSubtask.click();
      }
      break;
    case 'g':
      if (document.tabKeyIsDown) {
        var arrowPreviousSubtask = document.querySelector('#arrowPreviousSubtask');
        if (arrowPreviousSubtask) arrowPreviousSubtask.click();
      }
      break;
    case 'n':
      if (document.tabKeyIsDown) {
        if (document.querySelector('#SiblingSubtasksDropdownContainer')) {
          deleteSiblingSubtasksDropdown();
        } else {
          var arrowMiddleSubtask = document.querySelector('#arrowMiddleSubtask');
          if (arrowMiddleSubtask) arrowMiddleSubtask.click();
        }
      }
      break;
    case 'r':
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
  if (event.key === 'Tab') document.tabKeyIsDown = false;
});

window.addEventListener('blur', function () {
  document.tabKeyIsDown = false;
});

window.addEventListener('load', function () {
  getLocaleAndSetLocalizedStrings();
  runAllFunctionsIfEnabled();
});

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (message.name && message.name === 'asanaNavigatorOnUpdated') {
      runAllFunctionsIfEnabled(true); // We can only receive "loading" status, not "complete"
    }
});