/**
 * A planet
 */
class Planet extends Particle {
  constructor (main) {
    super(0, 0, 0)
    this.main = main
    this.max_gravity_dist = 10000
  }

  init () {
    console.log(this)
    this.radius = 240
    this.mass = this.radius / 2.4
    return this
  }

  update (delta, target) {
    let dist = this.dist(target)

    // Handle Gravity
    if (dist < this.max_gravity_dist) {
      let P2 = target
      let P = this
      let XDiff = P.x - P2.x
      let YDiff = P.y - P2.y
      let Distance = Math.sqrt((Math.pow(XDiff, 2)) + (Math.pow(YDiff, 2)))
      if (Distance < 2) { Distance = 2 }
      let a = 0.125
      let Force = a * (P.mass * P2.mass) / Math.pow(Distance, 2) * 4
      let Acceleration = Force / (P2.mass * 2)
      let XComponent = XDiff / Distance
      let YComponent = YDiff / Distance

      let v = new Vector(Acceleration * XComponent * delta, Acceleration * YComponent * delta)
      target.speed.add(v)
    }
  }

  render (ctx) {
    ctx.strokeStyle = 'rgba(180,255,180, 1)'
    ctx.fillStyle = 'rgba(0,10,0, 1)'
    ctx.beginPath()
    let p = this.main.view.translateCoords(this)
    ctx.arc(p.x, p.y, this.radius, 0, Math.PI * 2, true)
    ctx.fill()
    ctx.stroke()
  }

}

/**
 * The space ship
 */
class SpaceShip extends Particle {
  constructor (main) {
    super(0, 0, 0)
    this.main = main
    this.view = main.view

    this.angle = 270
    this.turning = 0
    this.turn_amount = 0.3
    this.mass = 13 * 13
    this.radius = 10
    this.accel = 0.0005  // Acceleration
    this.accel_turbo = 0.0015  // Turbo Acceleration
    this.decel = 0.0005  // Deceleration

    this.accelerating = false
    this.turbo = false
    this.speed_v = 0
    this.speed_max = 50

    this.shape = new Polygon([
      {x: 10, y: 0},
      {x: -6, y: 7},
      {x: -2, y: 0},
      {x: -6, y: -7},
    ])
  }

  serialize () {
    return [
      parseInt(this.x),
      parseInt(this.y),
      parseInt(this.speed.x),
      parseInt(this.speed.y),
      parseInt(this.angle),
    ]
  }

  decelerate () {
    console.log('decelerate')
  }

  accelerate (delta) {
    let amount = 1
    let accel = this.turbo ? this.accel_turbo : this.accel
    let v = (accel * amount) * delta
    let p = Helpers.rotatePoint({x: v, y: 0}, this.angle)
    this.speed.x = this.speed.x + p.x
    this.speed.y = this.speed.y + p.y
  }

  thrust (state, turbo = false) {
    this.accelerating = state
    this.turbo = turbo
  }

  turn (amount, turbo = false) {
    this.turning = amount
  }

  update (delta) {
    // Accelerate
    if (this.accelerating) {
      this.accelerate(delta)
    }

    // Turn
    if (this.turning) {
      this.angle = this.angle + (this.turn_amount * this.turning) * delta
      if (this.angle > 360) {
        this.angle = this.angle - 360
      }
      if (this.angle < 0) {
        this.angle = 360 - Math.abs(this.angle)
      }
    }

    // Move
    this.x = this.x + this.speed.x * delta
    this.y = this.y + this.speed.y * delta
  }

  render (ctx) {
    ctx.strokeStyle = 'rgba(156,232,255,0.9)'
    ctx.lineWidth = '1.5'
    ctx.beginPath()

    let shape = this.shape.copy().rotate(this.angle)
    let start_p = this.main.view.translateCoords(this.copy().add(shape.polygon[0]))
    ctx.lineTo(start_p.x, start_p.y)
    for (let i = shape.polygon.length - 1; i >= 0; i--) {
      let point = shape.polygon[i]
      let p = this.view.translateCoords(this.copy().add(point))
      ctx.lineTo(p.x, p.y)
    }
    ctx.stroke()
  }

}
