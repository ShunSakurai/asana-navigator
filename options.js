var saveOptions = function () {
  var projectsEnabled = document.getElementById('projects').checked;
  var subtasksEnabled = document.getElementById('subtasks').checked;
  var shortcutsEnabled = document.getElementById('shortcuts').checked;
  var parentEnabled = document.getElementById('parent').checked;
  var descriptionEnabled = document.getElementById('description').checked;
  chrome.storage.sync.set({
    'anOptionsProjects': projectsEnabled,
    'anOptionsSubtasks': subtasksEnabled,
    'anOptionsShortcuts': shortcutsEnabled,
    'anOptionsParent': parentEnabled,
    'anOptionsDescription': descriptionEnabled
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved';
    setTimeout(function() {
      status.textContent = '';
    }, 1000);
  });
};

var loadOptions = function () {
  chrome.storage.sync.get({
    'anOptionsProjects': true,
    'anOptionsSubtasks': true,
    'anOptionsShortcuts': true,
    'anOptionsParent': true,
    'anOptionsDescription': true
  }, function(items) {
    document.getElementById('projects').checked = items.anOptionsProjects;
    document.getElementById('subtasks').checked = items.anOptionsSubtasks;
    document.getElementById('shortcuts').checked = items.anOptionsShortcuts;
    document.getElementById('parent').checked = items.anOptionsParent;
    document.getElementById('description').checked = items.anOptionsDescription;
  });
};

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click', saveOptions);