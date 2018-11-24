/*
 * Handles the logic for a single star in the starfield
 */
class BgStar extends Vector {
  constructor (x, y, z) {
    super(x, y, z)
    this.twinkle = false
    this.color = [255, 255, 255]
    this.z_multiplier = 1
  }

  warp () {
    // Reset star
    this.twinkle = false
    this.color = [255, 255, 255]
    if (Helpers.getRandomInt(0, 10) === 5) {
      this.twinkle = true
    } else {
      this.z = Helpers.getRandomInt(0, 99)
    }
    if (Helpers.getRandomInt(0, 100) > 99) {
      this.color = Helpers.HsvToRgb([Helpers.getRandomInt(0, 255), 205, 250])
      this.z = Helpers.getRandomInt(0, 50) + 49
    }
  }

  move (add, size) {
    // Move the stars when the view origin is moved
    this.add(add)
    if (this.x < 0) {
      this.x = size.x
      this.y = Helpers.getRandomInt(0, size.y)
      this.warp()
    }
    if (this.x > size.x) {
      this.x = 0
      this.y = Helpers.getRandomInt(0, size.y)
      this.warp()
    }
    if (this.y < 0) {
      this.y = size.y
      this.x = Helpers.getRandomInt(0, size.x)
      this.warp()
    }
    if (this.y > size.y) {
      this.y = 0
      this.x = Helpers.getRandomInt(0, size.x)
      this.warp()
    }
  }
}

/*
 * Handles creating, updating and rendering of the starfield
 */
class Starfield {

  constructor (main) {
    this.main = main
    this.view = main.view

    this.star_amount = 100
    this.stars = []
  }

  createStars () {
    let size = this.view.getViewportSize()
    for (var i = 0; i < this.star_amount; i++) {
      let p = new BgStar()
      p.random(new Vector(size.x, size.y, 99), false)
      if (i > this.star_amount / 2) {
        p.z_multiplier = 0.98
      }
      this.stars.push(p)
    }
  }

  update (add) {
    for (var i = this.stars.length - 1; i >= 0; i--) {
      let star = this.stars[i]
      star.move(add.mul(star.z_multiplier), this.view.getViewportSize())
    }
  }

  render (ctx) {
    ctx.strokeStyle = 'rgba(240,240,210, .98)'
    for (var i = this.stars.length - 1; i >= 0; i--) {
      let star = this.stars[i]
      if (star.twinkle) {
        star.z = Helpers.getRandomInt(0, 99)
      }
      let value = 0.4 + (star.z - 1) / 2 / 100.0
      ctx.strokeStyle = 'rgba(' + star.color[0] + ',' + star.color[1] + ',' + star.color[2] + ',' + value + ')'
      ctx.beginPath()
      ctx.arc(star.x, star.y, 0.2 + value, 0, Math.PI * 2, true)
      ctx.stroke()
    };
  }

}
