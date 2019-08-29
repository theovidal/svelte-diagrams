# svelte-diagrams

### Svelte components to create beautiful diagrams and compile them into native code

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![license](https://img.shields.io/github/license/exybore/svelte-diagrams)](#-license)
[![version](https://img.shields.io/npm/v/svelte-diagrams)](https://www.npmjs.com/package/svelte-diagrams?activeTab=versions)
[![code size on github](https://img.shields.io/github/languages/code-size/exybore/svelte-diagrams)](https://github.com/exybore/svelte-diagrams)

- [🔧 Setup](#setup)
- [📊 Components](#-components)
  - [Pie chart](#pie-chart)
- [📜 Credits](#-credits)
- [🔐 License](#-license)

## 🔧 Setup

First, install the library using NPM :

```bash
npm install --dev svelte-diagrams  # Using NPM
yarn add --dev svelte-diagrams     # Using Yarn
```

Then, include the CSS :

- Use a Rollup plugin, for example [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss), so you can directly include the `svelte-diagrams/dist/svelte-diagrams.css` file in your code;
- Import it from Github and use it as a HTML `link` tag : `https://raw.githubusercontent.com/exybore/svelte-diagrams/master/packages/svelte-diagrams/dist/svelte-diagrams.css`

## 📊 Components

### Pie chart

**Warning : this diagram uses the `conic-gradient` CSS property. For the moment, it doesn't work in some browsers. Check the [compatibility table](https://caniuse.com/#search=conic-gradient) for more information.**

Create nice and personalized pie charts using the `PieChart` component :

![pie chart](https://raw.githubusercontent.com/exybore/svelte-diagrams/master/assets/basic-pie-chart.png)

```html
<script>
  import { PieChart } from 'svelte-diagrams'

  let data = [63.37, 15.05, 4.49, 3.75, 3.57, 2.58]
  let legends = [
    {
      title: 'Chrome',
      color: '#ffc107'
    },
    {
      title: 'Safari',
      color: '#29b6f6'
    },
    {
      title: 'Firefox',
      color: '#ff5722'
    },
    {
      title: 'Samsung Internet',
      color: '#ab47bc'
    },
    {
      title: 'UC Browser',
      color: '#fff176'
    },
    {
      title: 'Opera',
      color: '#d32f2f'
    }
  ]
</script>

<PieChart {data} {legends} />
```

Properties :

| name    | description                                                                  | default           |
| ------- | ---------------------------------------------------------------------------- | ----------------- |
| data    | array of numbers, each representing a chunk of the pie                       | required property |
| legends | array of objects, which are legends of each chunk                            | required property |
| size    | custom size, can be any CSS size                                             | 150px             |
| style   | custom CSS to apply. Note : you can't overwrite the generated conic gradient | ''                |

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
