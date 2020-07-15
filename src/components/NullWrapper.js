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
    <span class="ov null">
      <span class="ov null key">{{ name }}</span>
      <span class="ov null separator">:&nbsp;</span>
      <span class="ov null value">null</span>
    </span>
  `.trim(),
};
