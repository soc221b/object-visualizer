import { toString } from "../util";

export default {
  props: {
    data: {
      required: true,
      validator(data) {
        return toString(data) === "String";
      },
    },
    name: {
      required: true,
      type: String,
    },
  },
  template: `
    <span class="ov string">
      <span class="ov string key">{{ name }}</span>
      <span class="ov string separator">:&nbsp;</span>
      <span class="ov string value">"{{ data }}"</span>
    </span>
  `.trim(),
};
