class Keyboard {
  constructor () {
    this.pressed_keys = {}
  }

  init () {
    $(document.body).keydown((event) => {
      let key = event.keyCode
      console.log('keydown:', key)
      this.pressed_keys[key] = true
    })

    $(document.body).keyup((event) => {
      let key = event.keyCode
      let val = this.pressed_keys[key]
      if (val) {
        this.pressed_keys[key] = false
      }
    })
  }

  isPressed (key) {
    return this.pressed_keys[key]
  }

}
