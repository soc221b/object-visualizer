export const primitiveInArray = [null, false, 42, 'foo']

export const primitiveInObject = {
  NullKey: null,
  BooleanKey: false,
  NumberKey: 42,
  StringKey: 'foo',
}

export const arrayInArray = [[null, false, 42, 'foo']]

export const arrayInObject = {
  ArrayKey: [null, false, 42, 'foo'],
}

export const objectInArray = [
  {
    NullKey: null,
    BooleanKey: false,
    NumberKey: 42,
    StringKey: 'foo',
  },
]

export const objectInObject = {
  ObjectKey: {
    NullKey: null,
    BooleanKey: false,
    NumberKey: 42,
    StringKey: 'foo',
  },
}
