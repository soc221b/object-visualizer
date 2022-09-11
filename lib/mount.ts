import { createApp } from 'vue'
import Wrapper from './components/Wrapper.vue'
import { defaultConfig } from './config'

let objectVisualizerUid = 0

export const mount = (
  data: any,
  el: string | Element,
  options: Partial<typeof defaultConfig> = {},
) => {
  const normalizedOptions: Required<typeof defaultConfig> = {
    rootName: options.rootName ?? defaultConfig.rootName,
    getKeys: options.getKeys ?? defaultConfig.getKeys,
    expandOnCreatedAndUpdated:
      options.expandOnCreatedAndUpdated ??
      defaultConfig.expandOnCreatedAndUpdated,
  }

  if (typeof el !== 'string') el.classList.add('object-visualizer')
  createApp(Wrapper, {
    data: data,
    name: normalizedOptions.rootName,
    path: [],
    expandOnCreatedAndUpdated: normalizedOptions.expandOnCreatedAndUpdated,
    getKeys: normalizedOptions.getKeys,
    objectVisualizerUid: objectVisualizerUid++,
    role: 'tree',
    ariaLevel: 0,
  }).mount(el)
}
