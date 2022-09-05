function handleClick(element) {
    alert('You clicked me!')
    element.innerHTML = "Clicked!"
    element.style.color = "blue"
}

var header = document.getElementById("header")
header.addEventListener("mouseover", () => {
    this.style.color = "blue"
})

header.addEventListener("mouseout", () => {
    this.style.color = "blue"
})
