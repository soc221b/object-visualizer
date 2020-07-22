import UndefinedWrapper from "./UndefinedWrapper";
import NullWrapper from "./NullWrapper";
import BooleanWrapper from "./BooleanWrapper";
import NumberWrapper from "./NumberWrapper";
import StringWrapper from "./StringWrapper";
import ArrayWrapper from "./ArrayWrapper";
import ObjectWrapper from "./ObjectWrapper";
import { toString } from "../util";

const Wrapper = {
  name: "wrapper",
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
    ignore: {
      required: true,
      type: Function,
    },
  },
  setup() {
    return {
      toString,
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
    <template
      v-if="ignore(path)"
    >
      <span></span>
    </template>

    <undefined-wrapper
      v-else-if="toString(data) === 'Undefined'"
      :name="name"
      :data="data"
    ></undefined-wrapper>

    <null-wrapper
      v-else-if="toString(data) === 'Null'"
      :name="name"
      :data="data"
    ></null-wrapper>

    <boolean-wrapper
      v-else-if="toString(data) === 'Boolean'"
      :name="name"
      :data="data"
    ></boolean-wrapper>

    <number-wrapper
      v-else-if="toString(data) === 'Number'"
      :name="name"
      :data="data"
    ></number-wrapper>

    <string-wrapper
      v-else-if="toString(data) === 'String'"
      :name="name"
      :data="data"
    ></string-wrapper>

    <array-wrapper
      v-else-if="toString(data) === 'Array'"
      :name="name"
      :path="path"
      :data="data"
      :collapse-signal="collapseSignal"
      :expand-signal="expandSignal"
      :ignore="ignore"
      :expandOnCreatedAndUpdated="expandOnCreatedAndUpdated"
    ></array-wrapper>

    <object-wrapper
      v-else-if="toString(data) === 'Object'"
      :name="name"
      :path="path"
      :data="data"
      :collapse-signal="collapseSignal"
      :expand-signal="expandSignal"
      :ignore="ignore"
      :expandOnCreatedAndUpdated="expandOnCreatedAndUpdated"
    ></object-wrapper>
  `,
};

ArrayWrapper.components.Wrapper = Wrapper;
ObjectWrapper.components.Wrapper = Wrapper;

export default Wrapper;
