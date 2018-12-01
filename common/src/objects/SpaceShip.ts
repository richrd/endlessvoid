import { GameObject } from "./GameObject"
import { Vector } from "./Vector"

class SpaceShip extends GameObject {
    public angle: number = 90 // North / Up

    public serialize() {
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
