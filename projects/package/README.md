# react-drilld

> The best DrillDown for folder or graph or tree structure package for react

![GitHub branch checks state](https://img.shields.io/github/checks-status/sinashahoveisi/react-drilld/master?logo=github&style=plastic)
![GitHub issues](https://img.shields.io/github/issues/sinashahoveisi/react-drilld?logo=github&style=plastic)
![GitHub](https://img.shields.io/github/license/sinashahoveisi/react-drilld?style=plastic)
![npm](https://img.shields.io/npm/v/react-drilld?logo=npm&style=plastic)
![Website](https://img.shields.io/website?down_message=offline&style=plastic&up_message=online&url=https%3A%2F%2Fsinasho.ir)
![GitHub language count](https://img.shields.io/github/languages/count/sinashahoveisi/react-drilld?logo=TypeScript&style=plastic)
![GitHub top language](https://img.shields.io/github/languages/top/sinashahoveisi/react-drilld?logo=TypeScript&style=plastic)
![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/sinashahoveisi/react-drilld?style=plastic)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/sinashahoveisi/react-drilld?style=plastic)
![GitHub all releases](https://img.shields.io/github/downloads/sinashahoveisi/react-drilld/total?logo=github&style=plastic)
---

## What is this?

This package is a [React] component that can display graphic, tree or folder structures as a drill-down technique.
You can call the data simply or using the api and display it to the users.
Users can now easily analyze unstructured data that is difficult to understand and select their items in an analyzed and comprehensible way.

---

### Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Example](#examples)
    - [Simple](#simple)
    - [Advance](#advance)
- [Demo](#demo)
- [Documentation](#documentation)
- [Creator](#creator)
- [License](#license)

---

## Installation
You can install this package in two ways simultaneously

install with [npm]
```sh
npm install react-drilld
```

install with [yarn]
```sh
yarn add react-drilld
```
---

## Usage

```tsx
import {DrillD} from 'react-drilld';
```
or
```tsx
import DrillD from 'react-drilld';
```
---

## Examples

### Simple

simple example for show simple folder structure data

![simple]

```tsx
import React, { Component } from 'react';
import {DrillD} from 'react-drilld';

function App() {
  return (
    <div className="App">
      <DrillD 
          title="sina" 
          folders={[
              {
                  name: 'Folder A',
                  children: [{name: 'File A1'}, {name: 'File A2'}, {name: 'Folder AA', children: [{name: 'File AA1'}]}]
              },
              {
                  name: 'File 1'
              },
              {
                  name: 'Folder B',
                  children: [{name: 'File B1'}, {name: 'File A2'}, {name: 'Folder BB', children: [{name: 'File BB1'}]}]
              },
          ]} 
      />
    </div>
  );
}
```
### Advance

---

## Demo

[A demo is worth a thousand words](https://react-drild.sinasho.ir)

---

## Documentation

Check the [documentation](https://react-drild.sinasho.ir) to get you started!

---

## Creator

Alex Reardon [@sinashahoveisi](https://sinasho.ir)

> I love programming and I am interested in popular frameworks or programming languages and I am currently coding with JavaScript and React framework.

---

## License
[MIT][license] © [Sina Shahoveisi][author]

[react]: http://reactjs.org

[npm]: https://docs.npmjs.com/cli/install

[yarn]: https://docs.yarn.com/cli/install

[author]: https://github.com/sinashahoveisi

[simple]: https://react-drilld.sinasho.ir/assets/simple.gif

[license]: license