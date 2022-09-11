# Object Visualizer

Visualize the JSON object to the DOM.

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

```
$ npm install object-visualizer
```

```html
<script src="https://unpkg.com/object-visualizer"></script>
<link
  type="text/css"
  rel="stylesheet"
  href="https://unpkg.com/object-visualizer/dist/index.css"
/>
```

## How to use

1. Import component:

   ```ts
   import { ObjectVisualizer } from 'object-visualizer'
   ```

   or

   ```js
   const ObjectVisualizer = window.ObjectVisualizer.ObjectVisualizer
   ```

2. Mount:

   ```ts
   const data = fetch('https://jsonplaceholder.typicode.com/users')
   const const app = Vue.createApp(ObjectVisualizer, {
     // required props:
     data,
     // optional props with default values:
     rootName: '',
     expandOnCreatedAndUpdated: (path: string[]) => false,
     getKeys: (object: Record<string, any>, path: string[]) => Object.keys(object),
     uid: getCurrentInstance()?.uid
   })
   app.mount(document.getElementById('app'))
   ```

## License

[MIT](https://github.com/iendeavor/object-visualizer/blob/master/LICENSE)

## Donate

If this library helped you out feel free to donate.

<a href="https://www.buymeacoffee.com/iendeavor"><img src="https://img.buymeacoffee.com/button-api/?text=Help me keep working on OSS&emoji=&slug=iendeavor&button_colour=BD5FFF&font_colour=ffffff&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00"></a>
