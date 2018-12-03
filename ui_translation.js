// Unlocalized UI elements are shown in English
// The UI strings shouldn't include HTML special characters

var localizationStrings = {
  'de': {
    'arrowTitle-subtasksDropdown': 'Unteraufgaben',
    'drawerLabel-setParent': 'Machen Sie diese Aufgabe zu einer Unteraufgabe einer anderen Aufgabe.',
    'drawerPlaceholder-setParent': 'Finden Sie eine Aufgabe',
    'helpButton-keyboardShortcuts': 'Tastenkombinationen',
    'snippet-example': 'z. B. ',
    'toastButtton-undo': 'Rückgängig machen',
    'toastButtton-undoing': '(Wird rückgängig gemacht...)',
    'typeaheadItem-NoMatch': 'Keine Übereinstimmungen gefunden',
  },
  'en': {
    // Commenting the same or relevant UI from translations/en.bundle.js
    'arrowTitle-nextSubtask': 'Next subtask',
    'arrowTitle-previousSubtask': 'Previous subtask',
    'arrowTitle-subtasksDropdown': 'Subtasks', // u2c2cf (155sxj7)
    'dialogButton-usePreset': 'Use Preset Cleanup',
    'dialogButton-replaceText': 'Replace Text (Coming soon...)',
    'dialogLabel-replaceWith-list': ['Replace', 'with'],
    'dialogLink-addRow': 'Add Row',
    'dialogPlaceholder-duplicateLinks': 'Duplicate links',
    'dialogPlaceholder-HTMLEntities': 'HTML entities',
    'dialogPlaceholder-HTMLSymbols': 'HTML symbols',
    'dialogPlaceholder-singleString': 'Single link',
    'drawerLabel-setParent': 'Make this task a subtask of another task.', // krtmmb:[0,"Make this task a subtask of another task. It will be removed from the current project."]
    'drawerPlaceholder-setParent': 'Find a task by its name or ID', // "8bkw5o":[0,"Find a task"]
    'drawerSwitch-setParent-list': ['Insert at: Top', 'Bottom'],
    'helpButton-keyboardShortcuts': 'Keyboard shortcuts', // 5vkqjv
    'menuButton-replaceNotes': 'Replace Text in Notes...',
    'menuButton-setParent': 'Convert to a Subtask...',
    'shortcutDescription-siblingSubtasks': 'Jump to next/previous sibling subtask',
    'shortcutDescription-subtasksDropdown': 'Display sibling subtasks',
    'snippet-example': 'e.g. ', // "1mdunih":[0,"e.g., Priority, Stage, Status"]
    'toastButtton-undo': 'Undo', // 14vtr68
    'toastButtton-undoing': '(Undoing...)', // 63rova
    'toastContent-notesReplaced-list': ['Notes replaced:', ''],
    'toastContent-setParent-list': ['Made a subtask:', ''],
    'typeaheadItem-NoMatch': 'No matches found', // 1h71d4n
  },
  'es': {
    'arrowTitle-subtasksDropdown': 'Subtareas',
    'drawerLabel-setParent': 'Transformar esta tarea en una subtarea de otra tarea.',
    'drawerPlaceholder-setParent': 'Encontrar una tarea',
    'helpButton-keyboardShortcuts': 'Atajos del teclado',
    'menuButton-replaceNotes': 'Replace text in notes...',
    'menuButton-setParent': 'Convert to a subtask...',
    'snippet-example': 'ej. ',
    'toastButtton-undo': 'Deshacer',
    'toastButtton-undoing': '(Deshaciendo...)',
    'typeaheadItem-NoMatch': 'No se encontraron coincidencias',
  },
  'fr': {
    'arrowTitle-subtasksDropdown': 'Sous-tâches',
    'drawerLabel-setParent': 'Transformez cette tâche en sous-tâche d\'une autre tâche.',
    'drawerPlaceholder-setParent': 'Trouver une tâche',
    'helpButton-keyboardShortcuts': 'Raccourcis clavier',
    'menuButton-replaceNotes': 'Replace text in notes...',
    'menuButton-setParent': 'Convert to a subtask...',
    'snippet-example': 'ex. ',
    'toastButtton-undo': 'Annuler',
    'toastButtton-undoing': '(Annulation...)',
    'typeaheadItem-NoMatch': 'Aucune correspondance',
  },
  'ja': {
    'arrowTitle-nextSubtask': '次のサブタスク',
    'arrowTitle-previousSubtask': '前のサブタスク',
    'arrowTitle-subtasksDropdown': '前後のサブタスク', // translating differently
    'dialogButton-usePreset': '事前設定済みクリーンアップ',
    'dialogButton-replaceText': 'テキストを置換 (開発中)',
    'dialogLabel-replaceWith-list': ['置換前', '置換後'],
    'dialogLink-addRow': '行を追加',
    'dialogPlaceholder-duplicateLinks': '重複リンク',
    'dialogPlaceholder-HTMLEntities': 'HTMLエンティティ',
    'dialogPlaceholder-HTMLSymbols': 'HTML記号',
    'dialogPlaceholder-singleString': '単一のリンク',
    'drawerLabel-setParent': 'このタスクを他のタスクのサブタスクにしましょう。',
    'drawerPlaceholder-setParent': '名前またはIDでタスクを見つける',
    'drawerSwitch-setParent-list': ['挿入場所: 上部', '下部'],
    'helpButton-keyboardShortcuts': 'キーボードショートカット',
    'menuButton-replaceNotes': '説明テキストを置換...',
    'menuButton-setParent': 'サブタスクに変換...',
    'shortcutDescription-siblingSubtasks': '次/前のサブタスクに移動',
    'shortcutDescription-subtasksDropdown': '前後のサブタスクを表示',
    'snippet-example': '例: ',
    'toastButtton-undo': '元に戻す',
    'toastButtton-undoing': '(元に戻しています...)',
    'toastContent-notesReplaced-list': ['', 'の説明を置換しました。'],
    'toastContent-setParent-list': ['サブタスクにしました:', ''],
    'typeaheadItem-NoMatch': '一致するタスクは見つかりませんでした',
  },
  'pt': {
    'arrowTitle-subtasksDropdown': 'Subtarefas',
    'drawerLabel-setParent': 'Tornar esta uma subtarefa de outra tarefa.',
    'drawerPlaceholder-setParent': 'Encontrar tarefa',
    'helpButton-keyboardShortcuts': 'Atalhos do teclado',
    'menuButton-replaceNotes': 'Replace text in notes...',
    'menuButton-setParent': 'Convert to a subtask...',
    'snippet-example': 'ex. ',
    'toastButtton-undo': 'Desfazer',
    'toastButtton-undoing': '(Desfazendo...)',
    'typeaheadItem-NoMatch': 'Nenhuma correspondência encontrada',
  }
};

var locStrings = {};