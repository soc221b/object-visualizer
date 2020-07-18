import { toString } from "../util";
import { useExpand } from "../hooks";

export default ObjectWrapper = {
  name: "object-wrapper",
  props: {
    data: {
      required: true,
      validator(data) {
        return toString(data) === "Object";
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
      representingType: toString(props.data),
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
    <span class="object">
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
      >
        {{ name === '' ? '' : ': ' }}
      </span>
      <span
        class="preview"
        @click="handleClick"
      >
        {{ isExpanding ? '' : '{...}' }}
      </span>

      <span v-show="isExpanding" class="value">
        <wrapper
          v-for="key of Object.keys(data).sort()"
          class="value"
          :name="key"
          :data="data[key]"
          :expand-signal="innerExpandSignal"
          :collapse-signal="innerCollapseSignal"
        ></wrapper>
      </span>
    </span>
  `,
};
