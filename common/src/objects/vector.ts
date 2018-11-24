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

    add(v: Vector) {
        this.x = this.x + v.x
        this.y = this.y + v.y
        return this
    }

    sub(v: Vector) {
        this.x = this.x - v.x
        this.y = this.y - v.y
        return this
    }

    mul(m: number) {
        this.x = this.x * m
        this.y = this.y * m
        return this
    }

    div(d: number) {
        this.x = this.x / d
        this.y = this.y / d
        return this
    }
}

export { Vector }
