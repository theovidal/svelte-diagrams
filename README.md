# svelte-diagrams

### Svelte components to create beautiful diagrams and compile them into native code

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![license](https://img.shields.io/github/license/exybore/svelte-diagrams)](#-license)
[![version](https://img.shields.io/npm/v/svelte-diagrams)](https://www.npmjs.com/package/svelte-diagrams?activeTab=versions)
[![code size on github](https://img.shields.io/github/languages/code-size/exybore/svelte-diagrams)](https://github.com/exybore/svelte-diagrams)

## 📦 Packages

This repository is made of multiple packages, and are all located under the `packages` directory.

- `svelte-diagrams` : this is the main package, which contains all the library
- `testing` : this is the testing application for the library

## 💻 Developing

Make sure you have [node.js 10 or later](https://nodejs.org), and [lerna](https://github.com/lerna/lerna).

First of all, install all the required dependencies :

```bash
npm install   # Using NPM
yarn install  # Using Yarn
```

Then, bootstrap the dependencies using lerna :

```bash
lerna bootstrap
```

To build the library, go into its folder and run the `build` script :

```bash
npm run build  # Using NPM
yarn build     # Using Yarn
```

To run the testing app with live reload, go into its folder and run the `dev` script :

```bash
npm run dev  # Using NPM
yarn dev     # Using Yarn
```

## 📜 Credits

- Framework : [Svelte](https://svelte.dev)
- Maintainer : [Exybore](https://github.com/exybore)

## 🔐 License

MIT License

Copyright (c) 2019 Exybore

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
