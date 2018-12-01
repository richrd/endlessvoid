import {
    MSG_TYPE_CLIENT_HANDSHAKE,
    MSG_TYPE_CLIENT_KEY_STATE,
    MSG_TYPE_SERVER_STATE,
} from "../../common/src/Constants"

import { Logging } from "../../common/src/Logging/LoggerManager"
import { GameObject } from "../../common/src/objects/GameObject"
import { SpaceShip } from "../../common/src/objects/SpaceShip"
import { Vector } from "../../common/src/objects/Vector"

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

    constructor(game: any, id: number, socket: any) {
        this.game = game
        this.id = id
        this.socket = socket

        this.socket.on("message", (message: string | Buffer | ArrayBuffer) => {
            if (typeof message === "string") {
                this.handleStringMessage(message)
            } else {
                this.handleBinaryMessage(message)
            }
        })

        this.socket.on("close", () => {
            this.logger.warn("Disconnected")
            this.closed = true
            this.game.removeClient(this)
        })
    }

    public update(delta: number) {
        const acceleration = 0.001
        const turn_rate = 0.18

        if (this.key_state.left) {
            this.state.angle += turn_rate * delta
        }
        if (this.key_state.right) {
            this.state.angle -= turn_rate * delta
        }
        if (this.key_state.up) {
            const v = new Vector(acceleration * delta, 0).rotate(
                this.state.angle,
            )
            this.state.speed.add(v)
        }
        if (this.key_state.down) {
            const v = new Vector(-acceleration * delta, 0).rotate(
                this.state.angle,
            )
            this.state.speed.add(v)
        }

        const adjustedSpeed = this.state.speed.copy().mul(delta)

        this.state.add(adjustedSpeed)
    }

    public send(data: any) {
        try {
            this.socket.send(JSON.stringify(data))
        } catch (e) {
            this.logger.error("sending data failed", e)
        }
    }

    public sendUpdate(state: any) {
        this.send({
            state,
            type: MSG_TYPE_SERVER_STATE,
        })
    }

    private handleStringMessage(message: string) {
        // Parse the message as JSON
        let data: any = null
        try {
            data = JSON.parse(message)
        } catch (e) {
            this.logger.error("Unable parse message:" + message)
            return false
        }

        // The type is mandatory
        if (data.type === undefined) {
            this.logger.warn("Message missing type:" + message)
            return false
        }

        // React to different types of messages
        if (data.type === MSG_TYPE_CLIENT_HANDSHAKE) {
            this.logger.info("Client connected:" + message)
        } else if (data.type === MSG_TYPE_CLIENT_KEY_STATE) {
            this.key_state = data
        } else {
            this.logger.warn("Unknown message type:" + data.type)
        }
    }

    private handleBinaryMessage(message: Buffer | ArrayBuffer) {
        // TODO: Implement this
        this.logger.log(message)
    }
}

export { Client }
