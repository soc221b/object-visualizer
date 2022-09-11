import { createApp } from 'vue'
import { ObjectVisualizer } from '../../dist/object-visualizer.js'

export const mount = (data, el, options) => {
  const app = createApp(ObjectVisualizer, {
    data,
    ...options,
  })
  app.mount(el)
}
