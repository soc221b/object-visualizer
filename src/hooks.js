import { ref, watch } from "vue/dist/vue.esm-browser";

export function useExpand(props = { collapseSignal, expandSignal }) {
  const isExpanding = ref(false);
  const expandOrCollapse = () => {
    isExpanding.value = !isExpanding.value;
  };

  const innerCollapseSignal = ref(false);
  const collapseRecursive = (ev) => {
    isExpanding.value = false;
    innerCollapseSignal.value = !innerCollapseSignal.value;
  };
  watch(() => props.collapseSignal, collapseRecursive);

  const innerExpandSignal = ref(false);
  const expandRecursive = () => {
    isExpanding.value = true;
    innerExpandSignal.value = !innerExpandSignal.value;
  };
  watch(() => props.expandSignal, expandRecursive);

  const handleClick = (ev) => {
    if (ev.metaKey === true && ev.shiftKey === true) {
      collapseRecursive(ev);
    } else if (ev.metaKey === true) {
      expandRecursive(ev);
    } else {
      expandOrCollapse(ev);
    }
  };

  watch(
    () => props.data,
    () => {
      const [shouldExpand, isRecursive] = props.expandOnCreatedAndUpdated(
        props.path
      );
      if (shouldExpand) {
        if (isRecursive) expandRecursive();
        else isExpanding.value = true;
      } else {
        if (isRecursive) expandRecursive();
        else isExpanding.value = false;
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
