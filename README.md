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
- [x] Place project section selectors on top

#### Going to sibling subtasks:
- [x] Display arrows to go to previous/next sibling subtasks

#### Setting new parent tasks:
- [ ] Create SVG icon for new parent
- [ ] Set new parent from the toolbar

#### Publishing:
- [ ] Publish on Chrome Web Store

### Later:

#### Keyboard shortcuts:
- [x] Implement keyboard shortcuts to go to sibling subtasks (Tab+J/K)
- [ ] Implement keyboard shortcut to set new parent (Tab+R)
- [ ] Display the new key combinations in Keyboard Shortcuts list

#### Going to sibling subtasks:
- [ ] Display drop-down list to go to sibling subtasks

#### More seamless UI:
- [ ] Use tool tips with black background

#### Others:
- [ ] Write an options page to enable/disable each feature
- [ ] Take screenshots and capture video

### Maybe later:
- [ ] Create subtasks in bulk
- [ ] Convert tasks into subtasks in bulk
- [ ] Remove duplicate links in the task description
- [ ] Implement donation page

## Usage

- Install it from the [Chrome Web Store]()
- You can also `git clone` this repository and load the folder to Google Chrome to install it as a developer
- The features are automatically enabled when you are on an Asana task page
- Options are accessible by clicking the icon on the toolbar or by going to [chrome://extensions](chrome://extensions) > Asana Navigator > Details > Extension options

## Special thanks

I was highly inspired and motivated by Amit's [AsanaNG](https://github.com/amitg87/asana-chrome-plugin) project. That extension is very nicely made. I learned a lot from him and his code.

## Design decisions

- Amit's extension is for working with Asana regardless of what webpage you are on. My extension is focused on working in Asana task webpages, using a content script and DOM methods.
- By doing so, I can implement features seamlessly using the same classes/CSS used by Asana.
- I'd like to make all tools I create be customizable to each user's preference. Therefore, I'll create an options page where users can switch features on/off.

## Feedback and contribution

I'd love to hear from users and developers.
Please feel free to post feature requests, bug reports, and questions through the [Chrome Web Store](), [GitHub Issues](https://github.com/ShunSakurai/asana-navigator/issues), or my [Asana project](https://app.asana.com/0/777908652160115/777908652160115). I'd also welcome pull requests.

## License

[MIT License](https://github.com/ShunSakurai/asana-navigator/blob/master/LICENSE)
