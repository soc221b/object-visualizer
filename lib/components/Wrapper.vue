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
    :class="ariaLevel === 0 ? 'object-visualizer' : void 0"
    v-bind="attrs"
  />
</template>

<script lang="ts">
import NullWrapper from './NullWrapper.vue'
import TrueWrapper from './TrueWrapper.vue'
import FalseWrapper from './FalseWrapper.vue'
import NumberWrapper from './NumberWrapper.vue'
import StringWrapper from './StringWrapper.vue'
import ArrayWrapper from './ArrayWrapper.vue'
import ObjectWrapper from './ObjectWrapper.vue'
import { objectToString } from '../util'
import { computed, defineComponent, PropType } from 'vue'

const Wrapper = defineComponent({
  inheritAttrs: false,
  props: {
    path: {
      required: true,
      type: Array as PropType<(string | number)[]>,
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

    ariaLevel: {
      required: true,
      type: Number,
    },
  },
  setup(props) {
    const type = computed(() => objectToString(props.data))
    const is = computed(() => {
      switch (type.value) {
        case 'Null':
          return 'null-wrapper'
        case 'Boolean':
          return props.data ? 'true-wrapper' : 'false-wrapper'
        case 'Number':
          return 'number-wrapper'
        case 'String':
          return 'string-wrapper'
        case 'Array':
          return 'array-wrapper'
        case 'Object':
          return 'object-wrapper'
      }
    })
    const role = computed(() => {
      if (props.ariaLevel === 0) {
        if (type.value === 'Array' || type.value === 'Object') {
          return 'tree'
        } else {
          return void 0
        }
      } else {
        if (type.value === 'Array' || type.value === 'Object') {
          return 'group'
        } else {
          return 'treeitem'
        }
      }
    })
    const attrs = computed(() => {
      const attrs: { role?: string; ariaLevel?: number } = {}
      if (role.value !== void 0) {
        attrs.role = role.value
        attrs.ariaLevel = props.ariaLevel + 1
      }
      return attrs
    })

    return {
      is,
      role,
      attrs,
    }
  },
  components: {
    NullWrapper,
    TrueWrapper,
    FalseWrapper,
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
