export const defaultConfig = Object.freeze({
  ignorePathCallback: (path) => false,
  defaultExpandCallback: (path) => path.length <= 1,
});

export default defaultConfig;
