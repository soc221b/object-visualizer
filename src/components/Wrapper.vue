<template>
  <component
    :is="TYPE_TO_COMPONENT[objectToString(data)]"
    :name="name"
    :path="path"
    :data="data"
    :collapse-signal="collapseSignal"
    :expand-signal="expandSignal"
    :expandOnCreatedAndUpdated="expandOnCreatedAndUpdated"
    :getKeys="getKeys"
  />
</template>

<script>
import NullWrapper from "./NullWrapper.vue";
import BooleanWrapper from "./BooleanWrapper.vue";
import NumberWrapper from "./NumberWrapper.vue";
import StringWrapper from "./StringWrapper.vue";
import ArrayWrapper from "./ArrayWrapper.vue";
import ObjectWrapper from "./ObjectWrapper.vue";
import { objectToString } from "../util";

const TYPE_TO_COMPONENT = {
  Null: "null-wrapper",
  Boolean: "boolean-wrapper",
  Number: "number-wrapper",
  String: "string-wrapper",
  Array: "array-wrapper",
  Object: "object-wrapper",
};

const Wrapper = {
  inheritAttrs: false,
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
        return (
          objectToString(data) === "Null" ||
          objectToString(data) === "Boolean" ||
          objectToString(data) === "Number" ||
          objectToString(data) === "String" ||
          objectToString(data) === "Array" ||
          objectToString(data) === "Object"
        );
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
  setup() {
    return {
      objectToString,
      TYPE_TO_COMPONENT,
    };
  },
  components: {
    NullWrapper,
    BooleanWrapper,
    NumberWrapper,
    StringWrapper,
    ArrayWrapper,
    ObjectWrapper,
  },
};

ArrayWrapper.components.Wrapper = Wrapper;
ObjectWrapper.components.Wrapper = Wrapper;

export default Wrapper;
</script>
