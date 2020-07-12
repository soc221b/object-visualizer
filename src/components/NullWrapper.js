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
    <span class="ov null">{{ name }}: {{ data }}</span>
  `.trim(),
};
