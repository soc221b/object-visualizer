<template>
  <span class="string" :role="role" :aria-level="ariaLevel" :id="id">
    <span class="key">{{ name }}</span>
    <span v-if="name !== ''" class="separator">:&nbsp;</span>
    <span class="quotes">"</span>
    <span class="value">{{ data }}</span>
    <span class="quotes">"</span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  props: {
    data: {
      type: String,
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
