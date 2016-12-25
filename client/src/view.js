class View {
  constructor (main) {
    this.main = main
    this.edge_threshhold = 40
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.origin = new Vector()
    this.viewPadding = new Vector()

    this.minimap = new Minimap(this.main)
  }

  init () {
    let size = this.getViewportSize()
    this.viewPadding = new Vector(size.x * 0.4, size.y * 0.4)

    this.starfield = new Starfield(this.main)
    this.starfield.createStars()
  }

  setCanvasSize (size) {
    this.canvas.width = size.x
    this.canvas.height = size.y
  }

  getViewportSize () {
    return new Vector(
      window.innerWidth,
      window.innerHeight
    )
  }

  translateCoords (c) {
    let center = new Vector(window.innerWidth / 2, window.innerHeight / 2)
    return c.copy().add(center).add(this.origin)
  }

  updateOrigin (target) {
    let size = this.getViewportSize()
    let screen_pos = this.translateCoords(target.copy())
    if (screen_pos.x < this.viewPadding.x) {
      let delta = new Vector(this.viewPadding.x - screen_pos.x, 0)
      this.origin.add(delta)
      this.starfield.update(delta)
    }
    if (screen_pos.x > size.x - this.viewPadding.x) {
      let delta = new Vector(size.x - screen_pos.x - this.viewPadding.x, 0)
      this.origin.add(delta)
      this.starfield.update(delta)
    }
    if (screen_pos.y < this.viewPadding.y) {
      let delta = new Vector(0, this.viewPadding.y - screen_pos.y)
      this.origin.add(delta)
      this.starfield.update(delta)
    }
    if (screen_pos.y > size.y - this.viewPadding.y) {
      let delta = new Vector(0, size.y - screen_pos.y - this.viewPadding.y)
      this.origin.add(delta)
      this.starfield.update(delta)
    }
  }

  render () {
    this.updateOrigin(this.main.player_ship)
    this.setCanvasSize(this.getViewportSize())
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.starfield.render(this.ctx)
    this.main.planets.forEach((planet) => planet.render(this.ctx))
    this.minimap.render(this.ctx)
    this.main.player_ship.render(this.ctx)
  }

}
