/// <reference types="cypress" />

import path from 'path'
import { mount } from '../../../dist/object-visualizer.esm'

const options = {
  rootName: '$',
}

describe('primitive', () => {
  it('should works with null', () => {
    cy.visit(path.join(__dirname, '../../fixtures/index.html'))
    cy.get('#app')
      .then((app) => {
        mount(null, app[0], options)
      })
      .should('contain.text', 'null')
  })

  it('should works with boolean', () => {
    cy.visit(path.join(__dirname, '../../fixtures/index.html'))
    cy.get('#app')
      .then((app) => {
        mount(false, app[0], options)
      })
      .should('contain.text', 'false')
  })

  it('should works with number', () => {
    cy.visit(path.join(__dirname, '../../fixtures/index.html'))
    cy.get('#app')
      .then((app) => {
        mount(42, app[0], options)
      })
      .should('contain.text', '42')
  })

  it('should works with string', () => {
    cy.visit(path.join(__dirname, '../../fixtures/index.html'))
    cy.get('#app')
      .then((app) => {
        mount('foo', app[0], options)
      })
      .should('contain.text', '"foo"')
  })
})
