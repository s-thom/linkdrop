import faker from "@faker-js/faker";

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

    cy.visit("/");
    cy.findByRole("link", { name: /sign up/i }).click();

    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /sign up/i }).click();

    cy.findByRole("link", { name: /your links/i }).click();
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
    cy.visit("/");

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

    cy.findByRole("link", { name: testLink.url });
    cy.findByText(testLink.description);

    // TODO: editing and deleting
    // cy.findByRole("button", { name: /delete/i }).click();

    // cy.findByText("No notes yet");
  });
});
