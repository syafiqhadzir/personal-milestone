## File Name

```javascript
const fileName = Math.random().toString().slice(0,3);

cy.get("[data-testid=password]").type(`Get ${fileName} right now!`);
```
