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
    <span class="ov undefined">{{ name }}: {{ data }}</span>
  `.trim(),
};
