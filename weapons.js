/**
 * Weapons
 */

function Weapon(main, ship) {
    this.main = main;
    this.ship = ship;

    this.name = "";
}

Weapon.prototype.fire = function() {
    return;
}
Weapon.prototype.add_bullet = function(angle) {
    bullet = new Bullet(this.ship.x, this.ship.y);
    bullet.speed = this.ship.speed.copy()
    bullet.speed.add(rotate_point(30, 0, 0, 0, this.ship.angle + angle))
    this.main.bullets.push(bullet)
}



function Minigun(main, ship) {
    this.main = main;
    this.ship = ship;

    this.name = "Minigun";
}
Minigun.prototype = new Weapon( );

Minigun.prototype.fire = function() {
    this.add_bullet(0)
    //bullet = new Bullet(this.ship.x, this.ship.y);
    //bullet.speed = this.ship.speed.copy();
    //bullet.speed.add(rotate_point(20.5,0,0,0,this.ship.angle));
    //this.main.bullets.push(bullet);
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
Spreadgun.prototype.add_bullet = function(angle) {
    bullet = new Bullet(this.ship.x, this.ship.y);
    bullet.speed = this.ship.speed.copy()
    bullet.speed.add(rotate_point(30, 0, 0, 0, this.ship.angle + angle))
    this.main.bullets.push(bullet)
}





function Cannon(main, ship) {
    this.main = main;
    this.ship = ship;
    this.name = "Cannon";
    this.counter = 5
    this.counter_limit = 5
}
Cannon.prototype = new Weapon( );
Cannon.prototype.can_fire = function() {
    this.counter += 1
    if(this.counter > this.counter_limit) {
        this.counter = 0
        return true;
    }
    return false;
}
Cannon.prototype.fire = function() {
    if(this.can_fire()) {
        this.add_bullet(0);
    }
}





function Ring(main, ship) {
    this.main = main;
    this.ship = ship;

    this.name = "Ring";
}
Ring.prototype = new Weapon( );

Ring.prototype.fire = function() {
    ang = 0
    while (ang < 360) {
        this.add_bullet(ang);
        ang += 5
    }
}
Ring.prototype.add_bullet = function(angle) {
    bullet = new Bullet(this.ship.x, this.ship.y);
    bullet.speed = this.ship.speed.copy()
    bullet.speed.add(rotate_point(30, 0, 0, 0, this.ship.angle + angle))
    this.main.bullets.push(bullet)
}
