var textbox = document.getElementById("textbox")
var button = document.getElementById("btn")

button.addEventListener("click", () => {
    localStorage.name = textbox.value
})

document.write(localStorage.name)
