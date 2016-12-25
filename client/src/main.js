
class Game {
  constructor () {
    // Core
    this.max_fps = 60
    this.keyboard = new Keyboard()
    this.view = new View(this)

    // Game
    this.planets = []
    this.player_ship = new SpaceShip(this)
    this.client = new Client(this)
  }

  setMaxFPS (fps) {
    MainLoop.setMaxAllowedFPS(fps)
  }

  init () {
    let planet = new Planet(this)
    planet.init().add(new Vector(500, 0))
    this.planets.push(planet)
    planet = new Planet(this)
    planet.init().add(new Vector(-500, 0))
    this.planets.push(planet)

    document.addEventListener('mousewheel', (e) => this.mousewheel(e), false)
  }

  mousewheel (e) {
    let mul = 0.9
    if (e.wheelDelta > 0) {
      mul = 1.1
    }
    this.view.minimap.scale(mul)
  }

  start () {
    this.client.init()
    this.keyboard.init()
    this.view.init()
    MainLoop.setMaxAllowedFPS(this.max_fps)
    MainLoop.setBegin(
      () => this.input()
    ).setUpdate(
      delta => this.update(delta)
    ).setDraw(
      () => this.render()
    ).start()
  }

  input () {
    // Arrow Keys
    //   38
    // 37  39
    //   40

    // Turn
    if (this.keyboard.isPressed(37)) {  // Left
      this.player_ship.turn(-1)
    } else if (this.keyboard.isPressed(39)) {  // Right
      this.player_ship.turn(1)
    } else {
      this.player_ship.turn(0)
    }

    // Accelerate & Brake
    let turbo = this.keyboard.isPressed(90)  // Z
    if (this.keyboard.isPressed(38)) {  // Up
      this.player_ship.thrust(1, turbo)
    } else {
      this.player_ship.thrust(0, turbo)
    }
    if (this.keyboard.isPressed(40)) {  // Down
      this.player_ship.decelerate()
    }
  }

  communicate () {
    let pos = [this.player_ship.x, this.player_ship.y]
    this.socket.emit('state', pos)
  }

  update (delta) {
    this.player_ship.update(delta)
    this.planets.forEach((planet) => planet.update(delta, this.player_ship))
  }

  render () {
    this.view.updateOrigin(this.player_ship)
    this.view.render()
  }
}

var game = new Game()
game.init()
game.start()
