import { Vector } from "./vector"

class Shape {
    public points: Vector[]

    constructor(points: Vector[]) {
    	this.points = points
    }

    copy() {
    	return new Shape(this.points.map((p) => p.copy()))
    }

    rotate(angle: number) {
    	this.points = this.points.map((p) => p.rotate(angle))
    	return this;
    }
}

export { Shape }
