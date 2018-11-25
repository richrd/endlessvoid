class Vector {
    public x: number = 0
    public y: number = 0

    constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }

    copy() {
        return new Vector(this.x, this.y)
    }

    // Add
    add(v: Vector) {
        this.x = this.x + v.x
        this.y = this.y + v.y
        return this
    }

    // Subtract
    sub(v: Vector) {
        this.x = this.x - v.x
        this.y = this.y - v.y
        return this
    }

    // Multiply
    mul(m: number) {
        this.x = this.x * m
        this.y = this.y * m
        return this
    }

    // Divide
    div(d: number) {
        this.x = this.x / d
        this.y = this.y / d
        return this
    }

    // Rotate
    rotate(angle: number) {
        const ang = -angle * (Math.PI/180);
        const cos = Math.cos(ang);
        const sin = Math.sin(ang);
        const x = this.x
        const y = this.y
        this.x = x * cos - y * sin
        this.y = x * sin + y * cos
        return this
    }

    // Magnitude (length)
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
}

export { Vector }
