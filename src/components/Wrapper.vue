<template>
  <undefined-wrapper
    v-if="objectToString(data) === 'Undefined'"
    :name="name"
    :data="data"
  ></undefined-wrapper>

  <null-wrapper
    v-else-if="objectToString(data) === 'Null'"
    :name="name"
    :data="data"
  ></null-wrapper>

  <boolean-wrapper
    v-else-if="objectToString(data) === 'Boolean'"
    :name="name"
    :data="data"
  ></boolean-wrapper>

  <number-wrapper
    v-else-if="objectToString(data) === 'Number'"
    :name="name"
    :data="data"
  ></number-wrapper>

  <string-wrapper
    v-else-if="objectToString(data) === 'String'"
    :name="name"
    :data="data"
  ></string-wrapper>

  <array-wrapper
    v-else-if="objectToString(data) === 'Array'"
    :name="name"
    :path="path"
    :data="data"
    :collapse-signal="collapseSignal"
    :expand-signal="expandSignal"
    :expandOnCreatedAndUpdated="expandOnCreatedAndUpdated"
    :getKeys="getKeys"
  ></array-wrapper>

  <object-wrapper
    v-else-if="objectToString(data) === 'Object'"
    :name="name"
    :path="path"
    :data="data"
    :collapse-signal="collapseSignal"
    :expand-signal="expandSignal"
    :expandOnCreatedAndUpdated="expandOnCreatedAndUpdated"
    :getKeys="getKeys"
  ></object-wrapper>
</template>

<script>
import UndefinedWrapper from "./UndefinedWrapper.vue";
import NullWrapper from "./NullWrapper.vue";
import BooleanWrapper from "./BooleanWrapper.vue";
import NumberWrapper from "./NumberWrapper.vue";
import StringWrapper from "./StringWrapper.vue";
import ArrayWrapper from "./ArrayWrapper.vue";
import ObjectWrapper from "./ObjectWrapper.vue";
import { objectToString } from "../util";

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
    UndefinedWrapper,
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
