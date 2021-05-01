import { createApp, render } from "vue";
import Wrapper from "./components/Wrapper.vue";
import { defaultConfig } from "./config";

let objectVisualizerUid = 0;

export default (data, el, options = {}) => {
  if (options.rootName === undefined) options.rootName = "";
  if (options.getKeys === undefined) options.getKeys = defaultConfig.getKeys;
  if (options.expandOnCreatedAndUpdated === undefined)
    options.expandOnCreatedAndUpdated = defaultConfig.expandOnCreatedAndUpdated;

  el.classList.add("object-visualizer");
  render(null, el);
  createApp(Wrapper, {
    data: data,
    name: options.rootName,
    path: [],
    expandOnCreatedAndUpdated: options.expandOnCreatedAndUpdated,
    getKeys: options.getKeys,
    objectVisualizerUid: objectVisualizerUid++,
    role: "tree",
    ariaLevel: 0,
  }).mount(el);
};
