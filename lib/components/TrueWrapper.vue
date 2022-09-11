<template>
  <span class="true" :role="role" :aria-level="ariaLevel">
    <span class="key">{{ name }}</span>
    <span v-if="name !== ''" class="separator">:&nbsp;</span>
    <span class="value">{{ data }}</span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  props: {
    data: {
      type: Boolean,
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
