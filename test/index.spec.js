const template = require('../dist/template.cjs.node.js')

test('template', () => {
  expect(template.default()).toBe(true)
})
