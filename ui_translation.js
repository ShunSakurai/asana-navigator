// Unlocalized UI elements are shown in English
// The UI strings shouldn't include HTML special characters

var localizationStrings = {
  'de': {
    'drawerLabel-setParent': 'Machen Sie diese Aufgabe zu einer Unteraufgabe einer anderen Aufgabe.',
    'drawerPlaceholder-setParent': 'Finden Sie eine Aufgabe',
    'helpButton-keyboardShortcuts': 'Tastenkombinationen',
    'toastButtton-undo': 'Rückgängig machen',
    'toastButtton-undoing': '(Wird rückgängig gemacht...)',
    'typeaheadItem-NoMatch': 'Keine Übereinstimmungen gefunden',
  },
  'en': {
    // Commenting the same or relevant UI from translations/en.bundle.js
    'arrowTitle-nextSibling': 'Next sibling subtask',
    'arrowTitle-previousSibling': 'Previous sibling subtask',
    'drawerLabel-setParent': 'Make this task a subtask of another task.', // krtmmb:[0,"Make this task a subtask of another task. It will be removed from the current project."]
    'drawerPlaceholder-setParent': 'Find a task by its name or ID', // "8bkw5o":[0,"Find a task"]
    'drawerSwitch-setParent-list': ['Insert at: Top', 'Bottom'],
    'helpButton-keyboardShortcuts': 'Keyboard shortcuts', // 5vkqjv
    'menuButton-replaceNotes': 'Clean up Notes',
    'menuButton-setParent': 'Convert to a Subtask...',
    'shortcutDescription-siblingSubtasks': 'Jump to next/previous sibling subtask',
    'toastButtton-undo': 'Undo', // 14vtr68
    'toastButtton-undoing': '(Undoing...)', // 63rova
    'toastContent-notesReplaced-list': ['Notes replaced:', ''],
    'toastContent-setParent-list': ['Made a subtask:', ''],
    'typeaheadItem-NoMatch': 'No matches found', // 1h71d4n
  },
  'es': {
    'drawerLabel-setParent': 'Transformar esta tarea en una subtarea de otra tarea.',
    'drawerPlaceholder-setParent': 'Encontrar una tarea',
    'helpButton-keyboardShortcuts': 'Atajos del teclado',
    'menuButton-replaceNotes': 'Clean up notes',
    'menuButton-setParent': 'Convert to a subtask...',
    'toastButtton-undo': 'Deshacer',
    'toastButtton-undoing': '(Deshaciendo...)',
    'typeaheadItem-NoMatch': 'No se encontraron coincidencias',
  },
  'fr': {
    'drawerLabel-setParent': 'Transformez cette tâche en sous-tâche d\'une autre tâche.',
    'drawerPlaceholder-setParent': 'Trouver une tâche',
    'helpButton-keyboardShortcuts': 'Raccourcis clavier',
    'menuButton-replaceNotes': 'Clean up notes',
    'menuButton-setParent': 'Convert to a subtask...',
    'toastButtton-undo': 'Annuler',
    'toastButtton-undoing': '(Annulation...)',
    'typeaheadItem-NoMatch': 'Aucune correspondance',
  },
  'ja': {
    'arrowTitle-nextSibling': '次のサブタスク',
    'arrowTitle-previousSibling': '前のサブタスク',
    'drawerLabel-setParent': 'このタスクを他のタスクのサブタスクにしましょう。',
    'drawerPlaceholder-setParent': '名前またはIDでタスクを見つける',
    'drawerSwitch-setParent-list': ['挿入場所: 上部', '下部'],
    'helpButton-keyboardShortcuts': 'キーボードショートカット',
    'menuButton-replaceNotes': '説明テキストを整形',
    'menuButton-setParent': 'サブタスクに変換...',
    'shortcutDescription-siblingSubtasks': '次/前のサブタスクに移動',
    'toastButtton-undo': '元に戻す',
    'toastButtton-undoing': '(元に戻しています...)',
    'toastContent-notesReplaced-list': ['', 'の説明を整形しました。'],
    'toastContent-setParent-list': ['サブタスクにしました:', ''],
    'typeaheadItem-NoMatch': '一致するタスクは見つかりませんでした',
  },
  'pt': {
    'drawerLabel-setParent': 'Tornar esta uma subtarefa de outra tarefa.',
    'drawerPlaceholder-setParent': 'Encontrar tarefa',
    'helpButton-keyboardShortcuts': 'Atalhos do teclado',
    'menuButton-replaceNotes': 'Clean up notes',
    'menuButton-setParent': 'Convert to a subtask...',
    'toastButtton-undo': 'Desfazer',
    'toastButtton-undoing': '(Desfazendo...)',
    'typeaheadItem-NoMatch': 'Nenhuma correspondência encontrada',
  }
};

var locStrings = {};