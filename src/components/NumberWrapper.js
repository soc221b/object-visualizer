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
    <span class="ov number">{{ name }}: {{ data }}</span>
  `.trim(),
};
