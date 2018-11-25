import {
    MSG_TYPE_HANDSHAKE_CLIENT,
    MSG_TYPE_SERVER_STATE,
} from "../../common/src/constants"
import { Logging } from "../../common/src/logging/logging"

class Socket {
    public connection: any
    private logger: any = Logging.newLogger("Socket")
    private WebSocket = (window as any).WebSocket
    private open: boolean = false

    constructor() {}

    connect(url: string) {
        this.logger.log(`Socket.connect(${url})`)
        this.connection = new WebSocket(url, "dummy-protocol")
    }

    bind() {
        this.connection.onopen = () => {
            this.open = true
            this.logger.log("Socket:onopen")
            this.send(
                JSON.stringify({
                    type: MSG_TYPE_HANDSHAKE_CLIENT,
                })
            )
        }

        this.connection.onerror = (error: any) => {
            this.open = false
            this.logger.log("Socket:onerror", error)
            // an error occurred when sending/receiving data
        }
    }

    send(data: any) {
        if (this.open) {
            this.connection.send(data)
        }

        return false
    }
}

export { Socket }
