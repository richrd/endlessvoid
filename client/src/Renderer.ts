import { Shape } from "../../common/src/objects/Shape"
import { Vector } from "../../common/src/objects/Vector"
import { FULL_CIRCLE_RADIANS } from "./Constants"

class Renderer {
    private canvas_selector: string
    private canvas: any
    private ctx: any
    private ship_shape = new Shape([
        new Vector(-8, 9),
        new Vector(-3, 0),
        new Vector(-8, -9),
        new Vector(12, 0),
    ])

    constructor(canvas_selector: string) {
        this.canvas_selector = canvas_selector
        this.ctx = null
    }

    public init() {
        this.canvas = document.querySelector(this.canvas_selector) as any
        this.ctx = this.canvas.getContext("2d")
    }

    public setDefaultStyles() {
        this.ctx.strokeStyle = "rgba(255, 255, 255, 1)"
        this.ctx.lineWidth = 3
    }

    public setSizeByViewport() {
        this.ctx.canvas.width = window.innerWidth
        this.ctx.canvas.height = window.innerHeight
    }

    public clear() {
        // TODO: Use the commented line for some cool effect
        // this.ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
        this.ctx.fillStyle = "rgb(100, 0, 0)"
        // this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    public drawShape(center: Vector, shape: any) {
        this.ctx.beginPath()
        let p = center.copy().add(shape.points[shape.points.length - 1])
        this.ctx.lineTo(p.x, p.y)

        for (const point of shape.points) {
            p = center.copy().add(point)
            this.ctx.lineTo(p.x, p.y)
        }
        this.ctx.stroke()
    }

    public render(state: any) {
        if (!state) {
            return
        }

        this.clear()
        this.setDefaultStyles()

        const center_x = window.innerWidth / 2
        const center_y = window.innerHeight / 2

        for (const item of state) {
            const ship_center = new Vector(center_x + item.x, center_y + item.y)
            const rotated_shape = this.ship_shape.copy().rotate(item.angle)
            this.drawShape(ship_center, rotated_shape)
            /*
            this.ctx.beginPath();
            this.ctx.arc(
                ship_center.x,
                ship_center.y,
                1,
                0,
                FULL_CIRCLE_RADIANS
            )
            this.ctx.stroke()
            */
        }
    }
}

export { Renderer }
