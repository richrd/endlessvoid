const mainLoop = require("mainloop.js")

import { Logging } from "../../common/src/Logging/LoggerManager"
import { Client } from "./Client"
import { Server } from "./Server"

const network_update_ms = 1000 / 40 // 25ms (40fps)

class Main {
    private server: Server = new Server()
    private clients: any = {}
    private lastClientId = 0
    private logger: any = Logging.newLogger("Main")
    private clientUpdateInterval: NodeJS.Timeout

    // constructor() {}

    public init() {
        this.logger.log("init")
        mainLoop.setUpdate((delta: number) => {
            this.update(delta)
        })
    }

    public run() {
        this.server.onClientConnect((socket: any) => {
            this.clientConnected(socket)
        })
        this.server.start()
    }

    public start() {
        this.logger.info("start")
        mainLoop.start()
        // Send updates to clients
        this.clientUpdateInterval = setInterval(
            () => this.sendClientUpdates(),
            network_update_ms,
        )
    }

    public stop() {
        this.logger.info("stop")
        mainLoop.stop()
        clearInterval(this.clientUpdateInterval)
    }
    // Called with the socket object when a client connects
    public clientConnected(socket: any) {
        // TODO: verify the connection before adding
        if (!this.getClients().length) {
            // Start the loop if this is the first client
            this.start()
        }
        this.addClient(socket)
    }

    public getClients(): Client[] {
        return Object.values(this.clients)
    }

    public update(delta: number) {
        for (const client of this.getClients()) {
            client.update(delta)
        }
    }

    private newClientId() {
        this.lastClientId += 1
        return this.lastClientId
    }

    // Run when a client connection is verified
    private addClient(socket: any) {
        const id = this.newClientId()
        const client = new Client(this, id, socket)
        this.clients[id] = client
        this.logger.log("Total clients:" + this.getClients().length)
    }

    private removeClient(client: Client) {
        delete this.clients[client.id]
        if (!this.getClients().length) {
            this.onAllClientsLeft()
        }
    }

    private onAllClientsLeft() {
        this.stop()
        this.lastClientId = 0
    }

    private sendClientUpdates() {
        const state = this.getClients().map((client: Client) => {
            return client.state.serialize()
        })
        for (const client of this.getClients()) {
            client.sendUpdate(state)
        }
    }
}

export { Main }
