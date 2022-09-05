**Why use let and not var?**

**Scoping rules**

The main difference is scoping rules. Variables declared by <kbd>var</kbd> keyword are scoped to the immediate function body (hence the function scope) while <kbd>let</kbd> variables are scoped to the immediate enclosing block denoted by <kbd>{ }</kbd> (hence the block scope).

```javascript
function run() {
  var foo = "Foo";
  let bar = "Bar";

  console.log(foo, bar); // Foo Bar

  {
    var moo = "Mooo";
    let baz = "Bazz";
    console.log(moo, baz); // Mooo Bazz
  }

  console.log(moo); // Mooo
  console.log(baz); // ReferenceError
}

run();
```

The reason why <kbd>let</kbd> keyword was introduced to the language was function scope is confusing and was one of the main sources of bugs in JavaScript.

```javascript
var funcs = [];
// let's create 3 functions
for (var i = 0; i < 3; i++) {
  // and store them in funcs
  funcs[i] = function () {
    // each should log its value.
    console.log("My value: " + i);
  };
}
for (var j = 0; j < 3; j++) {
  // and now let's run each one to see
  funcs[j]();
}
```

<kbd>My value: 3</kbd> was output to console each time <kbd>funcs\[j\]\(\);</kbd> was invoked since anonymous functions were bound to the same variable.

People had to create immediately invoked functions to capture correct values from the loops but that was also hairy.

**Hoisting**

While variables declared with <kbd>var</kbd> keyword are hoisted (initialized with <kbd>undefined</kbd> before the code is run) which means they are accessible in their enclosing scope even before they are declared:

```javascript
function run() {
  console.log(foo); // undefined
  var foo = "Foo";
  console.log(foo); // Foo
}

run();
```

<kbd>let</kbd> variables are not initialized until their definition is evaluated. Accessing them before the initialization results in a <kbd>ReferenceError</kbd>. Variable said to be in "temporal dead zone" from the start of the block until the initialization is processed.

```javascript
function checkHoisting() {
  console.log(foo); // ReferenceError
  let foo = "Foo";
  console.log(foo); // Foo
}

checkHoisting();
```

**Creating global object property**

At the top level, <kbd>let</kbd>, unlike <kbd>var</kbd>, does not create a property on the global object:

```javascript
var foo = "Foo"; // globally scoped
let bar = "Bar"; // not allowed to be globally scoped

console.log(window.foo); // Foo
console.log(window.bar); // undefined
```

**Redeclaration**

In strict mode, <kbd>var</kbd> will let you re-declare the same variable in the same scope while <kbd>let</kbd> raises a SyntaxError.

```javascript
"use strict";
var foo = "foo1";
var foo = "foo2"; // No problem, 'foo1' is replaced with 'foo2'.

let bar = "bar1";
let bar = "bar2"; // SyntaxError: Identifier 'bar' has already been declared
```
