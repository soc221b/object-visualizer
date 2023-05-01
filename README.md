# Object Visualizer

A vue component to visualize the JSON object to the DOM.

## Live Demo

[![As same as Chrome's object tree](./dark.png)](https://codesandbox.io/s/object-visualizer-5bji4)
[![As same as Chrome's object tree](./light.png)](https://codesandbox.io/s/object-visualizer-5bji4)

## Feature

- `getKeys`: customize visible keys in any nested data
- `expandOnCreatedAndUpdated`: expand or collapse after created or updated

  > Starting from v4.0.0, this feature is only available for objects due to performance issues.

  - Recursive expand `Meta+Click`
  - Recursive collapse `Meta+Shift+Click`

- Light/Dark mode

## Installation

### NPM

```
$ npm install object-visualizer
```

```ts
import { ObjectVisualizer } from 'object-visualizer'
import 'object-visualizer/dist/index.min.css'
```

### CDN

```html
<script src="https://unpkg.com/object-visualizer"></script>
<link
  type="text/css"
  rel="stylesheet"
  href="https://unpkg.com/object-visualizer/dist/index.min.css"
/>

<script>
  const { ObjectVisualizer } = window.ObjectVisualizer
</script>
```

## Usage

```vue
<ObjectVisualizer
  :data="['foo', 'bar']"
  rootName="Data"
  :expandOnCreatedAndUpdated="(path) => false"
  :getKeys="(object, path) => Object.keys(object)"
></ObjectVisualizer>
```

## About

<a href="https://www.buymeacoffee.com/iendeavor" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

Distributed under the MIT license. See LICENSE for more information.

https://github.com/iendeavor
