'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');

const toString = (...args) =>
  Object.prototype.toString.call(...args).slice(8, -1);

var UndefinedWrapper = {
  props: {
    data: {
      required: true,
      validator(data) {
        return toString(data) === "Undefined";
      },
    },
    name: {
      required: true,
      type: String,
    },
  },
  template: `
    <span class="undefined">
      <span class="key">{{ name }}</span>
      <span v-if="name !== ''" class="separator">:&nbsp;</span>
      <span class="value">undefined</span>
    </span>
  `.trim(),
};

var NullWrapper = {
  props: {
    data: {
      required: true,
      validator(data) {
        return toString(data) === "Null";
      },
    },
    name: {
      required: true,
      type: String,
    },
  },
  template: `
    <span class="null">
      <span class="key">{{ name }}</span>
      <span v-if="name !== ''" class="separator">:&nbsp;</span>
      <span class="value">null</span>
    </span>
  `.trim(),
};

var BooleanWrapper = {
  props: {
    data: {
      required: true,
      validator(data) {
        return toString(data) === "Boolean";
      },
    },
    name: {
      required: true,
      type: String,
    },
  },
  template: `
    <span class="boolean">
      <span class="key">{{ name }}</span>
      <span v-if="name !== ''" class="separator">:&nbsp;</span>
      <span class="value">{{ data }}</span>
    </span>
  `.trim(),
};

var NumberWrapper = {
  props: {
    data: {
      required: true,
      validator(data) {
        return toString(data) === "Number";
      },
    },
    name: {
      required: true,
      type: String,
    },
  },
  template: `
    <span class="number">
      <span class="key">{{ name }}</span>
      <span v-if="name !== ''" class="separator">:&nbsp;</span>
      <span class="value">{{ data }}</span>
    </span>
  `.trim(),
};

var StringWrapper = {
  props: {
    data: {
      required: true,
      validator(data) {
        return toString(data) === "String";
      },
    },
    name: {
      required: true,
      type: String,
    },
  },
  template: `
    <span class="string">
      <span class="key">{{ name }}</span>
      <span v-if="name !== ''" class="separator">:&nbsp;</span>
      <span class="quotes">"</span>
      <span class="value">{{ data }}</span>
      <span class="quotes">"</span>
    </span>
  `.trim(),
};

function useExpand(props = { collapseSignal, expandSignal }) {
  const isExpanding = vue.ref(false);
  const expandOrCollapse = () => {
    isExpanding.value = !isExpanding.value;
  };

  const innerCollapseSignal = vue.ref(false);
  const collapseRecursive = (ev) => {
    isExpanding.value = false;
    innerCollapseSignal.value = !innerCollapseSignal.value;
  };
  vue.watch(() => props.collapseSignal, collapseRecursive);

  const innerExpandSignal = vue.ref(false);
  const expandRecursive = () => {
    isExpanding.value = true;
    innerExpandSignal.value = !innerExpandSignal.value;
  };
  vue.watch(() => props.expandSignal, expandRecursive);

  const handleClick = (ev) => {
    if (ev.metaKey === true && ev.shiftKey === true) {
      collapseRecursive();
    } else if (ev.metaKey === true) {
      expandRecursive();
    } else {
      expandOrCollapse();
    }
  };

  vue.watch(
    () => props.data,
    () => {
      const [shouldExpand, isRecursive] = props.expandOnCreatedAndUpdated(
        props.path
      );
      if (shouldExpand) {
        if (isRecursive) expandRecursive();
        else isExpanding.value = true;
      } else {
        if (isRecursive) expandRecursive();
        else isExpanding.value = false;
      }
    },
    { immediate: true }
  );

  return {
    isExpanding,
    innerCollapseSignal,
    innerExpandSignal,
    handleClick,
  };
}

var ArrayWrapper = {
  name: "array-wrapper",
  props: {
    path: {
      required: true,
      validator(path) {
        return (
          toString(path) === "Array" &&
          path.every(
            (key) => toString(key) === "String" || toString(key) === "Number"
          )
        );
      },
    },
    data: {
      required: true,
      validator(data) {
        return toString(data) === "Array";
      },
    },
    name: {
      required: true,
      type: String,
    },
    collapseSignal: {
      default: false,
      type: Boolean,
    },
    expandSignal: {
      default: false,
      type: Boolean,
    },
    expandOnCreatedAndUpdated: {
      required: true,
      type: Function,
    },
    getKeys: {
      required: true,
      type: Function,
    },
  },
  setup(props) {
    const {
      isExpanding,
      innerExpandSignal,
      innerCollapseSignal,
      handleClick,
    } = useExpand(props);

    const keys = vue.computed(() => {
      return props.getKeys(props.data, props.path);
    });

    return {
      keys,
      isExpanding,
      innerExpandSignal,
      innerCollapseSignal,
      handleClick,
    };
  },
  components: {
    // Wrapper,
  },
  template: `
    <span class="array">
      <span
        class="indicator"
        @click="handleClick"
      >{{ isExpanding ? '\u25BC' : '\u25B6' }}</span>
      <span
        class="key"
        @click="handleClick"
      >{{ name === '' ? '' : name }}</span>
      <span
        class="separator"
        @click="handleClick"
      >{{ name === '' ? '' : ': ' }}</span>
      <span
        class="count"
        @click="handleClick"
      >
        {{ isExpanding === false && data.length >= 2 ? '(' + data.length + ')' : '' }}
      </span>
      <span
        class="preview"
        @click="handleClick"
      >
        {{ isExpanding ? 'Array(' + data.length + ')' : '[...]' }}
      </span>

      <span v-show="isExpanding" class="value">
        <template
          v-for="key of keys"
        >
          <wrapper
            :name="key"
            :path="path.concat(key)"
            :data="data[key]"
            :expand-signal="innerExpandSignal"
            :collapse-signal="innerCollapseSignal"
            :expandOnCreatedAndUpdated="expandOnCreatedAndUpdated"
            :getKeys="getKeys"
          ></wrapper>
        </template>
      </span>
    </span>
  `,
};

var ObjectWrapper = {
  name: "object-wrapper",
  props: {
    path: {
      required: true,
      validator(path) {
        return (
          toString(path) === "Array" &&
          path.every(
            (key) => toString(key) === "String" || toString(key) === "Number"
          )
        );
      },
    },
    data: {
      required: true,
      validator(data) {
        return toString(data) === "Object";
      },
    },
    name: {
      required: true,
      type: String,
    },
    collapseSignal: {
      default: false,
      type: Boolean,
    },
    expandSignal: {
      default: false,
      type: Boolean,
    },
    expandOnCreatedAndUpdated: {
      required: true,
      type: Function,
    },
    getKeys: {
      required: true,
      type: Function,
    },
  },
  setup(props) {
    const {
      isExpanding,
      innerExpandSignal,
      innerCollapseSignal,
      handleClick,
    } = useExpand(props);

    const keys = vue.computed(() => {
      return props.getKeys(props.data, props.path);
    });

    return {
      keys,
      isExpanding,
      innerExpandSignal,
      innerCollapseSignal,
      handleClick,
    };
  },
  components: {
    // Wrapper,
  },
  template: `
    <span class="object">
      <span
        class="indicator"
        @click="handleClick"
      >{{ isExpanding ? '\u25BC' : '\u25B6' }}</span>
      <span
        class="key"
        @click="handleClick"
      >{{ name === '' ? '' : name }}</span>
      <span
        class="separator"
        @click="handleClick"
      >
        {{ name === '' ? '' : ': ' }}
      </span>
      <span
        class="preview"
        @click="handleClick"
      >
        {{ isExpanding ? '' : '{...}' }}
      </span>

      <span v-show="isExpanding" class="value">
        <template
          v-for="key of keys"
        >
          <wrapper
            class="value"
            :name="key"
            :path="path.concat(key)"
            :data="data[key]"
            :expand-signal="innerExpandSignal"
            :collapse-signal="innerCollapseSignal"
            :expandOnCreatedAndUpdated="expandOnCreatedAndUpdated"
            :getKeys="getKeys"
          ></wrapper>
        </template>
      </span>
    </span>
  `,
};

const Wrapper = {
  name: "wrapper",
  props: {
    path: {
      required: true,
      validator(path) {
        return (
          toString(path) === "Array" &&
          path.every(
            (key) => toString(key) === "String" || toString(key) === "Number"
          )
        );
      },
    },
    data: {
      required: true,
    },
    name: {
      required: true,
      type: String,
    },
    collapseSignal: {
      default: false,
      type: Boolean,
    },
    expandSignal: {
      default: false,
      type: Boolean,
    },
    expandOnCreatedAndUpdated: {
      required: true,
      type: Function,
    },
    getKeys: {
      required: true,
      type: Function,
    },
  },
  setup() {
    return {
      toString,
    };
  },
  components: {
    UndefinedWrapper,
    NullWrapper,
    BooleanWrapper,
    NumberWrapper,
    StringWrapper,
    ArrayWrapper,
    ObjectWrapper,
  },
  template: `
    <undefined-wrapper
      v-if="toString(data) === 'Undefined'"
      :name="name"
      :data="data"
    ></undefined-wrapper>

    <null-wrapper
      v-else-if="toString(data) === 'Null'"
      :name="name"
      :data="data"
    ></null-wrapper>

    <boolean-wrapper
      v-else-if="toString(data) === 'Boolean'"
      :name="name"
      :data="data"
    ></boolean-wrapper>

    <number-wrapper
      v-else-if="toString(data) === 'Number'"
      :name="name"
      :data="data"
    ></number-wrapper>

    <string-wrapper
      v-else-if="toString(data) === 'String'"
      :name="name"
      :data="data"
    ></string-wrapper>

    <array-wrapper
      v-else-if="toString(data) === 'Array'"
      :name="name"
      :path="path"
      :data="data"
      :collapse-signal="collapseSignal"
      :expand-signal="expandSignal"
      :expandOnCreatedAndUpdated="expandOnCreatedAndUpdated"
      :getKeys="getKeys"
    ></array-wrapper>

    <object-wrapper
      v-else-if="toString(data) === 'Object'"
      :name="name"
      :path="path"
      :data="data"
      :collapse-signal="collapseSignal"
      :expand-signal="expandSignal"
      :expandOnCreatedAndUpdated="expandOnCreatedAndUpdated"
      :getKeys="getKeys"
    ></object-wrapper>
  `,
};

ArrayWrapper.components.Wrapper = Wrapper;
ObjectWrapper.components.Wrapper = Wrapper;

const defaultConfig = Object.freeze({
  expandOnCreatedAndUpdated: (path) => [false, false],
  getKeys: (object, path) => Object.keys(object),
});

var mount = (data, el, options = {}) => {
  if (options.rootName === undefined) options.rootName = "";
  if (options.getKeys === undefined) options.getKeys = defaultConfig.getKeys;
  if (options.expandOnCreatedAndUpdated === undefined)
    options.expandOnCreatedAndUpdated = defaultConfig.expandOnCreatedAndUpdated;

  el.classList.add("object-visualizer");
  vue.render(null, el);
  vue.createApp(Wrapper, {
    data: data,
    name: options.rootName,
    path: [],
    expandOnCreatedAndUpdated: options.expandOnCreatedAndUpdated,
    getKeys: options.getKeys,
  }).mount(el);
};

Object.defineProperty(exports, 'reactive', {
  enumerable: true,
  get: function () {
    return vue.reactive;
  }
});
exports.mount = mount;
