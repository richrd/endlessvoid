const mainLoop = require("mainloop.js")
import { Logging } from "../../common/src/Logging/LoggerManager"
import { Vector } from "../../common/src/objects/Vector"
import { Renderer } from "./Renderer"
import { Socket } from "./Socket"

const SERVER_PORT = require("../../config.json").server_port

import {
    MSG_TYPE_CLIENT_KEY_STATE,
    MSG_TYPE_SERVER_STATE,
} from "../../common/src/Constants"
import {
    KEY_ARROW_DOWN,
    KEY_ARROW_LEFT,
    KEY_ARROW_RIGHT,
    KEY_ARROW_UP,
    Keyboard,
} from "./Keyboard"

class Main {
    private logger: any = Logging.newLogger("Main")
    private renderer: Renderer
    private keyboard: Keyboard
    private socket: Socket = new Socket()
    private state: any
    private last_key_state: any = null

    // constructor() {}

    public init() {
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

    public run() {
        this.logger.log("run")
        this.renderer.setSizeByViewport()
        this.renderer.clear()
        this.renderer.setDefaultStyles()

        mainLoop
            .setBegin(() => this.begin())
            .setUpdate((delta: number) => this.update(delta))
            .setDraw(() => this.draw())
            .start()
    }

    public begin() {
        this.sendKeyState()
    }

    // tslint:disable-next-line
    public update(delta: number) {
        // tslint:disable-next-line
        // Implement interpolation here
    }

    public draw() {
        this.renderer.render(this.state)
    }

    private sendKeyState() {
        // TODO: implement the binary protocol
        //       for now JSON is used for testing
        // const kbd = this.keyboard
        // let kbd_state = 0x0000
        // kbd_state = kbd_state ^ (kbd.isDown(KEY_ARROW_LEFT)  ? 0x1000 : 0x0000)
        // kbd_state = kbd_state ^ (kbd.isDown(KEY_ARROW_RIGHT) ? 0x0100 : 0x0000)
        // kbd_state = kbd_state ^ (kbd.isDown(KEY_ARROW_UP)    ? 0x0010 : 0x0000)
        // kbd_state = kbd_state ^ (kbd.isDown(KEY_ARROW_DOWN)  ? 0x0001 : 0x0000)
        // const kbd_array = new Uint32Array(new ArrayBuffer(4))
        // kbd_array[0] = kbd_state
        // for (var i = 0; i < array.length; ++i) {
        //     array[i] = i / 2;
        // }

        const state = JSON.stringify({
            type: MSG_TYPE_CLIENT_KEY_STATE,
            left: this.keyboard.isDown(KEY_ARROW_LEFT) ? 1 : 0,
            right: this.keyboard.isDown(KEY_ARROW_RIGHT) ? 1 : 0,
            up: this.keyboard.isDown(KEY_ARROW_UP) ? 1 : 0,
            down: this.keyboard.isDown(KEY_ARROW_DOWN) ? 1 : 0,
        })

        // Only send the state if it's changed
        if (state !== this.last_key_state) {
            this.socket.send(state)
            this.last_key_state = state
        }
    }
}

export { Main }
