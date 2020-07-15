import { ref } from "vue/dist/vue.esm-browser";
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
  },
  setup(props) {
    const isExpanding = ref(false);
    const expand = () => (isExpanding.value = !isExpanding.value);
    return {
      representingType: toString(props.data),
      config,
      expand,
      isExpanding,
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
      <span class="ov wrapper array">
        <span
          class="ov array indicator"
          @click="expand"
        >
          <span>{{ isExpanding ? '\u25BC' : '\u25B6' }}</span>
          <span class="ov array key">{{ name }} {{ isExpanding && data.length > 0 ? '[]' : '(' + data.length + ') [...]' }}</span>
        </span>

        <template v-if="isExpanding">
          <span v-for="(value, index) of data" class="ov array">
            <wrapper
              class="ov array value"
              :name="index + ''"
              :data="data[index]"
            ></wrapper>
          </span>
        </template>
      </span>
    </template>

    <template v-else-if="representingType === 'Object'">
      <span class="ov wrapper object">
        <span
          class="ov object indicator"
          @click="expand"
        >
          <span>{{ isExpanding ? '\u25BC' : '\u25B6' }}</span>
          <span class="ov object key">{{ name }} {{ isExpanding && Object.keys(data).length > 0 ? '{}' : '{...}' }}</span>
        </span>

        <template v-if="isExpanding">
          <span
            v-for="key of Object.keys(data).sort()" class="ov object"
          >
            <wrapper
              class="ov object value"
              :name="key"
              :data="data[key]"
            ></wrapper>
          </span>
        </template>
      </span>
    </template>
  `,
};
