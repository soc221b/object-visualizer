import { ref, watch } from "vue";

export const cache = new Set();

export function useExpand(props = { collapseSignal, expandSignal }) {
  const isExpanding = ref(false);
  const toggle = () => {
    isExpanding.value = !isExpanding.value;
  };

  const innerCollapseSignal = ref(false);
  const collapse = () => {
    isExpanding.value = false;
    innerCollapseSignal.value = !innerCollapseSignal.value;
  };
  watch(() => props.collapseSignal, collapse);

  const innerExpandSignal = ref(false);
  const expand = () => {
    isExpanding.value = true;
    innerExpandSignal.value = !innerExpandSignal.value;
  };
  watch(() => props.expandSignal, expand);

  const handleClick = (ev) => {
    cache.clear();

    if (ev.metaKey === true && ev.shiftKey === true) {
      collapse(ev);
    } else if (ev.metaKey === true) {
      expand(ev);
    } else {
      toggle(ev);
    }
  };

  watch(
    () => props.data,
    () => {
      const shouldExpand = props.expandOnCreatedAndUpdated(props.path);
      if (shouldExpand) {
        expand();
      } else {
        collapse();
      }
    },
    { immediate: true }
  );

  return {
    isExpanding,
    innerCollapseSignal,
    innerExpandSignal,
    handleClick,
  };
}
