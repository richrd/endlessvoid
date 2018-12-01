import {
    MSG_TYPE_CLIENT_HANDSHAKE,
    MSG_TYPE_SERVER_STATE,
} from "../../common/src/Constants"
import { Logging } from "../../common/src/Logging/LoggerManager"

class Socket {
    public connection: any
    private logger: any = Logging.newLogger("Socket")
    private WebSocket = (window as any).WebSocket
    private open: boolean = false

    // constructor() {}

    public connect(url: string) {
        this.logger.log(`Socket.connect(${url})`)
        this.connection = new WebSocket(url, "dummy-protocol")
    }

    public bind() {
        this.connection.onopen = () => {
            this.open = true
            this.logger.log("Socket:onopen")
            this.send(
                JSON.stringify({
                    type: MSG_TYPE_CLIENT_HANDSHAKE,
                    name: "Player",
                }),
            )
        }

        this.connection.onerror = (error: any) => {
            this.open = false
            this.logger.log("Socket:onerror", error)
            // an error occurred when sending/receiving data
        }
    }

    public send(data: any) {
        if (this.open) {
            this.connection.send(data)
        }

        return false
    }
}

export { Socket }