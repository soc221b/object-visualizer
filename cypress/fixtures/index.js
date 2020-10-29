export const primitiveInArray = [undefined, null, false, 42, "foo"];

export const primitiveInObject = {
  UndefinedKey: undefined,
  NullKey: null,
  BooleanKey: false,
  NumberKey: 42,
  StringKey: "foo",
};

export const arrayInArray = [[undefined, null, false, 42, "foo"]];

export const arrayInObject = {
  ArrayKey: [undefined, null, false, 42, "foo"],
};

export const objectInArray = [
  {
    UndefinedKey: undefined,
    NullKey: null,
    BooleanKey: false,
    NumberKey: 42,
    StringKey: "foo",
  },
];

export const objectInObject = {
  ObjectKey: {
    UndefinedKey: undefined,
    NullKey: null,
    BooleanKey: false,
    NumberKey: 42,
    StringKey: "foo",
  },
};
