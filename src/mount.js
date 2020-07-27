import { createApp, render } from "vue/dist/vue.esm-browser";
import Wrapper from "./components/Wrapper";
import { defaultConfig } from "./config";

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
  }).mount(el);
};
