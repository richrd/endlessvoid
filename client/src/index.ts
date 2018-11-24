import { Main } from "./main"

function start() {
    const main = new Main()
    main.init()
    main.run()
}

document.addEventListener("DOMContentLoaded", function(event) {
    start()
})
