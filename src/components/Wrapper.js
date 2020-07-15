import { ref, watch, nextTick } from "vue/dist/vue.esm-browser";
import UndefinedWrapper from "./UndefinedWrapper";
import NullWrapper from "./NullWrapper";
import BooleanWrapper from "./BooleanWrapper";
import NumberWrapper from "./NumberWrapper";
import StringWrapper from "./StringWrapper";
// import ArrayWrapper from "./ArrayWrapper";
// import ObjectWrapper from "./ObjectWrapper";
import { toString } from "../util";
import config from "../config";

const types = new Set([
  "Undefined",
  "Null",
  "Boolean",
  "Number",
  "String",
  "Array",
  "Object",
]);

export default {
  name: "wrapper",
  props: {
    data: {
      required: true,
      validator(data) {
        return types.has(toString(data));
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
    const isExpanding = ref(false);
    const expand = () => (isExpanding.value = !isExpanding.value);
    const innerCollapseSignal = ref(false);
    const innerExpandSignal = ref(false);
    const collapseRecursive = async () => {
      isExpanding.value = false;
      await nextTick();
      innerCollapseSignal.value = !innerCollapseSignal.value;
    };
    const expandRecursive = async () => {
      isExpanding.value = true;
      await nextTick();
      innerExpandSignal.value = !innerExpandSignal.value;
    };

    watch(() => props.expandSignal, expandRecursive);
    watch(() => props.collapseSignal, collapseRecursive);
    return {
      representingType: toString(props.data),
      config,
      expand,
      innerExpandSignal,
      innerCollapseSignal,
      isExpanding,
      collapseRecursive,
      expandRecursive,
    };
  },
  components: {
    UndefinedWrapper,
    NullWrapper,
    BooleanWrapper,
    NumberWrapper,
    StringWrapper,
    // ArrayWrapper,
    // ObjectWrapper,
  },
  template: `
    <undefined-wrapper
      v-if="representingType === 'Undefined'"
      :name="name"
      :data="data"
    ></undefined-wrapper>

    <null-wrapper
      v-else-if="representingType === 'Null'"
      :name="name"
      :data="data"
    ></null-wrapper>

    <boolean-wrapper
      v-else-if="representingType === 'Boolean'"
      :name="name"
      :data="data"
    ></boolean-wrapper>

    <number-wrapper
      v-else-if="representingType === 'Number'"
      :name="name"
      :data="data"
    ></number-wrapper>

    <string-wrapper
      v-else-if="representingType === 'String'"
      :name="name"
      :data="data"
    ></string-wrapper>

    <template v-else-if="representingType === 'Array'">
      <span class="array">
        <span
          class="indicator"
          @click="expand"
        >{{ isExpanding ? '\u25BC' : '\u25B6' }}</span>
        <span
          class="key"
          @click.exact="expand"
          @click.meta.exact="collapseRecursive"
          @click.shift.exact="expandRecursive"
        >{{ name === '' ? '' : name + ': ' }}{{ isExpanding && data.length > 0 ? 'Array(' + data.length + ')' : '(' + data.length + ') [...]' }}</span>

        <span v-show="isExpanding" class="value">
          <wrapper
            v-for="(value, index) of data"
            :name="index + ''"
            :data="data[index]"
            :collapseSignal="innerCollapseSignal"
            :expandSignal="innerExpandSignal"
          ></wrapper>
        </span>
      </span>
    </template>

    <template v-else-if="representingType === 'Object'">
      <span class="object">
        <span
          class="indicator"
          @click="expand"
        >{{ isExpanding ? '\u25BC' : '\u25B6' }}</span>
        <span
          class="key"
          @click.exact="expand"
          @click.meta.exact="collapseRecursive"
          @click.shift.exact="expandRecursive"
        >{{ name === '' ? '' : name + ': ' }}{{ isExpanding && Object.keys(data).length > 0 ? '{}' : '{...}' }}</span>

        <span v-show="isExpanding" class="value">
          <wrapper
            v-for="key of Object.keys(data).sort()"
            class="value"
            :name="key"
            :data="data[key]"
            :collapseSignal="innerCollapseSignal"
            :expandSignal="innerExpandSignal"
          ></wrapper>
        </span>
      </span>
    </template>
  `,
};
