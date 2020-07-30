export const objectToString = (...args) =>
  Object.prototype.toString.call(...args).slice(8, -1);
