(function() {

const saveOptions = function () {
  const subtasksEnabled = document.getElementById('subtasks').checked;
  const descriptionEnabled = document.getElementById('description').checked;
  const debugEnabled = document.getElementById('debug').checked;
  chrome.storage.sync.set({
    anOptionsSubtasks: subtasksEnabled,
    anOptionsDescription: descriptionEnabled,
    anOptionsDebug: debugEnabled
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
    anOptionsSubtasks: true,
    anOptionsDescription: true,
    anOptionsDebug: false
  }, function (items) {
    document.getElementById('subtasks').checked = items.anOptionsSubtasks;
    document.getElementById('description').checked = items.anOptionsDescription;
    document.getElementById('debug').checked = items.anOptionsDebug;
  });
};

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click', saveOptions);

})();