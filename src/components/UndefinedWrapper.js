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
    <span class="ov undefined">
      <span class="ov undefined key">{{ name }}</span>
      <span class="ov undefined separator">:&nbsp;</span>
      <span class="ov undefined value">undefined</span>
    </span>
  `.trim(),
};
