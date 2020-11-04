<template>
  <span class="array">
    <span class="indicator" @click="handleClick">{{
      isExpanding ? "\u25BC" : "\u25B6"
    }}</span>
    <span class="key" @click="handleClick">{{ name === "" ? "" : name }}</span>
    <span class="separator" @click="handleClick">{{
      name === "" ? "" : ": "
    }}</span>
    <span class="count" @click="handleClick">
      {{
        isExpanding === false && data.length >= 2 ? "(" + data.length + ")" : ""
      }}
    </span>
    <span class="preview" @click="handleClick">
      {{ isExpanding ? "Array(" + data.length + ")" : "[...]" }}
    </span>

    <template v-if="isCircular">
      <span v-if="isExpanding" class="value">
        <template v-for="key of keys" :key="key">
          <wrapper
            :name="key"
            :path="path.concat(key)"
            :data="data[key]"
            :expand-signal="innerExpandSignal"
            :collapse-signal="innerCollapseSignal"
            :expandOnCreatedAndUpdated="() => [false, false]"
            :getKeys="getKeys"
          ></wrapper>
        </template>
      </span>
    </template>

    <template v-else>
      <span v-show="isExpanding" class="value">
        <template v-for="key of keys" :key="key">
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
    </template>
  </span>
</template>

<script>
import { computed } from "vue";
import { objectToString } from "../util";
import { useExpand, cache } from "../hooks";

export default {
  name: "array-wrapper",
  props: {
    path: {
      required: true,
      validator(path) {
        return (
          objectToString(path) === "Array" &&
          path.every(
            (key) =>
              objectToString(key) === "String" ||
              objectToString(key) === "Number"
          )
        );
      },
    },
    data: {
      required: true,
      validator(data) {
        return objectToString(data) === "Array";
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

    const isCircular = cache.has(props.data);
    cache.add(props.data);

    return {
      keys,
      isExpanding,
      innerExpandSignal,
      innerCollapseSignal,
      handleClick,
      isCircular,
    };
  },
  components: {
    // Wrapper,
  },
};
</script>
