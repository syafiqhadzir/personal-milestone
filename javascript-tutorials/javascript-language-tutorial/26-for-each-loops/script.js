var books = [{
    title: "Harry Potter",
    author: "JK Rowling",
    pages: 300
}, {
    title: "Green Eggs & Ham",
    author: "Dr. Seuss",
    pages: 25
}]
var friends = ["Oscar", "Angela", "Kevin"]

books.forEach(function (book) {
    document.write(book.title + "<br />")
    document.write(book.author + "<br />")
})

for (var i = 0; i < friends.length; i++) {
    document.write(friends[i] + "<br />")
}