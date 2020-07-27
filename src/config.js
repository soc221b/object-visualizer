export const defaultConfig = Object.freeze({
  expandOnCreatedAndUpdated: (path) => [false, false],
  getKeys: (object, path) => Object.keys(object),
});
