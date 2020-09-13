import { openBlock, createBlock, createVNode, toDisplayString, createCommentVNode, ref, watch, computed, resolveComponent, Fragment, renderList, withDirectives, vShow, render as render$8, createApp } from 'vue';
export { reactive } from 'vue';

const objectToString = (...args) =>
  Object.prototype.toString.call(...args).slice(8, -1);

var script = {
  props: {
    data: {
      required: true,
      validator(data) {
        return objectToString(data) === "Undefined";
      },
    },
    name: {
      required: true,
      type: String,
    },
  },
};

const _hoisted_1 = { class: "undefined" };
const _hoisted_2 = { class: "key" };
const _hoisted_3 = {
  key: 0,
  class: "separator"
};
const _hoisted_4 = /*#__PURE__*/createVNode("span", { class: "value" }, "undefined", -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("span", _hoisted_1, [
    createVNode("span", _hoisted_2, toDisplayString(_ctx.name), 1 /* TEXT */),
    (_ctx.name !== '')
      ? (openBlock(), createBlock("span", _hoisted_3, ": "))
      : createCommentVNode("v-if", true),
    _hoisted_4
  ]))
}

script.render = render;
script.__file = "src/components/UndefinedWrapper.vue";

var script$1 = {
  props: {
    data: {
      required: true,
      validator(data) {
        return objectToString(data) === "Null";
      },
    },
    name: {
      required: true,
      type: String,
    },
  },
};

const _hoisted_1$1 = { class: "null" };
const _hoisted_2$1 = { class: "key" };
const _hoisted_3$1 = {
  key: 0,
  class: "separator"
};
const _hoisted_4$1 = /*#__PURE__*/createVNode("span", { class: "value" }, "null", -1 /* HOISTED */);

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("span", _hoisted_1$1, [
    createVNode("span", _hoisted_2$1, toDisplayString(_ctx.name), 1 /* TEXT */),
    (_ctx.name !== '')
      ? (openBlock(), createBlock("span", _hoisted_3$1, ": "))
      : createCommentVNode("v-if", true),
    _hoisted_4$1
  ]))
}

script$1.render = render$1;
script$1.__file = "src/components/NullWrapper.vue";

var script$2 = {
  props: {
    data: {
      required: true,
      validator(data) {
        return objectToString(data) === "Boolean";
      },
    },
    name: {
      required: true,
      type: String,
    },
  },
};

const _hoisted_1$2 = { class: "boolean" };
const _hoisted_2$2 = { class: "key" };
const _hoisted_3$2 = {
  key: 0,
  class: "separator"
};
const _hoisted_4$2 = { class: "value" };

function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("span", _hoisted_1$2, [
    createVNode("span", _hoisted_2$2, toDisplayString(_ctx.name), 1 /* TEXT */),
    (_ctx.name !== '')
      ? (openBlock(), createBlock("span", _hoisted_3$2, ": "))
      : createCommentVNode("v-if", true),
    createVNode("span", _hoisted_4$2, toDisplayString(_ctx.data), 1 /* TEXT */)
  ]))
}

script$2.render = render$2;
script$2.__file = "src/components/BooleanWrapper.vue";

var script$3 = {
  props: {
    data: {
      required: true,
      validator(data) {
        return objectToString(data) === "Number";
      },
    },
    name: {
      required: true,
      type: String,
    },
  },
};

const _hoisted_1$3 = { class: "number" };
const _hoisted_2$3 = { class: "key" };
const _hoisted_3$3 = {
  key: 0,
  class: "separator"
};
const _hoisted_4$3 = { class: "value" };

function render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("span", _hoisted_1$3, [
    createVNode("span", _hoisted_2$3, toDisplayString(_ctx.name), 1 /* TEXT */),
    (_ctx.name !== '')
      ? (openBlock(), createBlock("span", _hoisted_3$3, ": "))
      : createCommentVNode("v-if", true),
    createVNode("span", _hoisted_4$3, toDisplayString(_ctx.data), 1 /* TEXT */)
  ]))
}

script$3.render = render$3;
script$3.__file = "src/components/NumberWrapper.vue";

var script$4 = {
  props: {
    data: {
      required: true,
      validator(data) {
        return objectToString(data) === "String";
      },
    },
    name: {
      required: true,
      type: String,
    },
  },
};

const _hoisted_1$4 = { class: "string" };
const _hoisted_2$4 = { class: "key" };
const _hoisted_3$4 = {
  key: 0,
  class: "separator"
};
const _hoisted_4$4 = /*#__PURE__*/createVNode("span", { class: "quotes" }, "\"", -1 /* HOISTED */);
const _hoisted_5 = { class: "value" };
const _hoisted_6 = /*#__PURE__*/createVNode("span", { class: "quotes" }, "\"", -1 /* HOISTED */);

function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("span", _hoisted_1$4, [
    createVNode("span", _hoisted_2$4, toDisplayString(_ctx.name), 1 /* TEXT */),
    (_ctx.name !== '')
      ? (openBlock(), createBlock("span", _hoisted_3$4, ": "))
      : createCommentVNode("v-if", true),
    _hoisted_4$4,
    createVNode("span", _hoisted_5, toDisplayString(_ctx.data), 1 /* TEXT */),
    _hoisted_6
  ]))
}

script$4.render = render$4;
script$4.__file = "src/components/StringWrapper.vue";

const cache = new Set();

function useExpand(props = { collapseSignal, expandSignal }) {
  const isExpanding = ref(false);
  const expandOrCollapse = () => {
    isExpanding.value = !isExpanding.value;
  };

  const innerCollapseSignal = ref(false);
  const collapseRecursive = (ev) => {
    isExpanding.value = false;
    innerCollapseSignal.value = !innerCollapseSignal.value;
  };
  watch(() => props.collapseSignal, collapseRecursive);

  const innerExpandSignal = ref(false);
  const expandRecursive = () => {
    isExpanding.value = true;
    innerExpandSignal.value = !innerExpandSignal.value;
  };
  watch(() => props.expandSignal, expandRecursive);

  const handleClick = (ev) => {
    cache.clear();

    if (ev.metaKey === true && ev.shiftKey === true) {
      collapseRecursive();
    } else if (ev.metaKey === true) {
      expandRecursive();
    } else {
      expandOrCollapse();
    }
  };

  watch(
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

var script$5 = {
  name: "array-wrapper",
  props: {
    path: {
      required: true,
      validator(path) {
        return (
          objectToString(path) === "Array" &&
          path.every(
            (key) =>
              objectToString(key) === "String" ||
              objectToString(key) === "Number"
          )
        );
      },
    },
    data: {
      required: true,
      validator(data) {
        return objectToString(data) === "Array";
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

    const keys = computed(() => {
      return props.getKeys(props.data, props.path);
    });

    const isCircular = cache.has(props.data);
    cache.add(props.data);

    return {
      keys,
      isExpanding,
      innerExpandSignal,
      innerCollapseSignal,
      handleClick,
      isCircular,
    };
  },
  components: {
    // Wrapper,
  },
};

const _hoisted_1$5 = { class: "array" };
const _hoisted_2$5 = {
  key: 0,
  class: "value"
};
const _hoisted_3$5 = {
  key: 1,
  class: "value"
};

function render$5(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_wrapper = resolveComponent("wrapper");

  return (openBlock(), createBlock("span", _hoisted_1$5, [
    createVNode("span", {
      class: "indicator",
      onClick: _cache[1] || (_cache[1] = (...args) => (_ctx.handleClick(...args)))
    }, toDisplayString(_ctx.isExpanding ? "\u25BC" : "\u25B6"), 1 /* TEXT */),
    createVNode("span", {
      class: "key",
      onClick: _cache[2] || (_cache[2] = (...args) => (_ctx.handleClick(...args)))
    }, toDisplayString(_ctx.name === "" ? "" : _ctx.name), 1 /* TEXT */),
    createVNode("span", {
      class: "separator",
      onClick: _cache[3] || (_cache[3] = (...args) => (_ctx.handleClick(...args)))
    }, toDisplayString(_ctx.name === "" ? "" : ": "), 1 /* TEXT */),
    createVNode("span", {
      class: "count",
      onClick: _cache[4] || (_cache[4] = (...args) => (_ctx.handleClick(...args)))
    }, toDisplayString(_ctx.isExpanding === false && _ctx.data.length >= 2 ? "(" + _ctx.data.length + ")" : ""), 1 /* TEXT */),
    createVNode("span", {
      class: "preview",
      onClick: _cache[5] || (_cache[5] = (...args) => (_ctx.handleClick(...args)))
    }, toDisplayString(_ctx.isExpanding ? "Array(" + _ctx.data.length + ")" : "[...]"), 1 /* TEXT */),
    (_ctx.isCircular)
      ? (openBlock(), createBlock(Fragment, { key: 0 }, [
          (_ctx.isExpanding)
            ? (openBlock(), createBlock("span", _hoisted_2$5, [
                (openBlock(true), createBlock(Fragment, null, renderList(_ctx.keys, (key) => {
                  return (openBlock(), createBlock(_component_wrapper, {
                    key: key,
                    name: key,
                    path: _ctx.path.concat(key),
                    data: _ctx.data[key],
                    "expand-signal": _ctx.innerExpandSignal,
                    "collapse-signal": _ctx.innerCollapseSignal,
                    expandOnCreatedAndUpdated: () => [false, false],
                    getKeys: _ctx.getKeys
                  }, null, 8 /* PROPS */, ["name", "path", "data", "expand-signal", "collapse-signal", "expandOnCreatedAndUpdated", "getKeys"]))
                }), 256 /* UNKEYED_FRAGMENT */))
              ]))
            : createCommentVNode("v-if", true)
        ], 64 /* STABLE_FRAGMENT */))
      : withDirectives((openBlock(), createBlock("span", _hoisted_3$5, [
          (openBlock(true), createBlock(Fragment, null, renderList(_ctx.keys, (key) => {
            return (openBlock(), createBlock(_component_wrapper, {
              key: key,
              name: key,
              path: _ctx.path.concat(key),
              data: _ctx.data[key],
              "expand-signal": _ctx.innerExpandSignal,
              "collapse-signal": _ctx.innerCollapseSignal,
              expandOnCreatedAndUpdated: _ctx.expandOnCreatedAndUpdated,
              getKeys: _ctx.getKeys
            }, null, 8 /* PROPS */, ["name", "path", "data", "expand-signal", "collapse-signal", "expandOnCreatedAndUpdated", "getKeys"]))
          }), 256 /* UNKEYED_FRAGMENT */))
        ], 512 /* NEED_PATCH */)), [
          [vShow, _ctx.isExpanding]
        ])
  ]))
}

script$5.render = render$5;
script$5.__file = "src/components/ArrayWrapper.vue";

var script$6 = {
  name: "object-wrapper",
  props: {
    path: {
      required: true,
      validator(path) {
        return (
          objectToString(path) === "Array" &&
          path.every(
            (key) =>
              objectToString(key) === "String" ||
              objectToString(key) === "Number"
          )
        );
      },
    },
    data: {
      required: true,
      validator(data) {
        return objectToString(data) === "Object";
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

    const keys = computed(() => {
      return props.getKeys(props.data, props.path);
    });

    const isCircular = cache.has(props.data);
    cache.add(props.data);

    return {
      keys,
      isExpanding,
      innerExpandSignal,
      innerCollapseSignal,
      handleClick,
      isCircular,
    };
  },
  components: {
    // Wrapper,
  },
};

const _hoisted_1$6 = { class: "object" };
const _hoisted_2$6 = {
  key: 0,
  class: "value"
};
const _hoisted_3$6 = {
  key: 1,
  class: "value"
};

function render$6(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_wrapper = resolveComponent("wrapper");

  return (openBlock(), createBlock("span", _hoisted_1$6, [
    createVNode("span", {
      class: "indicator",
      onClick: _cache[1] || (_cache[1] = (...args) => (_ctx.handleClick(...args)))
    }, toDisplayString(_ctx.isExpanding ? "\u25BC" : "\u25B6"), 1 /* TEXT */),
    createVNode("span", {
      class: "key",
      onClick: _cache[2] || (_cache[2] = (...args) => (_ctx.handleClick(...args)))
    }, toDisplayString(_ctx.name === "" ? "" : _ctx.name), 1 /* TEXT */),
    createVNode("span", {
      class: "separator",
      onClick: _cache[3] || (_cache[3] = (...args) => (_ctx.handleClick(...args)))
    }, toDisplayString(_ctx.name === "" ? "" : ": "), 1 /* TEXT */),
    createVNode("span", {
      class: "preview",
      onClick: _cache[4] || (_cache[4] = (...args) => (_ctx.handleClick(...args)))
    }, toDisplayString(_ctx.isExpanding ? "" : "{...}"), 1 /* TEXT */),
    (_ctx.isCircular)
      ? (openBlock(), createBlock(Fragment, { key: 0 }, [
          (_ctx.isExpanding)
            ? (openBlock(), createBlock("span", _hoisted_2$6, [
                (openBlock(true), createBlock(Fragment, null, renderList(_ctx.keys, (key) => {
                  return (openBlock(), createBlock(_component_wrapper, {
                    key: key,
                    class: "value",
                    name: key,
                    path: _ctx.path.concat(key),
                    data: _ctx.data[key],
                    "expand-signal": _ctx.innerExpandSignal,
                    "collapse-signal": _ctx.innerCollapseSignal,
                    expandOnCreatedAndUpdated: () => [false, false],
                    getKeys: _ctx.getKeys
                  }, null, 8 /* PROPS */, ["name", "path", "data", "expand-signal", "collapse-signal", "expandOnCreatedAndUpdated", "getKeys"]))
                }), 256 /* UNKEYED_FRAGMENT */))
              ]))
            : createCommentVNode("v-if", true)
        ], 64 /* STABLE_FRAGMENT */))
      : withDirectives((openBlock(), createBlock("span", _hoisted_3$6, [
          (openBlock(true), createBlock(Fragment, null, renderList(_ctx.keys, (key) => {
            return (openBlock(), createBlock(_component_wrapper, {
              key: key,
              class: "value",
              name: key,
              path: _ctx.path.concat(key),
              data: _ctx.data[key],
              "expand-signal": _ctx.innerExpandSignal,
              "collapse-signal": _ctx.innerCollapseSignal,
              expandOnCreatedAndUpdated: _ctx.expandOnCreatedAndUpdated,
              getKeys: _ctx.getKeys
            }, null, 8 /* PROPS */, ["name", "path", "data", "expand-signal", "collapse-signal", "expandOnCreatedAndUpdated", "getKeys"]))
          }), 256 /* UNKEYED_FRAGMENT */))
        ], 512 /* NEED_PATCH */)), [
          [vShow, _ctx.isExpanding]
        ])
  ]))
}

script$6.render = render$6;
script$6.__file = "src/components/ObjectWrapper.vue";

const Wrapper = {
  name: "wrapper",
  props: {
    path: {
      required: true,
      validator(path) {
        return (
          objectToString(path) === "Array" &&
          path.every(
            (key) =>
              objectToString(key) === "String" ||
              objectToString(key) === "Number"
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
      objectToString,
    };
  },
  components: {
    UndefinedWrapper: script,
    NullWrapper: script$1,
    BooleanWrapper: script$2,
    NumberWrapper: script$3,
    StringWrapper: script$4,
    ArrayWrapper: script$5,
    ObjectWrapper: script$6,
  },
};

script$5.components.Wrapper = Wrapper;
script$6.components.Wrapper = Wrapper;

function render$7(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_undefined_wrapper = resolveComponent("undefined-wrapper");
  const _component_null_wrapper = resolveComponent("null-wrapper");
  const _component_boolean_wrapper = resolveComponent("boolean-wrapper");
  const _component_number_wrapper = resolveComponent("number-wrapper");
  const _component_string_wrapper = resolveComponent("string-wrapper");
  const _component_array_wrapper = resolveComponent("array-wrapper");
  const _component_object_wrapper = resolveComponent("object-wrapper");

  return (_ctx.objectToString(_ctx.data) === 'Undefined')
    ? createVNode(_component_undefined_wrapper, {
        key: 0,
        name: _ctx.name,
        data: _ctx.data
      }, null, 8 /* PROPS */, ["name", "data"])
    : (_ctx.objectToString(_ctx.data) === 'Null')
      ? createVNode(_component_null_wrapper, {
          key: 1,
          name: _ctx.name,
          data: _ctx.data
        }, null, 8 /* PROPS */, ["name", "data"])
      : (_ctx.objectToString(_ctx.data) === 'Boolean')
        ? createVNode(_component_boolean_wrapper, {
            key: 2,
            name: _ctx.name,
            data: _ctx.data
          }, null, 8 /* PROPS */, ["name", "data"])
        : (_ctx.objectToString(_ctx.data) === 'Number')
          ? createVNode(_component_number_wrapper, {
              key: 3,
              name: _ctx.name,
              data: _ctx.data
            }, null, 8 /* PROPS */, ["name", "data"])
          : (_ctx.objectToString(_ctx.data) === 'String')
            ? createVNode(_component_string_wrapper, {
                key: 4,
                name: _ctx.name,
                data: _ctx.data
              }, null, 8 /* PROPS */, ["name", "data"])
            : (_ctx.objectToString(_ctx.data) === 'Array')
              ? createVNode(_component_array_wrapper, {
                  key: 5,
                  name: _ctx.name,
                  path: _ctx.path,
                  data: _ctx.data,
                  "collapse-signal": _ctx.collapseSignal,
                  "expand-signal": _ctx.expandSignal,
                  expandOnCreatedAndUpdated: _ctx.expandOnCreatedAndUpdated,
                  getKeys: _ctx.getKeys
                }, null, 8 /* PROPS */, ["name", "path", "data", "collapse-signal", "expand-signal", "expandOnCreatedAndUpdated", "getKeys"])
              : (_ctx.objectToString(_ctx.data) === 'Object')
                ? createVNode(_component_object_wrapper, {
                    key: 6,
                    name: _ctx.name,
                    path: _ctx.path,
                    data: _ctx.data,
                    "collapse-signal": _ctx.collapseSignal,
                    "expand-signal": _ctx.expandSignal,
                    expandOnCreatedAndUpdated: _ctx.expandOnCreatedAndUpdated,
                    getKeys: _ctx.getKeys
                  }, null, 8 /* PROPS */, ["name", "path", "data", "collapse-signal", "expand-signal", "expandOnCreatedAndUpdated", "getKeys"])
                : createCommentVNode("v-if", true)
}

Wrapper.render = render$7;
Wrapper.__file = "src/components/Wrapper.vue";

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
  render$8(null, el);
  createApp(Wrapper, {
    data: data,
    name: options.rootName,
    path: [],
    expandOnCreatedAndUpdated: options.expandOnCreatedAndUpdated,
    getKeys: options.getKeys,
  }).mount(el);
};

export { mount };
