import { toString } from "../util";

export default {
  props: {
    data: {
      required: true,
      validator(data) {
        return toString(data) === "Boolean";
      },
    },
    name: {
      required: true,
      type: String,
    },
  },
  template: `
    <span class="boolean">
      <span class="key">{{ name }}</span>
      <span class="separator">:&nbsp;</span>
      <span class="value">{{ data }}</span>
    </span>
  `.trim(),
};
