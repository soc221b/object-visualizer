import { toString } from "../util";

export default {
  props: {
    data: {
      required: true,
      validator(data) {
        return toString(data) === "Undefined";
      },
    },
    name: {
      required: true,
      type: String,
    },
  },
  template: `
    <span class="undefined">
      <span class="key">{{ name }}</span>
      <span class="separator">:&nbsp;</span>
      <span class="value">undefined</span>
    </span>
  `.trim(),
};
