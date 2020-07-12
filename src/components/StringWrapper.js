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
    <span class="ov string">{{ name }}: '{{ data }}'</span>
  `.trim(),
};
