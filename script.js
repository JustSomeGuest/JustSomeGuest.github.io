const frame = document.getElementById("contentFrame")

const buttons = document.querySelectorAll(".tabBtn")

buttons.forEach(button => {

    button.addEventListener("click", () => {

        buttons.forEach(btn => {
            btn.classList.remove("active")
        })

        button.classList.add("active")

        frame.src = button.dataset.tab
    })

})
