import { Vector } from "./vector"
import { GameObject } from "./gameobject"

class SpaceShip extends GameObject {
    public angle: number = 0

    serialize() {
        return {
            x: this.x,
            y: this.y,
            speed_x: this.speed.x,
            speed_y: this.speed.y,
            angle: this.angle,
        }
    }
}

export { SpaceShip }
