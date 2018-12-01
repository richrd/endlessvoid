import { Main } from "./Main"

const start = () => {
    const main = new Main()
    main.init()
    main.run()
}

document.addEventListener("DOMContentLoaded", event => {
    start()
})
