import {
    MSG_TYPE_CLIENT_KEY_STATE,
    MSG_TYPE_SERVER_STATE,
} from "../../common/src/constants"
import { Logging } from "../../common/src/logging/logging"
import { GameObject } from "../../common/src/objects/gameobject"

class Client {
    public game: any
    public id: number
    public name: string
    public key_state: any = {
        left: 0,
        right: 0,
        up: 0,
        down: 0,
    }
    public state: GameObject = new GameObject()
    private closed = false
    private logger: any = Logging.newLogger("Client")
    private socket: any

    constructor(game: any, socket: any) {
        this.game = game
        this.socket = socket

        this.socket.on("message", (message: any) => {
            const data = JSON.parse(message)
            if (data.type === MSG_TYPE_CLIENT_KEY_STATE) {
                this.key_state = data
            }
        })

        this.socket.on("close", () => {
            this.logger.warn("Disconnected")
            this.closed = true
            this.game.removeClient(this)
        })
    }

    update(delta: number) {
        const acceleration = 0.001

        if (this.key_state.left) {
            this.state.speed.x -= acceleration * delta
        }
        if (this.key_state.right) {
            this.state.speed.x += acceleration * delta
        }
        if (this.key_state.up) {
            this.state.speed.y -= acceleration * delta
        }
        if (this.key_state.down) {
            this.state.speed.y += acceleration * delta
        }

        const adjustedSpeed = this.state.speed.copy().mul(delta)

        this.state.add(adjustedSpeed)
    }

    send(data: any) {
        try {
            this.socket.send(JSON.stringify(data))
        } catch (e) {
            this.logger.error("sending data failed", e)
        }
    }

    sendUpdate(state: any) {
        this.send({
            type: MSG_TYPE_SERVER_STATE,
            state: state
        })
    }
}

export { Client }
