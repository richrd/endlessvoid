/**
 * Weapons
 */

function Weapon(main, ship) {
    this.main = main;
    this.ship = ship;

    this.name = "";
    this.fire_time = 0;
    this.fire_delay = 0 // Minimum time in ms to wait between shots
}
Weapon.prototype._can_fire = function() {
    now = new Date;
    if(now - this.fire_time > this.fire_delay) {
        return true;
    }
}
Weapon.prototype._fire = function() {
    if(this._can_fire()) {
        this.fire();
        this.fire_time = new Date;
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
    this.fire_delay = 28;
}
Minigun.prototype = new Weapon( );
Minigun.prototype.fire = function() {
    this.add_bullet(0, 20)
}



function Spreadgun(main, ship) {
    this.main = main;
    this.ship = ship;
    this.name = "Spreadgun";
    this.fire_delay = 100;
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
    this.fire_delay = 333;
    this.fire_time = 0;
}
Cannon.prototype = new Weapon( );
Cannon.prototype.fire = function() {
    this.add_bullet(0, 20, 2.5);
}




function Ring(main, ship) {
    this.main = main;
    this.ship = ship;
    this.name = "Ring";
    this.fire_delay = 1000;
    this.fire_time = 0;
}
Ring.prototype = new Weapon( );
Ring.prototype.fire = function() {
    ang = 0
    while (ang < 360) {
        this.add_bullet(ang);
        ang += 5
    }
}

