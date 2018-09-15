var saveOptions = function () {
  var projectsEnabled = document.getElementById('projects').checked;
  var subtasksEnabled = document.getElementById('subtasks').checked;
  var parentEnabled = document.getElementById('parent').checked;
  var notesEnabled = document.getElementById('notes').checked;
  chrome.storage.sync.set({
    'anOptionsProjects': projectsEnabled,
    'anOptionsSubtasks': subtasksEnabled,
    'anOptionsParent': parentEnabled,
    'anOptionsNotes': notesEnabled
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
    'anOptionsParent': true,
    'anOptionsNotes': true
  }, function(items) {
    document.getElementById('projects').checked = items.anOptionsProjects;
    document.getElementById('subtasks').checked = items.anOptionsSubtasks;
    document.getElementById('parent').checked = items.anOptionsParent;
    document.getElementById('notes').checked = items.anOptionsNotes;
  });
};

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click', saveOptions);