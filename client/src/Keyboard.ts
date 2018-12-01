import { Logging } from "../../common/src/Logging/LoggerManager"

const KEY_ARROW_UP = 38
const KEY_ARROW_DOWN = 40
const KEY_ARROW_LEFT = 37
const KEY_ARROW_RIGHT = 39

/*
 * Keep track of what keys are pressed
 */
class Keyboard {
    public debug: boolean = false
    private logger: any = Logging.newLogger("Keyboard")
    private pressed_keys: boolean[]
    private keyDown: Function
    private keyUp: Function

    constructor() {
        this.pressed_keys = []

        this.keyDown = (event: KeyboardEvent) => {
            const key = event.keyCode
            this.pressed_keys[key] = true
            this.keysChanged()
        }

        this.keyUp = (event: KeyboardEvent) => {
            const key = event.keyCode
            this.pressed_keys[key] = false
            this.keysChanged()
        }
    }

    public isDown(key: number) {
        return this.pressed_keys[key]
    }

    public isTapped(key: number) {
        if (this.pressed_keys[key]) {
            this.pressed_keys[key] = false
            return true
        }

        return false
    }

    public bind() {
        document.addEventListener("keydown", this.keyDown as any)
        document.addEventListener("keyup", this.keyUp as any)
    }

    public unbind() {
        document.removeEventListener("keydown", this.keyDown as any)
        document.removeEventListener("keyup", this.keyUp as any)
    }

    private keysChanged() {
        // Debugging
        if (this.debug) {
            this.logger.log("Key Indices:", Object.keys(this.pressed_keys))
            this.logger.log("Key State:", this.pressed_keys)
        }
    }
}

export {
    Keyboard,
    KEY_ARROW_UP,
    KEY_ARROW_DOWN,
    KEY_ARROW_LEFT,
    KEY_ARROW_RIGHT,
}
