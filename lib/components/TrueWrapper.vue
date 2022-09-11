<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  inheritAttrs: false,
})
</script>

<script setup lang="ts">
defineProps<{
  data: true
  name: string
  role?: string
  ariaLevel?: number
}>()
</script>

<template>
  <span class="true" :role="role" :aria-level="ariaLevel">
    <span class="key">{{ name }}</span>
    <span v-if="name !== ''" class="separator">:&nbsp;</span>
    <span class="value">true</span>
  </span>
</template>
