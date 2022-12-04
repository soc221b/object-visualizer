# Object Visualizer

A vue component to visualize the JSON object to the DOM.

![E2E on Chrome](https://github.com/iendeavor/object-visualizer/workflows/E2E%20on%20Chrome/badge.svg)
![visitors](https://visitor-badge.glitch.me/badge?page_id=iendeavor.object-visualizer)
[![donate](https://img.shields.io/badge/buy%20me%20a%20coffee-donate-orange)](https://www.paypal.com/paypalme/iendeavor)

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

## License

[MIT](https://github.com/iendeavor/object-visualizer/blob/master/LICENSE)

## Donate

If this library helped you out feel free to donate.

<a href="https://www.buymeacoffee.com/iendeavor"><img src="https://img.buymeacoffee.com/button-api/?text=Help me keep working on OSS&emoji=&slug=iendeavor&button_colour=BD5FFF&font_colour=ffffff&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00"></a>
