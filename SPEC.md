
This document is for planning features and implementation.

# Protocol
There will be two different ways that the client and server communicate: binary and JSON. Time critical data will be
sent efficiently in binary, and non critical data such as game setup and highscores will use JSON.

## Client

### Input
Client input is sent to the server at a very fast rate. To combat latency and bandwith issues the data needs to be
sent in binary to minimize the size of each message. Only the relevant keys are sent, and they should be named
according to the action they take instead of the actual key code or key name. In essence each relevant key should
correspond to an action in the game.

- [X] Only send input state when it has changed compared to the previous sent state
- [ ] Send input state in binary

# Server
- Possible game modes
	- [ ] Capture The Flag
	- [ ] Deathmatch
	- [ ] Team Deathmatch
	- [ ] Conquest (colonize and defend planets)
- Time limit
- Score limit
- Player limit



# Player
- ID
- Name
- Score

## Space Ship

### State
- x: number
- y: number
- speed.x: number
- speed.y: number
- angle: number
- accelerating: boolean
- health: number
- armor: number
- equipped_weapon: number

### Static Properties
- Color
- Acceleration
- Turn speed
- Max Speed