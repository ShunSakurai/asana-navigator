(function() {

const saveOptions = function () {
  const inboxEnabled = document.getElementById('inbox').checked;
  const subtasksEnabled = document.getElementById('subtasks').checked;
  const searchEnabled = document.getElementById('search').checked;
  const attachmentEnabled = document.getElementById('attachment').checked;
  const shortcutsEnabled = document.getElementById('shortcuts').checked;
  const descriptionEnabled = document.getElementById('description').checked;
  const parentEnabled = document.getElementById('parent').checked;
  const sectionEnabled = document.getElementById('section').checked;
  chrome.storage.sync.set({
    anOptionsInbox: inboxEnabled,
    anOptionsSubtasks: subtasksEnabled,
    anOptionsSearch: searchEnabled,
    anOptionsAttachment: attachmentEnabled,
    anOptionsShortcuts: shortcutsEnabled,
    anOptionsDescription: descriptionEnabled,
    anOptionsParent: parentEnabled,
    anOptionsSection: sectionEnabled
  }, function () {
    const status = document.getElementById('status');
    status.textContent = 'Options saved';
    setTimeout(function () {
      status.textContent = '';
    }, 1000);
  });
};

const loadOptions = function () {
  chrome.storage.sync.get({
    anOptionsInbox: true,
    anOptionsSubtasks: true,
    anOptionsSearch: true,
    anOptionsAttachment: true,
    anOptionsShortcuts: true,
    anOptionsDescription: true,
    anOptionsParent: true,
    anOptionsSection: true
  }, function (items) {
    document.getElementById('inbox').checked = items.anOptionsInbox;
    document.getElementById('subtasks').checked = items.anOptionsSubtasks;
    document.getElementById('search').checked = items.anOptionsSearch;
    document.getElementById('attachment').checked = items.anOptionsAttachment;
    document.getElementById('shortcuts').checked = items.anOptionsShortcuts;
    document.getElementById('description').checked = items.anOptionsDescription;
    document.getElementById('parent').checked = items.anOptionsParent;
    document.getElementById('section').checked = items.anOptionsSection;
  });
};

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click', saveOptions);

})();