## Viewport

```javascript
// Desktop
it("Every basic elements exist", () => {
  cy.viewport(1280, 720);
  cy.visit("https://codedamn.com/");
});

// Mobile
it("Every basic elements exist on mobile", () => {
  cy.viewport("iphone-5");
  cy.visit("https://codedamn.com/");
});
```
