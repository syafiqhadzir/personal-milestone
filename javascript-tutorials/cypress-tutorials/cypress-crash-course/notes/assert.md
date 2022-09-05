## Assert

```javascript
it("Basic Element Exists", () => {
  // mocha
  // data-* -> data-testid="example"
  cy.contains("New way to learn programming.")
    .should("have.text", "New way to learn programming.")
    .should("exist");

  // cy.get

  // for e.g, Tailwind CSS
  // cy.get('.asyncComponent > div > a')
  // cy.get('[data-testid=menutoggle]').click()
  cy.get("div[id=root]").should("exist");
  cy.get("div#noroot").should("not.exist");
});
```
