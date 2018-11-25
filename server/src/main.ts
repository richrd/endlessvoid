const MainLoop = require("mainloop.js")

import { Logging } from "../../common/src/logging/logging"
import { Server } from "./server"
import { Client } from "./client"

const network_update_ms = 1000 / 40 // 25ms

class Main {
    private server: Server = new Server()
    private clients: Client[] = []
    private lastClientId = 0
    private logger: any = Logging.newLogger("Main")
    private clientUpdateInterval: NodeJS.Timeout;

    constructor() {}

    init() {
        this.logger.log("init")
        MainLoop.setBegin(() => this.begin()).setUpdate((delta: number) =>
            this.update(delta)
        )
    }

    run() {
        this.server.onClientConnect((socket: any) =>
            this.clientConnected(socket)
        )
        this.server.start()
    }

    start() {
        this.logger.info("start")
        MainLoop.start()
        // Send updates to clients
        this.clientUpdateInterval = setInterval(
            () => this.sendClientUpdates(),
            network_update_ms
        )
    }

    stop() {
        this.logger.info("stop")
        MainLoop.stop()
        clearInterval(this.clientUpdateInterval)
    }

    // Called with the socket object when a client connects
    clientConnected(socket: any) {
        // TODO: verify the connection before adding
        if (!this.clients.length) {
            // Start the loop if this is the first client
            this.start()
        }
        this.addClient(socket)
    }

    // Run when a client connection is verified
    addClient(socket: any) {
        const client = new Client(this, socket)
        this.clients.push(client)
        this.logger.log("Total clients:" + this.clients.length)
    }

    removeClient(client: Client) {
        this.clients.splice(this.clients.indexOf(client), 1)

        if (!this.clients.length) {
            this.onAllClientsLeft()
        }
    }

    onAllClientsLeft() {
        this.stop()
        this.lastClientId = 0
    }

    sendClientUpdates() {
        let state = this.clients.map((client) => client.state.serialize())
        for (const client of this.clients) {
            if (!client) {
                continue
            }
            client.sendUpdate(state)
        }
    }

    begin() {}

    update(delta: number) {
        if (!this.clients) {
            return
        }
        for (const client of this.clients) {
            client.update(delta)
        }
    }
}

export { Main }
