<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import Wrapper from './components/Wrapper.vue'

withDefaults(
  defineProps<{
    data: any
    rootName?: string
    expandOnCreatedAndUpdated?: (path: string[]) => boolean
    getKeys?: (object: Record<string, any>, path: string[]) => string[]
    uid?: number
  }>(),
  {
    rootName: '',
    expandOnCreatedAndUpdated: () => false,
    getKeys: (object: Record<string, any>, path: string[]) =>
      Object.keys(object),
    uid: getCurrentInstance()?.uid,
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
      :object-visualizer-uid="0"
      :path="[]"
      :aria-level="0"
    >
    </Wrapper>
  </section>
</template>
