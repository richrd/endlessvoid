/**
 * Weapons
 */

function Weapon(main, ship) {
    this.main = main;
    this.ship = ship;

    this.name = "";
    this.fire_delay = 0 // Number of frames to wait between shots
    this.fire_counter = 0;

}
Weapon.prototype._can_fire = function() {
    if(this.fire_delay) {
        if(this.fire_counter == 0) {
            this.fire_counter += 1;
            return true;
        } else if(this.fire_counter > this.fire_delay) {
            this.fire_counter = 0;
            return false;
        }
        this.fire_counter += 1;
        return false;
    }

    return true;
}
Weapon.prototype._fire = function() {
    if(this._can_fire()) {
        this.fire();
        return true;
    }
    
    return false;
}
Weapon.prototype.fire = function() {
    return;
}
Weapon.prototype.add_bullet = function(angle, speed, radius) {
    if(typeof(angle)==='undefined') angle = 0;
    if(typeof(speed)==='undefined') speed = 30;
    if(typeof(radius)==='undefined') radius = 1;
    bullet = new Bullet(this.ship.x, this.ship.y);
    bullet.speed = this.ship.speed.copy();
    bullet.radius = radius
    bullet.speed.add(rotate_point(speed, 0, 0, 0, this.ship.angle + angle));
    this.main.bullets.push(bullet);
}


function Minigun(main, ship) {
    this.main = main;
    this.ship = ship;
    this.name = "Minigun";
}
Minigun.prototype = new Weapon( );
Minigun.prototype.fire = function() {
    this.add_bullet(0, 10)
}



function Spreadgun(main, ship) {
    this.main = main;
    this.ship = ship;
    this.name = "Spreadgun";
}
Spreadgun.prototype = new Weapon( );
Spreadgun.prototype.fire = function() {
    this.add_bullet(0);
    this.add_bullet(10);
    this.add_bullet(-10);
}




function Cannon(main, ship) {
    this.main = main;
    this.ship = ship;
    this.name = "Cannon";
    this.fire_delay = 5 // Number of frames to wait between shots
    this.fire_counter = 0;
}
Cannon.prototype = new Weapon( );
Cannon.prototype.fire = function() {
    this.add_bullet(0, 20, 2.5);
}




function Ring(main, ship) {
    this.main = main;
    this.ship = ship;
    this.name = "Ring";
    this.fire_delay = 20 // Number of frames to wait between shots
    this.fire_counter = 0;
}
Ring.prototype = new Weapon( );
Ring.prototype.fire = function() {
    ang = 0
    while (ang < 360) {
        this.add_bullet(ang);
        ang += 5
    }
}

