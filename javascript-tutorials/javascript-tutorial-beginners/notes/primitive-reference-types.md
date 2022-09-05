**Primitive Types**

```javascript
let name = "Syafiq"; // String
let age = 30; // Number, there is only 1 type of number. JavaScript is a dynamic language.
let isApproved = false; // Boolean
let firstName = undefined;
let lastName = null; // Object
```

**Object Example**

```javascript
let person = {
  name: "Syafiq",
  age: 30,
};
```

```javascript
// Dot Notation:
person.name = "Syafiq";

// Bracket Notation
let selection = "name";
person[selection] = "Hadzir";
```

**Good to know:-**

| Primitives | References |
| :--------: | :--------: |
|   String   |   Object   |
|   Number   |   Array    |
|  Boolean   |  Function  |
| Undefined  |
|   Symbol   |
