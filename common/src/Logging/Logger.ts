import { LoggingManager } from "./LoggerManager"

// Logger class that other components use for logging to console and/or file
class Logger {
    public name: string
    private parent: LoggingManager

    constructor(parent: LoggingManager, name: string) {
        this.parent = parent
        this.name = name
    }

    // Log generic data
    public log(data: any) {
        this.handleLogEntry("log", data)
    }

    // Log informational data
    public info(data: any) {
        this.handleLogEntry("info", data)
    }

    // Log success messages
    public success(data: any) {
        this.handleLogEntry("success", data)
    }

    // Log warnings
    public warn(data: any) {
        this.handleLogEntry("warn", data)
    }

    // Log errors
    public error(data: any) {
        this.handleLogEntry("error", data)
    }

    // All logging goes through this function
    private handleLogEntry(type: string, data: any) {
        this.parent.log(this, type, data)
    }
}

export { Logger }
