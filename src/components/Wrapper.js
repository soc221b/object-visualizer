import UndefinedWrapper from "./UndefinedWrapper";
import NullWrapper from "./NullWrapper";
import BooleanWrapper from "./BooleanWrapper";
import NumberWrapper from "./NumberWrapper";
import StringWrapper from "./StringWrapper";
import ArrayWrapper from "./ArrayWrapper";
import ObjectWrapper from "./ObjectWrapper";
import { toString } from "../util";

const types = new Set([
  "Undefined",
  "Null",
  "Boolean",
  "Number",
  "String",
  "Array",
  "Object",
]);

const Wrapper = {
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
    return {
      representingType: toString(props.data),
    };
  },
  components: {
    UndefinedWrapper,
    NullWrapper,
    BooleanWrapper,
    NumberWrapper,
    StringWrapper,
    ArrayWrapper,
    ObjectWrapper,
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

    <array-wrapper
      v-else-if="representingType === 'Array'"
      :name="name"
      :data="data"
      :collapse-signal="collapseSignal"
      :expand-signal="expandSignal"
    ></array-wrapper>

    <object-wrapper
      v-else-if="representingType === 'Object'"
      :name="name"
      :data="data"
      :collapse-signal="collapseSignal"
      :expand-signal="expandSignal"
    ></object-wrapper>
  `,
};

ArrayWrapper.components.Wrapper = Wrapper;
ObjectWrapper.components.Wrapper = Wrapper;

export default Wrapper;
