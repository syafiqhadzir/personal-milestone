/*
    const menuBtn = document.querySelector('.menu-btn')
    const hamburger = document.querySelector('.menu-btn__burger')
    const nav = document.querySelector('.nav')
    const menuNav = document.querySelector('.menu-nav')
    const navItems = document.querySelector('.menu-nav__item')
 */

const menuBtn = document.querySelector(".menu-btn"),
    hamburger = document.querySelector(".menu-btn__burger"),
    nav = document.querySelector('.nav'),
    menuNav = document.querySelector('.menu-nav'),
    navItems = document.querySelector('.menu-nav__item')

/*
    let showMenu = false
 */

let showMenu = !1

menuBtn.addEventListener('click', toggleMenu)


/*
    function toggleMenu() {
    if (!showMenu) {
        hamburger.classList.add('open')
        nav.classList.add('open')
        menuNav.classList.add('open')
        navItems.forEach(item => item.classList.add('open'))
        showMenu = true
    } else {
        hamburger.classList.remove('open')
        nav.classList.remove('open')
        menuNav.classList.remove('open')
        navItems.forEach(item => item.classList.remove('open'))
        showMenu = false
    }
}
*/

function toggleMenu() {
    showMenu = showMenu ? (
        hamburger.classList.remove("open"),
        nav.classList.remove("open"),
        menuNav.classList.remove("open"),
        navItems.forEach(
            s => s.classList.remove("open")),
        !1
    ) : (
        hamburger.classList.add("open"),
        nav.classList.add("open"),
        menuNav.classList.add("open"),
        navItems.forEach(
            s => s.classList.add("open")),
        !0
    )
}