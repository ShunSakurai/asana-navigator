// Unlocalized UI elements fall back on English
// The UI strings shouldn't include HTML special characters to prevent XSS vulnerability

var localizationStrings = {
  'de': {
    'arrowTitle-subtasksDropdown': 'Unteraufgaben',
    'dialogMessage-visitReference-var-link': 'Bitte verwenden Sie das {link}, um mehr zu erfahren.',
    'drawerLabel-setParent': 'Machen Sie diese Aufgabe zu einer Unteraufgabe einer anderen Aufgabe.',
    'drawerPlaceholder-setParent': 'Finden Sie eine Aufgabe',
    'helpButton-keyboardShortcuts': 'Tastenkombinationen',
    'snippet-example': 'z. B. ',
    'snippet-save': 'Speichern',
    'toastButtton-undo': 'Rückgängig machen',
    'toastButtton-undoing': '(Wird rückgängig gemacht...)',
    'typeaheadItem-NoMatch': 'Keine Übereinstimmungen gefunden',
  },
  'en': {
    // Commenting the same or relevant UI from translations/en.bundle.js
    'arrowTitle-nextSubtask': 'Next subtask',
    'arrowTitle-previousSubtask': 'Previous subtask',
    'arrowTitle-subtasksDropdown': 'Subtasks', // u2c2cf
    'dialogButton-usePreset': 'Use Preset Cleanup',
    'dialogButton-replaceText': 'Replace Text',
    'dialogLabel-replaceWith-var-text': 'Replace{text}with',
    'dialogLink-addRow': 'Add Row',
    'dialogMessage-userStrings': 'You can define and replace custom strings below.',
    'dialogMessage-regularExpression': 'Regular expression is supported. Please escape special characters (symbols) with a backslash (&#92;) in the left column.',
    'dialogMessage-visitReference-var-link': 'Please visit the {link} for more information.', // "1pee805":[2,"Deactivation is permanent and cannot be undone. Once your account is deactivated, you can <strong>no longer</strong> log in to any Organizations or Workspaces in Asana. Please visit the <a>Asana Guide</a> for more information."]
    'dialogPlaceholder-duplicateLinks': 'Duplicate links',
    'dialogPlaceholder-HTMLEntities': 'HTML entities',
    'dialogPlaceholder-HTMLSymbols': 'HTML symbols',
    'dialogPlaceholder-singleString': 'Single link',
    'drawerLabel-setParent': 'Make this task a subtask of another task.', // krtmmb:[0,"Make this task a subtask of another task. It will be removed from the current project."]
    'drawerPlaceholder-setParent': 'Find a task by its name or ID', // "8bkw5o":[0,"Find a task"]
    'drawerSwitch-setParent-var-button': 'Insert at: Top{button}Bottom',
    'helpButton-keyboardShortcuts': 'Keyboard shortcuts', // 5vkqjv
    'menuButton-replaceDescription': 'Replace Text in Description...',
    'menuButton-setParent': 'Convert to a Subtask...',
    'shortcutDescription-siblingSubtasks': 'Jump to previous/next subtask',
    'shortcutDescription-subtasksDropdown': 'Show sibling subtasks',
    'snippet-example': 'e.g. ', // "1mdunih":[0,"e.g., Priority, Stage, Status"]
    'snippet-save': 'Save', // "14vpdb5"
    'snippet-spacing': ' ',
    'toastButtton-undo': 'Undo', // 14vtr68
    'toastButtton-undoing': '(Undoing...)', // 63rova
    'toastContent-descriptionReplaced-var-task': 'Description replaced: {task}',
    'toastContent-setParent-var-task': 'Made a subtask: {task}',
    'typeaheadItem-NoMatch': 'No matches found', // 1h71d4n
  },
  'es': {
    'arrowTitle-subtasksDropdown': 'Subtareas',
    'dialogMessage-visitReference-var-link': 'Por favor visita la {link} para más información.',
    'drawerLabel-setParent': 'Transformar esta tarea en una subtarea de otra tarea.',
    'drawerPlaceholder-setParent': 'Encontrar una tarea',
    'helpButton-keyboardShortcuts': 'Atajos del teclado',
    'menuButton-replaceDescription': 'Replace text in description...',
    'menuButton-setParent': 'Convert to a subtask...',
    'snippet-example': 'ej. ',
    'snippet-save': 'Guardar',
    'toastButtton-undo': 'Deshacer',
    'toastButtton-undoing': '(Deshaciendo...)',
    'typeaheadItem-NoMatch': 'No se encontraron coincidencias',
  },
  'fr': {
    'arrowTitle-subtasksDropdown': 'Sous-tâches',
    'dialogMessage-visitReference-var-link': 'Veuillez consulter le {link} pour plus d\'informations.',
    'drawerLabel-setParent': 'Transformez cette tâche en sous-tâche d\'une autre tâche.',
    'drawerPlaceholder-setParent': 'Trouver une tâche',
    'helpButton-keyboardShortcuts': 'Raccourcis clavier',
    'menuButton-replaceDescription': 'Replace text in description...',
    'menuButton-setParent': 'Convert to a subtask...',
    'snippet-example': 'ex. ',
    'snippet-save': 'Enregistrer',
    'toastButtton-undo': 'Annuler',
    'toastButtton-undoing': '(Annulation...)',
    'typeaheadItem-NoMatch': 'Aucune correspondance',
  },
  'ja': {
    'arrowTitle-nextSubtask': '次のサブタスク',
    'arrowTitle-previousSubtask': '前のサブタスク',
    'arrowTitle-subtasksDropdown': '前後のサブタスク', // translating differently
    'dialogButton-usePreset': '事前設定済みクリーンアップ',
    'dialogButton-replaceText': 'テキストを置換',
    'dialogLabel-replaceWith-var-text': '置換前{text}置換後',
    'dialogLink-addRow': '行を追加',
    'dialogMessage-userStrings': '以下でカスタムの文字列を定義して置換することができます。',
    'dialogMessage-regularExpression': '正規表現がサポートされています。左列では特殊文字 (記号) をバックスラッシュ (&#92;) でエスケープしてください。',
    'dialogMessage-visitReference-var-link': '詳しくは {link} をご覧ください。', // assuming half-width characters in between
    'dialogPlaceholder-duplicateLinks': '重複リンク',
    'dialogPlaceholder-HTMLEntities': 'HTMLエンティティ',
    'dialogPlaceholder-HTMLSymbols': 'HTML記号',
    'dialogPlaceholder-singleString': '単一のリンク',
    'drawerLabel-setParent': 'このタスクを他のタスクのサブタスクにしましょう。',
    'drawerPlaceholder-setParent': '名前またはIDでタスクを見つける', // translating differently
    'drawerSwitch-setParent-var-button': '挿入場所: 上部{button}下部',
    'helpButton-keyboardShortcuts': 'キーボードショートカット',
    'menuButton-replaceDescription': '説明テキストを置換...',
    'menuButton-setParent': 'サブタスクに変換...',
    'shortcutDescription-siblingSubtasks': '前/次のサブタスクに移動',
    'shortcutDescription-subtasksDropdown': '前後のサブタスクを表示',
    'snippet-example': '例: ',
    'snippet-save': '保存',
    'snippet-spacing': '', // no space between sentences
    'toastButtton-undo': '元に戻す',
    'toastButtton-undoing': '(元に戻しています...)',
    'toastContent-descriptionReplaced-var-task': '{task} の説明を置換しました。',
    'toastContent-setParent-var-task': 'サブタスクにしました: {task}',
    'typeaheadItem-NoMatch': '一致するタスクは見つかりませんでした', // translating differently
  },
  'pt': {
    'arrowTitle-subtasksDropdown': 'Subtarefas',
    'dialogMessage-visitReference-var-link': 'Visite o {link} para mais informações.',
    'drawerLabel-setParent': 'Tornar esta uma subtarefa de outra tarefa.',
    'drawerPlaceholder-setParent': 'Encontrar tarefa',
    'helpButton-keyboardShortcuts': 'Atalhos do teclado',
    'menuButton-replaceDescription': 'Replace text in description...',
    'menuButton-setParent': 'Convert to a subtask...',
    'snippet-example': 'ex. ',
    'snippet-save': 'Salvar',
    'toastButtton-undo': 'Desfazer',
    'toastButtton-undoing': '(Desfazendo...)',
    'typeaheadItem-NoMatch': 'Nenhuma correspondência encontrada',
  }
};

var locStrings = {};