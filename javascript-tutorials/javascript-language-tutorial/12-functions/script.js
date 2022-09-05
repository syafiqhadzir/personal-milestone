/* 
    Format:

    function funcName() {
        expression
    }

    JavaScript statements are composed of:

    Values, Operators, Expressions, Keywords, and Comments.
*/

function sayHi(name, age) {
    document.write("<h1>Hello, " + name + "!</h1>")
    alert("Hey! you are " + age + "!")
}

sayHi("Syafiq", 24) // Statement


function addition(num1, num2) {
    return num1 + num2
}

var addedNumbers = addition(4, 100)

documment.write(addedNumbers)

/*
    Notes:-

    Methods: A property containing a function definition.

*/

class car {
    constructor(name, age) {
        this.name = name
        this.age = age
    }
}