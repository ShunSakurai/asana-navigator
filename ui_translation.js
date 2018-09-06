// Unlocalized UI elements are shown in English

var localizationStrings = {
  'de': {
    'drawerLabel-setParent': 'Machen Sie diese Aufgabe zu einer Unteraufgabe einer anderen Aufgabe.',
    'drawerPlaceholder-setParent': 'Finden Sie eine Aufgabe',
    'toastButtton-undo': 'Rückgängig machen',
    'toastButtton-undoing': '(Wird rückgängig gemacht...)',
  },
  'en': {
    // Commenting the same or relevant UI from translations/en.bundle.js
    'arrowTitle-nextSibling': 'Next sibling subtask',
    'arrowTitle-previousSibling': 'Previous sibling subtask',
    'drawerLabel-setParent': 'Make this task a subtask of another task.', // krtmmb:[0,"Make this task a subtask of another task. It will be removed from the current project."]
    'drawerSwitch-setParent-list': ['Insert at: Top', 'Bottom'],
    'drawerPlaceholder-setParent': 'Find a task by its name or ID', // "8bkw5o":[0,"Find a task"]
    'menuButton-replaceNotes': 'Clean up Notes',
    'menuButton-setParent': 'Convert to a Subtask...',
    'toastButtton-undo': 'Undo', // 14vtr68
    'toastButtton-undoing': '(Undoing...)', // 63rova
    'toastContent-notesReplaced-list': ['Notes replaced:', ''],
    'toastContent-setParent-list': ['Made a subtask:', ''],
  },
  'es': {
    'drawerLabel-setParent': 'Transformar esta tarea en una subtarea de otra tarea.',
    'drawerPlaceholder-setParent': 'Encontrar una tarea',
    'menuButton-replaceNotes': 'Clean up notes',
    'menuButton-setParent': 'Convert to a subtask...',
    'toastButtton-undo': 'Deshacer',
    'toastButtton-undoing': '(Deshaciendo...)',
  },
  'fr': {
    'drawerLabel-setParent': 'Transformez cette tâche en sous-tâche d\'une autre tâche.',
    'drawerPlaceholder-setParent': 'Trouver une tâche',
    'menuButton-replaceNotes': 'Clean up notes',
    'menuButton-setParent': 'Convert to a subtask...',
    'toastButtton-undo': 'Annuler',
    'toastButtton-undoing': '(Annulation...)',
  },
  'ja': {
    'arrowTitle-nextSibling': '次のサブタスク',
    'arrowTitle-previousSibling': '前のサブタスク',
    'drawerLabel-setParent': 'このタスクを他のタスクのサブタスクにしましょう。',
    'drawerSwitch-setParent-list': ['挿入場所: 上部', '下部'],
    'drawerPlaceholder-setParent': '名前またはIDでタスクを見つける',
    'menuButton-replaceNotes': '説明テキストを整形',
    'menuButton-setParent': 'サブタスクに変換...',
    'toastButtton-undo': '元に戻す',
    'toastButtton-undoing': '(元に戻しています...)',
    'toastContent-notesReplaced-list': ['', 'の説明を整形しました。'],
    'toastContent-setParent-list': ['サブタスクにしました:', ''],
  },
  'pt': {
    'drawerLabel-setParent': 'Tornar esta uma subtarefa de outra tarefa.',
    'drawerPlaceholder-setParent': 'Encontrar tarefa',
    'menuButton-replaceNotes': 'Clean up notes',
    'menuButton-setParent': 'Convert to a subtask...',
    'toastButtton-undo': 'Desfazer',
    'toastButtton-undoing': '(Desfazendo...)',
  }
};

var locStrings = {};