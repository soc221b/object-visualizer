export const defaultConfig = Object.freeze({
  keyColors: {
    null: "rebeccapurple",
    boolean: "rebeccapurple",
    number: "rebeccapurple",
    string: "rebeccapurple",
    array: "rebeccapurple",
    object: "rebeccapurple",
  },
  valueColors: {
    null: "blue",
    boolean: "blue",
    number: "blue",
    string: "indianred",
    array: "black",
    object: "black",
  },
  ignorePathCallback: (path) => false,
  defaultExpandCallback: (path) => path.length <= 1,
});

export default defaultConfig;
