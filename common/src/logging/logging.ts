/*
 * Centralized logging feature
 */

// Mapping from log types to console logging functions
const console_functions: any = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    success: console.info,
}

// Basic terminal colors
const console_colors: any = {
    fg_black: "\x1b[30m",
    fg_red: "\x1b[31m",
    fg_green: "\x1b[32m",
    fg_yellow: "\x1b[33m",
    fg_blue: "\x1b[34m",
    fg_magenta: "\x1b[35m",
    fg_cyan: "\x1b[36m",
    fg_white: "\x1b[37m",
    reset: "\x1b[0m",
}

// Log type to color map
const type_to_color: any = {
    log: console_colors.fg_white,
    info: console_colors.fg_cyan,
    warn: console_colors.fg_magenta,
    error: console_colors.fg_red,
    success: console_colors.fg_green,
}

const isBrowser = new Function("try {return !!window;}catch(e){ return false;}")

// Logging manager that has access to all existing loggers
class LoggingManager {
    private isBrowser = isBrowser()

    constructor() {}

    // Get a new named logger instance
    newLogger(name: string) {
        const logger = new Logger(this, name)
        return logger
    }

    log(logger: Logger, type: string, data: any) {
        if (this.isBrowser) {
            this.logToBrowser(logger, type, data)
        } else {
            this.logToNode(logger, type, data)
        }
    }

    // Print logs to browser console
    logToBrowser(logger: Logger, type: string, data: any) {
        const console_func = console_functions[type]
            ? console_functions[type]
            : console.log
        // Padded type string
        const type_str = type.toUpperCase() + Array(8 - type.length).join(" ")
        const message = data.toString()
        const text = `${logger.name}: ${message}`
        console_func(text)
    }

    // Print logs to terminal in a nice format
    logToNode(logger: Logger, type: string, data: any) {
        const console_func = console_functions[type]
            ? console_functions[type]
            : console.log
        const timestamp = new Date().toString()
        // Padded type string
        const type_str = type.toUpperCase() + Array(8 - type.length).join(" ")
        const message = data.toString()
        let text = `${timestamp} | ${type_str} | ${logger.name}: ${message}`
        text = type_to_color[type] + text + console_colors.reset
        console_func(text)
    }
}

// Logger class that other components use for logging to console and/or file
class Logger {
    public name: string
    private parent: LoggingManager

    constructor(parent: LoggingManager, name: string) {
        this.parent = parent
        this.name = name
    }

    // All logging goes through this function
    handleLogEntry(type: string, data: any) {
        this.parent.log(this, type, data)
    }

    // Log generic data
    log(data: any) {
        this.handleLogEntry("log", data)
    }

    // Log informational data
    info(data: any) {
        this.handleLogEntry("info", data)
    }

    // Log success messages
    success(data: any) {
        this.handleLogEntry("success", data)
    }

    // Log warnings
    warn(data: any) {
        this.handleLogEntry("warn", data)
    }

    // Log errors
    error(data: any) {
        this.handleLogEntry("error", data)
    }
}

const Logging = new LoggingManager()
export { Logging }
