import { toString } from "../util";
import { useExpand } from "../hooks";

export default {
  name: "array-wrapper",
  props: {
    path: {
      required: true,
      validator(path) {
        return (
          toString(path) === "Array" &&
          path.every((key) => toString(key) === "String")
        );
      },
    },
    data: {
      required: true,
      validator(data) {
        return toString(data) === "Array";
      },
    },
    name: {
      required: true,
      type: String,
    },
    collapseSignal: {
      default: false,
      type: Boolean,
    },
    expandSignal: {
      default: false,
      type: Boolean,
    },
  },
  setup(props) {
    const {
      isExpanding,
      innerExpandSignal,
      innerCollapseSignal,
      handleClick,
    } = useExpand(props);

    return {
      isExpanding,
      innerExpandSignal,
      innerCollapseSignal,
      handleClick,
    };
  },
  components: {
    // Wrapper,
  },
  template: `
    <span class="array">
      <span
        class="indicator"
        @click="handleClick"
      >{{ isExpanding ? '\u25BC' : '\u25B6' }}</span>
      <span
        class="key"
        @click="handleClick"
      >{{ name === '' ? '' : name }}</span>
      <span
        class="separator"
        @click="handleClick"
      >{{ name === '' ? '' : ': ' }}</span>
      <span
        class="count"
        @click="handleClick"
      >
        {{ isExpanding === false && data.length >= 2 ? '(' + data.length + ')' : '' }}
      </span>
      <span
        class="preview"
        @click="handleClick"
      >
        {{ isExpanding ? 'Array(' + data.length + ')' : '[...]' }}
      </span>

      <span v-show="isExpanding" class="value">
        <wrapper
          v-for="(value, index) of data"
          :name="index + ''"
          :path="path.concat(index + '')"
          :data="data[index]"
          :expand-signal="innerExpandSignal"
          :collapse-signal="innerCollapseSignal"
        ></wrapper>
      </span>
    </span>
  `,
};
