/*
 * An x, y, z vector with and chainable methods for manipulation.
 */
class Vector {
  constructor (x = 0, y = 0, z = 0) {
    // Handle objects that contain properties x, y, z.
    if (typeof x === 'object' && 'x' in x && 'y' in x) {
      if ('z' in x) {
        z = x.z
      }
      y = x.y
      x = x.x
    }
    this.x = x
    this.y = y
    this.z = z
  }

  dist (v) {
    let xd = this.x - v.x
    let yd = this.y - v.y
    return Math.sqrt(Math.pow(Math.abs(xd), 2) + Math.pow(Math.abs(yd), 2))
  }

  copy () {
    return new Vector(this.x, this.y, this.z)
  }

  add (v) {
    this.x = this.x + v.x
    this.y = this.y + v.y
    this.z = this.z + v.z
    return this
  }

  sub (v) {
    this.x = this.x - v.x
    this.y = this.y - v.y
    this.z = this.z - v.z
    return this
  }

  mul (m) {
    this.x = this.x * m
    this.y = this.y * m
    this.z = this.z * m
    return this
  }

  invert () {
    this.x = this.x * -1
    this.y = this.y * -1
    this.z = this.z * -1
    return this
  }

  random (max, negative = false) {
    this.x = Helpers.getRandomInt(0, max.x)
    this.y = Helpers.getRandomInt(0, max.y)
    this.z = Helpers.getRandomInt(0, max.z)

    if (negative) {
      this.x = this.x - (max.x / 2)
      this.y = this.y - (max.y / 2)
      this.z = this.z - (max.z / 2)
    }
    return this
  }
}

/*
 * A particle that has speed and can be moved with update()
 */
class Particle extends Vector {
  constructor (x = 0, y = 0, z = 0) {
    super(x, y, z)
    this.speed = new Vector()
  }

  update (delta) {
    this.x = this.x + this.speed.x * delta
    this.y = this.y + this.speed.y * delta
  }
}

class Polygon {
  constructor (polygon = []) {
    this.polygon = polygon
  }

  copy () {
    let new_shape = new Polygon()
    for (var i = 0; i < this.polygon.length; i++) {
      new_shape.push(this.polygon[i])
    }
    return new_shape
  }

  toString () {
    return JSON.stringify(this.polygon)
  }

  push (p) {
    this.polygon.push(p)
  }

  rotate (angle) {
    let new_shape = new Polygon()
    for (let i = 0; i < this.polygon.length; i++) {
      let rotated = Helpers.rotatePoint(this.polygon[i], angle)
      new_shape.push(rotated)
    }
    return new_shape
  }
}
