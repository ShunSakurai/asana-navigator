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
- [x] Show projects on top
- [x] Place project section selectors on top

#### Going to sibling subtasks:
- [x] Show arrows to go to previous/next sibling subtasks

#### Setting new parent tasks:
- [x] Set new parent task from the toolbar

#### Publishing:
- [x] Publish on Chrome Web Store

### Later:

#### Keyboard shortcuts:
- [x] Implement keyboard shortcuts to go to sibling subtasks (Shift+Tab+↑/↓)
- [x] Implement keyboard shortcut to set new parent task (Tab+G)
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
- [ ] Search in the current open page, e.g. "search in this project"
- [ ] Use tool tips with black background
- [x] Update only the right pane when navigating subtasks
- [x] Remove duplicate links and replace HTML entities in the task description (Tab+E)
- [x] Replace text in the task description (Tab+E)
- [x] Support other languages
- [x] Implement donation button
- [x] Convert multiple tasks to subtasks
- [x] Move back from inbox to where the user has left off (Tab+J)
- [x] Convert task to section and vice versa (Tab+:)

## Usage

- Install it from the [Chrome Web Store](https://chrome.google.com/webstore/detail/asana-navigator/ckfdnhplhmbingcopckooenamecdckne)
- You can also `git clone` this repository and load the folder to Google Chrome to install it as a developer
- The features are automatically enabled when you are on an Asana task page. Please reload the Asana task page if this extension doesn't work well.
- Options are accessible by clicking the icon on the toolbar or by going to [chrome://extensions](chrome://extensions) > Asana Navigator > Details > Extension options

## Special thanks

I was highly inspired and motivated by Amit's [AsanaNG](https://github.com/amitg87/asana-chrome-plugin) project. That extension is very nicely made. I learned a lot from him and his code.
Thank you also to [Hiro-san](https://github.com/hiroyamada/) for giving me advice when I was struggling to implement the subtask dropdown feature.

## Design decisions

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
- JP: Insert space between half-width character and full-width character. Don't insert space between Katakana compounds. Use full-width characters for "?" and "!" in UI translation, use half-width characters for other symbols and occasions
- ES, FR, PT: Compared to EN where menu items often use capital letters such as "Add to **P**roject (Tab+P)", these languages tend to use lower letters such as "Ajouter à un **p**rojet (Tab+P)"

## License

[MIT License](https://github.com/ShunSakurai/asana-navigator/blob/master/LICENSE)
