import "@testing-library/cypress/add-commands";
import { cleanupUser, login, visitAndCheck } from "./commands";

Cypress.on("uncaught:exception", (err) => {
  // Cypress and React Hydrating the document don't get along
  // for some unknown reason. Hopefully we figure out why eventually
  // so we can remove this.
  if (
    /hydrat/i.test(err.message) ||
    /Minified React error #418/.test(err.message) ||
    /Minified React error #423/.test(err.message)
  ) {
    return false;
  }
  // Weird errors begone
  if (/The user aborted a request/.test(err.message)) {
    return false;
  }
});

Cypress.Commands.add("login", login);
Cypress.Commands.add("cleanupUser", cleanupUser);
Cypress.Commands.add("visitAndCheck", visitAndCheck);
