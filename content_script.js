const addReplaceDescriptionToExtraActions = function() {
  const singleTaskPaneExtraActionsButton = document.querySelector('.SingleTaskPaneExtraActionsButton');
  if (singleTaskPaneExtraActionsButton) {
    singleTaskPaneExtraActionsButton.addEventListener('click', function() {
      const replaceDescriptionButton = document.createElement('A');
      replaceDescriptionButton.setAttribute('class', 'StaticMenuItemBase-button StaticMenuItemBase--medium MenuItemBase Menu-menuItem SingleTaskPaneExtraActionsButton-replaceDescription SingleTaskPaneExtraActionsButton-menuItem');
      replaceDescriptionButton.addEventListener('mouseover', function() {this.classList.add('is-highlighted');});
      replaceDescriptionButton.addEventListener('mouseout', function() {this.classList.remove('is-highlighted');});
      replaceDescriptionButton.addEventListener('click', function() {
        displayReplaceDescriptionDialog();
        closeTaskPaneExtraActionsMenu();
      });
      replaceDescriptionButton.innerHTML = `<span class="MenuItem-label"><div class="ExtraActionsMenuItemLabel"><span class="ExtraActionsMenuItemLabel-body">${locStrings['menuButton-replaceDescription']}</span><span class="ExtraActionsMenuItemLabel-shortcut"><span class="KeyboardShortcutLabel KeyboardShortcutLabel--normal KeyboardShortcutLabel--light"><span class="KeyboardShortcutLabel-key">Tab</span><span class="KeyboardShortcutLabel-key">E</span></span></span></div></span>`;

      setTimeout(function() {
        const previousExtraActionButton = document.querySelector('.SingleTaskPaneExtraActionsButton-print');
        if (previousExtraActionButton && !document.querySelector('.SingleTaskPaneExtraActionsButton-replaceDescription')) {
          previousExtraActionButton.parentNode.insertBefore(replaceDescriptionButton, previousExtraActionButton.nextSibling);
        }
      }, 100);
    });
  }
};

const addRowToUserReplaceTextList = function() {
  const userTextToReplaceDialogTable = document.querySelector('#UserTextToReplaceDialogTable');
  if (!userTextToReplaceDialogTable) return;
  const newUserTextTr = document.createElement('TR');
  newUserTextTr.setAttribute('class', 'name-row');
  newUserTextTr.innerHTML = `<td class="field-value"><input autocomplete="off" class="generic-input showing ReplaceDescriptionInput" type="text" tabindex="0" value=""></td>
    <td class="field-value"><input autocomplete="off" class="generic-input showing ReplaceDescriptionInput" type="text" tabindex="0" value=""></td>
    <td><a class="delete-row-link">&nbsp;×</a></td>`;
  newUserTextTr.lastElementChild.addEventListener('click', function(event) {deleteUserReplaceTextRow(event.target);});
  userTextToReplaceDialogTable.firstElementChild.appendChild(newUserTextTr);
};

const addSearchDropdownShortcut = function() {
  let mode, fieldValue;
  const topbarPageHeaderStructure = document.querySelector('.TopbarPageHeaderStructure');
  if (!topbarPageHeaderStructure) return;
  if (window.location.href.includes('https://app.asana.com/0/inbox/')) {
    mode = 'InInbox';
    fieldValue = locStrings['snippet-me'];
  } else if (topbarPageHeaderStructure.classList.contains('ProjectPageHeader')) {
    mode = 'InProject';
    fieldValue = topbarPageHeaderStructure.children[1].firstElementChild.firstElementChild.textContent;
  } else if (topbarPageHeaderStructure.classList.contains('MyTasksPageHeader')) {
    mode = 'MyTasks';
    fieldValue = locStrings['snippet-me'];
  } else if (topbarPageHeaderStructure.classList.contains('ProfilePageHeader')) {
    mode = 'ThisUser';
    fieldValue = topbarPageHeaderStructure.children[1].firstElementChild.firstElementChild.textContent.match(new RegExp(locStrings['topbarTitle-replacement-var-nameOrEmail'].replace('{nameOrEmail}', '(.+?)').replace(' ', '\\s')))[1];
  } else {
    return;
  }
  const dropdownItem = document.createElement('DIV');
  constructInContextSearchDropdownItem(dropdownItem, mode);
  setTimeout(function() {
    const topbarSearchDropdownContainer = document.querySelector('.TopbarSearchTypeaheadDropdownContents-scrollableList').firstElementChild;
    if (!topbarSearchDropdownContainer || topbarSearchDropdownContainer.firstElementChild.id == 'InContextSearch') return;
    topbarSearchDropdownContainer.insertBefore(dropdownItem, topbarSearchDropdownContainer.firstElementChild);
    dropdownItem.addEventListener('click', function() {
      document.querySelector('.TopbarSearchAdvancedSearchItem').click();
      setTimeout(function() {
        const searchInContextFilter = ((mode == 'InInbox') ? document.querySelectorAll('.DomainUserFilter')[1] : document.querySelector(`.${(mode == 'InProject') ? 'ProjectFilter' : 'DomainUserFilter'}`));
        if (!searchInContextFilter) return;
        const searchInContextInputField = searchInContextFilter.firstElementChild.firstElementChild.children[1];
        if (!searchInContextInputField) return;
        searchInContextInputField.focus();
        searchInContextInputField.value = fieldValue;
        document.execCommand('insertText', false, fieldValue);
        searchInContextInputField.dispatchEvent(new Event('input', {bubbles: true, cancelable: true, target: searchInContextInputField}));
      }, 100);
    });
  }, 200);
};

const addSetParentToExtraActions = function() {
  const [taskPaneTypeString, taskPaneExtraActionsButton] = getTaskPaneTypeAndElement('ExtraActionsButton');
  if (taskPaneExtraActionsButton) {
    taskPaneExtraActionsButton.addEventListener('click', function() {
      const setParentButton = document.createElement('A');
      setParentButton.setAttribute('class', `StaticMenuItemBase-button StaticMenuItemBase--medium MenuItemBase Menu-menuItem ${taskPaneTypeString}TaskPaneExtraActionsButton-setParent ${taskPaneTypeString}TaskPaneExtraActionsButton-menuItem`);
      setParentButton.addEventListener('mouseover', function() {this.classList.add('is-highlighted');});
      setParentButton.addEventListener('mouseout', function() {this.classList.remove('is-highlighted');});
      setParentButton.addEventListener('click', function() {
        displaySetParentDrawer();
        closeTaskPaneExtraActionsMenu();
      });
      setParentButton.innerHTML = `<span class="MenuItem-label"><div class="ExtraActionsMenuItemLabel"><span class="ExtraActionsMenuItemLabel-body">${locStrings['menuButton-setParent']}</span><span class="ExtraActionsMenuItemLabel-shortcut"><span class="KeyboardShortcutLabel KeyboardShortcutLabel--normal KeyboardShortcutLabel--light"><span class="KeyboardShortcutLabel-key">Tab</span><span class="KeyboardShortcutLabel-key">G</span></span></span></div></span>`;

      setTimeout(function() {
        const advancedActionsMenuItemButton = document.querySelector('.SingleTaskPaneExtraActionsButton-advancedActionsMenuItem');
        const nextExtraActionButton = advancedActionsMenuItemButton ? advancedActionsMenuItemButton.parentNode : document.querySelector('.MenuSeparator');
        if (nextExtraActionButton && !document.querySelector(`.${taskPaneTypeString}TaskPaneExtraActionsButton-setParent`)) {
          nextExtraActionButton.parentNode.insertBefore(setParentButton, nextExtraActionButton);
        }
      }, 100);
    });
  }
};

const addToKeyboardShortcutsList = function() {
  const keyboardShortcutsModal = document.querySelector('.KeyboardShortcutsModal');
  if (!keyboardShortcutsModal) return;
  if (document.querySelector('#KeyboardShortcutsModalANSection')) return;
  const keyboardShortcutsModalANSection = document.createElement('DIV');
  keyboardShortcutsModalANSection.setAttribute('class', 'KeyboardShortcutsModal-section');
  keyboardShortcutsModalANSection.setAttribute('id', 'KeyboardShortcutsModalANSection');
  keyboardShortcutsModalANSection.innerHTML = '<h3 class="KeyboardShortcutsModal-sectionHeader">Asana Navigator</h3>';
  keyboardShortcutsModal.firstElementChild.children[1].lastElementChild.appendChild(keyboardShortcutsModalANSection);
  const separator = 'separator';
  const shortcutsArray = [
    [locStrings['shortcutDescription-backLink'], ['Tab', 'J']],
    [locStrings['shortcutDescription-attachmentsButton'], ['Tab', 'V']],
    [locStrings['shortcutDescription-moreActionsButton'], ['Tab', '.']],
    [locStrings['shortcutDescription-siblingSubtasks'], [platStrings['shift'], 'Tab', '↑', separator, platStrings['shift'], 'Tab', '↓']],
    [locStrings['shortcutDescription-subtasksDropdown'], [platStrings['shift'], 'Tab', '→']],
    [locStrings['menuButton-replaceDescription'], ['Tab', 'E']],
    [locStrings['menuButton-setParent'], ['Tab', 'G']],
    [locStrings['shortcutDescription-convertSection'], ['Tab', ':', separator, platStrings['shift'], 'Tab', ':']],
  ];
  for (let i = 0; i < shortcutsArray.length; i++) {
    const [description, keyList] = shortcutsArray[i];
    const keyboardShortcutsModalRow = document.createElement('DIV');
    keyboardShortcutsModalRow.setAttribute('class', 'KeyboardShortcutsModal-row');
    keyboardShortcutsModalRow.innerHTML = `<span class="KeyboardShortcutsModal-description">${description}</span><span class="KeyboardShortcutsModal-keys"><span class="KeyboardShortcutsModal-key"><span class="KeyboardShortcutLabel KeyboardShortcutLabel--normal KeyboardShortcutLabel--light">` +
    keyList.map(a => (a === separator) ? ' / ' : '<span class="KeyboardShortcutLabel-key">' + a + '</span>').join('') + '</span></span></span>';
    keyboardShortcutsModalANSection.appendChild(keyboardShortcutsModalRow);
  }
};

// https://www.chromium.org/Home/chromium-security/extension-content-script-fetches
// Delegate to background.js
const callAsanaApi = function(request, path, options, data, callback) {
  chrome.runtime.sendMessage(
    {contentScriptQuery: 'callAsanaApi', parameters: [request, path, options, data]}, callback
  );
};

const clickNumberedAddAttachmentButton = function(number) {
  const addAttachmentsMenuItem = document.querySelector('.AddAttachmentsMenuItem');
  if (!addAttachmentsMenuItem) return;
  const listAddAttachmentButtons = addAttachmentsMenuItem.parentNode.children;
  if (number) listAddAttachmentButtons[number].click();
};

const closeReplaceDescriptionDialog = function() {
  const replaceDescriptionDialogView = document.querySelector('#ReplaceDescriptionDialogView');
  if (replaceDescriptionDialogView) replaceDescriptionDialogView.remove();
};

const closeSetParentDrawer = function() {
  const setParentDrawer = document.querySelector('.SetParentDrawer');
  if (setParentDrawer) setParentDrawer.remove();
  document.removeEventListener('click', listenToClickToCloseSetParentDropdown);
};

const closeTaskPaneExtraActionsMenu = function() {
  const [taskPaneTypeString, taskPaneExtraActionsButton] = getTaskPaneTypeAndElement('ExtraActionsButton');
  if (taskPaneExtraActionsButton.classList.contains('CircularButton--active') || taskPaneExtraActionsButton.classList.contains('is-dropdownVisible')) {
    taskPaneExtraActionsButton.click();
  }
};

const constructInContextSearchDropdownItem = function(dropdownItem, mode) {
  dropdownItem.setAttribute('id', 'InContextSearch');
  dropdownItem.setAttribute('role', 'option');
  dropdownItem.innerHTML = `<div class="TypeaheadItemStructure TypeaheadItemStructure--enabled">
    <div class="TypeaheadItemStructure-icon">
      <svg class="Icon InContextIcon" focusable="false" viewBox="0 0 32 32">
        ${(mode == 'InInbox') ? '<path d="M30,20.6c-1.3-1.1-2-2.7-2-4.4v-3.9C28,5.7,22.7,0.1,16.2,0C13,0,9.9,1.2,7.6,3.4C5.3,5.7,4,8.8,4,12v4.2  c0,1.7-0.7,3.3-2,4.4c-1,0.9-1.3,2.4-0.7,3.7c0.5,1,1.6,1.7,2.8,1.7h23.7c1.2,0,2.3-0.7,2.8-1.7C31.3,23,31,21.6,30,20.6z M28.9,23.4c-0.2,0.3-0.6,0.6-1,0.6H4.2c-0.4,0-0.9-0.2-1-0.6c-0.2-0.5-0.1-1,0.2-1.3C5,20.6,6,18.5,6,16.2V12c0-2.7,1.1-5.2,3-7.1S13.4,2,16,2c0.1,0,0.1,0,0.2,0C21.6,2.1,26,6.7,26,12.4v3.9c0,2.2,1,4.4,2.6,5.9C29,22.5,29.1,23,28.9,23.4z M20.6,27.1c-0.5-0.2-1.1,0.1-1.3,0.6C18.8,29.1,17.5,30,16,30s-2.8-0.9-3.3-2.3c-0.2-0.5-0.8-0.8-1.3-0.6c-0.5,0.2-0.8,0.8-0.6,1.3c0.8,2.2,2.9,3.7,5.2,3.7s4.4-1.5,5.2-3.7C21.4,27.8,21.1,27.2,20.6,27.1z"></path>' :
        mode == 'InProject' ? document.querySelector('.TopbarPageHeaderStructure').firstElementChild.firstElementChild.children[1].innerHTML :
        '<path d="M29.1,20.9 M16,32C7.2,32,0,24.8,0,16S7.2,0,16,0s16,7.2,16,16S24.8,32,16,32z M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z M12.9,22.6c-0.3,0-0.5-0.1-0.7-0.3l-3.9-3.9C8,18,8,17.4,8.3,17s1-0.4,1.4,0l3.1,3.1l8.6-8.6c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-9.4,9.4C13.4,22.5,13.2,22.6,12.9,22.6z"></path>'}
      </svg>
    </div>
    <div class="TypeaheadItemStructure-label">
      <div class="TypeaheadItemStructure-title">${locStrings[`dropdown-search${mode}`]}</div>
    </div>
  </div>`;
  dropdownItem.addEventListener('mouseover', function() {this.firstElementChild.classList.add('TypeaheadItemStructure--highlighted');});
  dropdownItem.addEventListener('mouseout', function() {this.firstElementChild.classList.remove('TypeaheadItemStructure--highlighted');});
};

const convertProjectSection = function(workspaceGid, projectGid, projectSectionDOM) {
  const taskGroupHeaders = Array.from(document.querySelectorAll('.TaskGroupHeader'));
  callAsanaApi('GET', `projects/${projectGid}/sections`, {}, {}, function(response) {
    const projectSections = response.data;
    const sectionIndex = taskGroupHeaders.indexOf(projectSectionDOM) + (projectSections.length - taskGroupHeaders.length); // The first section might be "(no section)"
    const sectionGid = projectSections[sectionIndex].gid;
    callAsanaApi('POST', 'tasks', {name: projectSections[sectionIndex].name.replace(/[:：]+$/, ''), workspace: workspaceGid}, {}, function(response) {
      callAsanaApi('POST', `tasks/${response.data.gid}/addProject`, {section: projectSections[sectionIndex - 1].gid, project: projectGid}, {}, function(response) {});
      callAsanaApi('GET', `sections/${sectionGid}/tasks`, {}, {}, function(response) {
        const tasksInSection = response.data;
        if (tasksInSection.length == 0) {
          callAsanaApi('DELETE', `sections/${sectionGid}`, {}, {}, function(response) {});
        } else {
          let counter = 0;
          const recursiveMoveToSection = function(path, options, data) {
            callAsanaApi('POST', path, options, data, function(response) {
              counter += 1;
              if (counter == tasksInSection.length) {
                callAsanaApi('DELETE', `sections/${sectionGid}`, {}, {}, function(response) {});
              } else {
                path = `tasks/${tasksInSection[counter].gid}/addProject`;
                recursiveMoveToSection(path, options, data);
              }
            });
          };
          recursiveMoveToSection(`tasks/${tasksInSection[counter].gid}/addProject`, {section: projectSections[sectionIndex - 1].gid, project: projectGid}, {});
        }
      });
    });
  });
};

const convertProjectTask = function(focusedTaskData) {
  const focusedTaskGid = focusedTaskData.gid;
  const focusedTaskName = focusedTaskData.name;
  const currentProjectGid = findProjectGid(window.location.href);
  const currentSectionGid = focusedTaskData.memberships.filter(membership => membership.project.gid == currentProjectGid)[0].section.gid;
  callAsanaApi('GET', `sections/${currentSectionGid}/tasks`, {}, {}, function(response) {
    const tasksInSection = response.data;
    let indexInSection;
    for (let i = 0; i < tasksInSection.length; i++) {
      if (tasksInSection[i].gid == focusedTaskGid) {
        indexInSection = i;
        break;
      }
    }
    const tasksToMove = tasksInSection.slice(indexInSection + 1);
    callAsanaApi('POST', `projects/${currentProjectGid}/sections`, {name: (focusedTaskName.replace(/[:：]+$/, '') + ':')}, {}, function(response) {
      const newSectionGid = response.data.gid;
      callAsanaApi('POST', `projects/${currentProjectGid}/sections/insert`, {section: newSectionGid, after_section: currentSectionGid}, {}, function(response) {
        if (tasksToMove.length == 0) {
          callAsanaApi('DELETE', `tasks/${focusedTaskGid}`, {}, {}, function(response) {});
        } else {
          let counter = 0;
          const recursiveMoveToSection = function(path, options, data) {
            callAsanaApi('POST', path, options, data, function(response) {
              counter += 1;
              if (counter == tasksToMove.length) {
                callAsanaApi('DELETE', `tasks/${focusedTaskGid}`, {}, {}, function(response) {});
              } else {
                path = `tasks/${tasksToMove[counter].gid}/addProject`;
                recursiveMoveToSection(path, options, data);
              }
            });
          };
          recursiveMoveToSection(`tasks/${tasksToMove[counter].gid}/addProject`, {section: newSectionGid, project: currentProjectGid}, {});
        }
      });
    });
  });
};

// Works only where Tab+N is supported (project view, my tasks view, and subtask list)
const convertTaskAndSection = function() {
  const projectSectionDOM = document.querySelector('.TaskGroupHeader[draggable~="false"]');
  if (projectSectionDOM) {
    const confirmed = window.confirm(
      'Asana Navigator: ' +
      [locStrings['confirmMessage-convertToTask'], locStrings['snippet-continue']].join(locStrings['snippet-spacing'])
    );
    const projectGid = findProjectGid(window.location.href);
    callAsanaApi('GET', `projects/${projectGid}`, {opt_fields: 'workspace'}, {}, function(response) {
      const workspaceGid = response.data.workspace.gid;
      if (confirmed) convertProjectSection(workspaceGid, projectGid, projectSectionDOM);
    });
    return;
  }

  const focusedItemRow = document.querySelector('.ItemRow--focused') || document.querySelector('.SpreadsheetRow--highlighted')|| document.querySelector('.SpreadsheetRow--withShadedBackground');
  if (!focusedItemRow) {
    const returning = window.confirm(locStrings['confirmMessage-abortConversionUnsupportedPlace']);
    return;
  }
  const isProjectTask = !focusedItemRow.classList.contains('ItemRow--focused');
  const isMultiple = document.querySelectorAll('.ItemRow--focused').length > 1 || document.querySelectorAll('.SpreadsheetRow--highlighted').length > 1 || document.querySelectorAll('.SpreadsheetRow--withShadedBackground').length > 1;
  const isSeparator = focusedItemRow.classList.contains('SectionRow');

  const topbarPageHeaderStructure = document.querySelector('.TopbarPageHeaderStructure');
  if (!isSeparator && !topbarPageHeaderStructure.classList.contains('ProjectPageHeader') && !topbarPageHeaderStructure.classList.contains('MyTasksPageHeader')) {
    const returning = window.confirm(locStrings['confirmMessage-abortConversionUnsupportedPlace']);
    return;
  }
  const taskTextarea = isProjectTask ? focusedItemRow.firstElementChild.firstElementChild.children[4].children[1] : ((isSeparator ? focusedItemRow : focusedItemRow.children[1]).children[2] ? (isSeparator ? focusedItemRow : focusedItemRow.children[1]).children[2] : (isSeparator ? focusedItemRow : focusedItemRow.children[1]).children[1]).children[1];
  const focusedTaskGid = /_(\d+)$/.exec(taskTextarea.id)[1];

  callAsanaApi('GET', `tasks/${focusedTaskGid}`, {opt_fields: 'assignee,memberships.(project|section),name,parent,projects,subtasks,workspace'}, {}, function(response) {
    const focusedTaskData = response.data;
    const focusedTaskAssigneeGid = focusedTaskData.assignee ? focusedTaskData.assignee.gid : null;
    const focusedTaskName = focusedTaskData.name;
    const focusedTaskParentGid = focusedTaskData.parent ? focusedTaskData.parent.gid : null;
    const workspaceGid = focusedTaskData.workspace.gid;

    if (focusedTaskData.subtasks.length) {
      const returning = window.confirm(locStrings['confirmMessage-abortConversionWithSubtasks']);
      return;
    }

    const confirmed = window.confirm(
      'Asana Navigator: ' +
      (isSeparator ? locStrings['confirmMessage-convertToTask'] : locStrings['confirmMessage-convertToSection']) + '\n' +
      (isMultiple ? locStrings['confirmMessage-multipleTasks'] + '\n' : '') +
      ((isProjectTask && (focusedTaskAssigneeGid || focusedTaskParentGid)) ? locStrings['confirmMessage-taskInProject'] + '\n' : '') +
      ((!isProjectTask && response.data.projects.length) ? locStrings['confirmMessage-taskNotInProject'] + '\n' : '') +
      (isSeparator ? '' : (locStrings['confirmMessage-deleteInformation'] + '\n' + locStrings['confirmMessage-taskIdChanged'] + '\n')) +
      locStrings['snippet-continue']
    );
    if (!confirmed) return;

    if (isProjectTask) {
      convertProjectTask(focusedTaskData);
    } else {
      callAsanaApi('POST', 'tasks', {assignee: focusedTaskAssigneeGid ? focusedTaskAssigneeGid : 'null', name: (focusedTaskName.replace(/[:：]+$/, '') + (isSeparator ? '' : ':')), workspace: workspaceGid}, {}, function(response) {
        const newTaskGid = response.data.gid;
        if (focusedTaskAssigneeGid) {
          callAsanaApi('GET', `users/${focusedTaskAssigneeGid}/user_task_list`, {workspace: workspaceGid}, {}, function(response) {
            const userTaskListGid = response.data.gid;
            callAsanaApi('POST', `user_task_lists/${userTaskListGid}/tasks/insert`, {}, {insert_after: focusedTaskGid, task: newTaskGid}, function(response) {
              if (focusedTaskParentGid) {
                callAsanaApi('POST', `tasks/${newTaskGid}/setParent`, {insert_after: focusedTaskGid, parent: focusedTaskParentGid}, {}, function(response) {
                    callAsanaApi('DELETE', `tasks/${focusedTaskGid}`, {}, {}, function(response) {});
                });
              } else {
                callAsanaApi('DELETE', `tasks/${focusedTaskGid}`, {}, {}, function(response) {});
              }
            });
          });
        } else if (focusedTaskParentGid) {
          callAsanaApi('POST', `tasks/${newTaskGid}/setParent`, {insert_after: focusedTaskGid, parent: focusedTaskParentGid}, {}, function(response) {
              callAsanaApi('DELETE', `tasks/${focusedTaskGid}`, {}, {}, function(response) {});
          });
        }
      });
    }
  });
};

const createBackFromInboxButton = function() {
  const inboxNavigationBar = document.querySelector('.InboxNavigationBar');
  if (inboxNavigationBar && !document.querySelector('.InboxNavigationBar-backLink')) {
    const backLinkFromInbox = document.createElement('LI');
    backLinkFromInbox.setAttribute('class', 'Tab TabNavigationBar-tab InboxNavigationBar-backLink');
    backLinkFromInbox.innerHTML = '<a class="InboxButton-backLink disabled">&times;</a>';
    inboxNavigationBar.firstElementChild.appendChild(backLinkFromInbox);
    if (document.anPreviousUrl) {
      backLinkFromInbox.innerHTML = `<a class="InboxButton-backLink" href="${document.anPreviousUrl}" title="${locStrings['buttonTitle-backLink']} (Tab+J)">&times;</a>`;
      backLinkFromInbox.addEventListener('click', function(event) {
        openPageWithoutRefresh(document.anPreviousUrl);
        event.preventDefault();
        document.anPreviousUrl = undefined;
      });
    }
  }
};

const createSetParentDropdownContainer = function(input, taskGidList, workspaceGid) {
  const singleTaskTitleInput = document.querySelector('.SingleTaskTitleInput-taskName');
  const taskName = (singleTaskTitleInput) ? singleTaskTitleInput.children[1].textContent : '';
  const queryValue = input.value || taskName;
  if (!document.querySelector('#SetParentDropdownContainer')) {
    const setParentDropdownContainer = document.createElement('DIV');
    setParentDropdownContainer.innerHTML = '<div class="LayerPositioner LayerPositioner--alignLeft LayerPositioner--below"><div class="LayerPositioner-layer"><div class="Dropdown" role="listbox"><div class="Scrollable Scrollable--vertical TypeaheadScrollable SetParentTypeaheadDropdownContents"><div class="TypeaheadScrollable-contents"></div></div></div></div></div>';
    setParentDropdownContainer.setAttribute('id', 'SetParentDropdownContainer');
    input.parentNode.appendChild(setParentDropdownContainer);
  }
  let potentialTask;
  const potentialTaskGidMatch = /^\d{15,}$/.exec(input.value.trim()); // gid spec might change
  const potentialTaskGid = (potentialTaskGidMatch) ? potentialTaskGidMatch[0] : findTaskGid(input.value);
  if (potentialTaskGid) {
    callAsanaApi('GET', `tasks/${potentialTaskGid}`, {}, {}, function(response) {
      potentialTask = response.data;
      populateFromTypeahead(taskGidList, workspaceGid, queryValue, potentialTask);
    });
  } else {
    populateFromTypeahead(taskGidList, workspaceGid, queryValue, potentialTask);
  }
};

const createSiblingSubtasksDropdown = function(subtaskList, taskGid, containerGid) {
  const completeIcon = '<svg class="SiblingSubtasksIcon CheckCircleFullIcon SiblingSubtasksItem-completedIcon" focusable="false" viewBox="0 0 32 32"><path d="M16,0C7.2,0,0,7.2,0,16s7.2,16,16,16s16-7.2,16-16S24.8,0,16,0z M23.3,13.3L14,22.6c-0.3,0.3-0.7,0.4-1.1,0.4s-0.8-0.1-1.1-0.4L8,18.8c-0.6-0.6-0.6-1.5,0-2.1s1.5-0.6,2.1,0l2.8,2.8l8.3-8.3c0.6-0.6,1.5-0.6,2.1,0S23.9,12.7,23.3,13.3z"></path></svg>';
  const incompleteIcon = '<svg class="SiblingSubtasksIcon CheckCircleIcon SiblingSubtasksItem-incompletedIcon" focusable="false" viewBox="0 0 32 32"><path d="M16,32C7.2,32,0,24.8,0,16S7.2,0,16,0s16,7.2,16,16S24.8,32,16,32z M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z"></path><path d="M12.9,22.6c-0.3,0-0.5-0.1-0.7-0.3l-3.9-3.9C8,18,8,17.4,8.3,17s1-0.4,1.4,0l3.1,3.1l8.6-8.6c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-9.4,9.4C13.4,22.5,13.2,22.6,12.9,22.6z"></path></svg>';
  if (document.querySelector('#SiblingSubtasksDropdownContainer')) return;
  const siblingDropdown = document.createElement('DIV');
  siblingDropdown.setAttribute('id', 'SiblingSubtasksDropdownContainer');
  siblingDropdown.innerHTML = '<div class="LayerPositioner LayerPositioner--alignRight LayerPositioner--below SiblingSubtasksDropdownLayer"><div class="LayerPositioner-layer"><div class="Dropdown Scrollable Scrollable--vertical SiblingSubtasksDropdownContainer"><div class="menu">' +
    subtaskList.map(
      subtask => `<a class="StaticMenuItemBase-button StaticMenuItemBase--medium MenuItemBase Menu-menuItem" ${(subtask.is_rendered_as_separator) ? '' : `href="https://app.asana.com/0/${containerGid}/${subtask.gid}`}"><span class="MenuItem-label">` +
      `${(subtask.is_rendered_as_separator) ? '<u>' + subtask.name + '</u>' : ((subtask.gid === taskGid) ? '<strong id="currentSubtaskMarker">&gt;</strong>&nbsp;' : (subtask.completed ? completeIcon : incompleteIcon)) + '&nbsp;' + subtask.name}</span></a>`
    ).join('') +
    '</div></div></div>';
  Array.from(siblingDropdown.firstElementChild.firstElementChild.firstElementChild.firstElementChild.children).forEach(function(subtask) {
    subtask.addEventListener('mouseover', function() {this.classList.add('is-highlighted');});
    subtask.addEventListener('mouseout', function() {this.classList.remove('is-highlighted');});
  });
  document.body.appendChild(siblingDropdown);
  document.querySelector('#currentSubtaskMarker').scrollIntoView(false);
  siblingDropdown.addEventListener('click', function(event) {
    if (event.target.href) {
      openPageWithoutRefresh(event.target.href);
    } else {
      openPageWithoutRefresh(event.target.parentNode.href);
    }
    deleteSiblingSubtasksDropdown();
  });
  document.addEventListener('click', listenToClickToCloseSiblingSubtasksDropdown);
};

const deleteInContextSearchDropdownItem = function(event) {
  const inContextSearchDropdown = document.querySelector('#InContextSearch');
  if (inContextSearchDropdown && event.target.value.trim()) inContextSearchDropdown.remove();
};

const deleteSetParentTypeaheadDropdown = function() {
  const setParentDropdownContainer = document.querySelector('#SetParentDropdownContainer');
  if (setParentDropdownContainer) setParentDropdownContainer.remove();
};

const deleteSiblingButtons = function() {
  const SiblingButtons = document.querySelector('#SiblingButtons');
  if (SiblingButtons) SiblingButtons.remove();
};

const deleteSiblingSubtasksDropdown = function() {
  const siblingDropdown = document.querySelector('#SiblingSubtasksDropdownContainer');
  if (siblingDropdown) siblingDropdown.remove();
  document.removeEventListener('click', listenToClickToCloseSiblingSubtasksDropdown);
};

const deleteUserReplaceTextRow = function(button) {
  const trToDelete = button.parentNode.parentNode;
  trToDelete.remove();
};

const displayLinksToSiblingSubtasks = function(idOfArrowToClick) {
  const taskAncestryTaskLinks = document.querySelectorAll('.TaskAncestry-ancestorLink');
  if (!taskAncestryTaskLinks.length) return;
  const parentGid = findTaskGid(taskAncestryTaskLinks[taskAncestryTaskLinks.length - 1].href);
  const taskGid = findTaskGid(window.location.href);
  const containerGid = findProjectGid(window.location.href) || '0';

  callAsanaApi('GET', `tasks/${parentGid}/subtasks`, {opt_fields: 'completed,is_rendered_as_separator,name'}, {}, function(response) {
    const subtaskList = response.data;
    const subtaskListFiltered = subtaskList.filter(function(subtask) {
      return !subtask.is_rendered_as_separator || subtask.gid === taskGid;
    });
    const indexCurrent = subtaskListFiltered.map(subtask => subtask.gid).indexOf(taskGid);
    const indexPrevious = (indexCurrent > 0) ? indexCurrent - 1 : null;
    const indexNext = (indexCurrent < subtaskListFiltered.length - 1) ? indexCurrent + 1 : null;
    deleteSiblingButtons();
    const siblingButtons = document.createElement('SPAN');
    siblingButtons.setAttribute('id', 'SiblingButtons');
    const singleTaskPaneTitleRow = document.querySelector('.SingleTaskPaneSpreadsheet-titleRow') || document.querySelector('.SingleTaskPane-titleRow');
    if (singleTaskPaneTitleRow) singleTaskPaneTitleRow.appendChild(siblingButtons);

    if (indexPrevious || indexPrevious === 0) {
      const divArrowPreviousSubtask = document.createElement('DIV');
      divArrowPreviousSubtask.setAttribute('class', 'SmallTextButtons');
      divArrowPreviousSubtask.innerHTML = `<a class="NoBorderBottom TaskAncestry-ancestorLink" href="https://app.asana.com/0/${containerGid}/${subtaskListFiltered[indexPrevious].gid}" id="ArrowPreviousSubtask" title="${locStrings['arrowTitle-previousSubtask']} (${[platStrings['shift'], 'Tab', '↑'].join(platStrings['sep'])})\n${escapeHtml(subtaskListFiltered[indexPrevious].name)}">∧</a>`;
      siblingButtons.appendChild(divArrowPreviousSubtask);
      const arrowPreviousSubtask = document.querySelector('#ArrowPreviousSubtask');
      if (arrowPreviousSubtask) arrowPreviousSubtask.addEventListener('click', function(event) {
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
    if (arrowMiddleSubtask) arrowMiddleSubtask.addEventListener('click', function(event) {
      createSiblingSubtasksDropdown(subtaskList, taskGid, containerGid);
    });
    if (indexNext) {
      const divArrowNextSubtask = document.createElement('DIV');
      divArrowNextSubtask.setAttribute('class', 'SmallTextButtons');
      divArrowNextSubtask.innerHTML = `<a class="NoBorderBottom TaskAncestry-ancestorLink" href="https://app.asana.com/0/${containerGid}/${subtaskListFiltered[indexNext].gid}" id="ArrowNextSubtask" title="${locStrings['arrowTitle-nextSubtask']} (${[platStrings['shift'], 'Tab', '↓'].join(platStrings['sep'])})\n${escapeHtml(subtaskListFiltered[indexNext].name)}">∨</a>`;
      siblingButtons.appendChild(divArrowNextSubtask);
      const arrowNextSubtask = document.querySelector('#ArrowNextSubtask');
      if (arrowNextSubtask) arrowNextSubtask.addEventListener('click', function(event) {
        openPageWithoutRefresh(`https://app.asana.com/0/${containerGid}/${subtaskListFiltered[indexNext].gid}`);
        event.preventDefault();
      });
    } else {
      siblingButtons.appendChild(document.createElement('BR'));
    }
    if (idOfArrowToClick) {
        const arrowToClick = document.querySelector(idOfArrowToClick);
        if (arrowToClick) arrowToClick.click();
    }
  });
};

const displayReplaceDescriptionDialog = function() {
  const replaceDescriptionDialog = document.createElement('DIV');
  replaceDescriptionDialog.setAttribute('id', 'ReplaceDescriptionDialogView');
  replaceDescriptionDialog.setAttribute('class', 'DecorativeModalLayer');
  replaceDescriptionDialog.setAttribute('tabindex', '-1');
  replaceDescriptionDialog.innerHTML = returnReplaceDescriptionInnerHTML();
  document.body.appendChild(replaceDescriptionDialog);
  document.querySelector('#CloseReplaceDescriptionDialogButton').addEventListener('click', closeReplaceDescriptionDialog);
  document.querySelectorAll('.delete-row-link').forEach(link => link.addEventListener('click', function(event) {deleteUserReplaceTextRow(event.target);}));
  document.querySelector('#AddRowToUserReplaceTextListLink').addEventListener('click', addRowToUserReplaceTextList);
  document.querySelector('#SaveUserReplaceTextListLink').addEventListener('click', saveUserReplaceTextList);
  addRowToUserReplaceTextList();
  const replaceDescriptionDialogPresetButton = document.querySelector('#ReplaceDescriptionDialogPresetButton');
  replaceDescriptionDialogPresetButton.addEventListener('click', replaceDescriptionPreset);
  const replaceDescriptionDialogUserButton = document.querySelector('#ReplaceDescriptionDialogUserButton');
  replaceDescriptionDialogUserButton.addEventListener('click', replaceDescriptionUserText);
  replaceDescriptionDialogPresetButton.focus();

  replaceDescriptionDialog.addEventListener('keydown', function(event) {
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

const displaySetParentDrawer = function() {
  if (document.querySelector('.SetParentDrawer')) return;
  const [taskPaneTypeString, taskPaneBody] = getTaskPaneTypeAndElement('-body', true) || getTaskPaneTypeAndElement('Spreadsheet-body');
  if (!taskPaneBody) return;
  const setParentDrawer = document.createElement('DIV');
  setParentDrawer.setAttribute('class', 'Drawer SetParentDrawer');
  setParentDrawer.innerHTML = '<a class="CloseButton Drawer-closeButton" id="SetParentDrawerCloseButton"><svg class="Icon XIcon CloseButton-xIcon" focusable="false" viewBox="0 0 32 32"><path d="M18.1,16l8.9-8.9c0.6-0.6,0.6-1.5,0-2.1c-0.6-0.6-1.5-0.6-2.1,0L16,13.9L7.1,4.9c-0.6-0.6-1.5-0.6-2.1,0c-0.6,0.6-0.6,1.5,0,2.1l8.9,8.9l-8.9,8.9c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path></svg></a>' +
  `<div class="switch-view SetParentSwitchView"><p>${locStrings['drawerLabel-setParent']}</p><p>${locStrings['drawerSwitch-setParent-var-button'].replace('{button}', '&nbsp;<span class="SwitchPresentation SwitchPresentation--small"><input id="InputSetParentSwitch" class="Switch-checkbox" type="checkbox"><label class="Switch-label"></label></span>&nbsp;')}</p></div><input autocomplete="off" class="textInput textInput--medium SetParentDrawer-typeaheadInput" placeholder="${locStrings['drawerPlaceholder-setParent']}" type="text" role="combobox" value=""><noscript></noscript></div>`;

  taskPaneBody.insertBefore(setParentDrawer, taskPaneBody.firstElementChild);
  // const singleTaskPaneTopmostElement = document.querySelector('.SingleTaskPaneBanners') || document.querySelector(`.${taskPaneTypeString}TaskPaneToolbar`);
  // taskPaneBody.insertBefore(setParentDrawer, singleTaskPaneTopmostElement.nextSibling);

  document.querySelector('#SetParentDrawerCloseButton').addEventListener('click', function() {
    closeSetParentDrawer();
  });
  document.querySelector('#InputSetParentSwitch').parentNode.addEventListener('click', function() {
    toggleSetParentSwitch(this.firstElementChild);
  });

  const setParentDrawerTypeaheadInput = document.querySelector('.SetParentDrawer-typeaheadInput');
  setParentDrawerTypeaheadInput.focus();

  const taskGid = findTaskGid(window.location.href);
  callAsanaApi('GET', `tasks/${taskGid}`, {}, {}, function(response) {
    let taskGidList;
    const workspaceGid = response.data.workspace.gid;
    if (taskPaneTypeString === 'Single') {
      taskGidList = [taskGid];
    } else {
      const taskRowHighlightedOrFocused = Array.from(document.querySelectorAll('.TaskRow--highlighted, .TaskRow--focused'));
      const spreadsheetRowsHighlighted = Array.from(document.querySelectorAll('.SpreadsheetRow--highlighted'));
      taskGidList = (taskRowHighlightedOrFocused.length ? taskRowHighlightedOrFocused : spreadsheetRowsHighlighted).map(divTaskRow => /_(\d+)$/.exec((taskRowHighlightedOrFocused.length ? divTaskRow.children[1].children[1] : divTaskRow.firstElementChild.firstElementChild.children[3]).children[1].id)[1]);
    }
    ['click', 'focus', 'input'].forEach(function(e) {
      setParentDrawerTypeaheadInput.addEventListener(e, function(event) {
        const that = this;
        createSetParentDropdownContainer(that, taskGidList, workspaceGid);
      });
    });
    createSetParentDropdownContainer(setParentDrawerTypeaheadInput, taskGidList, workspaceGid);
    saveOriginalParents(taskGidList);
  });
  document.addEventListener('click', listenToClickToCloseSetParentDropdown);
};

const displaySuccessToast = function(task, messageVarTask, functionToRunCallbackAtLast) {
  const toastManager = document.querySelector('.ToastManager');
  if (!toastManager) return;
  const toastDiv = document.createElement('DIV');
  toastDiv.innerHTML = '<div class="ToastManager-toast"><div class="ToastContainer SuccessToast"><div class="ToastNotificationContent"><div class="ToastNotificationContent-firstRow"><div class="ToastNotificationContent-text"><span>' +
  messageVarTask.replace('{task}', `<a class="NavigationLink ToastNotification-link" href="https://app.asana.com/0/0/${task.gid}">${(task.completed) ? '✓ ' : ''}${escapeHtml(task.name)}</a> `) +
    '</span></div><a class="CloseButton"><svg class="Icon XIcon CloseButton-xIcon" focusable="false" viewBox="0 0 32 32"><path d="M18.1,16l8.9-8.9c0.6-0.6,0.6-1.5,0-2.1c-0.6-0.6-1.5-0.6-2.1,0L16,13.9L7.1,4.9c-0.6-0.6-1.5-0.6-2.1,0c-0.6,0.6-0.6,1.5,0,2.1l8.9,8.9l-8.9,8.9c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path></svg></a></div>' +
    `<div class="Button Button--small Button--secondary" tabindex="0" role="button" aria-disabled="false">${locStrings['toastButtton-undo']}</div></div></div></div>`;
  const toastNotificationContent = toastDiv.firstElementChild.firstElementChild.firstElementChild;
  const toastALink = toastNotificationContent.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
  toastALink.addEventListener('click', function(event) {
    openPageWithoutRefresh(`https://app.asana.com/0/0/${task.gid}`);
    event.preventDefault();
  });
  const closeButton = toastNotificationContent.firstElementChild.children[1];
  closeButton.addEventListener('click', function() {
    toastDiv.remove();
  });
  const undoButton = toastNotificationContent.children[1];
  undoButton.addEventListener('click', function() {
    undoButton.outerText = locStrings['toastButtton-undoing'];
    functionToRunCallbackAtLast(function() {
      toastDiv.remove();
    });
  });
  toastManager.appendChild(toastDiv);
  setTimeout(function() {
    toastDiv.remove();
  }, 15000);
};

const enableFeaturesAfterDelayOnLoad = function(delay) {
  chrome.storage.sync.get({
    anOptionsInbox: true,
    anOptionsSearch: true
  }, function(items) {
    setTimeout(function() {
      if (items.anOptionsInbox) listenToClickOnInboxSavePrevious();
      if (items.anOptionsSearch) listenToSearchBarExpansion();
      enableFeaturesAfterDelayOnPageChange(0);
    }, delay);
  });
};

const enableFeaturesAfterDelayOnPageChange = function(delay) {
  chrome.storage.sync.get({
    anOptionsAttachment: true,
    anOptionsDescription: true,
    anOptionsParent: true,
    anOptionsSubtasks: true
  }, function(items) {
    setTimeout(function() {
      if (items.anOptionsAttachment) listenToClickOnAddAttachmentsButton();
      if (items.anOptionsDescription) addReplaceDescriptionToExtraActions();
      if (items.anOptionsParent) addSetParentToExtraActions();
      if (items.anOptionsSubtasks) displayLinksToSiblingSubtasks();
    }, delay);
  });
};

const escapeHtml = function(text) {
  const map = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&apos;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};

const findProjectGid = function(url) { // gid spec might change
  const projectGidRegexPattern = /https:\/\/app\.asana\.com\/0\/(\d+)\//;
  const findProjectGidMatch = projectGidRegexPattern.exec(url);
  if (findProjectGidMatch) return findProjectGidMatch[1];
};

const findTaskGid = function(url) { // gid spec might change
  const taskGidRegexPatterns = [
    /https:\/\/app\.asana\.com\/0\/\d+\/(\d+)/,
    /https:\/\/app\.asana\.com\/0\/inbox\/\d+\/(\d+)\/\d+/,
    /https:\/\/app\.asana\.com\/0\/search\/\d+\/(\d+)/
  ];
  for (let i = 0; i < taskGidRegexPatterns.length; i++) {
    const match = taskGidRegexPatterns[i].exec(url);
    if (match) return match[1];
  }
};

const getLocaleAndSetLocalizedStrings = function() {
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

const getPlatformAndSetPlatStrings = function() {
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

const getTaskPaneTypeAndElement = function(subsequentClassName, returnBoolean) {
  const singleTaskPaneElement = document.querySelector('.SingleTaskPane' + subsequentClassName);
  if (singleTaskPaneElement) return ['Single', singleTaskPaneElement];
  const multiTaskPaneElement = document.querySelector('.MultiTaskPane' + subsequentClassName);
  if (multiTaskPaneElement) return ['Multi', multiTaskPaneElement];
  return returnBoolean? false: ['', undefined];
};

const getUserReplaceTextList = function() {
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

const listenToClickOnAddAttachmentsButton = function() {
  const addAttachmentsButton = document.querySelector('.AddAttachmentsButton');
  if (!addAttachmentsButton) return;
  addAttachmentsButton.addEventListener('click', function() {
    setTimeout(function() {
      const addAttachmentsMenuItem = document.querySelector('.AddAttachmentsMenuItem');
      if (!addAttachmentsMenuItem) return;
      const listAddAttachmentButtons = addAttachmentsMenuItem.parentNode.children;
      for (let i = 1; i < listAddAttachmentButtons.length; i++) {
        if (listAddAttachmentButtons[i].classList.contains('MenuItemLabel-shortcut')) continue;
        listAddAttachmentButtons[i].classList.add('MenuItemLabel-shortcut');
        listAddAttachmentButtons[i].innerHTML += `<span class="ExtraActionsMenuItemLabel-shortcut"><span class="KeyboardShortcutLabel KeyboardShortcutLabel--normal KeyboardShortcutLabel--light"><span class="KeyboardShortcutLabel-key">Tab</span><span class="KeyboardShortcutLabel-key">${i}</span></span></span>`;
      }
    }, 50);
  });
};

const listenToClickOnInboxSavePrevious = function() {
  const sidebarInboxLink = document.querySelector('.SidebarTopNavLinks-notificationsButton');
  if (sidebarInboxLink) {
    sidebarInboxLink.addEventListener('click', function() {
      document.anPreviousUrl = window.location.href;
      setTimeout(function() {
        createBackFromInboxButton();
      }, 100);
    });
  }
};

const listenToClickToCloseSetParentDropdown = function(event) {
  const setParentDrawer = document.querySelector('.SetParentDrawer');
  if (setParentDrawer) {
    if (!setParentDrawer.contains(event.target)) {
      deleteSetParentTypeaheadDropdown();
    }
  }
};

const listenToClickToCloseSiblingSubtasksDropdown = function(event) {
  const siblingButtons = document.querySelector('#SiblingButtons');
  const siblingDropdown = document.querySelector('#SiblingSubtasksDropdownContainer');
  if (siblingDropdown) {
    if (!siblingButtons || !siblingButtons.contains(event.target) && !siblingDropdown.contains(event.target)) {
        deleteSiblingSubtasksDropdown();
    }
  }
};

const listenToSearchBarExpansion = function() {
  const targetNode = document.querySelector('#topbar_search_input');
  if (!targetNode) return;
  const observerConfig = {attributes: true, childList: false, subtree: false};
  const mutationObserver = new MutationObserver(function(mutationsList, observer) {
    mutationsList.forEach(function(mutation) {
      if (targetNode.getAttribute('value').trim()) return; // Keep dropdown item when the input field only contains spaces
      if ((mutation.attributeName == 'aria-expanded' && targetNode.getAttribute('aria-expanded') == 'true') || mutation.attributeName == 'value') addSearchDropdownShortcut();
    });
  });
  mutationObserver.observe(targetNode, observerConfig);
  targetNode.addEventListener('input', deleteInContextSearchDropdownItem);
};

const loadUserReplaceTextList = function() {
  chrome.storage.sync.get({
    anOptionsPairs: []
  }, function(items) {
    document.loadedUserReplaceTextList = items.anOptionsPairs;
  });
};

const openPageWithoutRefresh = function(newUrl) {
  window.history.pushState({}, '', newUrl);
  window.history.back();
  setTimeout(function() {
    window.history.forward();
  }, 100);
};

const populateFromTypeahead = function(taskGidList, workspaceGid, queryValue, potentialTask) {
  callAsanaApi('GET', `workspaces/${workspaceGid}/typeahead`, {type: 'task',query: queryValue, opt_fields: 'completed,is_rendered_as_separator,name,parent.name,projects.name,subtasks'}, {}, function(response) {
    const typeaheadScrollableContents = document.querySelector('.TypeaheadScrollable-contents');
    while (typeaheadScrollableContents && typeaheadScrollableContents.lastElementChild) {
      typeaheadScrollableContents.lastElementChild.remove();
    }
    if (potentialTask) response.data.unshift(potentialTask);
    for (let i = 0; i < response.data.length; i++) {
      if (taskGidList.includes(response.data[i].gid)) continue;
      if (response.data[i].parent && taskGidList.includes(response.data[i].parent.gid)) continue;
      if (response.data[i].subtasks && response.data[i].subtasks.map(subtask => subtask.gid).filter(subtaskGid => taskGidList.includes(subtaskGid)).length) continue;
      if (response.data[i].is_rendered_as_separator) continue;
      const dropdownItem = document.createElement('DIV');
      dropdownItem.innerHTML = returnTypeAheadInnerHTML(response.data[i]);
      if (typeaheadScrollableContents) typeaheadScrollableContents.appendChild(dropdownItem);
      dropdownItem.addEventListener('mouseover', function() {this.firstElementChild.firstElementChild.classList.add('TypeaheadItemStructure--highlighted');});
      dropdownItem.addEventListener('mouseout', function() {this.firstElementChild.firstElementChild.classList.remove('TypeaheadItemStructure--highlighted');});
      dropdownItem.addEventListener('click', function() {
        const setParentData = {parent: response.data[i].gid};
        if (document.querySelector('#InputSetParentSwitch').hasAttribute('checked')) {
          setParentData.insert_before = null;
        } else {
          setParentData.insert_after = null;
          taskGidList.reverse();
        }
        setNewParentTask(taskGidList, setParentData, response.data[i]);
      });
    }
    if (typeaheadScrollableContents && !typeaheadScrollableContents.children.length) {
      const dropdownItemHintText = document.createElement('DIV');
      dropdownItemHintText.setAttribute('class', 'HintTextTypeaheadItem');
      dropdownItemHintText.innerText = locStrings['typeaheadItem-NoMatch'];
      typeaheadScrollableContents.appendChild(dropdownItemHintText);
    }
  });
};

const replaceDescription = function(replaceTextList, specialBoolean) {
  const taskGid = findTaskGid(window.location.href);
  if (isNaN(taskGid)) return; // gid spec might change
  callAsanaApi('GET', `tasks/${taskGid}`, {opt_fields: 'html_notes'}, {}, function(response) {
    const htmlNotesOriginal = response.data.html_notes;
    let htmlNotes = htmlNotesOriginal.replace(/^<body>/, '').replace(/<\/body>$/, '');
    let counter = 0;
    for (let i = 0; i < replaceTextList.length; i ++) {
      const pair = replaceTextList[i];
      htmlNotes = htmlNotes.replace(pair[0], specialBoolean ? pair[1] : function() { ++counter; return pair[1];});
      }
    callAsanaApi('PUT', `tasks/${taskGid}`, {}, {html_notes: '<body>' + htmlNotes + '</body>'}, function(response) {
      closeTaskPaneExtraActionsMenu();
      closeReplaceDescriptionDialog();
      const messageVarTask = specialBoolean ? locStrings['toastContent-descriptionReplaced-noCount-var-task'] : locStrings['toastContent-descriptionReplaced-var-task'].replace('{counter}', counter);
      displaySuccessToast(response.data, messageVarTask, function(callback) {
        callAsanaApi('PUT', `tasks/${taskGid}`, {}, {html_notes: htmlNotesOriginal}, function(response) {
          callback();
        });
      });
    });
  });
};

const replaceDescriptionPreset = function() {
  const replaceTextListDuplicateLink = [[/(?:&lt;|&quot;|')?(<a href=")(mailto:)?([A-Za-z0-9!#$%&'+,\-./:;=?@_~]+)(">)\3(<\/a>)(\?)?(?:&gt;|&quot;|')? &lt;\2?\1\2\3[\/\s]*\4\3[\/\s]*\5\6&gt;(?:&gt;|&quot;|')?/g, '$1$2$3$4$3$5$6']];
  const replaceTextListCharCode = [[/&amp;#(\d+);/g, function($0, $1) {return String.fromCharCode($1);}]];
  // exclude XML entities: [['&amp;', '&'], ['&gt;', '>'], ['&lt;', '<'], ['&quot;', '"']]
  const replaceTextListEntity = [['&Aacute;', 'Á'], ['&aacute;', 'á'], ['&Acirc;', 'Â'], ['&acirc;', 'â'], ['&acute;', '´'], ['&AElig;', 'Æ'], ['&aelig;', 'æ'], ['&Agrave;', 'À'], ['&agrave;', 'à'], ['&Alpha;', 'Α'], ['&alpha;', 'α'], ['&and;', '∧'], ['&ang;', '∠'], ['&apos;', '\''], ['&Aring;', 'Å'], ['&aring;', 'å'], ['&asymp;', '≈'], ['&Atilde;', 'Ã'], ['&atilde;', 'ã'], ['&Auml;', 'Ä'], ['&auml;', 'ä'], ['&bdquo;', '„'], ['&Beta;', 'Β'], ['&beta;', 'β'], ['&brvbar;', '¦'], ['&bull;', '•'], ['&cap;', '∩'], ['&Ccedil;', 'Ç'], ['&ccedil;', 'ç'], ['&cedil;', '¸'], ['&cent;', '¢'], ['&Chi;', 'Χ'], ['&chi;', 'χ'], ['&circ;', 'ˆ'], ['&clubs;', '♣'], ['&cong;', '≅'], ['&copy;', '©'], ['&crarr;', '↵'], ['&cup;', '∪'], ['&curren;', '¤'], ['&dagger;', '†'], ['&Dagger;', '‡'], ['&dArr;', '⇓'], ['&darr;', '↓'], ['&deg;', '°'], ['&Delta;', 'Δ'], ['&delta;', 'δ'], ['&diams;', '♦'], ['&divide;', '÷'], ['&Eacute;', 'É'], ['&eacute;', 'é'], ['&Ecirc;', 'Ê'], ['&ecirc;', 'ê'], ['&Egrave;', 'È'], ['&egrave;', 'è'], ['&empty;', '∅'], ['&emsp;', ' '], ['&ensp;', ' '], ['&Epsilon;', 'Ε'], ['&epsilon;', 'ε'], ['&equiv;', '≡'], ['&Eta;', 'Η'], ['&eta;', 'η'], ['&ETH;', 'Ð'], ['&eth;', 'ð'], ['&Euml;', 'Ë'], ['&euml;', 'ë'], ['&euro;', '€'], ['&exist;', '∃'], ['&fnof;', 'ƒ'], ['&forall;', '∀'], ['&frac12;', '½'], ['&frac14;', '¼'], ['&frac34;', '¾'], ['&Gamma;', 'Γ'], ['&gamma;', 'γ'], ['&ge;', '≥'], ['&hArr;', '⇔'], ['&harr;', '↔'], ['&hearts;', '♥'], ['&hellip;', '…'], ['&Iacute;', 'Í'], ['&iacute;', 'í'], ['&Icirc;', 'Î'], ['&icirc;', 'î'], ['&iexcl;', '¡'], ['&Igrave;', 'Ì'], ['&igrave;', 'ì'], ['&infin;', '∞'], ['&int;', '∫'], ['&Iota;', 'Ι'], ['&iota;', 'ι'], ['&iquest;', '¿'], ['&isin;', '∈'], ['&Iuml;', 'Ï'], ['&iuml;', 'ï'], ['&Kappa;', 'Κ'], ['&kappa;', 'κ'], ['&Lambda;', 'Λ'], ['&lambda;', 'λ'], ['&laquo;', '«'], ['&lArr;', '⇐'], ['&larr;', '←'], ['&lceil;', '⌈'], ['&ldquo;', '“'], ['&le;', '≤'], ['&lfloor;', '⌊'], ['&lowast;', '∗'], ['&loz;', '◊'], ['&lrm;', '‎'], ['&lsaquo;', '‹'], ['&lsquo;', '‘'], ['&macr;', '¯'], ['&mdash;', '—'], ['&micro;', 'µ'], ['&middot;', '·'], ['&minus;', '−'], ['&Mu;', 'Μ'], ['&mu;', 'μ'], ['&nabla;', '∇'], ['&ndash;', '–'], ['&ne;', '≠'], ['&ni;', '∋'], ['&not;', '¬'], ['&notin;', '∉'], ['&nsub;', '⊄'], ['&Ntilde;', 'Ñ'], ['&ntilde;', 'ñ'], ['&Nu;', 'Ν'], ['&nu;', 'ν'], ['&Oacute;', 'Ó'], ['&oacute;', 'ó'], ['&Ocirc;', 'Ô'], ['&ocirc;', 'ô'], ['&OElig;', 'Œ'], ['&oelig;', 'œ'], ['&Ograve;', 'Ò'], ['&ograve;', 'ò'], ['&oline;', '‾'], ['&Omega;', 'Ω'], ['&omega;', 'ω'], ['&Omicron;', 'Ο'], ['&omicron;', 'ο'], ['&oplus;', '⊕'], ['&or;', '∨'], ['&ordf;', 'ª'], ['&ordm;', 'º'], ['&Oslash;', 'Ø'], ['&oslash;', 'ø'], ['&Otilde;', 'Õ'], ['&otilde;', 'õ'], ['&otimes;', '⊗'], ['&Ouml;', 'Ö'], ['&ouml;', 'ö'], ['&para;', '¶'], ['&part;', '∂'], ['&permil;', '‰'], ['&perp;', '⊥'], ['&Phi;', 'Φ'], ['&phi;', 'φ'], ['&Pi;', 'Π'], ['&pi;', 'π'], ['&piv;', 'ϖ'], ['&plusmn;', '±'], ['&pound;', '£'], ['&prime;', '′'], ['&Prime;', '″'], ['&prod;', '∏'], ['&prop;', '∝'], ['&Psi;', 'Ψ'], ['&psi;', 'ψ'], ['&radic;', '√'], ['&raquo;', '»'], ['&rArr;', '⇒'], ['&rarr;', '→'], ['&rceil;', '⌉'], ['&rdquo;', '”'], ['&reg;', '®'], ['&rfloor;', '⌋'], ['&Rho;', 'Ρ'], ['&rho;', 'ρ'], ['&rlm;', '‏'], ['&rsaquo;', '›'], ['&rsquo;', '’'], ['&sbquo;', '‚'], ['&Scaron;', 'Š'], ['&scaron;', 'š'], ['&sdot;', '⋅'], ['&sect;', '§'], ['&Sigma;', 'Σ'], ['&sigma;', 'σ'], ['&sigmaf;', 'ς'], ['&sim;', '∼'], ['&spades;', '♠'], ['&sub;', '⊂'], ['&sube;', '⊆'], ['&sum;', '∑'], ['&sup1;', '¹'], ['&sup2;', '²'], ['&sup3;', '³'], ['&sup;', '⊃'], ['&supe;', '⊇'], ['&szlig;', 'ß'], ['&Tau;', 'Τ'], ['&tau;', 'τ'], ['&there4;', '∴'], ['&Theta;', 'Θ'], ['&theta;', 'θ'], ['&thetasym;', 'ϑ'], ['&thinsp;', ' '], ['&THORN;', 'Þ'], ['&thorn;', 'þ'], ['&tilde;', '˜'], ['&times;', '×'], ['&trade;', '™'], ['&Uacute;', 'Ú'], ['&uacute;', 'ú'], ['&uArr;', '⇑'], ['&uarr;', '↑'], ['&Ucirc;', 'Û'], ['&ucirc;', 'û'], ['&Ugrave;', 'Ù'], ['&ugrave;', 'ù'], ['&uml;', '¨'], ['&upsih;', 'ϒ'], ['&Upsilon;', 'Υ'], ['&upsilon;', 'υ'], ['&Uuml;', 'Ü'], ['&uuml;', 'ü'], ['&Xi;', 'Ξ'], ['&xi;', 'ξ'], ['&Yacute;', 'Ý'], ['&yacute;', 'ý'], ['&yen;', '¥'], ['&Yuml;', 'Ÿ'], ['&yuml;', 'ÿ'], ['&Zeta;', 'Ζ'], ['&zeta;', 'ζ'], ['&zwj;', '‍'], ['&zwnj;', '‌']].map(a => [new RegExp(a[0].replace('&', '&amp;'), 'g'), a[1]]);
  const replaceTextList = [...replaceTextListDuplicateLink, ...replaceTextListCharCode, ...replaceTextListEntity];
  replaceDescription(replaceTextList, true);
};

const replaceDescriptionUserText = function() {
  const userReplaceTextList = getUserReplaceTextList();
  for (let i = 0; i < userReplaceTextList.length; i ++) {
    try {
      userReplaceTextList[i][0] = new RegExp(escapeHtml(userReplaceTextList[i][0]).replace('(?&lt;', '(?<'), 'gm');
    } catch (error) {
      const userTextToReplaceDialogTr = document.querySelector('#UserTextToReplaceDialogTable').firstElementChild.children;
      let counter = 0;
      for (let row = 1; row < userTextToReplaceDialogTr.length; row++) {
        const userTextToReplaceInput = userTextToReplaceDialogTr[row].firstElementChild.firstElementChild;
        if (userTextToReplaceInput.value) {
          if (i == counter) {
            userTextToReplaceInput.classList.add('IsInvalid');
            setTimeout(function() {
              userTextToReplaceInput.classList.remove('IsInvalid');
            }, 2000);
            throw(error);
          }
          counter += 1;
        }
      }
    }
  }
  if (userReplaceTextList.length) {
    replaceDescription(userReplaceTextList);
  } else {
    const replaceDescriptionDialogUserButton = document.querySelector('#ReplaceDescriptionDialogUserButton');
    replaceDescriptionDialogUserButton.classList.add('is-disabled');
    setTimeout(function() {
      replaceDescriptionDialogUserButton.classList.remove('is-disabled');
    }, 2000);
  }
};

const returnReplaceDescriptionInnerHTML = function() {
  return `<div class="ModalBuffer">
  <div class="ModalBuffer-topBuffer"></div>
  <div class="ModalBuffer-content">
    <div class="ModalPaneWithBuffer-pane">
      <div id="ReplaceDescriptionDialog" class="DeprecatedDialog FloatCenterDialog" style="position: fixed; top: 50%; transform: translateX(-50%) translateY(-50%);"> <!-- inline CSS in case main.css is not loaded -->
        <header class="DeprecatedDialog-header">
          <div class="DeprecatedDialog-headerTitle"><div>${locStrings['menuButton-replaceDescription']}</div></div>
          <div role="button" tabindex="0" class="CloseButton Dialog-closeButton" id="CloseReplaceDescriptionDialogButton"><svg class="Icon--small Icon XIcon CloseButton-xIcon" focusable="false" viewBox="0 0 32 32"><path d="M18.1,16L27,7.1c0.6-0.6,0.6-1.5,0-2.1s-1.5-0.6-2.1,0L16,13.9l-8.9-9C6.5,4.3,5.6,4.3,5,4.9S4.4,6.4,5,7l8.9,8.9L5,24.8c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path></svg></div>
        </header>
        <div class="content">
          <div class="Scrollable Scrollable--vertical ReplaceDescriptionStructure-formContents">
            <div class="FormRowStructure-label--labelPlacementTop">
            <table class="ReplaceDescriptionTable">
              <tr class="name-row"><td>${locStrings['dialogLabel-replaceWith-var-text'].replace('{text}', '</td><td>')}</td></tr>
              <tr class="name-row">
                <td class="field-value"><input autocomplete="off" class="generic-input showing ReplaceDescriptionInput" type="text" value="${locStrings['dialogPlaceholder-HTMLEntities']} (${locStrings['snippet-example']}&amp;hearts;)" disabled></td>
                <td class="field-value"><input autocomplete="off" class="generic-input showing ReplaceDescriptionInput" type="text" value="${locStrings['dialogPlaceholder-HTMLSymbols']} (${locStrings['snippet-example']}♥)" disabled></td>
              </tr>
              <tr class="name-row">
                <td class="field-value"><input autocomplete="off" class="generic-input showing ReplaceDescriptionInput" type="text" value="${locStrings['dialogPlaceholder-duplicateLinks']} (${locStrings['snippet-example']}https://app.asana.com/ <https://app.asana.com/>)" disabled></td>
                <td class="field-value"><input autocomplete="off" class="generic-input showing ReplaceDescriptionInput" type="text" value="${locStrings['dialogPlaceholder-singleString']} (${locStrings['snippet-example']}https://app.asana.com/)" disabled></td>
              </tr>
            </table>
            <div class="Button Button--primary Button--medium DialogFloatButton DialogFloatRight" role="button" id="ReplaceDescriptionDialogPresetButton" tabindex="0">${locStrings['dialogButton-usePreset']}</div>
          </div></div>
          <div class="DialogDivider"></div>
          <div class="Scrollable Scrollable--vertical ReplaceDescriptionStructure-formContents ReplaceUserTextSection">
            <div class="FormRowStructure-label--labelPlacementTop"><div>
            <div class="ReplaceUserTextSectionDescription">${locStrings['dialogMessage-userStrings']}<br>${locStrings['dialogMessage-regularExpression']}${locStrings['snippet-spacing']}${locStrings['dialogMessage-visitReference-var-link'].replace('{link}', '<a href="https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions" rel="noopener noreferrer" tabindex="-1" target="_blank">MDN</a>')}</div>
            <table class="ReplaceDescriptionTable" id="UserTextToReplaceDialogTable">
              <tr class="name-row"><td>${locStrings['dialogLabel-replaceWith-var-text'].replace('{text}', '</td><td>')}</td><td></td></tr>${document.loadedUserReplaceTextList.map(a => `<tr class="name-row">
              <td class="field-value"><input autocomplete="off" class="generic-input showing ReplaceDescriptionInput" type="text" tabindex="0" value="` + escapeHtml(a[0]) + `"></td>
              <td class="field-value"><input autocomplete="off" class="generic-input showing ReplaceDescriptionInput" type="text" tabindex="0" value="` + escapeHtml(a[1]) + `"></td>
              <td><a class="delete-row-link">&nbsp;×</a></td>
            </tr>`).join('')}
            </table>
            <div>
              <a id="AddRowToUserReplaceTextListLink">+ ${locStrings['dialogLink-addRow']}</a>
              <a class="DialogFloatRight" id="SaveUserReplaceTextListLink">${locStrings['snippet-save']}</a>
            </div>
            <div class="footer-top"></div>
            <div class="Button Button--primary Button--medium DialogFloatButton DialogFloatRight" role="button" tabindex="0" id="ReplaceDescriptionDialogUserButton">${locStrings['dialogButton-replaceText']}</div>
            </div></div>
          </div>
        </div>
      </div>
    </div>
  </div></div>`;
};

const returnTypeAheadInnerHTML = function(task) {
  const parentName = (task.parent) ? task.parent.name : '';
  const projectNameList = (task.projects) ? task.projects.map(a => a.name).join(', ') : '';
  return `<div role="option" data-task-gid="${task.gid}" title="` +
  escapeHtml(task.name) + `${(parentName) ? '&#13;‹ ' + escapeHtml(parentName) : ''}` + `${(projectNameList) ? '&#13;(' + escapeHtml(projectNameList) + ')' : ''}` +
  '"><div class="TypeaheadItemStructure TypeaheadItemStructure--enabled"><div class="TypeaheadItemStructure-icon">' +
  `${(task.completed) ? '<svg class="Icon CheckCircleFullIcon TaskTypeaheadItem-completedIcon" focusable="false" viewBox="0 0 32 32"><path d="M16,0C7.2,0,0,7.2,0,16s7.2,16,16,16s16-7.2,16-16S24.8,0,16,0z M23.3,13.3L14,22.6c-0.3,0.3-0.7,0.4-1.1,0.4s-0.8-0.1-1.1-0.4L8,18.8c-0.6-0.6-0.6-1.5,0-2.1s1.5-0.6,2.1,0l2.8,2.8l8.3-8.3c0.6-0.6,1.5-0.6,2.1,0S23.9,12.7,23.3,13.3z"></path></svg>' : '<svg class="Icon CheckCircleIcon TaskTypeaheadItem-incompletedIcon" focusable="false" viewBox="0 0 32 32"><path d="M16,32C7.2,32,0,24.8,0,16S7.2,0,16,0s16,7.2,16,16S24.8,32,16,32z M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z"></path><path d="M12.9,22.6c-0.3,0-0.5-0.1-0.7-0.3l-3.9-3.9C8,18,8,17.4,8.3,17s1-0.4,1.4,0l3.1,3.1l8.6-8.6c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-9.4,9.4C13.4,22.5,13.2,22.6,12.9,22.6z"></path></svg>'}` +
  `</div><div class="TypeaheadItemStructure-label"><div class="TypeaheadItemStructure-title"><span>${escapeHtml(task.name)}</span>` +
  `${(parentName) ? '<span class="TaskTypeaheadItem-parentTask">' + escapeHtml(parentName) + '</span>' : ''}`+
  '</div>' +
  `${(projectNameList) ? '<div class="TypeaheadItemStructure-subtitle">' + escapeHtml(projectNameList) + '</div>' : ''}`+
  '</div></div></div>';
};

const saveOriginalParents = function(taskGidList) {
  document.anOriginalParents = {};
  const taskAncestryTaskLinks = document.querySelectorAll('.NavigationLink.TaskAncestry-ancestorLink');
  const taskGid = findTaskGid(window.location.href);
  if (taskGidList.length >= 2) {
    for (let i = 0; i < taskGidList.length; i++) {
      callAsanaApi('GET', `tasks/${taskGidList[i]}`, {}, {opt_fields: 'parent'}, function(response) {
        if (!response.data.parent) {
          document.anOriginalParents[i] = [null, null];
        } else {
          const originalParentGid = response.data.parent.gid;
          callAsanaApi('GET', `tasks/${originalParentGid}/subtasks`, {}, {}, function(response) {
            const subtaskGidList = response.data.map(subtask => subtask.gid);
            const indexCurrent = subtaskGidList.indexOf(taskGidList[i]);
            const originalPreviousSiblingGid = (indexCurrent > 0) ? subtaskGidList[indexCurrent - 1] : null;
            document.anOriginalParents[i] = [originalParentGid, originalPreviousSiblingGid];
          });
        }
      });
    }
  } else if (taskAncestryTaskLinks.length) {
    const originalParentGid = findTaskGid(taskAncestryTaskLinks[taskAncestryTaskLinks.length - 1].href);
    callAsanaApi('GET', `tasks/${originalParentGid}/subtasks`, {}, {}, function(response) {
      const subtaskGidList = response.data.map(subtask => subtask.gid);
      const indexCurrent = subtaskGidList.indexOf(taskGid);
      const originalPreviousSiblingGid = (indexCurrent > 0) ? subtaskGidList[indexCurrent - 1] : null;
      document.anOriginalParents[0] = [originalParentGid, originalPreviousSiblingGid];
    });
  } else {
    document.anOriginalParents[0] = [null, null];
  }
};

const saveUserReplaceTextList = function() {
  const userReplaceTextList = getUserReplaceTextList();
  chrome.storage.sync.set({
    anOptionsPairs: userReplaceTextList
  }, function() {
    document.loadedUserReplaceTextList = userReplaceTextList;
    const saveTextLink = document.querySelector('#SaveUserReplaceTextListLink');
    const savedText = '✓ ';
    saveTextLink.textContent = savedText + saveTextLink.textContent;
    setTimeout(function() {
      saveTextLink.textContent = saveTextLink.textContent.replace(savedText, '');
    }, 2000);
  });
};

const setNewParentTask = function(taskGidList, setParentData, parentTask) {
  const originalParentsList = Object.values(document.anOriginalParents);

  let counter = 0;
  const recursiveSetNewParent = function(path, options, data) {
    callAsanaApi('POST', path, options, data, function(response) {
      counter += 1;
      if (counter === taskGidList.length) {
        displaySuccessToast(parentTask, locStrings['toastContent-setParent-var-task'], function(callback) {
          if (setParentData.hasOwnProperty('insert_after')) taskGidList.reverse();
          let counterUndo = 0;
          const recursiveUndoParent = function() {
            callAsanaApi('POST', `tasks/${taskGidList[counterUndo]}/setParent`, {}, {parent: originalParentsList[counterUndo][0], insert_after: originalParentsList[counterUndo][1]}, function(response) {
              counterUndo += 1;
              if (counterUndo === taskGidList.length) {
                callback();
                enableFeaturesAfterDelayOnPageChange(100);
              } else {
                recursiveUndoParent();
              }
            });
          };
          recursiveUndoParent();
        });
        enableFeaturesAfterDelayOnPageChange(100);
      } else {
        path = `tasks/${taskGidList[counter]}/setParent`;
        recursiveSetNewParent(path, options, data);
      }
    });
  };
  recursiveSetNewParent(`tasks/${taskGidList[counter]}/setParent`, {}, setParentData);
  closeSetParentDrawer();
};

const toggleSetParentSwitch = function(input) {
  const span = input.parentNode;
  if (span.classList.contains('SwitchPresentation--checked')) {
    input.removeAttribute('checked');
    span.classList.remove('SwitchPresentation--checked');
  } else {
    input.setAttribute('checked', true);
    span.classList.add('SwitchPresentation--checked');
  }
};

document.tabKeyIsDown = false;
document.tabKeyIsDownOnModal = false;

document.addEventListener('keydown', function(event) {
  switch (event.key){
    case 'Tab':
      document.tabKeyIsDown = true;
      break;
    case '/':
      if (event.metaKey || event.ctrlKey) {
        chrome.storage.sync.get({anOptionsShortcuts: true}, function(items) {
          if (items.anOptionsShortcuts) addToKeyboardShortcutsList();
        });
      }
      break;
    case ':':
      if (!document.tabKeyIsDown) break;
      chrome.storage.sync.get({anOptionsSection: true}, function(items) {
        if (items.anOptionsSection) convertTaskAndSection();
      });
      break;
    case '*':
      if (document.tabKeyIsDown && event.code == 'Quote') {
        chrome.storage.sync.get({anOptionsSection: true}, function(items) {
          if (items.anOptionsSection) convertTaskAndSection();
        });
      }
      break;
    case '.': {
      if (!document.tabKeyIsDown) break;
      chrome.storage.sync.get({anOptionsAttachment: true}, function(items) {
        if (items.anOptionsAttachment) {
          const singleTaskPaneExtraActionsButton = document.querySelector('.SingleTaskPaneExtraActionsButton');
          if (singleTaskPaneExtraActionsButton) {
            singleTaskPaneExtraActionsButton.click();
            singleTaskPaneExtraActionsButton.focus();
          }
        }
      });
      break;
    }
    case 'ArrowDown':
      if (document.tabKeyIsDown && event.shiftKey) {
        const arrowNextSubtask = document.querySelector('#ArrowNextSubtask');
        if (arrowNextSubtask) {
          arrowNextSubtask.click();
        } else if (!document.querySelector('#SiblingButtons')) {
          displayLinksToSiblingSubtasks('#ArrowNextSubtask');
        }
      }
      break;
    case 'ArrowRight':
      if (document.tabKeyIsDown && event.shiftKey) {
        if (document.querySelector('#SiblingSubtasksDropdownContainer')) {
          deleteSiblingSubtasksDropdown();
        } else {
          const arrowMiddleSubtask = document.querySelector('#ArrowMiddleSubtask');
          if (arrowMiddleSubtask) {
            arrowMiddleSubtask.click();
          } else if (!document.querySelector('#SiblingButtons')) {
            displayLinksToSiblingSubtasks('#ArrowMiddleSubtask');
          }
        }
      }
      break;
    case 'ArrowUp':
      if (document.tabKeyIsDown && event.shiftKey) {
        const arrowPreviousSubtask = document.querySelector('#ArrowPreviousSubtask');
        if (arrowPreviousSubtask) {
          arrowPreviousSubtask.click();
        } else if (!document.querySelector('#SiblingButtons')) {
          displayLinksToSiblingSubtasks('#ArrowPreviousSubtask');
        }
      }
      break;
    case 'e':
      if (document.tabKeyIsDown || document.tabKeyIsDownOnModal) {
        chrome.storage.sync.get({anOptionsDescription: true}, function(items) {
          if (items.anOptionsDescription) {
            if (document.querySelector('#ReplaceDescriptionDialogView')) {
              closeReplaceDescriptionDialog();
            } else {
              if (document.querySelector('.SingleTaskPane') || document.querySelector('.SingleTaskPaneSpreadsheet')) displayReplaceDescriptionDialog();
            }
          }
        });
      }
      break;
    case 'Escape':
      if (document.querySelector('#SiblingSubtasksDropdownContainer')) deleteSiblingSubtasksDropdown();
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
        chrome.storage.sync.get({anOptionsParent: true}, function(items) {
          if (items.anOptionsParent) displaySetParentDrawer();
        });
      }
      break;
    case 'v': {
      if (!document.tabKeyIsDown) break;
      chrome.storage.sync.get({anOptionsAttachment: true}, function(items) {
        if (items.anOptionsAttachment) {
          const addAttachmentButton = document.querySelector('.AddAttachmentsButton');
          if (addAttachmentButton) addAttachmentButton.children[1].click(); // span > div
        }
      });
      break;
    }
    case '1':
      if (!document.tabKeyIsDown) break;
      clickNumberedAddAttachmentButton(1);
      break;
    case '2':
      if (!document.tabKeyIsDown) break;
      clickNumberedAddAttachmentButton(2);
      break;
    case '3':
      if (!document.tabKeyIsDown) break;
      clickNumberedAddAttachmentButton(3);
      break;
    case '4':
      if (!document.tabKeyIsDown) break;
      clickNumberedAddAttachmentButton(4);
      break;
    case '5':
      if (!document.tabKeyIsDown) break;
      clickNumberedAddAttachmentButton(5);
      break;
  }
});

document.addEventListener('keyup', function(event) {
  if (event.key === 'Tab') {
    document.tabKeyIsDown = false;
    document.tabKeyIsDownOnModal = false;
  }
});

window.addEventListener('blur', function() {
  document.tabKeyIsDown = false;
  document.tabKeyIsDownOnModal = false;
});

// After first load or page reload
window.addEventListener('load', function() {
  getLocaleAndSetLocalizedStrings();
  getPlatformAndSetPlatStrings();
  loadUserReplaceTextList();
  enableFeaturesAfterDelayOnLoad(300);
});

// After jumping from other resources on Asana
chrome.runtime.onMessage.addListener(
  function(message, sender, callback) {
    if (message.name && message.name === 'asanaNavigatorOnUpdated' && message.status === 'complete') {
      enableFeaturesAfterDelayOnPageChange(400);
    }
});