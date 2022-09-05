var fruits = ["Apples", "Oranges"]
var person = {
    name: "Mike",
    age: 23,
    isMale: true,
    occupation: "programmer",
    printName: function () {
        document.write("<h1>" + this.name + "</h1>")
    }
}
person.name = "Joe"
var phrase = "Strings are cool!"
document.write(person.isMale)
document.write(phrase.length)
person.printName()