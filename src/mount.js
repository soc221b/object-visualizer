import { createApp } from "vue/dist/vue.esm-browser";
import Wrapper from "./components/Wrapper";

export default (
  data,
  el,
  options = {
    rootName: "",
  }
) => {
  el.classList.add("object-visualizer");
  createApp(Wrapper, { data: data, name: options.rootName }).mount(el);
};
