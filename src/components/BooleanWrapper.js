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
    <span class="ov boolean">
      <span class="ov boolean key">{{ name }}</span>
      <span class="ov boolean separator">:&nbsp;</span>
      <span class="ov boolean value">{{ data }}</span>
    </span>
  `.trim(),
};
