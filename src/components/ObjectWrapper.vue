<template>
  <span
    class="object"
    :role="role"
    :aria-expanded="isExpanding"
    :aria-level="ariaLevel"
    :id="id"
  >
    <span class="indicator" @click="handleClick">{{
      isExpanding ? "\u25BC" : "\u25B6"
    }}</span>
    <span class="key" @click="handleClick">{{ name === "" ? "" : name }}</span>
    <span class="separator" @click="handleClick">
      {{ name === "" ? "" : ": " }}
    </span>
    <span class="preview" @click="handleClick">
      {{ isExpanding ? "" : "{...}" }}
    </span>

    <template v-if="isCircular">
      <span v-if="isExpanding" class="value">
        <template v-for="key of keys" :key="key">
          <wrapper
            class="value"
            :name="key"
            :path="path.concat(key)"
            :data="data[key]"
            :expand-signal="innerExpandSignal"
            :collapse-signal="innerCollapseSignal"
            :expandOnCreatedAndUpdated="() => false"
            :getKeys="getKeys"
            :object-visualizer-uid="objectVisualizerUid"
            :aria-level="ariaLevel"
          ></wrapper>
        </template>
      </span>
    </template>

    <template v-else>
      <span v-show="isExpanding" class="value">
        <template v-for="key of keys" :key="key">
          <wrapper
            class="value"
            :name="key"
            :path="path.concat(key)"
            :data="data[key]"
            :expand-signal="innerExpandSignal"
            :collapse-signal="innerCollapseSignal"
            :expandOnCreatedAndUpdated="expandOnCreatedAndUpdated"
            :getKeys="getKeys"
            :object-visualizer-uid="objectVisualizerUid"
            :aria-level="ariaLevel"
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
  inheritAttrs: false,
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
        return objectToString(data) === "Object";
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

    objectVisualizerUid: {
      required: true,
      type: Number,
    },
    id: {
      required: true,
      type: String,
    },
    role: {
      required: true,
      type: String,
    },
    ariaLevel: {
      required: true,
      type: Number,
    },
  },
  setup(props) {
    const { isExpanding, innerExpandSignal, innerCollapseSignal, handleClick } =
      useExpand(props);

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
