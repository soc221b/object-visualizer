<template>
  <component
    :is="is"
    :name="name"
    :path="path"
    :data="data"
    :collapse-signal="collapseSignal"
    :expand-signal="expandSignal"
    :expandOnCreatedAndUpdated="expandOnCreatedAndUpdated"
    :getKeys="getKeys"
    :object-visualizer-uid="objectVisualizerUid"
    :id="`object-visualizer-${objectVisualizerUid}--${
      path.length === 0 ? 'root' : path.join('-')
    }`"
    :role="role"
    :aria-level="ariaLevel + 1"
  />
</template>

<script lang="ts">
import NullWrapper from './NullWrapper.vue'
import BooleanWrapper from './BooleanWrapper.vue'
import NumberWrapper from './NumberWrapper.vue'
import StringWrapper from './StringWrapper.vue'
import ArrayWrapper from './ArrayWrapper.vue'
import ObjectWrapper from './ObjectWrapper.vue'
import { objectToString } from '../util'
import { computed, defineComponent } from 'vue'

const TYPE_TO_COMPONENT = {
  Null: 'null-wrapper',
  Boolean: 'boolean-wrapper',
  Number: 'number-wrapper',
  String: 'string-wrapper',
  Array: 'array-wrapper',
  Object: 'object-wrapper',
}

const Wrapper = defineComponent({
  inheritAttrs: false,
  props: {
    path: {
      type: Array,
      required: true,
      validator(path: unknown) {
        return (
          objectToString(path) === 'Array' &&
          (path as unknown[]).every(
            (key) =>
              objectToString(key) === 'String' ||
              objectToString(key) === 'Number',
          )
        )
      },
    },
    data: {
      required: true,
      validator(data: any) {
        return (
          objectToString(data) === 'Null' ||
          objectToString(data) === 'Boolean' ||
          objectToString(data) === 'Number' ||
          objectToString(data) === 'String' ||
          objectToString(data) === 'Array' ||
          objectToString(data) === 'Object'
        )
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

    objectVisualizerUid: {
      required: true,
      type: Number,
    },
    role: {
      default: 'group',
      type: String,
    },
    ariaLevel: {
      required: true,
      type: Number,
    },
  },
  setup(props) {
    const is = computed(
      () =>
        TYPE_TO_COMPONENT[
          objectToString(props.data) as keyof typeof TYPE_TO_COMPONENT
        ],
    )
    return {
      is,
      objectToString,
      TYPE_TO_COMPONENT,
    }
  },
  components: {
    NullWrapper,
    BooleanWrapper,
    NumberWrapper,
    StringWrapper,
    ArrayWrapper,
    ObjectWrapper,
  },
})

;(ArrayWrapper.components as any).Wrapper = Wrapper
;(ObjectWrapper.components as any).Wrapper = Wrapper

export default Wrapper
</script>
