class Client {
  constructor () {
    this.socket = null
  }

  init () {
    this.socket = io()
  }

}
