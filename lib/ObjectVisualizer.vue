<script setup lang="ts">
import Wrapper from './components/Wrapper.vue'

withDefaults(
  defineProps<{
    data: any
    rootName?: string
    expandOnCreatedAndUpdated?: (path: string[]) => boolean
    getKeys?: (object: Record<string, any>, path: string[]) => string[]
  }>(),
  {
    rootName: '',
    expandOnCreatedAndUpdated: () => false,
    getKeys: (object: Record<string, any>, path: string[]) =>
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
