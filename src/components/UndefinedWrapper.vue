<template>
  <span class="undefined">
    <span class="key">{{ name }}</span>
    <span v-if="name !== ''" class="separator">:&nbsp;</span>
    <span class="value">undefined</span>
  </span>
</template>

<script>
import { objectToString } from "../util";

export default {
  props: {
    data: {
      required: true,
      validator(data) {
        return objectToString(data) === "Undefined";
      },
    },
    name: {
      required: true,
      type: String,
    },
  },
};
</script>
