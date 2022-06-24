# explain scripts

  ```json
  {
  "scripts": {
    "prepack": "yarn build",
    "prebuild": "yarn clean",
    "start": "rollup -cw",
    "build": "rollup -c",
    "clean": "rimraf dist react-drilld-*.tgz",
    "storybook": "start-storybook -p 6006",
    "build-storybook": "build-storybook"
    }
  }
  ```
- build project.
```sh
npm run prepack
```
---
- clean project
```sh
npm run prebuild
```
---
- watch project for build when changed
```sh
npm run start
```
---
- build project for publish
```sh
npm run build
```
---
- clean project
```sh
npm run clean
```
---
- start storybook project
```sh
npm run storybook
```
---
- build storybook project
```sh
npm run build-storybook
```
---