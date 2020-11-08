# Object Visualizer

Visualize the JSON object to the DOM.

![E2E on Chrome](https://github.com/iendeavor/object-visualizer/workflows/E2E%20on%20Chrome/badge.svg)
![visitors](https://visitor-badge.glitch.me/badge?page_id=iendeavor.object-visualizer)

## Live Demo

[![As same as Chrome's object tree](./screenshot.png)](https://codesandbox.io/s/object-visualizer-5bji4)

## Feature

### Reactivity

### Fully Configurable

- option.getKeys: customize visible keys in any nested data
- option.expandOnCreatedAndUpdated: expand or collapse after created or updated

### Expand/Collapse Hot Keys

- Recursive expand `Meta+Click`
- Recursive collapse `Meta+Shift+Click`

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

1. Import the **mount** function from the module

```js
import { mount } from "object-visualizer";
```

2. Query the HTML element to inject the JSON, e.g. `<pre id="app"></pre>`

```js
//Vanilla JS
const preEl = document.getElementById("app");
//Vanilla JS new dom api
const preEl = document.querySelector("#app");
//jQuery
const preEl = $("#app");
```

3. Have your data on a variable

```js
const data = {};
```

> Optional: To make DOM reactivity, just wrap your data via reactive function before mount it.

```js
import { reactive } from "object-visualizer";

const data = reactive({});
```

4. Use mount function

```js
mount(data, preEl);
```

5. Thats it!!

## Options

```js
// path will be string[]
const options = {
  getKeys: (object, path) => {
    return Object.keys(object).sort();
  },
  expandOnCreatedAndUpdated: (path) => {
    return true;
  },
};

mount(data, preEl, options);
```

## License

[MIT](https://github.com/iendeavor/object-visualizer/blob/master/LICENSE)

## Donate

If this library helped you out feel free to donate.

<a href="https://www.buymeacoffee.com/iendeavor"><img src="https://img.buymeacoffee.com/button-api/?text=Help me keep working on OSS&emoji=&slug=iendeavor&button_colour=BD5FFF&font_colour=ffffff&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00"></a>
