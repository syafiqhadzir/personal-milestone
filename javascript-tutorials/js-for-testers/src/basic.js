const firstName = 'John'
// firstName = ' Kate'
console.log('Name is: ' + firstName)

let age = 31
console.log('Age is: ' + age)

let ageMoreThan18 = true
console.log('Age is more than 18: ' + ageMoreThan18)

//Conditional Operators
// if (age > 18) {
//     ageMoreThan18 = true
// } else if (age = 18) {
//     ageMoreThan18 = false
// } else {
//     ageMoreThan18 = false
// }
// console.log('Age is more than 18: ' + ageMoreThan18)

ageMoreThan18 = (age > 18) ? true : false

console.log('Age is more than 18: ' + ageMoreThan18)

// Loops
// let i = 0
// while (i < 5) {
//     console.log('i is now : ' + i)
//     i++
// }

for (i = 0; i < 5; i++) {
    console.log('i is now : ' + i)
}

// Functions

function product(a, b) {
    return a * b
}
let result = product(5, 6)

console.log(result)