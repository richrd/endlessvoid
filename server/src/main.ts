const MainLoop = require("mainloop.js")

import { Logging } from "../../common/src/logging/logging"
import { Server } from "./server"
import { Client } from "./client"

const network_update_ms = 1000 / 40 // 25ms (40fps)

class Main {
    private server: Server = new Server()
    private clients: any = {}
    private lastClientId = 0
    private logger: any = Logging.newLogger("Main")
    private clientUpdateInterval: NodeJS.Timeout

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
        if (!this.getClients().length) {
            // Start the loop if this is the first client
            this.start()
        }
        this.addClient(socket)
    }

    newClientId() {
        this.lastClientId += 1
        return this.lastClientId
    }

    // Run when a client connection is verified
    addClient(socket: any) {
        const id = this.newClientId()
        const client = new Client(this, id, socket)
        this.clients[id] = client
        this.logger.log("Total clients:" + this.getClients().length)
    }

    removeClient(client: Client) {
        delete this.clients[client.id]
        if (!this.getClients().length) {
            this.onAllClientsLeft()
        }
    }

    getClients(): Client[] {
        return Object.values(this.clients)
    }

    onAllClientsLeft() {
        this.stop()
        this.lastClientId = 0
    }

    sendClientUpdates() {
        const state = this.getClients().map((client: Client) =>
            client.state.serialize()
        )
        for (const client of this.getClients()) {
            client.sendUpdate(state)
        }
    }

    begin() {}

    update(delta: number) {
        for (const client of this.getClients()) {
            client.update(delta)
        }
    }
}

export { Main }
