import { computed } from "vue/dist/vue.esm-browser";
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
          path.every(
            (key) => toString(key) === "String" || toString(key) === "Number"
          )
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
    expandOnCreatedAndUpdated: {
      required: true,
      type: Function,
    },
    getKeys: {
      required: true,
      type: Function,
    },
  },
  setup(props) {
    const {
      isExpanding,
      innerExpandSignal,
      innerCollapseSignal,
      handleClick,
    } = useExpand(props);

    const keys = computed(() => {
      return props.getKeys(props.data, props.path);
    });

    return {
      keys,
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
        <template
          v-for="key of keys"
        >
          <wrapper
            :name="key"
            :path="path.concat(key)"
            :data="data[key]"
            :expand-signal="innerExpandSignal"
            :collapse-signal="innerCollapseSignal"
            :expandOnCreatedAndUpdated="expandOnCreatedAndUpdated"
            :getKeys="getKeys"
          ></wrapper>
        </template>
      </span>
    </span>
  `,
};
