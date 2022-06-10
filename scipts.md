# explain scripts

  ```json
  {
  "scripts": {
    "bootstrap": "lerna bootstrap",
    "publish": "lerna publish",
    "link": "lerna link",
    "changed": "lerna changed",
    "start": "lerna run --parallel start",
    "build": "lerna run build --scope react-drilld",
    "clean": "lerna run clean --scope react-drilld",
    "clean:all": "lerna clean",
    "watch": "lerna run watch --scope react-drilld",
    "package": "lerna exec --scope react-drilld -- npm pack"
  }
  }
  ```
- Bootstrap the packages in the current Lerna repo. Installing all their dependencies and linking any cross-dependencies.
```sh
npm run bootstrap
```
- Create a new release of the packages that have been updated. Prompts for a new version and updates all the packages on git and npm.
```sh
npm run publish
```
- Symlink together all Lerna `packages` that are dependencies of each other in the current Lerna repo.
```sh
npm run link
```
- Check which packages have changed since the last release.
```sh
npm run changed
```
- Remove all `react-drilld-*.tgz` file from react-drilld package.
```sh
npm run clean
```
- Remove the `node_modules` directory from all packages.
```sh
npm run clean:all
```