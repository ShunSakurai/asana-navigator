const saveOptions = function () {
  let inboxEnabled = document.getElementById('inbox').checked;
  let projectsEnabled = document.getElementById('projects').checked;
  let subtasksEnabled = document.getElementById('subtasks').checked;
  let shortcutsEnabled = document.getElementById('shortcuts').checked;
  let parentEnabled = document.getElementById('parent').checked;
  let descriptionEnabled = document.getElementById('description').checked;
  chrome.storage.sync.set({
    'anOptionsInbox': inboxEnabled,
    'anOptionsProjects': projectsEnabled,
    'anOptionsSubtasks': subtasksEnabled,
    'anOptionsShortcuts': shortcutsEnabled,
    'anOptionsParent': parentEnabled,
    'anOptionsDescription': descriptionEnabled
  }, function () {
    let status = document.getElementById('status');
    status.textContent = 'Options saved';
    setTimeout(function () {
      status.textContent = '';
    }, 1000);
  });
};

const loadOptions = function () {
  chrome.storage.sync.get({
    'anOptionsInbox': true,
    'anOptionsProjects': true,
    'anOptionsSubtasks': true,
    'anOptionsShortcuts': true,
    'anOptionsParent': true,
    'anOptionsDescription': true
  }, function (items) {
    document.getElementById('inbox').checked = items.anOptionsInbox;
    document.getElementById('projects').checked = items.anOptionsProjects;
    document.getElementById('subtasks').checked = items.anOptionsSubtasks;
    document.getElementById('shortcuts').checked = items.anOptionsShortcuts;
    document.getElementById('parent').checked = items.anOptionsParent;
    document.getElementById('description').checked = items.anOptionsDescription;
  });
};

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click', saveOptions);