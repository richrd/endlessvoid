class Minimap {
  constructor (main) {
    this.main = main
    this.minimap_scale = 0.0100
    this.minimap_scale_min = 0.0010
    this.minimap_scale_max = 0.1

    this.minimap_center = new Vector(130, 130)
    this.minimap_radius = 90
  }

  scale (mul) {
    this.minimap_scale = this.minimap_scale * mul
    if (this.minimap_scale < this.minimap_scale_min) {
      this.minimap_scale = this.minimap_scale_min
    }
    if (this.minimap_scale > this.minimap_scale_max) {
      this.minimap_scale = this.minimap_scale_max
    }
  }

  translate (v) {
    // WTF?
    return v.copy().add(this.main.player_ship.copy().invert()).mul(this.minimap_scale).add(this.minimap_center)
  }

  render (ctx) {
    /*
     * save() allows us to save the canvas context before
     * defining the clipping region so that we can return
     * to the default state later on
     */
    ctx.save()

    ctx.strokeStyle = 'rgba(180,220,255, .3)'
    ctx.fillStyle = 'rgba(180,220,255, .05)'

    // Minimap outline
    ctx.beginPath()
    ctx.arc(this.minimap_center.x, this.minimap_center.y, this.minimap_radius, 0, Math.PI * 2, true)
    ctx.stroke()
    ctx.fill()
    ctx.clip() // Clip

    // Minimap center marker
    ctx.beginPath()
    ctx.fillStyle = 'rgb(255,255,255)'
    ctx.arc(this.minimap_center.x, this.minimap_center.y, 2, 0, Math.PI * 2, true)
    ctx.fill()

    // Ship angle marker
    ctx.strokeStyle = 'rgba(180,220,255, .3)'
    let d1 = Helpers.rotatePoint({x: this.minimap_radius, y: 0}, this.main.player_ship.angle)
    d1 = new Vector(d1.x, d1.y)
    d1.add(this.minimap_center)
    let d2 = Helpers.rotatePoint({x: this.minimap_radius - (this.minimap_radius * 0.1), y: 0}, this.main.player_ship.angle)
    d2 = new Vector(d2.x, d2.y)
    d2.add(this.minimap_center)
    ctx.beginPath()
    ctx.moveTo(d2.x, d2.y)
    ctx.lineTo(d1.x, d1.y)
    ctx.stroke()

    // Ship speed vector indicator
    ctx.strokeStyle = 'rgba(180,220,255, .3)'
    let speed_pos = this.main.player_ship.speed.copy().mul(20)
    if (new Vector().dist(speed_pos) > this.minimap_radius) {
      ctx.strokeStyle = 'rgba(255,120,50, .9)'
      speed_pos.mul(0.4)
    }
    speed_pos.add(this.minimap_center)
    ctx.beginPath()
    ctx.moveTo(this.minimap_center.x, this.minimap_center.y)
    ctx.lineTo(speed_pos.x, speed_pos.y)
    ctx.stroke()

    // Planets
    ctx.strokeStyle = 'rgba(180, 255, 180, .4)'
    ctx.fillStyle = 'rgba(180, 255, 180, 0.01)'
    ctx.strokeStyle = 'rgba(180,255,180, .6)'
    ctx.fillStyle = 'rgba(50,200,50, .05)'
    for (var i = this.main.planets.length - 1; i >= 0; i--) {
      let p = this.translate(this.main.planets[i])
      // Add 100px to avoid skipping objects before they're completely out of view
      if (this.minimap_center.dist(p) > this.minimap_radius + 100) { continue }
      ctx.beginPath()
      ctx.arc(p.x, p.y, this.main.planets[i].radius * this.minimap_scale, 0, Math.PI * 2, true)
      ctx.stroke()
      ctx.fill()
    }

    /*
     * restore() restores the canvas context to its original state
     * before we defined the clipping region
     */
    ctx.restore()
  }

}
