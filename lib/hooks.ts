import { ref, watch } from 'vue'
import type { Path } from './util'

export const cache = new Set()

export function useExpand<T>(props: {
  path: Path
  data: T
  expandOnCreatedAndUpdated: (path: Path) => boolean
  collapseSignal: boolean
  expandSignal: boolean
}) {
  const isExpanding = ref(false)
  const toggle = () => {
    isExpanding.value = !isExpanding.value
  }

  const innerCollapseSignal = ref(false)
  const collapse = () => {
    isExpanding.value = false
    innerCollapseSignal.value = !innerCollapseSignal.value
  }
  watch(() => props.collapseSignal, collapse)

  const innerExpandSignal = ref(false)
  const expand = () => {
    isExpanding.value = true
    innerExpandSignal.value = !innerExpandSignal.value
  }
  watch(() => props.expandSignal, expand)

  const handleClick = (ev: MouseEvent) => {
    cache.clear()

    if (ev.metaKey === true && ev.shiftKey === true) {
      collapse()
    } else if (ev.metaKey === true) {
      expand()
    } else {
      toggle()
    }
  }

  watch(
    () => props.data,
    () => {
      const shouldExpand = props.expandOnCreatedAndUpdated(props.path)
      if (shouldExpand) {
        expand()
      } else {
        collapse()
      }
    },
    { immediate: true },
  )

  return {
    isExpanding,
    innerCollapseSignal,
    innerExpandSignal,
    handleClick,
  }
}
