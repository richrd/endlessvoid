const MainLoop = require("mainloop.js")
import { Logging } from "../../common/src/logging/logging"
import { Vector } from "../../common/src/objects/vector"
import { Socket } from "./socket"
import { Renderer } from "./renderer"

const SERVER_PORT = require("../../config.json").server_port

import {
    MSG_TYPE_CLIENT_KEY_STATE,
    MSG_TYPE_SERVER_STATE,
} from "../../common/src/constants"
import {
    Keyboard,
    KEY_ARROW_UP,
    KEY_ARROW_DOWN,
    KEY_ARROW_LEFT,
    KEY_ARROW_RIGHT,
} from "./keyboard"

class Main {
    private logger: any = Logging.newLogger("Main")
    private renderer: Renderer
    private keyboard: Keyboard
    private socket: Socket = new Socket()
    private state: any

    constructor() {}

    init() {
        this.logger.log("init")
        this.renderer = new Renderer("#canvas")
        this.renderer.init()
        this.keyboard = new Keyboard()
        this.keyboard.bind()

        // FIXME:
        // This is used during development to ensure that the websocket
        // host is the same as the HTTP host. It helps when connecting
        // from different devices on the same network. For example the
        // following hosts will work automatically:
        // - localhost
        // - 0.0.0.0
        // - 192.168.1.123
        const ws_host = window.location.host.split(":")[0]
        this.socket.connect(`ws://${ws_host}:${SERVER_PORT}`)
        this.socket.bind()
        this.socket.connection.onmessage = (message: any) => {
            const data = JSON.parse(message.data)
            if (data.type === MSG_TYPE_SERVER_STATE) {
                this.state = data.state
            }
        }
    }

    run() {
        this.logger.log("run")
        this.renderer.clear()
        this.renderer.setDefaultStyles()

        MainLoop.setBegin(() => this.begin())
            .setUpdate((delta: number) => this.update(delta))
            .setDraw(() => this.draw())
            .start()
    }

    begin() {}

    update(delta: number) {
        this.sendKeyState()
    }

    draw() {
        this.renderer.render(this.state)
    }

    sendKeyState() {
        // TODO: implement the binary protocol
        //       for now JSON is used for testing
        // const keyboard_state_bits = [
        //     this.keyboard.isDown(KEY_ARROW_LEFT) ? 1 : 0,
        //     this.keyboard.isDown(KEY_ARROW_RIGHT) ? 1 : 0,
        //     this.keyboard.isDown(KEY_ARROW_UP) ? 1 : 0,
        //     this.keyboard.isDown(KEY_ARROW_DOWN) ? 1 : 0,
        // ].join("")
        // const keyboard_state_int = parseInt("0x" + keyboard_state_bits);
        const state = {
            type: MSG_TYPE_CLIENT_KEY_STATE,
            left: this.keyboard.isDown(KEY_ARROW_LEFT) ? 1 : 0,
            right: this.keyboard.isDown(KEY_ARROW_RIGHT) ? 1 : 0,
            up: this.keyboard.isDown(KEY_ARROW_UP) ? 1 : 0,
            down: this.keyboard.isDown(KEY_ARROW_DOWN) ? 1 : 0,
        }
        this.socket.send(JSON.stringify(state))
    }
}

export { Main }
