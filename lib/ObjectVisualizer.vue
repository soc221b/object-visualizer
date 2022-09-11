<script setup lang="ts">
import Wrapper from './components/Wrapper.vue'
import type { Path } from './util'

withDefaults(
  defineProps<{
    data: unknown
    rootName?: string
    expandOnCreatedAndUpdated?: (path: Path) => boolean
    getKeys?: (
      object: Record<PropertyKey, unknown> | unknown[],
      path: Path,
    ) => string[]
  }>(),
  {
    rootName: '',
    expandOnCreatedAndUpdated: () => false,
    getKeys: (object: Record<PropertyKey, unknown> | unknown[], path: Path) =>
      Object.keys(object),
  },
)
</script>

<template>
  <section class="object-visualizer">
    <Wrapper
      :data="data"
      :name="rootName"
      :expand-on-created-and-updated="expandOnCreatedAndUpdated"
      :get-keys="getKeys"
      :path="[]"
      :aria-level="0"
    >
    </Wrapper>
  </section>
</template>
