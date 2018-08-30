function saveOptions() {
  var projectsEnabled = document.getElementById('projects').checked;
  var subtasksEnabled = document.getElementById('subtasks').checked;
  var parentEnabled = document.getElementById('parent').checked;
  chrome.storage.sync.set({
    'anOptionsProjects': projectsEnabled,
    'anOptionsSubtasks': subtasksEnabled,
    'anOptionsParent': parentEnabled
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved';
    setTimeout(function() {
      status.textContent = '';
    }, 1000);
  });
}
function loadOptions() {
  chrome.storage.sync.get({
    'anOptionsProjects': true,
    'anOptionsSubtasks': true,
    'anOptionsParent': true
  }, function(items) {
    document.getElementById('projects').checked = items.anOptionsProjects;
    document.getElementById('subtasks').checked = items.anOptionsSubtasks;
    document.getElementById('parent').checked = items.anOptionsParent;
  });
}
document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click',
    saveOptions);