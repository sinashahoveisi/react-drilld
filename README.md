# react-drilld

> The best DrillDown for folder or graph or tree structure package for react

[![NPM](https://img.shields.io/npm/v/drilld.svg)](https://www.npmjs.com/package/react-drilld) 
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![CircleCI branch](https://img.shields.io/circleci/project/github/atlassian/react-drilld/master.svg)](https://circleci.com/gh/atlassian/react-drilld/tree/master)

## What is this?

This package is a [React] component that can display graphic, tree or folder structures as a drill-down technique.
You can call the data simply or using the api and display it to the users.
Users can now easily analyze unstructured data that is difficult to understand and select their items in an analyzed and comprehensible way.


## Install

install with [npm]
```sh
npm install react-drilld
```

install with [yarn]
```sh
yarn add react-drilld
```

## Usage

```tsx
import {DrillD} from 'react-drilld';
```
or
```tsx
import DrillD from 'react-drilld';
```

## Examples

simple example for show simple folder structure data

![simple][]

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

## License
[MIT][license] © [Sina Shahoveisi][author]

[react]: http://reactjs.org

[npm]: https://docs.npmjs.com/cli/install

[yarn]: https://docs.yarn.com/cli/install

[author]: https://github.com/sinashahoveisi

[simple]: https://react-drilld.sinasho.ir/assets/simple.gif

[license]: license