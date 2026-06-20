const frame = document.getElementById("contentFrame")
const buttons = document.querySelectorAll(".tabBtn")
const menuBtn = document.getElementById("menuBtn")
const sidebar = document.getElementById("sidebar")

buttons.forEach(button => {

    button.addEventListener("click", () => {

        buttons.forEach(btn => {
            btn.classList.remove("active")
        })

        button.classList.add("active")

        frame.style.opacity = "0"

        setTimeout(() => {
            frame.src = button.dataset.tab
            frame.style.opacity = "1"
        }, 150)

        if (window.innerWidth <= 768) {
            sidebar.classList.remove("open")
        }

    })

})

menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open")
})
