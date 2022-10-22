import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to register and login", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };
    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visitAndCheck("/");
    cy.findByRole("link", { name: /sign up/i }).click();

    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /sign up/i }).click();

    cy.findByRole("link", { name: /your links/i }).click();
    cy.findByRole("textbox", { name: /enter tags/i }).should("exist");

    cy.findByRole("link", { name: /settings/i }).click();
    cy.findByRole("button", { name: /log out/i }).click();

    cy.findByRole("link", { name: /log in/i });
  });

  it("should allow you to save a link", () => {
    const testLink = {
      url: `https://example.com#${faker.word.noun()}`,
      description: faker.lorem.sentences(1),
      tags: "foo+bar,baz wibble+wobble,wubble",
    };
    cy.login();
    cy.visitAndCheck("/");

    cy.findByRole("link", { name: /Your links/i }).click();
    cy.findByText("You haven't added any links yet.");

    cy.findAllByRole("link", { name: /New link/i })
      .first()
      .click();

    cy.findByRole("textbox", { name: /URL/i }).type(testLink.url);
    cy.findByRole("textbox", { name: /Description/i }).type(
      testLink.description
    );
    cy.findByRole("textbox", { name: /Tags/i }).type(testLink.tags);
    cy.findByRole("button", { name: /save/i }).click();
    cy.wait(5000);

    cy.findByRole("link", { name: /your links/i }).click();
    cy.findByRole("link", { name: testLink.url }).should("exist");
    cy.findByText(testLink.description).should("exist");

    cy.findByRole("link", { name: /edit link/i }).click();
    cy.wait(2000);
    cy.findByRole("button", { name: /delete/i }).click();
    cy.wait(2000);
    cy.findByText("You haven't added any links yet.").should("exist");
  });

  it("should warn on duplicate links", () => {
    const testLink = {
      url: `https://example.com/${faker.word.noun()}`,
      description: faker.lorem.sentences(1),
      tags: "test",
    };
    cy.login();
    cy.visitAndCheck("/links/new");

    // Save initial link
    cy.findByRole("textbox", { name: /URL/i }).type(testLink.url);
    cy.findByRole("textbox", { name: /Description/i }).type(
      testLink.description
    );
    cy.findByRole("textbox", { name: /Tags/i }).type(testLink.tags);
    cy.findByRole("button", { name: /save/i }).click();
    cy.wait(5000);

    // Expect no warning on edit
    cy.findByRole("link", { name: /your links/i }).click();
    cy.findByRole("link", { name: testLink.url }).should("exist");
    cy.findByRole("link", { name: /edit link/i }).click();
    cy.wait(1000);
    cy.findAllByText("This link has been saved before.").should("not.exist");

    // Expect warning on new link
    cy.visitAndCheck("/links/new");
    cy.findByRole("textbox", { name: /URL/i }).type(testLink.url);
    cy.wait(1000);
    cy.findByText("This link has been saved before.").should("exist");
  });
});
