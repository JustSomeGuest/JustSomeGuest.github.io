const frame = document.getElementById("contentFrame")
const buttons = document.querySelectorAll(".tabBtn")
const menuBtn = document.getElementById("menuBtn")
const sidebar = document.getElementById("sidebar")
const overlay = document.getElementById("overlay")

buttons.forEach(button => {

    button.addEventListener("click", () => {

        buttons.forEach(btn => btn.classList.remove("active"))
        button.classList.add("active")

        frame.src = button.dataset.tab

        if (window.innerWidth <= 768) {
            sidebar.classList.remove("open")
            overlay.classList.remove("open")
        }

    })

})

menuBtn.addEventListener("click", () => {

    sidebar.classList.toggle("open")
    overlay.classList.toggle("open")

})

overlay.addEventListener("click", () => {

    sidebar.classList.remove("open")
    overlay.classList.remove("open")

})
