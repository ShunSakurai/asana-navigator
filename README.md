# Asana Navigator

Unofficial [Google Chrome](https://chrome.google.com/webstore/detail/asana-navigator/ckfdnhplhmbingcopckooenamecdckne) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/asana-navigator/) extension to enhance navigation for [Asana](https://asana.com/) -- less mouse moves and key presses.

## Feature list as well as to-do list

### Prep:
- [x] Register as a Chrome developer
- [x] Create GitHub project
- [x] Set up Chrome extension's content script structure
- [x] Write base XMLHttpRequest function → fetch()
- [x] Create the icon
- [x] Publish on Chrome Web Store after implementing MVP features
- [x] Publish as a Firefox Browser Add-on

#### Putting projects on top:
- [x] ~~[Show projects on top](https://forum.asana.com/t/ui-change-project-tabs-buttons-in-tasks-pushed-down/20394/208)~~
- [x] Happily drop this feature because of [the improved task pane layout](https://forum.asana.com/t/we-re-updating-our-task-pane/70641)

#### Going to sibling subtasks:
- [x] Show arrows to go to previous/next sibling subtasks
- [x] Show drop-down list to go to sibling subtasks (Shift+Tab+→)
- [x] Update only the right pane when navigating subtasks

#### Setting new parent tasks:
- [x] [Set new parent task from the toolbar](https://forum.asana.com/t/convert-task-to-sub-task-and-vice-versa/12072/7)
- [x] Search for task ID when the input is an integer
- [x] Show information such as projects and completed/incomplete
- [x] ~~Convert multiple tasks to subtasks~~　Not working

#### Replacing text:
- [x] Remove duplicate links and replace HTML entities in the task description (Tab+E)
- [x] [Replace text in the task description (Tab+E)](https://forum.asana.com/t/34586/6)

#### Convecting task to section and vice versa:
- [x] ~~[Convert task to section and vice versa (Tab+: or Shift+Tab+:)](https://forum.asana.com/t/tab-n-our-new-shortcut-to-create-sections/38525/207)~~ Not fully working
- [x] ~~Support task/section conversion in the new list/board switchable projects -- [Watch it in action](https://youtu.be/BJz_p7d-WAE)~~ Not fully working

#### Keyboard shortcuts:
- [x] Implement keyboard shortcuts to go to sibling subtasks (Shift+Tab+↑/↓)
- [x] [Implement keyboard shortcut to set new parent task (Tab+G)](https://forum.asana.com/t/convert-task-to-sub-task-and-vice-versa/12072/10)
- [x] Show additional keyboard shortcuts in the list (Cmd/Ctrl+/)
- [x] Add keyboard shortcuts to attach files (Tab+V and Tab+1/2/3/4/5)
- [x] Add a keyboard shortcut to open more actions (Tab+.)

#### More seamless UI:
- [x] Display undo toast on bottom left
- [x] ~~Support other languages~~ Limited support

#### Others:
- [x] Write an options page to enable/disable each feature
- [x] Implement donation button
- [x] [Search tasks in a context-aware way, from my tasks, inbox, current open project~~, tag, user, or team~~ or user in the workspace (Advanced search)](https://forum.asana.com/t/when-searching-from-within-a-project-only-show-results-from-within-that-project/45638/5)
- [x] [Move back from inbox to where the user has left off (Tab+J)](https://forum.asana.com/t/34586/10)
- [ ] Display preview of @mentioned tasks
- [ ] Display subtasks in calendar and/or timeline

## Usage

Chrome:
- Install it from the [Chrome Web Store](https://chrome.google.com/webstore/detail/asana-navigator/ckfdnhplhmbingcopckooenamecdckne)
- You can also `git clone` this repository (or download the repository as a zip file) and load the folder to Google Chrome to install it as a developer
- The options are accessible by clicking the icon on the toolbar or by going to [chrome://extensions](chrome://extensions) > Asana Navigator > Details > Extension options

Firefox:
- Install it from the [Firefox AMO store](https://addons.mozilla.org/en-US/firefox/addon/asana-navigator/)
- Asana Navigator doesn't work with Firefox if added as a temporary add-on, because of the limitation of `chrome.storage.sync`
- The options are accessible from [about:addons](about:addons) > Asana Navigator > Preferences

Common:
- The features are automatically enabled when you are on an Asana task page
- Please reload the Asana task page if this extension doesn't work well, especially after it was updated to a new version
- In incognito mode, features that interact with Asana API don't work

## Special thanks

I was highly inspired and motivated by Amit's [AsanaNG](https://github.com/amitg87/asana-chrome-plugin) project. That extension is very nicely made. I learned a lot from him and his code.

### Motivation and design decisions

- I love Asana and use it every day to manage everything from personal to work stuff. It’s already great but I’m an efficiency-oriented person so I wanted to make it a little quicker. I hope some day Asana will implement those features on their own.
- Amit's extension is for working with Asana regardless of what webpage you are on. My extension is focused on working in Asana task webpages, using content scripts and DOM methods.
- By doing so, I can implement features seamlessly using the same classes/CSS used by Asana. This involves a lot of "Inspect" actions on Asana task pages.
- I'd like to make all tools I create be customizable to each user's preference. Therefore, I created an options page where users can switch features on/off.

## Privacy policy and terms of use

We don't collect your data. We don't have our server to store, use, and share such information. We only use your Asana data (URLs, resource IDs, names, task description, etc.) to make API calls to Asana through HTTPS. All communications are between you and Asana API. All options are saved to your browser, not in other places.

The extension requires the following permissions:

- `https://app.asana.com/*` permission is needed to be active on Asana Web app
- `activeTab` permission is needed to reload all Asana Web app pages when the extension is updated
- `storage` permission is needed to save your options to the browser
- `tabs` permission is needed to be compatible with Firefox. The extension doesn't work as expected with only activeTab permission

I try my best to maintain the quality and safety of this extension, but please use it at your own risk. The author doesn't take any responsibility for any damage caused by use of this extension.

## Feedback and contribution

I'd love to hear from users and developers.
Please feel free to post feature requests, bug reports, and questions through the [Chrome Web Store](https://chrome.google.com/webstore/detail/asana-navigator/ckfdnhplhmbingcopckooenamecdckne), [addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/addon/asana-navigator/), [GitHub Issues](https://github.com/ShunSakurai/asana-navigator/issues), or [Asana Community Forum](https://forum.asana.com/t/34586). I'd also welcome pull requests and help with translating the UI.

### Localization style guide:
- Follow the style in localized UI in Asana as much as possible
- EN: Capitalize UI elements in the menu lists and the keyboard shortcut list, e.g. "Mark as **M**ilestone" and "Jump to **I**nbox."
- JP: Insert space between half-width character and full-width character. Don't insert space between Katakana compounds. Use full-width characters for "?" and "!" in UI translation, use half-width characters for other symbols and occasions

## License

[MIT License](https://github.com/ShunSakurai/asana-navigator/blob/master/LICENSE)
