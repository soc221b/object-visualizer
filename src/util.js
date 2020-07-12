export const toString = (...args) =>
  Object.prototype.toString.call(...args).slice(8, -1);
