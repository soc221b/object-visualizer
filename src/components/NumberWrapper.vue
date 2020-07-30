<template>
  <span class="number">
    <span class="key">{{ name }}</span>
    <span v-if="name !== ''" class="separator">:&nbsp;</span>
    <span class="value">{{ data }}</span>
  </span>
</template>

<script>
import { objectToString } from "../util";

export default {
  props: {
    data: {
      required: true,
      validator(data) {
        return objectToString(data) === "Number";
      },
    },
    name: {
      required: true,
      type: String,
    },
  },
};
</script>
