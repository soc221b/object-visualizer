<template>
  <span class="null" :role="role" :aria-level="ariaLevel">
    <span class="key">{{ name }}</span>
    <span v-if="name !== ''" class="separator">:&nbsp;</span>
    <span class="value">null</span>
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  props: {
    data: {
      type: Object as PropType<null>,
      required: true,
    },
    name: {
      required: true,
      type: String,
    },

    role: {
      type: String,
    },
    ariaLevel: {
      type: Number,
    },
  },
})
</script>
