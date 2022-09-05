## Login

```javascript
it("Logging In with Cypress", () => {
  // TODO: Set this as localStorage token for authentication
  const token = "ey123456790";

  cy.viewport("macbook-13");
  cy.visit("https://codedamn.com/");
  cy.contains("Sign In").click();

  cy.get("[data-testid=username]").type("iosdev");
  cy.get("[data-testid=password]").type("iosdev");

  cy.get("[data-testid=login]").click();

  cy.url().should("inclue", "/dashboard");
});
```
