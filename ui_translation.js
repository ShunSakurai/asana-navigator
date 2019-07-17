// Unlocalized UI elements fall back on English
// The UI strings shouldn't include HTML special characters to prevent XSS vulnerability

const localizationStrings = {
  'de': {
    'arrowTitle-subtasksDropdown': 'Unteraufgaben',
    'dialogMessage-visitReference-var-link': 'Bitte verwenden Sie das {link}, um mehr zu erfahren.',
    'drawerLabel-setParent': 'Machen Sie diese Aufgabe zu einer Unteraufgabe einer anderen Aufgabe.',
    'drawerPlaceholder-setParent': 'Finden Sie eine Aufgabe',
    'helpButton-keyboardShortcuts': 'Tastenkombinationen',
    'snippet-continue': 'Möchten Sie damit wirklich fortfahren?',
    'snippet-example': 'z. B. ',
    'snippet-save': 'Speichern',
    'snippet-tags': 'Tags',
    'toastButtton-undo': 'Rückgängig machen',
    'toastButtton-undoing': '(Wird rückgängig gemacht...)',
    'topbarTitle-replacement-var-nameOrEmail': 'Aufgaben von {nameOrEmail} ',
    'typeaheadItem-NoMatch': 'Keine Übereinstimmungen gefunden',
  },
  'en': {
    // Commenting the same or relevant UI from translations/en.bundle.js
    'arrowTitle-nextSubtask': 'Next subtask',
    'arrowTitle-previousSubtask': 'Previous subtask',
    'arrowTitle-subtasksDropdown': 'Subtasks', // u2c2cf
    'buttonTitle-backLink': 'Go back to what you were doing',
    'confirmMessage-abortConvertBySubtasks': 'A task containing one or more subtasks cannot be converted to a section.',
    'confirmMessage-convertToSection': 'Create a section with the same name and delete the original task.',
    'confirmMessage-convertToTask': 'Create a task with the same name and delete the original section.',
    'confirmMessage-deleteInformation': 'All task related information (due date, custom fields, description, tags, comments, etc.) will be deleted.',
    'confirmMessage-taskIdChanged': 'The task ID will be changed, so any links pointing to this task will become invalid.',
    'dialogButton-replaceText': 'Replace Text',
    'dialogButton-usePreset': 'Use Preset Cleanup',
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
    'dropdown-searchInInbox': 'Search in Tasks I Follow',
    'dropdown-searchInProject': 'Search in this Project',
    'dropdown-searchInTag': 'Search in this Tag',
    'dropdown-searchMyTasks': 'Search in My Tasks',
    'dropdown-searchThisUser': 'Search in this user\'s tasks',
    'helpButton-keyboardShortcuts': 'Keyboard shortcuts', // 5vkqjv
    'menuButton-replaceDescription': 'Replace text in description...',
    'menuButton-setParent': 'Convert to subtask(s)...',
    'shortcutDescription-backLink': 'Go back from Inbox',
    'shortcutDescription-convertSection': 'Convert task to section and vice versa',
    'shortcutDescription-siblingSubtasks': 'Jump to previous/next subtask',
    'shortcutDescription-subtasksDropdown': 'Show sibling subtasks',
    'snippet-continue': 'Do you want to continue?', // l3zrkk:[0,"Your import will be cancelled. Do you want to continue?"]
    'snippet-example': 'e.g. ', // "1mdunih":[0,"e.g., Priority, Stage, Status"]
    'snippet-save': 'Save', // "14vpdb5"
    'snippet-spacing': ' ',
    'snippet-tags': 'Tags', // "1utfvzg":[0,"Tags",null,!0]
    'toastButtton-undo': 'Undo', // 14vtr68
    'toastButtton-undoing': '(Undoing...)', // 63rova
    'toastContent-descriptionReplaced-var-task': 'Description replaced: {task}',
    'toastContent-setParent-var-task': 'Set a new parent task: {task}',
    'topbarTitle-replacement-var-nameOrEmail': '{nameOrEmail}’s Tasks ', // "31yy2c":[1,"{nameOrEmail}’s Tasks - {domainName}"]
    'typeaheadItem-NoMatch': 'No matches found', // 1h71d4n
  },
  'es': {
    'arrowTitle-subtasksDropdown': 'Subtareas',
    'dialogMessage-visitReference-var-link': 'Por favor visita la {link} para más información.',
    'drawerLabel-setParent': 'Transformar esta tarea en una subtarea de otra tarea.',
    'drawerPlaceholder-setParent': 'Encontrar una tarea',
    'helpButton-keyboardShortcuts': 'Atajos del teclado',
    'snippet-continue': '¿Deseas continuar?',
    'snippet-example': 'ej. ',
    'snippet-save': 'Guardar',
    'snippet-tags': 'Etiquetas',
    'toastButtton-undo': 'Deshacer',
    'toastButtton-undoing': '(Deshaciendo...)',
    'topbarTitle-replacement-var-nameOrEmail': 'Tareas de {nameOrEmail} ',
    'typeaheadItem-NoMatch': 'No se encontraron coincidencias',
  },
  'fr': {
    'arrowTitle-subtasksDropdown': 'Sous-tâches',
    'dialogMessage-visitReference-var-link': 'Veuillez consulter le {link} pour plus d\'informations.',
    'drawerLabel-setParent': 'Transformez cette tâche en sous-tâche d\'une autre tâche.',
    'drawerPlaceholder-setParent': 'Trouver une tâche',
    'helpButton-keyboardShortcuts': 'Raccourcis clavier',
    'snippet-continue': 'Souhaitez-vous continuer ?',
    'snippet-example': 'ex. ',
    'snippet-save': 'Enregistrer',
    'snippet-tags': 'Étiquettes',
    'toastButtton-undo': 'Annuler',
    'toastButtton-undoing': '(Annulation...)',
    'topbarTitle-replacement-var-nameOrEmail': 'Tâches de {nameOrEmail} ',
    'typeaheadItem-NoMatch': 'Aucune correspondance',
  },
  'ja': {
    'arrowTitle-nextSubtask': '次のサブタスク',
    'arrowTitle-previousSubtask': '前のサブタスク',
    'arrowTitle-subtasksDropdown': '前後のサブタスク', // translating differently
    'buttonTitle-backLink': '前の作業に戻る',
    'confirmMessage-abortConvertBySubtasks': 'サブタスクを持つタスクをセクションに変換することはできません。',
    'confirmMessage-convertToSection': '同名のセクションを作成して元のタスクを削除します。',
    'confirmMessage-convertToTask': '同名のタスクを作成して元のセクションを削除します。',
    'confirmMessage-deleteInformation': '期日、カスタムフィールド、説明、タグ、コメントなど、このタスクに関係する情報はすべて削除されます。',
    'confirmMessage-taskIdChanged': 'タスク ID も変更されるため、このタスクを指すリンクは無効になります。',
    'dialogButton-replaceText': 'テキストを置換',
    'dialogButton-usePreset': '事前設定済みクリーンアップ',
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
    'dropdown-searchInInbox': '自分がフォローしているタスクを検索',
    'dropdown-searchInProject': 'このプロジェクト内を検索',
    'dropdown-searchInTag': 'このタグ内を検索',
    'dropdown-searchMyTasks': 'マイタスクを検索',
    'dropdown-searchThisUser': 'このユーザーのタスクを検索',
    'helpButton-keyboardShortcuts': 'キーボードショートカット',
    'menuButton-replaceDescription': '説明テキストを置換...',
    'menuButton-setParent': 'サブタスクに変換...',
    'shortcutDescription-backLink': '受信トレイから戻る',
    'shortcutDescription-convertSection': 'タスクとセクションを相互に変換',
    'shortcutDescription-siblingSubtasks': '前/次のサブタスクに移動',
    'shortcutDescription-subtasksDropdown': '前後のサブタスクを表示',
    'snippet-continue': '続行してよろしいですか？',
    'snippet-example': '例: ',
    'snippet-save': '保存',
    'snippet-spacing': '', // no space between sentences
    'snippet-tags': 'タグ',
    'toastButtton-undo': '元に戻す',
    'toastButtton-undoing': '(元に戻しています...)',
    'toastContent-descriptionReplaced-var-task': '{task} の説明を置換しました。',
    'toastContent-setParent-var-task': '新しい親タスクを設定しました: {task}',
    'topbarTitle-replacement-var-nameOrEmail': '{nameOrEmail} のタスク',
    'typeaheadItem-NoMatch': '一致するタスクは見つかりませんでした', // translating differently
  },
  'pt': {
    'arrowTitle-subtasksDropdown': 'Subtarefas',
    'dialogMessage-visitReference-var-link': 'Visite o {link} para mais informações.',
    'drawerLabel-setParent': 'Tornar esta uma subtarefa de outra tarefa.',
    'drawerPlaceholder-setParent': 'Encontrar tarefa',
    'helpButton-keyboardShortcuts': 'Atalhos do teclado',
    'snippet-continue': 'Deseja continuar?',
    'snippet-example': 'ex. ',
    'snippet-save': 'Salvar',
    'snippet-tags': 'Tags',
    'toastButtton-undo': 'Desfazer',
    'toastButtton-undoing': '(Desfazendo...)',
    'topbarTitle-replacement-var-nameOrEmail': 'Tarefas de {nameOrEmail} ',
    'typeaheadItem-NoMatch': 'Nenhuma correspondência encontrada',
  }
};

const locStrings = {};