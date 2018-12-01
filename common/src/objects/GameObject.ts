import { Vector } from "./Vector"

class GameObject extends Vector {
    public speed: Vector = new Vector()

    public serialize() {
        return {
            x: this.x,
            y: this.y,
            speed_x: this.speed.x,
            speed_y: this.speed.y,
        }
    }
}

export { GameObject }
