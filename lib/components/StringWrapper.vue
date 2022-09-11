<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  inheritAttrs: false,
})
</script>

<script setup lang="ts">
defineProps<{
  data: string
  name: string
  role?: string
  ariaLevel?: number
}>()
</script>

<template>
  <span class="string" :role="role" :aria-level="ariaLevel">
    <span class="key">{{ name }}</span>
    <span v-if="name !== ''" class="separator">:&nbsp;</span>
    <span class="quotes">"</span>
    <span class="value">{{ JSON.stringify(data).slice(1, -1) }}</span>
    <span class="quotes">"</span>
  </span>
</template>
