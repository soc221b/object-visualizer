/// <reference types="cypress" />

import path from "path";
import { mount } from "../../../dist/object-visualizer.esm";
import {
  primitiveInArray,
  arrayInArray,
  objectInArray,
} from "../../fixtures/index";

const options = {
  rootName: "$",
  expandOnCreatedAndUpdated: () => true,
};

describe("array", () => {
  it("should works with primitive", () => {
    cy.visit(path.join(__dirname, "../../fixtures/index.html"));

    cy.get("#app")
      .then((app) => {
        mount(primitiveInArray, app[0], options);
      })
      .should("contain.text", "undefined")
      .should("contain.text", "null")
      .should("contain.text", "false")
      .should("contain.text", "42")
      .should("contain.text", '"foo"');
  });

  it("should works with array", () => {
    cy.visit(path.join(__dirname, "../../fixtures/index.html"));

    cy.get("#app")
      .then((app) => {
        mount(arrayInArray, app[0], options);
      })
      .should("contain.text", "undefined")
      .should("contain.text", "null")
      .should("contain.text", "false")
      .should("contain.text", "42")
      .should("contain.text", '"foo"');
  });

  it("should works with object", () => {
    cy.visit(path.join(__dirname, "../../fixtures/index.html"));

    cy.get("#app")
      .then((app) => {
        mount(objectInArray, app[0], options);
      })
      .should("contain.text", "undefined")
      .should("contain.text", "null")
      .should("contain.text", "false")
      .should("contain.text", "42")
      .should("contain.text", '"foo"');
  });
});
