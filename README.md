# Asana Navigator

Unofficial [Google Chrome extension](https://chrome.google.com/webstore/detail/asana-navigator/ckfdnhplhmbingcopckooenamecdckne) to enhance navigation for [Asana](https://asana.com/) tasks

## Feature list as well as to-do list

### Prep:
- [x] Register as a Chrome developer
- [x] Create GitHub project
- [x] Set up Chrome extension's content script structure
- [x] Write base XMLHttpRequest function
- [x] Create the icon

### MVP:

#### Putting projects on top:
- [x] [Show projects on top](https://forum.asana.com/t/ui-change-project-tabs-buttons-in-tasks-pushed-down/20394/208)
- [x] Place project section selectors on top

#### Going to sibling subtasks:
- [x] Show arrows to go to previous/next sibling subtasks

#### Setting new parent tasks:
- [x] [Set new parent task from the toolbar](https://forum.asana.com/t/convert-task-to-sub-task-and-vice-versa/12072/7)

#### Publishing:
- [x] Publish on Chrome Web Store

### Later:

#### Keyboard shortcuts:
- [x] Implement keyboard shortcuts to go to sibling subtasks (Shift+Tab+↑/↓)
- [x] [Implement keyboard shortcut to set new parent task (Tab+G)](https://forum.asana.com/t/convert-task-to-sub-task-and-vice-versa/12072/10)
- [x] Show the new key combinations in Keyboard Shortcuts list

#### Going to sibling subtasks:
- [x] Show drop-down list to go to sibling subtasks (Shift+Tab+→)

#### Setting new parent tasks:
- [x] Search for task ID when the input is an integer
- [x] Show information such as projects and completed/incomplete

#### More seamless UI:
- [x] Display undo toast on bottom left

#### Others:
- [x] Write an options page to enable/disable each feature

### Maybe later:
- [x] [Search tasks in a context-aware way, from my tasks, inbox, current open project, tag, user, or team in organization (Advanced search)](https://forum.asana.com/t/when-searching-from-within-a-project-only-show-results-from-within-that-project/45638/5)
- [ ] Use tool tips with black background
- [x] Update only the right pane when navigating subtasks
- [x] Remove duplicate links and replace HTML entities in the task description (Tab+E)
- [x] [Replace text in the task description (Tab+E)](https://forum.asana.com/t/asana-navigator-unofficial-efficiency-google-chrome-extension-to-enhance-navigation-for-asana-tasks/34586/6)
- [x] Support other languages
- [x] Implement donation button
- [x] Convert multiple tasks to subtasks
- [x] [Move back from inbox to where the user has left off (Tab+J)](https://forum.asana.com/t/asana-navigator-unofficial-efficiency-google-chrome-extension-to-enhance-navigation-for-asana-tasks/34586/10)
- [x] [Convert task to section and vice versa (Tab+: or Shift+Tab+:)](https://forum.asana.com/t/tab-n-our-new-shortcut-to-create-sections/38525/207) -- [Watch it in action](https://www.youtube.com/watch?v=4V_4FtMLZZk)
- [ ] Support task/section conversion in the new list/board switchable projects
- [x] Jump to sibling subtasks even when the arrows fail to be added
- [ ] Display subtasks in calendar and/or timeline
- [ ] Support Command/Ctrl+Shift+Up/Down arrow in the new list/board project structure

## Usage

- Install it from the [Chrome Web Store](https://chrome.google.com/webstore/detail/asana-navigator/ckfdnhplhmbingcopckooenamecdckne)
- You can also `git clone` this repository and load the folder to Google Chrome to install it as a developer
- The features are automatically enabled when you are on an Asana task page. Please reload the Asana task page if this extension doesn't work well.
- Options are accessible by clicking the icon on the toolbar or by going to [chrome://extensions](chrome://extensions) > Asana Navigator > Details > Extension options

## Special thanks

I was highly inspired and motivated by Amit's [AsanaNG](https://github.com/amitg87/asana-chrome-plugin) project. That extension is very nicely made. I learned a lot from him and his code.
Thank you also to [Hiro-san](https://github.com/hiroyamada/) for giving me advice when I was struggling to implement the subtask dropdown feature.

### Motivation and design decisions

- I love Asana and use it every day to manage everything from personal to work stuff. It’s already great but I’m an efficiency-oriented person so I wanted to make it a little quicker. I hope some day Asana will implement those features on their own.
- Amit's extension is for working with Asana regardless of what webpage you are on. My extension is focused on working in Asana task webpages, using content scripts and DOM methods.
- By doing so, I can implement features seamlessly using the same classes/CSS used by Asana. This involves a lot of "Inspect" actions on Asana task pages.
- I'd like to make all tools I create be customizable to each user's preference. Therefore, I created an options page where users can switch features on/off.

## Privacy policy and terms of use

We don't store your data. We physically can't. (Borrowed part from [here](https://github.com/amitg87/asana-chrome-plugin/wiki/Privacy-policy).) All communications are between you and Asana API. All options are saved to your Google Chrome, not on our servers.

I try my best to maintain the quality and safety of this extension, but please use it at your own risk. The author doesn't take any responsibility for any damage caused by use of this extension.

## Feedback and contribution

I'd love to hear from users and developers.
Please feel free to post feature requests, bug reports, and questions through the [Chrome Web Store](https://chrome.google.com/webstore/detail/asana-navigator/ckfdnhplhmbingcopckooenamecdckne), [GitHub Issues](https://github.com/ShunSakurai/asana-navigator/issues), or [Asana Community Forum](https://forum.asana.com/t/34586). I'd also welcome pull requests and help with translating the UI.

### Localization style guide:
- Follow the style in localized UI in Asana as much as possible
- EN: Capitalize UI elements in the menu lists and the keyboard shortcut list, e.g. "Mark as **M**ilestone" and "Jump to **I**nbox."
- JP: Insert space between half-width character and full-width character. Don't insert space between Katakana compounds. Use full-width characters for "?" and "!" in UI translation, use half-width characters for other symbols and occasions

## License

[MIT License](https://github.com/ShunSakurai/asana-navigator/blob/master/LICENSE)
