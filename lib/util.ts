export const objectToString = (thisArg: unknown) =>
  Object.prototype.toString.call(thisArg).slice(8, -1)
