import { FULL_CIRCLE_RADIANS } from "./constants"
import { Vector } from "../../common/src/objects/vector"
import { Shape } from "../../common/src/objects/shape"


class Renderer {
    private canvas_selector: string
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

    drawShape(center: Vector, shape: any) {
        this.ctx.beginPath();
        let p = center.copy().add(shape.points[shape.points.length-1])
        this.ctx.lineTo(p.x, p.y)

        for (const point of shape.points) {
            p = center.copy().add(point)
            this.ctx.lineTo(p.x, p.y)
        };
        this.ctx.stroke();
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
            const ship_center = new Vector(center_x + item.x, center_y + item.y)
            const rotated_shape = this.ship_shape.copy().rotate(item.angle);
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
