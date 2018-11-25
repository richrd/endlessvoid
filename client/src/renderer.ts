import { FULL_CIRCLE_RADIANS } from "./constants"

class Renderer {
    private canvas_selector: string
    private ctx: any

    constructor(canvas_selector: string) {
        this.canvas_selector = canvas_selector
        this.ctx = null
    }

    init() {
        this.ctx = (document.querySelector(
            this.canvas_selector
        ) as any).getContext("2d")
    }

    setDefaultStyles() {
        this.ctx.strokeStyle = "rgba(255, 255, 255, 1)"
        this.ctx.lineWidth = 3
    }

    clear() {
        this.ctx.canvas.width = window.innerWidth
        this.ctx.canvas.height = window.innerHeight
    }

    render(state: any) {
        if (!state) {
            return;
        }

        this.clear()
        this.setDefaultStyles()

        const center_x = window.innerWidth / 2
        const center_y = window.innerHeight / 2

        for (const item of state) {
            this.ctx.beginPath();
            this.ctx.arc(
                center_x + item.x,
                center_y + item.y,
                5,
                0,
                FULL_CIRCLE_RADIANS
            )
            this.ctx.stroke()
        }

    }
}

export { Renderer }
