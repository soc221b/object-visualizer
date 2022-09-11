<template>
  <span class="number" :role="role" :aria-level="ariaLevel" :id="id">
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
      type: Number,
      required: true,
    },
    name: {
      required: true,
      type: String,
    },

    id: {
      required: true,
      type: String,
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
})
</script>
