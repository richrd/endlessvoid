# endlessvoid :rocket:

    .     .        .    
       '     /\  .      '
    .    .  /  \  .  +  .
     '     /    \     '
       +  /  ..  \  .   '
    '    / .'  '. \    .
      . /_/  '   \_\
    .    .    .      .   .

Infinite space to explore with a space ship on a HTML5 Canvas.
The idea is to develop this into a game like direction.
The ultimate goal is making it multi player.

## Demo!

[Test it out here.](http://richrd.github.io/) (http://richrd.github.io/)
*The current version is still really bare.*


## TODO

* [ ] Implement a proper timestep (ticks per second)
* [ ] Fix stars and add parallax effect. TODO: reposition all stars on hit
* [ ] Optimize rendering and pre-render common graphics (pickups, etc.)
* [ ] Clean up code and refactor it into proper modern js
* [ ] ~~Improve planet generation~~ Design sun, planet and moon generation.
* [ ] Different looking planets with more variation in size (planet colors and possibly craters etc)
* [ ] Different looking ships
* [ ] Asteroids with polygons
* [ ] Some other flying stuff?!
* [ ] Create proper game logic
   * [ ] Scale all movement by fps to get consistent speeds across platforms
   * [ ] Spawn on a planet (and respawn on previously visited planet on death)
   * [ ] Collision detection (space ships, bullets, planets)
      * [ ] Simple circle and rectangle based collisions to improve performance
      * [ ] Point collision for bullets
   * [ ] HUD displaying ship health, upgrades
   * [ ] Pickups for ship upgrades, points etc
   * [ ] Stars with orbiting planets (and planets with moons?)
   * [ ] Players (Ships)
      * [ ] Name
      * [ ] Health
      * [ ] Upgrades
         * [ ] Shields
            * [ ] Lighter shields against bullets
            * [ ] Harder shields to survive crashing into planets
            * [ ] Invisibility
         * [ ] Weapons
            * [X] Minigun
            * [X] Spread gun
            * [X] Cannon
            * [X] Bullet Ring
            * [ ] Missiles
            * [ ] Heat seeking missiles
            * [ ] Bombs (that are 'dropped')
            * [ ] Laser
            * [ ] Force field or pulse to bump other ships away from you
            * [ ] ...
            * [ ] Mines?
            * [ ] Turrets?
            
   * [X] Bullets (weapons fire different kinds of bullets, rename to Particle?)
      * [X] Name
      * [X] Radius
      * [X] Fire selay
      * [ ] Color
      * [ ] Damage amount
      * [ ] Bullet 'ownership' (who is dealing the damage)
      * [ ] Lifetime (prevent stray bullets from never disappearing if followed etc)
      * [ ] Twinkling bullets, like stars (as if they're burning)
      * [ ] Blast/Hit velocity (add directional velocity to target) 
      * [ ] Posibility to emit more particles while traveling or when explding.
* [X] Separate update and render operations
* [X] Pause game feature (Only in single player mode)

## Multiplayer implementation
 * Logic
   * The game must be deterministic. That means:
     * Drop floating point operations? :(
     * With certain inputs the output is always the same
     * Enables fully accurate client side simulation 
 * Networking / Connection
   * UDP is the DOPE for game dev, but unfortunately it's only in WebRTC, wich isn't widely supperted.
   * Try WebSockets first instead (TCP sucks for real time)
   * Client and server interaction options:
     * Deterministic lockstep: client only sends inputs, server updates game.
       * Game speed depends on slowest player :(
     * State syncing
       * Client can simulate future events
       * and server sends corrections (delta game state)
       * 
   * If latency is a problem try to migrate to WebRTC
   * If there still are serious latency problems:
     * First implement LAN playing with suitable abstraction
     * Improve the abstraction to support latency
     * If all above fails, and multiplayer wont work:
       * Scrap the web version and migrate to Go
         * No browser limitations
         * UDP Support
         * Easy to read and write
         * Efficent
 * Model
   * Server tracks the game model
   * Server syncs the model state for only visible changes
 * Player state:
   * Position, angle and speed
   * Turning direction and acceleration
   * 

## WISHLIST! (Comming some time 2015!)
1. [ ] Learn node.js (io.js)
2. [ ] Create multi player server
3. [ ] Implement game model at server
4. [ ] And input and rendering on the client side
5. [ ] If all above is not feasible: rewrite entire game in Go

## Bugs
[ ] Ship explosion (and resetting stars) should happen at the end of next frame.
    Currently stars positions are not properly reset.

## Brainstorming!
 * Different ambient soundscapes based on location
 * Currency for buying and building things etc.
 * Big distances after which new areas occur
 * 3 worlds: one for mining (inhabited by neutral AI), one for building, one for fighting against the evil (inhabited by STI aka Solid State Intelligence and where player against player combat is possible)
 * Evil space worms
 * Black holes: different ones (for example: random teleport -blackhole)
 * Home base which you can change and teleport to (possibly last planet that you landed on)
 * Different kind of techologies: for attacking, for mining and gathering other resources, for defence, for navigation (maps etc.) and for traveling
 * Portals
 * Missiles (can only detonate themselves) and spy vehicles (invisible) _which you can control_. Defence tech for detechting spies and destroying missiles) 
 * Fuel: you cant travel forever fast --> better fuel as you build your base and dig deeper --> super tech later (teleporting etc)
 * Allianced which start building their cities from zero (newcomers can build their own or join ones already existing)
 * Different kind of alliances: anarchist, hierarchial, capitalist etc. For example: anarchist-communist alliance has no private owning of resources,
   no central leadership, can swap the space ship they fly [no-one own ships, but they can require skill which must be personally acquired], and no _central_ resources, lots of negotiance etc.
 * Different game strategies: individual vs collective and centralized against noncentralized --> both strategies are good in their own ways
 * Different kind of politics (depending on kind of the alliance) which affect the way you make decisions between co-players (discussion and voting, consensus or despotic) 
 * You can dig and find precious metals and minerals inside planets
 * Trick s: you can for example travel without fuel by using storm currents and gravity force of planets
 * UFO's: which can bring messages from unknown galaxies and new technology or sudden destruction (which can also be caused by meteorites)
 * Epic lore!!!11111
     * For history of humans and different alliances
     * Already existing kindoms! which you can join (or then be an anarchist): all new players start as people who are exploring unkown frontiers which still have plenty minerals
     * History and explanations for different UFO-races, STI etc.
     * References to Tesla and Reich
 * Comm tech to inform and command own bases.
 * Technology which makes mining richer planets, which enables mining more valuable resources 
 * AI-Kindoms: you can communicate with them, trade with them, join them, be in war with them (if you are an anarchist) --> different options when communicating  
 * Possibility to build ships on owned planets, and to control desired ship at any time.

