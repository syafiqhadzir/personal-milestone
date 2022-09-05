var messages = document.getElementById("messages")
var textbox = document.getElementById("textbox")
var button = document.getElementById("button")


button.addEventListener("click", () => {
    var newMessage = document.createElement("li")
    newMessage.innerHTML = textbox.value
    messages.appendChild(newMessage)
    textbox.value = ""
})