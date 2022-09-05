
var numberGrid = [
    [1, 2, 3]
    [4, 5, 6]
    [7, 8, 9]
    [0]
]

document.write(numberGrid[0][0])

for (var i = 0; i < numberGrid.length; i++) {
    for (var j = 0; j < numberGrid[i].length; j++) {
        // document.write("i = " + i + ", j = " + j + "<br />")
        document.write(numberGrid[i][j])
    }
    document.write("<br />")
}