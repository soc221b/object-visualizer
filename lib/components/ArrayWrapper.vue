<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  components: {},
})
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useExpand, cache } from '../hooks'
import type { Path } from '../util'

const props = withDefaults(
  defineProps<{
    path: Path
    data: unknown[]
    name: string
    expandOnCreatedAndUpdated: (path: Path) => boolean
    getKeys: (object: unknown[], path: Path) => string[]
    role: string
    ariaLevel: number
    collapseSignal?: boolean
    expandSignal?: boolean
  }>(),
  {
    collapseSignal: false,
    expandSignal: false,
  },
)

const { isExpanding, innerExpandSignal, innerCollapseSignal, handleClick } =
  useExpand(props)

const keys = computed(() => {
  return props.getKeys(props.data, props.path)
})

const lookup = (key: PropertyKey): unknown => {
  return props.data[key as keyof typeof props.data]
}

const isCircular = cache.has(props.data)
cache.add(props.data)
</script>

<template>
  <span
    class="array"
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
    <span class="count" @click="handleClick">
      {{
        isExpanding === false && data.length >= 2 ? '(' + data.length + ')' : ''
      }}
    </span>
    <span class="preview" @click="handleClick">
      {{ isExpanding ? 'Array(' + data.length + ')' : '[...]' }}
    </span>

    <template v-if="isCircular">
      <span v-if="isExpanding" class="value">
        <template v-for="key of keys" :key="key">
          <wrapper
            :name="key"
            :path="[...path, key]"
            :data="lookup(key)"
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
      <span v-if="isExpanding" class="value">
        <template v-for="key of keys" :key="key">
          <wrapper
            :name="key"
            :path="[...path, key]"
            :data="lookup(key)"
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
