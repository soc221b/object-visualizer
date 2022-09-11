export const defaultConfig = Object.freeze({
  rootName: '',
  expandOnCreatedAndUpdated: (path: string) => false,
  getKeys: (object: Record<string, any>, path: string) => Object.keys(object),
})
