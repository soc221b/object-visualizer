import { createApp } from "vue/dist/vue.esm-browser";
import Wrapper from "./components/Wrapper";

export const mount = (
  data,
  preEl,
  options = {
    rootName: "$",
  }
) => {
  createApp(Wrapper, { data: data, name: options.rootName }).mount(preEl);
};
