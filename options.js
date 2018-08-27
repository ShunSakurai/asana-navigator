function saveOptions() {
  var projectsEnabled = document.getElementById('projects').checked;
  var subtasksEnabled = document.getElementById('subtasks').checked;
  chrome.storage.sync.set({
    anOptionsProjects: projectsEnabled,
    anOptionsSubtasks: subtasksEnabled
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
    'anOptionsSubtasks': true
  }, function(items) {
    document.getElementById('projects').checked = items.anOptionsProjects;
    document.getElementById('subtasks').checked = items.anOptionsSubtasks;
  });
}
document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click',
    saveOptions);