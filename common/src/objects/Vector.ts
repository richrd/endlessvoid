class Vector {
    public x: number = 0
    public y: number = 0

    public constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }

    public copy() {
        return new Vector(this.x, this.y)
    }

    // Add;
    public add(v: Vector) {
        this.x = this.x + v.x
        this.y = this.y + v.y
        return this
    }

    // Subtract;
    public sub(v: Vector) {
        this.x = this.x - v.x
        this.y = this.y - v.y
        return this
    }

    // Multiply;
    public mul(m: number) {
        this.x = this.x * m
        this.y = this.y * m
        return this
    }

    // Divide;
    public div(d: number) {
        this.x = this.x / d
        this.y = this.y / d
        return this
    }

    // Rotate;
    public rotate(angle: number) {
        const ang = -angle * (Math.PI / 180)
        const cos = Math.cos(ang)
        const sin = Math.sin(ang)
        const x = this.x
        const y = this.y
        this.x = x * cos - y * sin
        this.y = x * sin + y * cos
        return this
    }

    // Magnitude (length);
    public mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
}

export { Vector }
