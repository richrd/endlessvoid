import { Vector } from "./Vector"

class Shape {
    public points: Vector[]

    constructor(points: Vector[]) {
        this.points = points
    }

    public copy() {
        return new Shape(this.points.map(p => p.copy()))
    }

    public rotate(angle: number) {
        this.points = this.points.map(p => p.rotate(angle))
        return this
    }
}

export { Shape }
