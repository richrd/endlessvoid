import {
    MSG_TYPE_CLIENT_KEY_STATE,
    MSG_TYPE_SERVER_STATE,
} from "../../common/src/constants"
import { Logging } from "../../common/src/logging/logging"
import { Vector } from "../../common/src/objects/vector"
import { GameObject } from "../../common/src/objects/gameobject"
import { SpaceShip } from "../../common/src/objects/spaceship"

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
    public state: SpaceShip = new SpaceShip()
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
        const turn_rate = 0.18


        if (this.key_state.left) {
            //this.state.speed.x -= acceleration * delta
            this.state.angle += turn_rate * delta
        }
        if (this.key_state.right) {
            this.state.angle -= turn_rate * delta
        }
        if (this.key_state.up) {
            const v = new Vector(acceleration * delta, 0).rotate(this.state.angle)
            this.state.speed.add(v)
        }
        if (this.key_state.down) {
            const v = new Vector(-acceleration * delta, 0).rotate(this.state.angle)
            this.state.speed.add(v)
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
