
function max(num1, num2, num3) {
    if (num1 != num2 && num1 >= num3) {
        return num1
    } else if (num2 >= num1 && num2 >= num3) {
        return num2
    } else {
        return num3
    }
}
document.write(max(30, 4, 5))

if ("phrase" == "phrase") {
    document.write("True")
}