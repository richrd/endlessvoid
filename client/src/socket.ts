import {
    MSG_TYPE_HANDSHAKE_CLIENT,
    MSG_TYPE_SERVER_PLAYER_STATE,
} from "../../common/src/constants"

class Socket {
    public connection: any
    private WebSocket =
        (window as any).WebSocket || (window as any).MozWebSocket
    private open: boolean = false

    constructor() {}

    connect(url: string) {
        console.log(`Socket.connect(${url})`)
        this.connection = new WebSocket(url, "dummy-protocol")
    }

    bind() {
        this.connection.onopen = () => {
            this.open = true
            console.log("Socket:onopen")
            this.send(
                JSON.stringify({
                    type: MSG_TYPE_HANDSHAKE_CLIENT,
                })
            )
            // connection is opened and ready to use
        }

        this.connection.onerror = (error: any) => {
            this.open = false
            console.log("Socket:onerror", error)
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
