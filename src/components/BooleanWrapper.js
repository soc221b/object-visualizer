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
    <span class="ov boolean">{{ name }}: {{ data }}</span>
  `.trim(),
};
