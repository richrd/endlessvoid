class Helpers {
  static getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  static rotatePoint (point, angle, origin = {x: 0, y: 0}) {
    return this._rotatePoint(point.x, point.y, origin.x, origin.y, angle)
  }

  /**
   * Rotate each cordinate in an array and return a new array
   */
  static rotatePoints (points, origin, angle) {
    let new_p = []
    for (var i = points.length - 1; i >= 0; i--) {
      let point = points[i]
      let r = Helpers.rotatePoint(point, origin, angle)
      new_p.push(r)
    }
    new_p.reverse()
    return new_p
  }

  static HsvToRgb (color) {
    let h = color[0] / 255
    let s = color[1] / 255
    let v = color[2] / 255
    let h_i = parseInt(h * 6)
    let f = h * 6 - h_i
    let p = v * (1 - s)
    let q = v * (1 - f * s)
    let t = v * (1 - (1 - f) * s)
    let r, g, b
    if (h_i === 0) {
      r = v
      g = t
      b = p
    }
    if (h_i === 1) {
      r = q
      g = v
      b = p
    }
    if (h_i === 2) {
      r = p
      g = v
      b = t
    }
    if (h_i === 3) {
      r = p
      g = q
      b = v
    }
    if (h_i === 4) {
      r = t
      g = p
      b = v
    }
    if (h_i === 5) {
      r = v
      g = p
      b = q
    }

    let rgb = [parseInt(r * 256), parseInt(g * 256), parseInt(b * 256)]
    return rgb
  }

  /**
   * Rotate 2d coordinates around a point and get new coordinates
   */
  static _rotatePoint (pointX, pointY, originX, originY, angle) {
    angle = angle * Math.PI / 180.0
    return {
      x: Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX,
      y: Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY
    }
  }

}
