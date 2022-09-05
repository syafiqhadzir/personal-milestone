## Typing

```javascript
it("Typing with Cypress", () => {
  cy.viewport("macbook-13");
  cy.visit("https://codedamn.com/");
  cy.contains("Sign In").click();

  cy.contains("Unable to authorize").should("not.exist");

  cy.get("[data-testid=username]").type("admin");
  cy.get("[data-testid=password]").type("admin");

  cy.get("[data-testid=login]").click();

  cy.contains("Unable to authorize").should("exist");
});
```
