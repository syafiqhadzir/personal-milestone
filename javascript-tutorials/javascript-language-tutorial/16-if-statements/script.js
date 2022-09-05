var isMale = true
var isTall = false

if (isMale && isTall) { // && and, || or
    document.write("You are either male or tall")
} else if (isMale && !isTall) {
    document.write("You are a short male.")
} else if (!isMale && isTall) {
    document.write("You are not male, but you are tall.")
} else {
    document.write("You are either not male nor tall.")
}
