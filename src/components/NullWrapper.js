import { toString } from "../util";

export default {
  props: {
    data: {
      required: true,
      validator(data) {
        return toString(data) === "Null";
      },
    },
    name: {
      required: true,
      type: String,
    },
  },
  template: `
    <span class="null">
      <span class="key">{{ name }}</span>
      <span class="separator">:&nbsp;</span>
      <span class="value">null</span>
    </span>
  `.trim(),
};
