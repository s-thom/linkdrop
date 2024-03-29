module.exports = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
) => {
  const isDev = config.watchForFileChanges;
  const port = process.env.PORT ?? (isDev ? "3000" : "8811");
  const configOverrides: Partial<Cypress.PluginConfigOptions> = {
    baseUrl: `http://localhost:${port}`,
    video: !process.env.CI,
    screenshotOnRunFailure: !process.env.CI,
    e2e: {
      specPattern: "cypress/e2e",
    },
  };
  Object.assign(config, configOverrides);

  // To use this:
  // cy.task('log', whateverYouWantInTheTerminal)
  on("task", {
    log(message) {
      console.log(message);
      return null;
    },
  });

  return config;
};
