import { toString } from "../util";

export default {
  props: {
    data: {
      required: true,
      validator(data) {
        return toString(data) === "Number";
      },
    },
    name: {
      required: true,
      type: String,
    },
  },
  template: `
    <span class="ov number">
      <span class="ov number key">{{ name }}</span>
      <span class="ov number separator">:&nbsp;</span>
      <span class="ov number value">{{ data }}</span>
    </span>
  `.trim(),
};
