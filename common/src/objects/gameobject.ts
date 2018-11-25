import { Vector } from "./vector"

class GameObject extends Vector {
    public speed: Vector = new Vector()

    serialize() {
        return {
            x: this.x,
            y: this.y,
            speed_x: this.speed.x,
            speed_y: this.speed.y,
        }
    }
}

export { GameObject }
