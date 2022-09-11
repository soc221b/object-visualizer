/// <reference types="cypress" />

import path from 'path'
import { mount } from '../../../dist/object-visualizer.esm'
import {
  primitiveInObject,
  arrayInObject,
  objectInObject,
} from '../../fixtures/index'

const options = {
  rootName: '$',
  expandOnCreatedAndUpdated: () => true,
}

describe('object', () => {
  it('should works with primitive', () => {
    cy.visit(path.join(__dirname, '../../fixtures/index.html'))

    cy.get('#app')
      .then((app) => {
        mount(primitiveInObject, app[0], options)
      })
      .should('contain.text', 'null')
      .should('contain.text', 'false')
      .should('contain.text', '42')
      .should('contain.text', '"foo"')
  })

  it('should works with array', () => {
    cy.visit(path.join(__dirname, '../../fixtures/index.html'))

    cy.get('#app')
      .then((app) => {
        mount(arrayInObject, app[0], options)
      })
      .should('contain.text', 'null')
      .should('contain.text', 'false')
      .should('contain.text', '42')
      .should('contain.text', '"foo"')
  })

  it('should works with object', () => {
    cy.visit(path.join(__dirname, '../../fixtures/index.html'))

    cy.get('#app')
      .then((app) => {
        mount(objectInObject, app[0], options)
      })
      .should('contain.text', 'null')
      .should('contain.text', 'false')
      .should('contain.text', '42')
      .should('contain.text', '"foo"')
  })
})
