<template>
  <span
    class="object"
    :role="role"
    :aria-expanded="isExpanding"
    :aria-level="ariaLevel"
    @click.self="handleClick"
  >
    <span class="indicator" @click="handleClick">{{
      isExpanding ? '\u25BC' : '\u25B6'
    }}</span>
    <span class="key" @click="handleClick">{{ name === '' ? '' : name }}</span>
    <span class="separator" @click="handleClick">
      {{ name === '' ? '' : ': ' }}
    </span>
    <span class="preview" @click="handleClick">
      {{ isExpanding ? '' : '{...}' }}
    </span>

    <template v-if="isCircular">
      <span v-if="isExpanding" class="value">
        <template v-for="key of keys" :key="key">
          <wrapper
            class="value"
            :name="key"
            :path="path.concat(key)"
            :data="data[key]"
            :expand-signal="innerExpandSignal"
            :collapse-signal="innerCollapseSignal"
            :expandOnCreatedAndUpdated="() => false"
            :getKeys="getKeys"
            :aria-level="ariaLevel"
          ></wrapper>
        </template>
      </span>
    </template>

    <template v-else>
      <span v-show="isExpanding" class="value">
        <template v-for="key of keys" :key="key">
          <wrapper
            class="value"
            :name="key"
            :path="path.concat(key)"
            :data="data[key]"
            :expand-signal="innerExpandSignal"
            :collapse-signal="innerCollapseSignal"
            :expandOnCreatedAndUpdated="expandOnCreatedAndUpdated"
            :getKeys="getKeys"
            :aria-level="ariaLevel"
          ></wrapper>
        </template>
      </span>
    </template>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { objectToString } from '../util'
import { useExpand, cache } from '../hooks'

export default defineComponent({
  inheritAttrs: false,
  props: {
    path: {
      required: true,
      type: Array as PropType<string[]>,
      validator(path: unknown) {
        return (
          objectToString(path) === 'Array' &&
          (path as unknown[]).every(
            (key: unknown) =>
              objectToString(key) === 'String' ||
              objectToString(key) === 'Number',
          )
        )
      },
    },
    data: {
      type: Object as PropType<Record<PropertyKey, unknown>>,
      required: true,
      validator(data) {
        return objectToString(data) === 'Object'
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
      type: Function as PropType<(path: string[]) => boolean>,
    },
    getKeys: {
      required: true,
      type: Function,
    },

    role: {
      required: true,
      type: String,
    },
    ariaLevel: {
      required: true,
      type: Number,
    },
  },
  setup(props) {
    const { isExpanding, innerExpandSignal, innerCollapseSignal, handleClick } =
      useExpand(props)

    const keys = computed(() => {
      return props.getKeys(props.data, props.path)
    })

    const isCircular = cache.has(props.data)
    cache.add(props.data)

    return {
      keys,
      isExpanding,
      innerExpandSignal,
      innerCollapseSignal,
      handleClick,
      isCircular,
    }
  },
  components: {
    // Wrapper,
  },
})
</script>
