const addReplaceDescriptionToExtraActions = function () {
  const singleTaskPaneExtraActionsButton = document.querySelector('.SingleTaskPaneExtraActionsButton');
  if (singleTaskPaneExtraActionsButton) {
    singleTaskPaneExtraActionsButton.addEventListener('click', function () {
      const replaceDescriptionButton = document.createElement('A');
      replaceDescriptionButton.setAttribute('class', 'menuItem-button menuItem--small SingleTaskPaneExtraActionsButton-replaceDescription SingleTaskPaneExtraActionsButton-menuItem');
      replaceDescriptionButton.addEventListener('click', function () {
        displayReplaceDescriptionDialog();
        closeTaskPaneExtraActionsMenu();
      });
      replaceDescriptionButton.innerHTML = `<span class="menuItem-label"><div class="ExtraActionsMenuItemLabel"><span class="ExtraActionsMenuItemLabel-body">${locStrings['menuButton-replaceDescription']}</span><span class="ExtraActionsMenuItemLabel-shortcut">TAB+E</span></div></span>`;

      setTimeout(function () {
        const nextExtraActionButton = document.querySelector('.SingleTaskPaneExtraActionsButton-makeADuplicate');
        if (nextExtraActionButton && !document.querySelector('.SingleTaskPaneExtraActionsButton-replaceDescription')) {
          nextExtraActionButton.parentNode.insertBefore(replaceDescriptionButton, nextExtraActionButton);
        }
      }, 100);
    });
  }
};

const addRowToUserReplaceTextList = function () {
  const userTextToReplaceDialogTable = document.querySelector('#UserTextToReplaceDialogTable');
  if (!userTextToReplaceDialogTable) return;
  const newUserTextTr = document.createElement('TR');
  newUserTextTr.setAttribute('class', 'name-row');
  newUserTextTr.innerHTML = `<td class="field-value"><input autocomplete="off" class="generic-input showing" type="text" tabindex="0" value=""></td>
    <td class="field-value"><input autocomplete="off" class="generic-input showing" type="text" tabindex="0" value=""></td>
    <td><a class="delete-row-link">&nbsp;×</a></td>`;
  newUserTextTr.lastElementChild.addEventListener('click', function (event) {deleteUserReplaceTextRow(event.target);});
  userTextToReplaceDialogTable.firstElementChild.appendChild(newUserTextTr);
};

const addSetParentToExtraActions = function () {
  const [taskPaneTypeString, taskPaneExtraActionsButton] = getTaskPaneTypeAndElement('ExtraActionsButton');
  if (taskPaneExtraActionsButton) {
    taskPaneExtraActionsButton.addEventListener('click', function () {
      const setParentButton = document.createElement('A');
      setParentButton.setAttribute('class', `menuItem-button menuItem--small ${taskPaneTypeString}TaskPaneExtraActionsButton-setParent ${taskPaneTypeString}TaskPaneExtraActionsButton-menuItem`);
      setParentButton.addEventListener('click', function () {
        displaySetParentDrawer();
        closeTaskPaneExtraActionsMenu();
      });
      setParentButton.innerHTML = `<span class="menuItem-label"><div class="ExtraActionsMenuItemLabel"><span class="ExtraActionsMenuItemLabel-body">${locStrings['menuButton-setParent']}</span><span class="ExtraActionsMenuItemLabel-shortcut">TAB+G</span></div></span>`;

      setTimeout(function () {
        const advancedActionsMenuItemButton = document.querySelector('.SingleTaskPaneExtraActionsButton-advancedActionsMenuItem');
        const nextExtraActionButton = advancedActionsMenuItemButton? advancedActionsMenuItemButton.parentNode: document.querySelector('.MenuSeparator');
        if (nextExtraActionButton && !document.querySelector(`.${taskPaneTypeString}TaskPaneExtraActionsButton-setParent`)) {
          nextExtraActionButton.parentNode.insertBefore(setParentButton, nextExtraActionButton);
        }
      }, 100);
    });
  }
};

const addToKeyboardShortcutsList = function () {
  const keyboardShortcutsModal = document.querySelector('.KeyboardShortcutsModal');
  if (!keyboardShortcutsModal) return;
  if (document.querySelector('#KeyboardShortcutsModalANSection')) return;
  const keyboardShortcutsModalANSection = document.createElement('DIV');
  keyboardShortcutsModalANSection.setAttribute('class', 'KeyboardShortcutsModal-section');
  keyboardShortcutsModalANSection.setAttribute('id', 'KeyboardShortcutsModalANSection');
  keyboardShortcutsModalANSection.innerHTML = '<h3 class="KeyboardShortcutsModal-sectionHeader">Asana Navigator</h3>';
  keyboardShortcutsModal.firstElementChild.children[1].lastElementChild.appendChild(keyboardShortcutsModalANSection);
  const separator = 'separator';
  const toTitleCase = function (string) {
    // Should consider if language is German
    return string[0] + string.slice(1).toLowerCase();
  };
  const shortcutsArray = [
    [locStrings['shortcutDescription-backLink'], ['Tab', 'J']],
    [locStrings['shortcutDescription-siblingSubtasks'], [platStrings['shift'], 'Tab', '↑', separator, platStrings['shift'], 'Tab', '↓']],
    [locStrings['shortcutDescription-subtasksDropdown'], [platStrings['shift'], 'Tab', '→']],
    [toTitleCase(locStrings['menuButton-replaceDescription']).replace('...', ''), ['Tab', 'E']],
    [locStrings['shortcutDescription-convertSection'], ['Tab', ':']],
    [toTitleCase(locStrings['menuButton-setParent']).replace('...', ''), ['Tab', 'G']],
  ];
  for (let i = 0; i < shortcutsArray.length; i++) {
    const [description, keyList] = shortcutsArray[i];
    const keyboardShortcutsModalRow = document.createElement('DIV');
    keyboardShortcutsModalRow.setAttribute('class', 'KeyboardShortcutsModal-row');
    keyboardShortcutsModalRow.innerHTML = `<span class="KeyboardShortcutsModal-description">${description}</span><span class="KeyboardShortcutsModal-keys">` +
    keyList.map(a => (a === separator)? '/': '<span class="KeyboardShortcutsModal-key">' + a + '</span>').join('') + '</span>';
    keyboardShortcutsModalANSection.appendChild(keyboardShortcutsModalRow);
  }
};

const callAsanaApi = function (request, path, options, data, callback) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', function () {
    callback(JSON.parse(this.response));
  });
  const manifest = chrome.runtime.getManifest();
  const client_name = ['chrome-extension', manifest.version, manifest.name].join(':'); // Be polite to Asana API
  let requestData;
  if (request === 'POST' || request === 'PUT') {
    requestData = JSON.stringify({'data': data});
    options.client_name = client_name;
  } else {
    options.opt_client_name = client_name;
  }
  let requestUrl = 'https://app.asana.com/api/1.1/' + path;
  if (Object.keys(options).length) {
    let parameters = '';
    for (let key in options) {
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

const clickSectionSelector = function (a) {
  const taskProjectsProjectGid = findProjectGid(a.previousSibling.href);
  const taskProjectsProjectList = document.querySelector('.TaskProjects-projectList');
  let floatingSelectLabel;
  for (let i = 0; i < taskProjectsProjectList.children.length; i++) {
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

const closeReplaceDescriptionDialog = function () {
  const replaceDescriptionDialogView = document.querySelector('#ReplaceDescriptionDialogView');
  if (replaceDescriptionDialogView) replaceDescriptionDialogView.remove();
};

const closeSetParentDrawer = function () {
  const setParentDrawer = document.querySelector('.SetParentDrawer');
  if (setParentDrawer) setParentDrawer.remove();
  document.removeEventListener('click', listenToClickToCloseSetParentDropdown);
};

const closeTaskPaneExtraActionsMenu = function () {
  const [taskPaneTypeString, taskPaneExtraActionsButton] = getTaskPaneTypeAndElement('ExtraActionsButton');
  if (taskPaneExtraActionsButton.classList.contains('CircularButton--active') || taskPaneExtraActionsButton.classList.contains('is-dropdownVisible')) {
    taskPaneExtraActionsButton.click();
  }
};

// Works only where Tab+N is supported (project view, my task view, and subtask list)
// section_migration_status is considered to be "not_migrated" at the moment
const convertTaskAndSection = function () {
  const focusedItemRow = document.querySelector('.ItemRow--focused');
  if (!focusedItemRow) return;
  const isSection = focusedItemRow.classList.contains('SectionRow');
  const isSubtask = focusedItemRow.classList.contains('SubtaskTaskRow') || focusedItemRow.classList.contains('SectionRow--subtask');
  const taskTextarea = (isSection? focusedItemRow: focusedItemRow.children[1]).children[1].children[1];
  const focusedTaskGid = /_(\d+)/.exec(taskTextarea.id)[1];
  const focusedTaskName = taskTextarea.textContent;

  callAsanaApi('GET', `tasks/${focusedTaskGid}`, {opt_fields: 'assignee,parent,projects.section_migration_status,subtasks,workspace'}, {}, function (response) {
    const focusedTaskData = response.data;
    if (focusedTaskData.subtasks.length) {
      const returning = window.confirm(locStrings['confirmMessage-abortConvertBySubtasks']);
      return;
    }
    const workspaceGid = focusedTaskData.workspace.gid;
    const focusedTaskAssigneeGid = focusedTaskData.assignee? focusedTaskData.assignee.gid: 'null';
    const confirmed = window.confirm('Asana Navigator: ' + (
      isSection?
      [locStrings['confirmMessage-convertToTask'], locStrings['snippet-continue']]:
      [locStrings['confirmMessage-convertToSection'], locStrings['confirmMessage-deleteInformation'], locStrings['confirmMessage-taskIdChanged'], locStrings['snippet-continue']]
    ).join(locStrings['snippet-spacing']));
    if (!confirmed) return;

    if (isSubtask) {
      const taskGid = findTaskGid(window.location.href);
      callAsanaApi('POST', 'tasks', {'assignee': focusedTaskAssigneeGid, 'name': (focusedTaskName.replace(/[:：]+$/, '') + (isSection? '': ':')), 'workspace': workspaceGid}, {}, function (response) {
        callAsanaApi('POST', `tasks/${response.data.gid}/setParent`, {'insert_after': focusedTaskGid, 'parent': taskGid}, {}, function (response) {
          callAsanaApi('DELETE', `tasks/${focusedTaskGid}`, {}, {}, function (response) {
          });
        });
      });
    } else {
      const topbarPageHeaderStructure = document.querySelector('.TopbarPageHeaderStructure');
      const projectGidList = focusedTaskData.projects.map(project => project.gid);

      if (topbarPageHeaderStructure.classList.contains('ProjectPageHeader')) {
        const currentProjectGid = findProjectGid(window.location.href);
        // if section_migration_status is "migrated," the path will be: isSection? 'tasks': `projects/${currentProjectGid}/sections`
        callAsanaApi('POST', 'tasks', {'assignee': focusedTaskAssigneeGid, 'name': (focusedTaskName.replace(/[:：]+$/, '') + (isSection? '': ':')), 'workspace': workspaceGid}, {}, function (response) {
          if (focusedTaskData.parent) {
            callAsanaApi('POST', `tasks/${response.data.gid}/setParent`, {'insert_after': focusedTaskGid, 'parent': focusedTaskData.parent.gid}, {}, function (response) {});
          }
          for (let i = 0; i < projectGidList.length; i++) {
            callAsanaApi('POST', `tasks/${response.data.gid}/addProject`, {'insert_after': focusedTaskGid, 'project': projectGidList[i]}, {}, function (response) {
              if (i === projectGidList.length - 1) {
                callAsanaApi('DELETE', `tasks/${focusedTaskGid}`, {}, {}, function (response) {
                });
              }
            });
          }
        });
      } else if (topbarPageHeaderStructure.classList.contains('MyTasksPageHeader')) {
        // Different from the user gid
        const userTaskListGid = findProjectGid(window.location.href);
        callAsanaApi('POST', 'tasks', {'name': (focusedTaskName.replace(/[:：]+$/, '') + (isSection? '': ':')), 'workspace': workspaceGid}, {}, function (response) {
          callAsanaApi('POST', `user_task_lists/${userTaskListGid}/tasks/insert`, {}, {'insert_after': focusedTaskGid, 'task': response.data.gid}, function (response) {});
          if (focusedTaskData.parent) {
            callAsanaApi('POST', `tasks/${response.data.gid}/setParent`, {'insert_after': focusedTaskGid, 'parent': focusedTaskData.parent.gid}, {}, function (response) {});
          }
          if (projectGidList.length) {
            for (let i = 0; i < projectGidList.length; i++) {
              callAsanaApi('POST', `tasks/${response.data.gid}/addProject`, {'insert_after': focusedTaskGid, 'project': projectGidList[i]}, {}, function (response) {
                if (i === projectGidList.length - 1) {
                  callAsanaApi('DELETE', `tasks/${focusedTaskGid}`, {}, {}, function (response) {
                  });
                }
              });
            }
          } else {
            callAsanaApi('DELETE', `tasks/${focusedTaskGid}`, {}, {}, function (response) {
            });
          }
        });
      }
    }
  });
};

const createBackFromInboxButton = function () {
  const inboxNavigationBar = document.querySelector('.InboxNavigationBar');
  if (inboxNavigationBar && !document.querySelector('.InboxNavigationBar-backLink')) {
    const backLinkFromInbox = document.createElement('DIV');
    backLinkFromInbox.setAttribute('class', 'InboxNavigationBar-backLink');
    backLinkFromInbox.innerHTML = '<a class="InboxButton-backLink disabled">&times;</a>';
    inboxNavigationBar.appendChild(backLinkFromInbox);
    if (document.anPreviousUrl) {
      backLinkFromInbox.innerHTML = `<a class="InboxButton-backLink" href="${document.anPreviousUrl}" title="${locStrings['buttonTitle-backLink']} (Tab+J)">&times;</a>`;
      backLinkFromInbox.addEventListener('click', function (event) {
        openPageWithoutRefresh(document.anPreviousUrl);
        event.preventDefault();
        document.anPreviousUrl = undefined;
      });
    }
  }
};

const createSetParentDropdownContainer = function (input, taskGidList, workspaceGid) {
  const singleTaskTitleInput = document.querySelector('.SingleTaskTitleInput-taskName');
  const taskName = (singleTaskTitleInput)? singleTaskTitleInput.children[1].textContent: '';
  const queryValue = input.value || taskName;
  if (!document.querySelector('#SetParentDropdownContainer')) {
    const setParentDropdownContainer = document.createElement('DIV');
    setParentDropdownContainer.innerHTML = '<div class="LayerPositioner LayerPositioner--alignLeft LayerPositioner--below"><div class="LayerPositioner-layer"><div class="Dropdown" role="listbox"><div class="scrollable scrollable--vertical TypeaheadSearchScrollable SetParentTypeaheadDropdownContents"><div class="TypeaheadSearchScrollable-contents"></div></div></div></div></div>';
    setParentDropdownContainer.setAttribute('id', 'SetParentDropdownContainer');
    input.parentNode.appendChild(setParentDropdownContainer);
  }
  let potentialTask;
  const potentialTaskGidMatch = /^\d{15}$/.exec(input.value.trim()); // gid spec might change
  const potentialTaskGid = (potentialTaskGidMatch)? potentialTaskGidMatch[0]: findTaskGid(input.value);
  if (potentialTaskGid) {
    callAsanaApi('GET', `tasks/${potentialTaskGid}`, {}, {}, function (response) {
      potentialTask = response.data;
      populateFromTypeahead(taskGidList, workspaceGid, queryValue, potentialTask);
    });
  } else {
    populateFromTypeahead(taskGidList, workspaceGid, queryValue, potentialTask);
  }
};

const createSiblingSubtasksDropdown = function (subtaskList, taskGid, containerGid) {
  const completeIcon = '<svg class="SiblingSubtasksIcon CheckCircleFullIcon SiblingSubtasksItem-completedIcon" focusable="false" viewBox="0 0 32 32"><path d="M16,0C7.2,0,0,7.2,0,16s7.2,16,16,16s16-7.2,16-16S24.8,0,16,0z M23.3,13.3L14,22.6c-0.3,0.3-0.7,0.4-1.1,0.4s-0.8-0.1-1.1-0.4L8,18.8c-0.6-0.6-0.6-1.5,0-2.1s1.5-0.6,2.1,0l2.8,2.8l8.3-8.3c0.6-0.6,1.5-0.6,2.1,0S23.9,12.7,23.3,13.3z"></path></svg>';
  const incompleteIcon = '<svg class="SiblingSubtasksIcon CheckCircleIcon SiblingSubtasksItem-incompletedIcon" focusable="false" viewBox="0 0 32 32"><path d="M16,32C7.2,32,0,24.8,0,16S7.2,0,16,0s16,7.2,16,16S24.8,32,16,32z M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z"></path><path d="M12.9,22.6c-0.3,0-0.5-0.1-0.7-0.3l-3.9-3.9C8,18,8,17.4,8.3,17s1-0.4,1.4,0l3.1,3.1l8.6-8.6c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-9.4,9.4C13.4,22.5,13.2,22.6,12.9,22.6z"></path></svg>';
  if (document.querySelector('#SiblingSubtasksDropdownContainer')) return;
  const siblingDropdown = document.createElement('DIV');
  siblingDropdown.setAttribute('id', 'SiblingSubtasksDropdownContainer');
  siblingDropdown.innerHTML = '<div class="LayerPositioner LayerPositioner--alignRight LayerPositioner--below SiblingSubtasksDropdownLayer"><div class="LayerPositioner-layer"><div class="Dropdown scrollable scrollable--vertical SiblingSubtasksDropdownContainer"><div class="menu menu--default">' +
    subtaskList.map(
      subtask => `<a class="menuItem-button menuItem--small" ${(subtask.is_rendered_as_separator)? '': `href="https://app.asana.com/0/${containerGid}/${subtask.gid}`}"><span class="menuItem-label">` +
      `${(subtask.is_rendered_as_separator)? '<u>' + subtask.name + '</u>': ((subtask.gid === taskGid)? '<strong id="currentSubtaskMarker">&gt;</strong>&nbsp;': (subtask.completed? completeIcon: incompleteIcon)) + '&nbsp;' + subtask.name}</span></a>`
    ).join('') +
    '</div></div></div>';
  const singleTaskPane = document.querySelector('.SingleTaskPane');
  singleTaskPane.insertBefore(siblingDropdown, singleTaskPane.firstElementChild);
  document.querySelector('#currentSubtaskMarker').scrollIntoView(false);
  siblingDropdown.addEventListener('click', function (event) {
    if (event.target.href) {
      openPageWithoutRefresh(event.target.href);
    } else {
      openPageWithoutRefresh(event.target.parentNode.href);
    }
  });
  document.addEventListener('click', listenToClickToCloseSiblingSubtasksDropdown);
};

const deleteProjectNamesOnTop = function () {
  const projectNamesOnTop = document.querySelector('#TaskAncestryProjectNamesOnTop');
  if (projectNamesOnTop) projectNamesOnTop.remove();
};

const deleteSetParentTypeaheadDropdown = function () {
  const setParentDropdownContainer = document.querySelector('#SetParentDropdownContainer');
  if (setParentDropdownContainer) setParentDropdownContainer.remove();
};

const deleteSiblingButtons = function () {
  const SiblingButtons = document.querySelector('#SiblingButtons');
  if (SiblingButtons) SiblingButtons.remove();
};

const deleteSiblingSubtasksDropdown = function () {
  const siblingDropdown = document.querySelector('#SiblingSubtasksDropdownContainer');
  if (siblingDropdown) siblingDropdown.remove();
  document.removeEventListener('click', listenToClickToCloseSiblingSubtasksDropdown);
};

const deleteUserReplaceTextRow = function (button) {
  const trToDelete = button.parentNode.parentNode;
  trToDelete.remove();
};

const displayLinksToSiblingSubtasks = function () {
  const taskAncestryTaskLinks = document.querySelectorAll('.NavigationLink.TaskAncestry-ancestorLink');
  if (!taskAncestryTaskLinks.length) return;
  const parentGid = findTaskGid(taskAncestryTaskLinks[taskAncestryTaskLinks.length - 1].href);
  const taskGid = findTaskGid(window.location.href);
  const containerGid = findProjectGid(window.location.href) || '0';

  callAsanaApi('GET', `tasks/${parentGid}/subtasks`, {'opt_fields': 'completed,is_rendered_as_separator,name'}, {}, function (response) {
    const subtaskList = response.data;
    const subtaskListFiltered = subtaskList.filter(function (subtask) {
      return !subtask.is_rendered_as_separator || subtask.gid === taskGid;
    });
    const indexCurrent = subtaskListFiltered.map(subtask => subtask.gid).indexOf(taskGid);
    const indexPrevious = (indexCurrent > 0)? indexCurrent - 1: null;
    const indexNext = (indexCurrent < subtaskListFiltered.length - 1)? indexCurrent + 1: null;
    deleteSiblingButtons();
    const siblingButtons = document.createElement('SPAN');
    siblingButtons.setAttribute('id', 'SiblingButtons');
    const singleTaskPaneTitleRow = document.querySelector('.SingleTaskPane-titleRow');
    if (singleTaskPaneTitleRow) singleTaskPaneTitleRow.appendChild(siblingButtons);

    if (indexPrevious || indexPrevious === 0) {
      const divArrowPreviousSubtask = document.createElement('DIV');
      divArrowPreviousSubtask.setAttribute('class', 'SmallTextButtons');
      divArrowPreviousSubtask.innerHTML = `<a class="NoBorderBottom TaskAncestry-ancestorLink" href="https://app.asana.com/0/${containerGid}/${subtaskListFiltered[indexPrevious].gid}" id="ArrowPreviousSubtask" title="${locStrings['arrowTitle-previousSubtask']} (${[platStrings['shift'], 'Tab', '↑'].join(platStrings['sep'])})\n${escapeHtml(subtaskListFiltered[indexPrevious].name)}">∧</a>`;
      siblingButtons.appendChild(divArrowPreviousSubtask);
      const arrowPreviousSubtask = document.querySelector('#ArrowPreviousSubtask');
      if (arrowPreviousSubtask) arrowPreviousSubtask.addEventListener('click', function (event) {
        openPageWithoutRefresh(`https://app.asana.com/0/${containerGid}/${subtaskListFiltered[indexPrevious].gid}`);
        event.preventDefault();
      });
    } else {
      siblingButtons.appendChild(document.createElement('BR'));
    }
    const divArrowMiddleSubtask = document.createElement('DIV');
    divArrowMiddleSubtask.setAttribute('class', 'SmallTextButtons');
    divArrowMiddleSubtask.innerHTML = `<a class="NoBorderBottom TaskAncestry-ancestorLink" id="ArrowMiddleSubtask" title="${locStrings['arrowTitle-subtasksDropdown']} (${[platStrings['shift'], 'Tab', '→'].join(platStrings['sep'])})">&gt;</a>`;
    siblingButtons.appendChild(divArrowMiddleSubtask);
    const arrowMiddleSubtask = document.querySelector('#ArrowMiddleSubtask');
    if (arrowMiddleSubtask) arrowMiddleSubtask.addEventListener('click', function (event) {
      createSiblingSubtasksDropdown(subtaskList, taskGid, containerGid);
    });
    if (indexNext) {
      const divArrowNextSubtask = document.createElement('DIV');
      divArrowNextSubtask.setAttribute('class', 'SmallTextButtons');
      divArrowNextSubtask.innerHTML = `<a class="NoBorderBottom TaskAncestry-ancestorLink" href="https://app.asana.com/0/${containerGid}/${subtaskListFiltered[indexNext].gid}" id="ArrowNextSubtask" title="${locStrings['arrowTitle-nextSubtask']} (${[platStrings['shift'], 'Tab', '↓'].join(platStrings['sep'])})\n${escapeHtml(subtaskListFiltered[indexNext].name)}">∨</a>`;
      siblingButtons.appendChild(divArrowNextSubtask);
      const arrowNextSubtask = document.querySelector('#ArrowNextSubtask');
      if (arrowNextSubtask) arrowNextSubtask.addEventListener('click', function (event) {
        openPageWithoutRefresh(`https://app.asana.com/0/${containerGid}/${subtaskListFiltered[indexNext].gid}`);
        event.preventDefault();
      });
    } else {
      siblingButtons.appendChild(document.createElement('BR'));
    }
  });
};

const displayProjectsOnTop = function () {
  const taskProjectsProjectList = document.querySelector('.TaskProjects-projectList');
  if (!taskProjectsProjectList) return;
  const taskAncestry = document.createElement('DIV');
  taskAncestry.setAttribute('class', 'TaskAncestry');
  const taskAncestryAncestorProjects = document.createElement('DIV');
  taskAncestryAncestorProjects.setAttribute('class', 'TaskAncestry-ancestorProjects');
  taskAncestryAncestorProjects.setAttribute('id', 'TaskAncestryProjectNamesOnTop');
  taskAncestry.appendChild(taskAncestryAncestorProjects);

  const taskGid = findTaskGid(window.location.href);
  Array.from(taskProjectsProjectList.children).forEach(function (li) {
    const a = li.firstElementChild;
    const projectUrl = a.href;
    const projectGid = findProjectGid(projectUrl);
    const projectName = a.firstElementChild.textContent;

    const taskAncestryAncestorProject = document.createElement('A');
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
      if (response.data.length && !response.data.map(section => section.gid).includes(taskGid)) {
        const taskAncestryAncestorProjectSectionSelector = document.createElement('A');
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
  const singleTaskPaneBody = document.querySelector('.SingleTaskPane-body');
  const singleTaskPaneTitleRow = document.querySelector('.SingleTaskPane-titleRow');
  if (singleTaskPaneBody) singleTaskPaneBody.insertBefore(taskAncestry, singleTaskPaneTitleRow);
};

const displayReplaceDescriptionDialog = function () {
  const replaceDescriptionDialog = document.createElement('DIV');
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
  const replaceDescriptionDialogPresetButton = document.querySelector('#ReplaceDescriptionDialogPresetButton');
  replaceDescriptionDialogPresetButton.addEventListener('click', replaceDescriptionPreset);
  const replaceDescriptionDialogUserButton = document.querySelector('#ReplaceDescriptionDialogUserButton');
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

const displaySetParentDrawer = function () {
  if (document.querySelector('.SetParentDrawer')) return;
  const [taskPaneTypeString, taskPaneBody] = getTaskPaneTypeAndElement('-body');
  if (!taskPaneBody) return;
  const setParentDrawer = document.createElement('DIV');
  setParentDrawer.setAttribute('class', 'Drawer SetParentDrawer');
  setParentDrawer.innerHTML = '<a class="CloseButton Drawer-closeButton" id="SetParentDrawerCloseButton"><svg class="Icon XIcon CloseButton-xIcon" focusable="false" viewBox="0 0 32 32"><path d="M18.1,16l8.9-8.9c0.6-0.6,0.6-1.5,0-2.1c-0.6-0.6-1.5-0.6-2.1,0L16,13.9L7.1,4.9c-0.6-0.6-1.5-0.6-2.1,0c-0.6,0.6-0.6,1.5,0,2.1l8.9,8.9l-8.9,8.9c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path></svg></a>' +
  `<div class="switch-view SetParentSwitchView"><p>${locStrings['drawerLabel-setParent']}</p><p>${locStrings['drawerSwitch-setParent-var-button'].replace('{button}', '&nbsp;<span id="SetParentSwitch" class="switch"></span>&nbsp;')}</p></div><input autocomplete="off" class="textInput textInput--medium SetParentDrawer-typeaheadInput" placeholder="${locStrings['drawerPlaceholder-setParent']}" type="text" role="combobox" value=""><noscript></noscript></div>`;

  const singleTaskPaneTopmostElement = document.querySelector('.SingleTaskPaneBanners') || document.querySelector(`.${taskPaneTypeString}TaskPaneToolbar`);
  taskPaneBody.insertBefore(setParentDrawer, singleTaskPaneTopmostElement.nextSibling);

  document.querySelector('#SetParentDrawerCloseButton').addEventListener('click', function () {
    closeSetParentDrawer();
  });
  document.querySelector('#SetParentSwitch').addEventListener('click', function () {
    toggleSetParentSwitch(this);
  });

  const setParentDrawerTypeaheadInput = document.querySelector('.SetParentDrawer-typeaheadInput');
  const taskGid = findTaskGid(window.location.href);
  callAsanaApi('GET', `tasks/${taskGid}`, {}, {}, function (response) {
    let taskGidList;
    const workspaceGid = response.data.workspace.gid;
    if (taskPaneTypeString === 'Single') {
      taskGidList = [taskGid];
    } else {
      const taskRowHighlightedOrFocused = Array.from(document.querySelectorAll('.TaskRow--highlighted, .TaskRow--focused'));
      taskGidList = taskRowHighlightedOrFocused.map(divTaskRow => /_(\d+)/.exec(divTaskRow.children[1].children[1].children[1].id)[1]);
    }
    ['click', 'focus', 'input'].forEach(function (e) {
      setParentDrawerTypeaheadInput.addEventListener(e, function (event) {
        const that = this;
        createSetParentDropdownContainer(that, taskGidList, workspaceGid);
      });
    });
    setParentDrawerTypeaheadInput.focus();
    saveOriginalParents(taskGidList);
  });
  document.addEventListener('click', listenToClickToCloseSetParentDropdown);
};

const displaySuccessToast = function (task, messageVarTask, functionToRunCallbackAtLast) {
  const toastManager = document.querySelector('.ToastManager');
  if (!toastManager) return;
  const toastDiv = document.createElement('DIV');
  toastDiv.innerHTML = '<div class="ToastManager-toastContainer"><div class="ToastNotification SuccessToast"><div class="ToastNotificationContent"><div class="ToastNotificationContent-firstRow"><div class="ToastNotificationContent-text"><span>' +
  messageVarTask.replace('{task}', `<a class="NavigationLink ToastNotification-link" href="https://app.asana.com/0/0/${task.gid}">${(task.completed)? '✓ ': ''}${escapeHtml(task.name)}</a> `) +
    '</span></div><a class="CloseButton"><svg class="Icon XIcon CloseButton-xIcon" focusable="false" viewBox="0 0 32 32"><path d="M18.1,16l8.9-8.9c0.6-0.6,0.6-1.5,0-2.1c-0.6-0.6-1.5-0.6-2.1,0L16,13.9L7.1,4.9c-0.6-0.6-1.5-0.6-2.1,0c-0.6,0.6-0.6,1.5,0,2.1l8.9,8.9l-8.9,8.9c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path></svg></a></div>' +
    `<div class="Button Button--small Button--secondary" tabindex="0" role="button" aria-disabled="false">${locStrings['toastButtton-undo']}</div></div></div></div>`;
  const toastNotificationContent = toastDiv.firstElementChild.firstElementChild.firstElementChild;
  const toastALink = toastNotificationContent.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
  toastALink.addEventListener('click', function (event) {
    openPageWithoutRefresh(`https://app.asana.com/0/0/${task.gid}`);
    event.preventDefault();
  });
  const closeButton = toastNotificationContent.firstElementChild.children[1];
  closeButton.addEventListener('click', function () {
    toastDiv.remove();
  });
  const undoButton = toastNotificationContent.children[1];
  undoButton.addEventListener('click', function () {
    undoButton.outerText = locStrings['toastButtton-undoing'];
    functionToRunCallbackAtLast(function () {
      toastDiv.remove();
    });
  });
  toastManager.appendChild(toastDiv);
  setTimeout(function () {
    toastDiv.remove();
  }, 15000);
};

const escapeHtml = function (text) {
  const map = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&apos;'
  };
  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
};

const findProjectGid = function (url) { // gid spec might change
  const projectGidRegexPattern = /https:\/\/app\.asana\.com\/0\/(\d+)\/\d+\/?f?/;
  const findProjectGidMatch = projectGidRegexPattern.exec(url);
  if (findProjectGidMatch) return findProjectGidMatch[1];
};

const findTaskGid = function (url) { // gid spec might change
  const taskGidRegexPatterns = [
    /https:\/\/app\.asana\.com\/0\/\d+\/(\d+)\/?f?/,
    /https:\/\/app\.asana\.com\/0\/inbox\/\d+\/(\d+)\/\d+\/?f?/,
    /https:\/\/app\.asana\.com\/0\/search\/\d+\/(\d+)\/?f?/
  ];
  for (let i = 0; i < taskGidRegexPatterns.length; i++) {
    const pattern = taskGidRegexPatterns[i];
    if (pattern.exec(url)) {
      return pattern.exec(url)[1];
    }
  }
};

const getLocaleAndSetLocalizedStrings = function () {
  let locale = 'en';
  const scriptArray = Array.from(document.scripts);
  for (let i = 0; i < scriptArray.length; i++) {
    const match = /cloudfront\.net\/compressed\/build\/bundles\/[0-9a-f]+\/translations\/([a-z]{2})\.bundle\.js/.exec(scriptArray[i].src);
    if (match) {
      if (localizationStrings.hasOwnProperty(match[1])) locale = match[1];
      break;
    }
  }
  for (let key in localizationStrings.en) {
    if (localizationStrings[locale].hasOwnProperty(key)) {
      locStrings[key] = localizationStrings[locale][key];
    } else {
      locStrings[key] = localizationStrings.en[key];
    }
  }
};

const getPlatformAndSetPlatStrings = function () {
  let platform = 'win';
  if (window.navigator.platform.indexOf('Mac') != -1) platform = 'mac';
  for (let key in platformStrings.win) {
    if (platformStrings[platform].hasOwnProperty(key)) {
      platStrings[key] = platformStrings[platform][key];
    } else {
      platStrings[key] = platformStrings.win[key];
    }
  }
};

const getTaskPaneTypeAndElement = function (subsequentClassName) {
  const singleTaskPaneElement = document.querySelector('.SingleTaskPane' + subsequentClassName);
  if (singleTaskPaneElement) return ['Single', singleTaskPaneElement];
  const multiTaskPaneElement = document.querySelector('.MultiTaskPane' + subsequentClassName);
  if (multiTaskPaneElement) return ['Multi', multiTaskPaneElement];
  return ['', undefined];
};

const getUserReplaceTextList = function () {
  const userTextToReplaceDialogTable = document.querySelector('#UserTextToReplaceDialogTable');
  if (!userTextToReplaceDialogTable) return;
  const userTextToReplaceDialogTr = userTextToReplaceDialogTable.firstElementChild.children;
  const userReplaceTextList = [];
  for (let i = 1; i < userTextToReplaceDialogTr.length; i++) {
    const element = userTextToReplaceDialogTr[i];
    if (!element.firstElementChild.firstElementChild.value) continue;
    userReplaceTextList.push([element.firstElementChild.firstElementChild.value, element.children[1].firstElementChild.value]);
  }
  return userReplaceTextList;
};

const listenToClickOnInboxSavePrevious = function () {
  setTimeout(function () {
    const sidebarInboxLink = document.querySelector('.SidebarTopNavLinks-notificationsButton');
    if (sidebarInboxLink) {
      sidebarInboxLink.addEventListener('click', function () {
        document.anPreviousUrl = window.location.href;
        setTimeout(function () {
          createBackFromInboxButton();
        }, 100);
      });
    }
  }, 500);
};

const listenToClickOnKeyboardShortcutList = function () {
  const topbarHelpMenuButton = document.querySelector('.topbarHelpMenuButton');
  if (topbarHelpMenuButton) topbarHelpMenuButton.addEventListener('click', function () {
    setTimeout(function () {
      const menuItemsList = Array.from(document.querySelectorAll('.menuItem-button.menuItem--small'));
      const indexKeyboardShortcuts = menuItemsList.map(menuItem => menuItem.firstElementChild.innerText).indexOf(locStrings['helpButton-keyboardShortcuts']);
      const helpButtonKeyboardShortcuts = menuItemsList[indexKeyboardShortcuts];
      helpButtonKeyboardShortcuts.addEventListener('click', function () {
        setTimeout(function () {
          addToKeyboardShortcutsList();
        }, 100);
      });
    }, 100);
  });
};

const listenToClickToCloseSetParentDropdown = function (event) {
  const setParentDrawer = document.querySelector('.SetParentDrawer');
  if (setParentDrawer) {
    if (!setParentDrawer.contains(event.target)) {
      deleteSetParentTypeaheadDropdown();
    }
  }
};

const listenToClickToCloseSiblingSubtasksDropdown = function (event) {
  const siblingButtons = document.querySelector('#SiblingButtons');
  const siblingDropdown = document.querySelector('#SiblingSubtasksDropdownContainer');
  if (siblingDropdown) {
    if (!siblingButtons.contains(event.target) && !siblingDropdown.contains(event.target)) {
        deleteSiblingSubtasksDropdown();
    }
  }
};

const loadUserReplaceTextList = function () {
  chrome.storage.sync.get({
    'anOptionsPairs': []
  }, function (items) {
    document.loadedUserReplaceTextList = items.anOptionsPairs;
  });
};

const openPageWithoutRefresh = function (newUrl) {
  window.history.pushState({}, '', newUrl);
  window.history.back();
  setTimeout(function () {
    window.history.forward();
  }, 100);
};

const populateFromTypeahead = function (taskGidList, workspaceGid, queryValue, potentialTask) {
  callAsanaApi('GET', `workspaces/${workspaceGid}/typeahead`, {'type': 'task','query': queryValue, 'opt_fields': 'completed,is_rendered_as_separator,name,parent.name,projects.name,subtasks'}, {}, function (response) {
    const typeaheadSearchScrollableContents = document.querySelector('.TypeaheadSearchScrollable-contents');
    while (typeaheadSearchScrollableContents && typeaheadSearchScrollableContents.lastElementChild) {
      typeaheadSearchScrollableContents.lastElementChild.remove();
    }
    if (potentialTask) response.data.unshift(potentialTask);
    for (let i = 0; i < response.data.length; i++) {
      if (taskGidList.includes(response.data[i].gid)) continue;
      if (response.data[i].parent && taskGidList.includes(response.data[i].parent.gid)) continue;
      if (response.data[i].subtasks && response.data[i].subtasks.map(subtask => subtask.gid).filter(subtaskGid => taskGidList.includes(subtaskGid)).length) continue;
      if (response.data[i].is_rendered_as_separator) continue;
      const dropdownItem = document.createElement('DIV');
      dropdownItem.innerHTML = returnTypeAheadInnerHTML(response.data[i]);
      if (typeaheadSearchScrollableContents) typeaheadSearchScrollableContents.appendChild(dropdownItem);
      dropdownItem.addEventListener('mouseover', function () {
        this.firstElementChild.firstElementChild.classList.add('TypeaheadItemStructure--highlighted');
      });
      dropdownItem.addEventListener('mouseout', function () {
        this.firstElementChild.firstElementChild.classList.remove('TypeaheadItemStructure--highlighted');
      });
      dropdownItem.addEventListener('click', function () {
        const setParentData = {'parent': response.data[i].gid};
        if (document.querySelector('#SetParentSwitch').classList.contains('checked')) {
          setParentData.insert_before = null;
        } else {
          setParentData.insert_after = null;
          taskGidList.reverse();
        }
        setNewParentTask(taskGidList, setParentData, response.data[i]);
      });
    }
    if (typeaheadSearchScrollableContents && !typeaheadSearchScrollableContents.children.length) {
      const dropdownItemHintText = document.createElement('DIV');
      dropdownItemHintText.setAttribute('class', 'HintTextTypeaheadItem');
      dropdownItemHintText.innerText = locStrings['typeaheadItem-NoMatch'];
      typeaheadSearchScrollableContents.appendChild(dropdownItemHintText);
    }
  });
};

const replaceDescription = function (replaceTextList) {
  const taskGid = findTaskGid(window.location.href);
  if (isNaN(taskGid)) return; // gid spec might change
  callAsanaApi('GET', `tasks/${taskGid}`, {'opt_fields': 'html_notes'}, {}, function (response) {
    const htmlNotesOriginal = response.data.html_notes;
    let htmlNotes = htmlNotesOriginal.replace(/^<body>/, '').replace(/<\/body>$/, '');
    for (let i = 0; i < replaceTextList.length; i ++) {
      const pair = replaceTextList[i];
      htmlNotes = htmlNotes.replace(pair[0], pair[1]);
    }
    callAsanaApi('PUT', `tasks/${taskGid}`, {}, {'html_notes': '<body>' + htmlNotes + '</body>'}, function (response) {
      closeTaskPaneExtraActionsMenu();
      closeReplaceDescriptionDialog();
      displaySuccessToast(response.data, locStrings['toastContent-descriptionReplaced-var-task'], function (callback) {
        callAsanaApi('PUT', `tasks/${taskGid}`, {}, {'html_notes': htmlNotesOriginal}, function (response) {
          callback();
        });
      });
    });
  });
};

const replaceDescriptionPreset = function () {
  const replaceTextList = replaceTextListRegex.concat(replaceTextListEntity);
  replaceDescription(replaceTextList);
};

const replaceDescriptionUserText = function () {
  const userReplaceTextList = getUserReplaceTextList().map(a => [new RegExp(escapeHtml(a[0]), 'gm'), escapeHtml(a[1])]);
  if (!userReplaceTextList.length) {
    const replaceDescriptionDialogUserButton = document.querySelector('#ReplaceDescriptionDialogUserButton');
    replaceDescriptionDialogUserButton.classList.add('is-disabled');
    setTimeout(function () {
      replaceDescriptionDialogUserButton.classList.remove('is-disabled');
    }, 2000);
    return;
  }
  replaceDescription(userReplaceTextList);
};

// exclude XML entities: [['&amp;', '&'], ['&gt;', '>'], ['&lt;', '<'], ['&quot;', '"']]
const replaceTextListEntity = [['&Aacute;', 'Á'], ['&aacute;', 'á'], ['&Acirc;', 'Â'], ['&acirc;', 'â'], ['&acute;', '´'], ['&AElig;', 'Æ'], ['&aelig;', 'æ'], ['&Agrave;', 'À'], ['&agrave;', 'à'], ['&Alpha;', 'Α'], ['&alpha;', 'α'], ['&and;', '∧'], ['&ang;', '∠'], ['&apos;', '\''], ['&Aring;', 'Å'], ['&aring;', 'å'], ['&asymp;', '≈'], ['&Atilde;', 'Ã'], ['&atilde;', 'ã'], ['&Auml;', 'Ä'], ['&auml;', 'ä'], ['&bdquo;', '„'], ['&Beta;', 'Β'], ['&beta;', 'β'], ['&brvbar;', '¦'], ['&bull;', '•'], ['&cap;', '∩'], ['&Ccedil;', 'Ç'], ['&ccedil;', 'ç'], ['&cedil;', '¸'], ['&cent;', '¢'], ['&Chi;', 'Χ'], ['&chi;', 'χ'], ['&circ;', 'ˆ'], ['&clubs;', '♣'], ['&cong;', '≅'], ['&copy;', '©'], ['&crarr;', '↵'], ['&cup;', '∪'], ['&curren;', '¤'], ['&dagger;', '†'], ['&Dagger;', '‡'], ['&dArr;', '⇓'], ['&darr;', '↓'], ['&deg;', '°'], ['&Delta;', 'Δ'], ['&delta;', 'δ'], ['&diams;', '♦'], ['&divide;', '÷'], ['&Eacute;', 'É'], ['&eacute;', 'é'], ['&Ecirc;', 'Ê'], ['&ecirc;', 'ê'], ['&Egrave;', 'È'], ['&egrave;', 'è'], ['&empty;', '∅'], ['&emsp;', ' '], ['&ensp;', ' '], ['&Epsilon;', 'Ε'], ['&epsilon;', 'ε'], ['&equiv;', '≡'], ['&Eta;', 'Η'], ['&eta;', 'η'], ['&ETH;', 'Ð'], ['&eth;', 'ð'], ['&Euml;', 'Ë'], ['&euml;', 'ë'], ['&euro;', '€'], ['&exist;', '∃'], ['&fnof;', 'ƒ'], ['&forall;', '∀'], ['&frac12;', '½'], ['&frac14;', '¼'], ['&frac34;', '¾'], ['&Gamma;', 'Γ'], ['&gamma;', 'γ'], ['&ge;', '≥'], ['&hArr;', '⇔'], ['&harr;', '↔'], ['&hearts;', '♥'], ['&hellip;', '…'], ['&Iacute;', 'Í'], ['&iacute;', 'í'], ['&Icirc;', 'Î'], ['&icirc;', 'î'], ['&iexcl;', '¡'], ['&Igrave;', 'Ì'], ['&igrave;', 'ì'], ['&infin;', '∞'], ['&int;', '∫'], ['&Iota;', 'Ι'], ['&iota;', 'ι'], ['&iquest;', '¿'], ['&isin;', '∈'], ['&Iuml;', 'Ï'], ['&iuml;', 'ï'], ['&Kappa;', 'Κ'], ['&kappa;', 'κ'], ['&Lambda;', 'Λ'], ['&lambda;', 'λ'], ['&laquo;', '«'], ['&lArr;', '⇐'], ['&larr;', '←'], ['&lceil;', '⌈'], ['&ldquo;', '“'], ['&le;', '≤'], ['&lfloor;', '⌊'], ['&lowast;', '∗'], ['&loz;', '◊'], ['&lrm;', '‎'], ['&lsaquo;', '‹'], ['&lsquo;', '‘'], ['&macr;', '¯'], ['&mdash;', '—'], ['&micro;', 'µ'], ['&middot;', '·'], ['&minus;', '−'], ['&Mu;', 'Μ'], ['&mu;', 'μ'], ['&nabla;', '∇'], ['&ndash;', '–'], ['&ne;', '≠'], ['&ni;', '∋'], ['&not;', '¬'], ['&notin;', '∉'], ['&nsub;', '⊄'], ['&Ntilde;', 'Ñ'], ['&ntilde;', 'ñ'], ['&Nu;', 'Ν'], ['&nu;', 'ν'], ['&Oacute;', 'Ó'], ['&oacute;', 'ó'], ['&Ocirc;', 'Ô'], ['&ocirc;', 'ô'], ['&OElig;', 'Œ'], ['&oelig;', 'œ'], ['&Ograve;', 'Ò'], ['&ograve;', 'ò'], ['&oline;', '‾'], ['&Omega;', 'Ω'], ['&omega;', 'ω'], ['&Omicron;', 'Ο'], ['&omicron;', 'ο'], ['&oplus;', '⊕'], ['&or;', '∨'], ['&ordf;', 'ª'], ['&ordm;', 'º'], ['&Oslash;', 'Ø'], ['&oslash;', 'ø'], ['&Otilde;', 'Õ'], ['&otilde;', 'õ'], ['&otimes;', '⊗'], ['&Ouml;', 'Ö'], ['&ouml;', 'ö'], ['&para;', '¶'], ['&part;', '∂'], ['&permil;', '‰'], ['&perp;', '⊥'], ['&Phi;', 'Φ'], ['&phi;', 'φ'], ['&Pi;', 'Π'], ['&pi;', 'π'], ['&piv;', 'ϖ'], ['&plusmn;', '±'], ['&pound;', '£'], ['&prime;', '′'], ['&Prime;', '″'], ['&prod;', '∏'], ['&prop;', '∝'], ['&Psi;', 'Ψ'], ['&psi;', 'ψ'], ['&radic;', '√'], ['&raquo;', '»'], ['&rArr;', '⇒'], ['&rarr;', '→'], ['&rceil;', '⌉'], ['&rdquo;', '”'], ['&reg;', '®'], ['&rfloor;', '⌋'], ['&Rho;', 'Ρ'], ['&rho;', 'ρ'], ['&rlm;', '‏'], ['&rsaquo;', '›'], ['&rsquo;', '’'], ['&sbquo;', '‚'], ['&Scaron;', 'Š'], ['&scaron;', 'š'], ['&sdot;', '⋅'], ['&sect;', '§'], ['&Sigma;', 'Σ'], ['&sigma;', 'σ'], ['&sigmaf;', 'ς'], ['&sim;', '∼'], ['&spades;', '♠'], ['&sub;', '⊂'], ['&sube;', '⊆'], ['&sum;', '∑'], ['&sup1;', '¹'], ['&sup2;', '²'], ['&sup3;', '³'], ['&sup;', '⊃'], ['&supe;', '⊇'], ['&szlig;', 'ß'], ['&Tau;', 'Τ'], ['&tau;', 'τ'], ['&there4;', '∴'], ['&Theta;', 'Θ'], ['&theta;', 'θ'], ['&thetasym;', 'ϑ'], ['&thinsp;', ' '], ['&THORN;', 'Þ'], ['&thorn;', 'þ'], ['&tilde;', '˜'], ['&times;', '×'], ['&trade;', '™'], ['&Uacute;', 'Ú'], ['&uacute;', 'ú'], ['&uArr;', '⇑'], ['&uarr;', '↑'], ['&Ucirc;', 'Û'], ['&ucirc;', 'û'], ['&Ugrave;', 'Ù'], ['&ugrave;', 'ù'], ['&uml;', '¨'], ['&upsih;', 'ϒ'], ['&Upsilon;', 'Υ'], ['&upsilon;', 'υ'], ['&Uuml;', 'Ü'], ['&uuml;', 'ü'], ['&Xi;', 'Ξ'], ['&xi;', 'ξ'], ['&Yacute;', 'Ý'], ['&yacute;', 'ý'], ['&yen;', '¥'], ['&Yuml;', 'Ÿ'], ['&yuml;', 'ÿ'], ['&Zeta;', 'Ζ'], ['&zeta;', 'ζ'], ['&zwj;', '‍'], ['&zwnj;', '‌']].map(a => [new RegExp(a[0].replace('&', '&amp;'), 'g'), a[1]]);

const replaceTextListRegex = [[/(?:&lt;|&quot;|')?(<a href=")(mailto:)?([A-Za-z0-9\-:;/._=+&%?!#$'@]+)(">)\3(<\/a>)(\?)?(?:&gt;|&quot;|')? &lt;\2?\1\2\3[\/\s]*\4\3[\/\s]*\5\6&gt;(?:&gt;|&quot;|')?/g, '$1$2$3$4$3$5$6']];

const returnReplaceDescriptionInnerHTML = function () {
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

const returnTypeAheadInnerHTML = function (task) {
  const parentName = (task.parent)? task.parent.name: '';
  const projectNameList = (task.projects)? task.projects.map(a => a.name).join(', '): '';
  return `<div role="option" data-task-gid="${task.gid}" title="` +
  escapeHtml(task.name) + `${(parentName)? '&#13;‹ ' + escapeHtml(parentName): ''}` + `${(projectNameList)? '&#13;(' + escapeHtml(projectNameList) + ')': ''}` +
  '"><div class="TypeaheadItemStructure TypeaheadItemStructure--enabled"><div class="TypeaheadItemStructure-icon">' +
  `${(task.completed)? '<svg class="Icon CheckCircleFullIcon TaskTypeaheadItem-completedIcon" focusable="false" viewBox="0 0 32 32"><path d="M16,0C7.2,0,0,7.2,0,16s7.2,16,16,16s16-7.2,16-16S24.8,0,16,0z M23.3,13.3L14,22.6c-0.3,0.3-0.7,0.4-1.1,0.4s-0.8-0.1-1.1-0.4L8,18.8c-0.6-0.6-0.6-1.5,0-2.1s1.5-0.6,2.1,0l2.8,2.8l8.3-8.3c0.6-0.6,1.5-0.6,2.1,0S23.9,12.7,23.3,13.3z"></path></svg>': '<svg class="Icon CheckCircleIcon TaskTypeaheadItem-incompletedIcon" focusable="false" viewBox="0 0 32 32"><path d="M16,32C7.2,32,0,24.8,0,16S7.2,0,16,0s16,7.2,16,16S24.8,32,16,32z M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z"></path><path d="M12.9,22.6c-0.3,0-0.5-0.1-0.7-0.3l-3.9-3.9C8,18,8,17.4,8.3,17s1-0.4,1.4,0l3.1,3.1l8.6-8.6c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-9.4,9.4C13.4,22.5,13.2,22.6,12.9,22.6z"></path></svg>'}` +
  `</div><div class="TypeaheadItemStructure-label"><div class="TypeaheadItemStructure-title"><span>${escapeHtml(task.name)}</span>` +
  `${(parentName)? '<span class="TaskTypeaheadItem-parentTask">' + escapeHtml(parentName) + '</span>': ''}`+
  '</div>' +
  `${(projectNameList)? '<div class="TypeaheadItemStructure-subtitle">' + escapeHtml(projectNameList) + '</div>': ''}`+
  '</div></div></div>';
};

const runOptionalFunctionsOnLoad = function () {
  chrome.storage.sync.get({
    'anOptionsProjects': true,
    'anOptionsSubtasks': true,
    'anOptionsShortcuts': true,
    'anOptionsDescription': true,
    'anOptionsParent': true
  }, function (items) {
    if (items.anOptionsProjects) displayProjectsOnTop();
    if (items.anOptionsSubtasks) displayLinksToSiblingSubtasks();
    if (items.anOptionsShortcuts) listenToClickOnKeyboardShortcutList();
    if (items.anOptionsDescription) addReplaceDescriptionToExtraActions();
    if (items.anOptionsParent) addSetParentToExtraActions();
  });
};

const runOptionalFunctionsAfterDelay = function (delay) {
  chrome.storage.sync.get({
    'anOptionsInbox': true,
    'anOptionsProjects': true,
    'anOptionsSubtasks': true,
    'anOptionsDescription': true,
    'anOptionsParent': true
  }, function (items) {
    setTimeout(function () {
      if (items.anOptionsInbox) listenToClickOnInboxSavePrevious();
      if (items.anOptionsProjects) displayProjectsOnTop();
      if (items.anOptionsSubtasks) displayLinksToSiblingSubtasks();
      if (items.anOptionsDescription) addReplaceDescriptionToExtraActions();
      if (items.anOptionsParent) addSetParentToExtraActions();
    }, delay);
  });
};

const saveOriginalParents = function (taskGidList) {
  document.anOriginalParents = {};
  const taskAncestryTaskLinks = document.querySelectorAll('.NavigationLink.TaskAncestry-ancestorLink');
  const taskGid = findTaskGid(window.location.href);
  if (taskGidList.length >= 2) {
    for (let i = 0; i < taskGidList.length; i++) {
      callAsanaApi('GET', `tasks/${taskGidList[i]}`, {}, {'opt_fields': 'parent'}, function (response) {
        if (!response.data.parent) {
          document.anOriginalParents[i] = [null, null];
        } else {
          const originalParentGid = response.data.parent.gid;
          callAsanaApi('GET', `tasks/${originalParentGid}/subtasks`, {}, {}, function (response) {
            const subtaskGidList = response.data.map(subtask => subtask.gid);
            const indexCurrent = subtaskGidList.indexOf(taskGidList[i]);
            const originalPreviousSiblingGid = (indexCurrent > 0)? subtaskGidList[indexCurrent - 1]: null;
            document.anOriginalParents[i] = [originalParentGid, originalPreviousSiblingGid];
          });
        }
      });
    }
  } else if (taskAncestryTaskLinks.length) {
    const originalParentGid = findTaskGid(taskAncestryTaskLinks[taskAncestryTaskLinks.length - 1].href);
    callAsanaApi('GET', `tasks/${originalParentGid}/subtasks`, {}, {}, function (response) {
      const subtaskGidList = response.data.map(subtask => subtask.gid);
      const indexCurrent = subtaskGidList.indexOf(taskGid);
      const originalPreviousSiblingGid = (indexCurrent > 0)? subtaskGidList[indexCurrent - 1]: null;
      document.anOriginalParents[0] = [originalParentGid, originalPreviousSiblingGid];
    });
  } else {
    document.anOriginalParents[0] = [null, null];
  }
};

const saveUserReplaceTextList = function () {
  const userReplaceTextList = getUserReplaceTextList();
  chrome.storage.sync.set({
    'anOptionsPairs': userReplaceTextList
  }, function () {
    document.loadedUserReplaceTextList = userReplaceTextList;
    const saveTextLink = document.querySelector('#SaveUserReplaceTextListLink');
    const savedText = '✓ ';
    saveTextLink.textContent = savedText + saveTextLink.textContent;
    setTimeout(function () {
      saveTextLink.textContent = saveTextLink.textContent.replace(savedText, '');
    }, 2000);
  });
};

const setNewParentTask = function (taskGidList, setParentData, parentTask) {
  const setParentDrawer = document.querySelector('.SetParentDrawer');
  const originalParentsList = Object.values(document.anOriginalParents);

  let counter = 0;
  const recursiveSetNewParent = function (path, options, data) {
    callAsanaApi('POST', path, options, data, function (response) {
      counter += 1;
      if (counter === taskGidList.length) {
        displaySuccessToast(parentTask, locStrings['toastContent-setParent-var-task'], function (callback) {
          if (setParentData.hasOwnProperty('insert_after')) taskGidList.reverse();
          let counterUndo = 0;
          const recursiveUndoParent = function () {
            callAsanaApi('POST', `tasks/${taskGidList[counterUndo]}/setParent`, {}, {'parent': originalParentsList[counterUndo][0], 'insert_after': originalParentsList[counterUndo][1]}, function (response) {
              counterUndo += 1;
              if (counterUndo === taskGidList.length) {
                callback();
                runOptionalFunctionsAfterDelay(100);
              } else {
                recursiveUndoParent();
              }
            });
          };
          recursiveUndoParent();
        });
        runOptionalFunctionsAfterDelay(100);
      } else {
        path = `tasks/${taskGidList[counter]}/setParent`;
        recursiveSetNewParent(path, options, data);
      }
    });
  };
  recursiveSetNewParent(`tasks/${taskGidList[counter]}/setParent`, {}, setParentData);
  closeSetParentDrawer();
};

const toggleSetParentSwitch = function (input) {
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
        const arrowNextSubtask = document.querySelector('#ArrowNextSubtask');
        if (arrowNextSubtask) arrowNextSubtask.click();
      }
      break;
      case 'ArrowRight':
      if (document.tabKeyIsDown && event.shiftKey) {
        if (document.querySelector('#SiblingSubtasksDropdownContainer')) {
          deleteSiblingSubtasksDropdown();
        } else {
          const arrowMiddleSubtask = document.querySelector('#ArrowMiddleSubtask');
          if (arrowMiddleSubtask) arrowMiddleSubtask.click();
        }
      }
      break;
      case 'ArrowUp':
        if (document.tabKeyIsDown && event.shiftKey) {
          const arrowPreviousSubtask = document.querySelector('#ArrowPreviousSubtask');
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
    case 'i': {
      if (!document.tabKeyIsDown) break;
      const sidebarInboxLink = document.querySelector('.SidebarTopNavLinks-notificationsButton');
      sidebarInboxLink.click();
      break;
    }
    case 'j': {
      if (!document.tabKeyIsDown) break;
      const backLinkFromInbox = document.querySelector('.InboxButton-backLink');
      if (backLinkFromInbox) backLinkFromInbox.click();
      break;
    }
    case 'g':
      if (!document.tabKeyIsDown) break;
      if (document.querySelector('.SetParentDrawer')) {
        closeSetParentDrawer();
      } else {
        chrome.storage.sync.get({'anOptionsParent': true}, function (items) {
          if (items.anOptionsParent) displaySetParentDrawer();
        });
      }
      break;
    case ':':
      if (!document.tabKeyIsDown) break;
      chrome.storage.sync.get({'anOptionsSection': true}, function (items) {
        if (items.anOptionsSection) convertTaskAndSection();
      });
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

// First load or page reload
window.addEventListener('load', function () {
  createBackFromInboxButton();
  getLocaleAndSetLocalizedStrings();
  getPlatformAndSetPlatStrings();
  loadUserReplaceTextList();
  runOptionalFunctionsOnLoad();
});

// After jumping from other resources on Asana
chrome.runtime.onMessage.addListener(
  function (message, sender, sendResponse) {
    if (message.name && message.name === 'asanaNavigatorOnUpdated' && message.status === 'complete') {
      runOptionalFunctionsAfterDelay(400);
    }
});