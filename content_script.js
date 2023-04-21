const addRowToUserReplaceTextList = function() {
  const userTextToReplaceDialogTable = loggingQuerySelector('#UserTextToReplaceDialogTable');
  if (!userTextToReplaceDialogTable) return;
  const newUserTextTr = document.createElement('TR');
  newUserTextTr.setAttribute('class', 'name-row');
  newUserTextTr.innerHTML = `
    <td class="field-value"><input autocomplete="off" class="generic-input showing ReplaceDescriptionInput" type="text" tabindex="0" value=""></td>
    <td class="field-value"><input autocomplete="off" class="generic-input showing ReplaceDescriptionInput" type="text" tabindex="0" value=""></td>
    <td><a class="delete-row-link">&nbsp;×</a></td>`;
  newUserTextTr.lastElementChild.addEventListener('click', function(event) {deleteUserReplaceTextRow(event.target);});
  userTextToReplaceDialogTable.firstElementChild.appendChild(newUserTextTr);
};

// https://www.chromium.org/Home/chromium-security/extension-content-script-fetches
// Delegate to background.js
const callAsanaApi = function(method, path, options, data, callback) {
  chrome.runtime.sendMessage(
    {contentScriptQuery: 'callAsanaApi', parameters: [method, path, options, data]}, callback
  );
};

const closeReplaceDescriptionDialog = function() {
  const replaceDescriptionDialogView = loggingQuerySelector('#ReplaceDescriptionDialogView');
  if (replaceDescriptionDialogView) replaceDescriptionDialogView.remove();
};

const createSiblingSubtasksDropdown = function(subtaskList, taskGid, containerGid, fullscreenSuffix) {
  const completeIcon = '<svg class="SiblingSubtasksIcon CheckCircleFullIcon SiblingSubtasksItem-completedIcon" focusable="false" viewBox="0 0 32 32"><path d="M16,0C7.2,0,0,7.2,0,16s7.2,16,16,16s16-7.2,16-16S24.8,0,16,0z M23.3,13.3L14,22.6c-0.3,0.3-0.7,0.4-1.1,0.4s-0.8-0.1-1.1-0.4L8,18.8c-0.6-0.6-0.6-1.5,0-2.1s1.5-0.6,2.1,0l2.8,2.8l8.3-8.3c0.6-0.6,1.5-0.6,2.1,0S23.9,12.7,23.3,13.3z"></path></svg>';
  const incompleteIcon = '<svg class="SiblingSubtasksIcon CheckCircleIcon SiblingSubtasksItem-incompletedIcon" focusable="false" viewBox="0 0 32 32"><path d="M16,32C7.2,32,0,24.8,0,16S7.2,0,16,0s16,7.2,16,16S24.8,32,16,32z M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z"></path><path d="M12.9,22.6c-0.3,0-0.5-0.1-0.7-0.3l-3.9-3.9C8,18,8,17.4,8.3,17s1-0.4,1.4,0l3.1,3.1l8.6-8.6c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-9.4,9.4C13.4,22.5,13.2,22.6,12.9,22.6z"></path></svg>';
  if (loggingQuerySelector('#SiblingSubtasksDropdownContainer')) return;
  const siblingDropdown = document.createElement('DIV');
  siblingDropdown.setAttribute('id', 'SiblingSubtasksDropdownContainer');
  siblingDropdown.innerHTML = `
  <div class="LayerPositioner LayerPositioner--alignRight LayerPositioner--below SiblingSubtasksDropdownLayer">
    <div class="LayerPositioner-layer">
      <div class="Dropdown Scrollable Scrollable--vertical SiblingSubtasksDropdownContainer">
        <div class="menu">` +
    subtaskList.map(
      subtask => `<a class="StaticMenuItemBase-button StaticMenuItemBase--medium MenuItemBase Menu-menuItem" ${(subtask.is_rendered_as_separator) ? '' : `href="https://app.asana.com/0/${containerGid}/${subtask.gid}${fullscreenSuffix}`}"><span class="MenuItem-label">` +
      `${(subtask.is_rendered_as_separator) ? '<u>' + subtask.name + '</u>' : ((subtask.gid === taskGid) ? '<strong id="currentSubtaskMarker">&gt;</strong>&nbsp;' : (subtask.completed ? completeIcon : incompleteIcon)) + '&nbsp;' + subtask.name}</span></a>`
    ).join('') +
    '</div></div></div>';
  Array.from(siblingDropdown.firstElementChild.firstElementChild.firstElementChild.firstElementChild.children).forEach(function(subtask) {
    subtask.addEventListener('mouseover', function() {this.classList.add('is-highlighted');});
    subtask.addEventListener('mouseout', function() {this.classList.remove('is-highlighted');});
  });
  document.body.appendChild(siblingDropdown);
  loggingQuerySelector('#currentSubtaskMarker').scrollIntoView(false);
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

const deleteSiblingButtons = function() {
  const SiblingButtons = loggingQuerySelector('#SiblingButtons');
  if (SiblingButtons) SiblingButtons.remove();
};

const deleteSiblingSubtasksDropdown = function() {
  const siblingDropdown = loggingQuerySelector('#SiblingSubtasksDropdownContainer');
  if (siblingDropdown) siblingDropdown.remove();
  document.removeEventListener('click', listenToClickToCloseSiblingSubtasksDropdown);
};

const deleteUserReplaceTextRow = function(button) {
  const trToDelete = button.parentNode.parentNode;
  trToDelete.remove();
};

const displayLinksToSiblingSubtasks = function(idOfArrowToClick) {
  const taskAncestryTaskLinks = loggingQuerySelectorAll('.TaskAncestry-ancestorLink');
  if (!taskAncestryTaskLinks.length) return;
  const parentGid = findTaskGid(taskAncestryTaskLinks[taskAncestryTaskLinks.length - 1].href);
  const taskGid = findTaskGid(window.location.href);
  const containerGid = findProjectGid(window.location.href) || '0';
  const fullscreenSuffix = window.location.href.endsWith('/f')? '/f': '';

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
    const singleTaskPaneTitleRow = loggingQuerySelector('.SingleTaskPaneSpreadsheet-titleRow') || loggingQuerySelector('.SingleTaskPane-titleRow');
    if (singleTaskPaneTitleRow) singleTaskPaneTitleRow.appendChild(siblingButtons);

    if (indexPrevious || indexPrevious === 0) {
      const divArrowPreviousSubtask = document.createElement('DIV');
      divArrowPreviousSubtask.setAttribute('class', 'SmallTextButtons');
      divArrowPreviousSubtask.innerHTML = `<a class="NoBorderBottom TaskAncestry-ancestorLink" href="https://app.asana.com/0/${containerGid}/${subtaskListFiltered[indexPrevious].gid}${fullscreenSuffix}" id="ArrowPreviousSubtask" title="${locStrings['arrowTitle-previousSubtask']}\n${escapeHtml(subtaskListFiltered[indexPrevious].name)}">∧</a>`;
      siblingButtons.appendChild(divArrowPreviousSubtask);
      const arrowPreviousSubtask = loggingQuerySelector('#ArrowPreviousSubtask');
      if (arrowPreviousSubtask) arrowPreviousSubtask.addEventListener('click', function(event) {
        openPageWithoutRefresh(`https://app.asana.com/0/${containerGid}/${subtaskListFiltered[indexPrevious].gid}${fullscreenSuffix}`);
        event.preventDefault();
      });
    } else {
      siblingButtons.appendChild(document.createElement('BR'));
    }

    const divArrowMiddleSubtask = document.createElement('DIV');
    divArrowMiddleSubtask.setAttribute('class', 'SmallTextButtons');
    divArrowMiddleSubtask.innerHTML = `<a class="NoBorderBottom TaskAncestry-ancestorLink" id="ArrowMiddleSubtask" title="${locStrings['arrowTitle-subtasksDropdown']}">&gt;</a>`;
    siblingButtons.appendChild(divArrowMiddleSubtask);
    const arrowMiddleSubtask = loggingQuerySelector('#ArrowMiddleSubtask');
    if (arrowMiddleSubtask) arrowMiddleSubtask.addEventListener('click', function(event) {
      createSiblingSubtasksDropdown(subtaskList, taskGid, containerGid, fullscreenSuffix);
    });

    if (indexNext) {
      const divArrowNextSubtask = document.createElement('DIV');
      divArrowNextSubtask.setAttribute('class', 'SmallTextButtons');
      divArrowNextSubtask.innerHTML = `<a class="NoBorderBottom TaskAncestry-ancestorLink" href="https://app.asana.com/0/${containerGid}/${subtaskListFiltered[indexNext].gid}${fullscreenSuffix}" id="ArrowNextSubtask" title="${locStrings['arrowTitle-nextSubtask']}\n${escapeHtml(subtaskListFiltered[indexNext].name)}">∨</a>`;
      siblingButtons.appendChild(divArrowNextSubtask);
      const arrowNextSubtask = loggingQuerySelector('#ArrowNextSubtask');
      if (arrowNextSubtask) arrowNextSubtask.addEventListener('click', function(event) {
        openPageWithoutRefresh(`https://app.asana.com/0/${containerGid}/${subtaskListFiltered[indexNext].gid}${fullscreenSuffix}`);
        event.preventDefault();
      });
    } else {
      siblingButtons.appendChild(document.createElement('BR'));
    }
    if (idOfArrowToClick) {
        const arrowToClick = loggingQuerySelector(idOfArrowToClick);
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
  loggingQuerySelector('#CloseReplaceDescriptionDialogButton').addEventListener('click', closeReplaceDescriptionDialog);
  loggingQuerySelectorAll('.delete-row-link').forEach(link => link.addEventListener('click', function(event) {deleteUserReplaceTextRow(event.target);}));
  loggingQuerySelector('#AddRowToUserReplaceTextListLink').addEventListener('click', addRowToUserReplaceTextList);
  loggingQuerySelector('#SaveUserReplaceTextListLink').addEventListener('click', saveUserReplaceTextList);
  addRowToUserReplaceTextList();
  const replaceDescriptionDialogPresetButton = loggingQuerySelector('#ReplaceDescriptionDialogPresetButton');
  replaceDescriptionDialogPresetButton.addEventListener('click', replaceDescriptionPreset);
  const replaceDescriptionDialogUserButton = loggingQuerySelector('#ReplaceDescriptionDialogUserButton');
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

const displaySuccessToast = function(task, messageVarTask, functionToRunCallbackAtLast) {
  const toastManager = loggingQuerySelector('.ToastManager');
  if (!toastManager) return;
  const toastDiv = document.createElement('DIV');
  toastDiv.innerHTML = `
  <div class="ToastManager-toast">
    <div class="ToastContainer SuccessToast">
      <div class="ToastNotificationContent">
        <div class="ToastNotificationContent-firstRow">
          <div class="ToastNotificationContent-text">
            <span>` +
  messageVarTask.replace('{task}', `<a class="NavigationLink ToastNotification-link" href="https://app.asana.com/0/0/${task.gid}">${(task.completed) ? '✓ ' : ''}${escapeHtml(task.name)}</a> `) +`
            </span>
          </div>
          <a class="CloseButton">
            <svg class="Icon XIcon CloseButton-xIcon" focusable="false" viewBox="0 0 32 32">
              <path d="M18.1,16l8.9-8.9c0.6-0.6,0.6-1.5,0-2.1c-0.6-0.6-1.5-0.6-2.1,0L16,13.9L7.1,4.9c-0.6-0.6-1.5-0.6-2.1,0c-0.6,0.6-0.6,1.5,0,2.1l8.9,8.9l-8.9,8.9c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path></svg>
          </a>
        </div>
        <div class="Button Button--small Button--secondary" tabindex="0" role="button" aria-disabled="false">${locStrings['toastButtton-undo']}</div>
      </div>
    </div>
  </div>`;
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

const enableFeaturesAfterDelayOnPageChange = function(delay) {
  chrome.storage.sync.get({
    anOptionsSubtasks: true
  }, function(items) {
    setTimeout(function() {
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

const getTaskPaneTypeAndElement = function(subsequentClassName, returnBoolean) {
  const singleTaskPaneElement = loggingQuerySelector('.SingleTaskPane' + subsequentClassName);
  if (singleTaskPaneElement) return ['Single', singleTaskPaneElement];
  const multiTaskPaneElement = loggingQuerySelector('.MultiTaskPane' + subsequentClassName);
  if (multiTaskPaneElement) return ['Multi', multiTaskPaneElement];
  return returnBoolean? false: ['', undefined];
};

const getUserReplaceTextList = function() {
  const userTextToReplaceDialogTable = loggingQuerySelector('#UserTextToReplaceDialogTable');
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

const listenToClickToCloseSiblingSubtasksDropdown = function(event) {
  const siblingButtons = loggingQuerySelector('#SiblingButtons');
  const siblingDropdown = loggingQuerySelector('#SiblingSubtasksDropdownContainer');
  if (siblingDropdown) {
    if (!siblingButtons || !siblingButtons.contains(event.target) && !siblingDropdown.contains(event.target)) {
        deleteSiblingSubtasksDropdown();
    }
  }
};

const loadUserReplaceTextList = function() {
  chrome.storage.sync.get({
    anOptionsPairs: []
  }, function(items) {
    document.loadedUserReplaceTextList = items.anOptionsPairs;
  });
};

const loggingQuerySelector = function(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    const getOptionDebug = new Promise(resolve => {
      chrome.storage.sync.get({anOptionsDebug: false}, function(items) {
        resolve(items.anOptionsDebug);
      });
    });
    getOptionDebug.then(value => {
      if (value) console.trace(element);
    });
  }
  return element;
};

const loggingQuerySelectorAll = function(selector) {
  const element = document.querySelectorAll(selector);
  if (!element.length) {
    const getOptionDebug = new Promise(resolve => {
      chrome.storage.sync.get({anOptionsDebug: false}, function(items) {
        resolve(items.anOptionsDebug);
      });
    });
    getOptionDebug.then(value => {
      if (value) console.trace(element);
    });
  }
  return element;
};

const openPageWithoutRefresh = function(newUrl) {
  window.history.pushState({}, '', newUrl);
  window.history.back();
  setTimeout(function() {
    window.history.forward();
  }, 100);
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
  const replaceTextListDuplicateLink = [[/(?:&lt;|&quot;|')?(<a href=")(mailto:)?([A-Za-z0-9!#$%&'+,\-./:;=?@_~]+)(" target="_blank" rel="noreferrer noopener">)\3(<\/a>)(\?)?(?:&gt;|&quot;|')? &lt;\2?\1\2\3[\/\s]*\4\3[\/\s]*\5\6&gt;(?:&gt;|&quot;|')?/g, '$1$2$3$4$3$5$6']];
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
      const userTextToReplaceDialogTr = loggingQuerySelector('#UserTextToReplaceDialogTable').firstElementChild.children;
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
    const replaceDescriptionDialogUserButton = loggingQuerySelector('#ReplaceDescriptionDialogUserButton');
    replaceDescriptionDialogUserButton.classList.add('is-disabled');
    setTimeout(function() {
      replaceDescriptionDialogUserButton.classList.remove('is-disabled');
    }, 2000);
  }
};

const returnReplaceDescriptionInnerHTML = function() {
  return `
  <div class="ModalBuffer">
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
    </div>
  </div>`;
};

const saveUserReplaceTextList = function() {
  const userReplaceTextList = getUserReplaceTextList();
  chrome.storage.sync.set({
    anOptionsPairs: userReplaceTextList
  }, function() {
    document.loadedUserReplaceTextList = userReplaceTextList;
    const saveTextLink = loggingQuerySelector('#SaveUserReplaceTextListLink');
    const savedText = '✓ ';
    saveTextLink.textContent = savedText + saveTextLink.textContent;
    setTimeout(function() {
      saveTextLink.textContent = saveTextLink.textContent.replace(savedText, '');
    }, 2000);
  });
};

// After first load or page reload
window.addEventListener('load', function() {
  getLocaleAndSetLocalizedStrings();
  loadUserReplaceTextList();
});

// After jumping from other resources on Asana
chrome.runtime.onMessage.addListener(
  function(message, sender, callback) {
    if (message.command == 'displayLinksToSiblingSubtasks') {
      displayLinksToSiblingSubtasks('#ArrowMiddleSubtask');
    }
    if (message.command == 'replaceTextInDescription') {
      if (document.querySelector('#ReplaceDescriptionDialogView')) {
        closeReplaceDescriptionDialog();
      } else {
        displayReplaceDescriptionDialog();
      }
    }

    if (message.name && message.name === 'asanaNavigatorOnUpdated' && message.status === 'complete') {
      enableFeaturesAfterDelayOnPageChange(400);
    }
});