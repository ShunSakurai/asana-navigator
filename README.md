# Asana Navigator

Google Chrome extension to enhance navigation for [Asana](https://asana.com/) tasks

## Feature list as well as to-do list

### Prep:
- [x] Register as a Chrome developer
- [x] Create GitHub project
- [x] Set up Chrome extension's content script structure
- [x] Write base XMLHttpRequest function
- [x] Create the icon

### MVP:

#### Putting projects on top:
- [x] Display projects on top
- [ ] Place project section selectors on top

#### Going to sibling subtasks:
- [ ] Display drop-down lists to go to sibling subtasks

- [ ] Publish on Chrome Web Store

### Later:

#### Going to sibling subtasks:
- [ ] Implement keyboard shortcuts to go to sibling subtasks

#### Setting new parent tasks:
- [ ] Set new parent from the toolbar
- [ ] Implement keyboard shortcut to set new parent

#### Others:
- [ ] Create SVG icon for new parent
- [ ] Write options page to enable/disable each feature

### Maybe later:
- [ ] Create subtasks in bulk
- [ ] Convert tasks into subtasks in bulk
- [ ] Remove duplicate links in the task description
- [ ] Implement donation page

## Usage

- Install it from [Chrome Web Store]()
- You can also `git clone` this repository and load the folder to Google Chrome to install it as a developer
- The features are automatically enabled when you are on an Asana task page
- Options are accessible from [chrome://extensions](chrome://extensions) > Asana Navigator > Details > Extension options

## Special thanks

I was highly inspired and motivated by Amit's [AsanaNG](https://github.com/amitg87/asana-chrome-plugin) project. That extension is very nicely made. I learned a lot from him and his code.

## Design decisions

- Amit's extension is for working with Asana regardless of what webpage you are on. My extension is focused on working in the Asana task webpages, using content script and DOM methods.
- By doing so, I can use simple HTTP requests, rather than complicated API calls including authentication.
- Also by doing so, I can implement features seamlessly using same classes/CSS used by Asana.
- I'd like to make all tools I create to be minutely customizable to each user's preference. So I'll create an options page where users can switch features on/off.
- I'm using pure JavaScript as a practice, rather than using frameworks/libraries.

## Feedback and contribution

I'd love to hear from the users and developers.
Please feel free to post feature requests, bug reports, and questions through [Chrome Web Store](), [GitHub Issues](https://github.com/ShunSakurai/asana-navigator/issues), or my [Asana project](https://app.asana.com/0/777908652160115/777908652160115). I'd also welcome pull requests.

## License

[MIT License](https://github.com/ShunSakurai/asana-navigator/blob/master/LICENSE)
