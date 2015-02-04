
/**
 * A vector object representing xyz coordinates, with methods for common operations
 */
function Vector(x, y, z) {
    this.x = typeof x !== 'undefined' ? x : 0;
    this.y = typeof y !== 'undefined' ? y : 0;
    this.z = typeof z !== 'undefined' ? z : 0;
}
Vector.prototype.set = function(v) {
    this.x = v.x
    this.y = v.y
    this.z = v.z
}
Vector.prototype.copy = function() {
    v = new Vector(this.x, this.y, this.z)
    return v;
}
Vector.prototype.add = function(v) {
    this.x = this.x + v.x
    this.y = this.y + v.y
    this.z = this.z + v.z
    return this
}
Vector.prototype.sub = function(v) {
    this.x = this.x - v.x
    this.y = this.y - v.y
    this.z = this.z - v.z
    return this
}
Vector.prototype.mul = function(m) {
    this.x = this.x * m
    this.y = this.y * m
    this.z = this.z * m
    return this
}
Vector.prototype.combine = function() {
    return Math.abs(this.x)+Math.abs(this.y)
}
Vector.prototype.dist = function(v) {
    xd = this.x - v.x
    yd = this.y - v.y
    return Math.sqrt(   Math.pow(Math.abs(xd),2) + Math.pow(Math.abs(yd),2)   );
}
Vector.prototype.invert = function() {
    this.x = this.x * -1
    this.y = this.y * -1
    this.z = this.z * -1
    return this
}
Vector.prototype.random = function(max,negative) {
    max = typeof max !== 'undefined' ? max : new Vector(1,1,1);
    negative = typeof negative !== 'undefined' ? negative : true;
    this.x = getRandomInt(0,max.x)
    this.y = getRandomInt(0,max.y)
    this.z = getRandomInt(0,max.z)

    if(negative) {
        this.x = this.x-(max.x/2);
        this.y = this.y-(max.y/2);
        this.z = this.z-(max.z/2);
    }
    return this
}

/**
 * A particle object with a position and speed. Used as a foundation for things in space
 */
function Particle() {
    this.max_x = 9999
    this.max_y = 9999
    this.speed = new Vector(0, 0);
}
Particle.prototype = new Vector( );
Particle.prototype.update = function() {
    this.x = this.x + this.speed.x;
    this.y = this.y + this.speed.y;
}


/**
 * A small star used in the background star field
 */
function BgStar() {
    this.twinkle = false;
    this.color = [255, 255, 255];
}
BgStar.prototype = new Particle( );
BgStar.prototype.warp = function() {
    this.twinkle = false;
    this.color = [255, 255, 255];
    if(getRandomInt(0, 10) == 5) {
        this.twinkle = true;
    } else {
        this.z = getRandomInt(0, 99);
    }
    if(getRandomInt(0, 150) >  149) {
        this.color = hsv_to_rgb( [getRandomInt(0,255), 205, 250] )
        this.z = getRandomInt(0, 50) + 49;
    }
}
BgStar.prototype.move = function(add) {
    this.add(add)
    if(this.x < 0) {
        this.x = window.innerWidth
        this.y = getRandomInt(0,window.innerHeight)
        this.warp()
    }
    if(this.x > window.innerWidth) {
        this.x = 0
        this.y = getRandomInt(0,window.innerHeight)
        this.warp()
    }
    if(this.y < 0) {
        this.y = window.innerHeight
        this.x = getRandomInt(0,window.innerWidth)
        this.warp()
    }
    if(this.y > window.innerHeight) {
        this.y = 0
        this.x = getRandomInt(0,window.innerWidth)
        this.warp()
    }
}

BgStar.prototype.update = function() {
    if(this.twinkle) {
        this.z = getRandomInt(0,99)
    }
}


/**
 * A planet object that has gravity
 */
function Planet(main) {
    this.main = main
    this.radius = 240;
    this.mass = this.radius*this.radius;
    this.max_dist = 40000;
    this.max_gravity_dist = 3600;
}
Planet.prototype = new Particle( );

Planet.prototype.set_radius = function(radius) {
    this.radius = radius;
    this.mass = this.radius*this.radius;
}
Planet.prototype.warp = function() {
    p = new Vector();
    p.random(new Vector(window.innerWidth*(50,window.innerHeight*50,99)));
    angle = angle_to_target(this.main.space_ship.speed,{x:0,y:0})
    distance = rotate_point(this.max_dist/2,0,0,0,angle)
    // p.add(this.main.space_ship).add(distance) //.add(this.main.space_ship.speed.copy().mul(102)) // Planets vanish at high speeds
    p.add(this.main.space_ship).add(distance).add(this.main.space_ship.speed.copy().mul(102)) // Planets vanish at high speeds
    this.set(p)
}

Planet.prototype.update = function() {
    if(this.main.space_ship.dist(this)>this.max_dist) {
        this.warp()
    }
    if(this.main.space_ship.landed) {return}
    dist = this.dist(this.main.space_ship)

    // Handle Gravity
    if(dist < this.max_gravity_dist) {
        if(dist<this.main.space_ship.radius+this.radius) {
            if(Math.abs(this.main.space_ship.speed.x)+Math.abs(this.main.space_ship.speed.y)>2.4){
                this.main.space_ship.explode()
            }
            else {
                this.main.space_ship.land();
            }
        }
        P2 = this.main.space_ship
        P = this
        XDiff = P.x - P2.x
        YDiff = P.y - P2.y
        Distance = Math.sqrt((Math.pow(XDiff, 2))+(Math.pow(YDiff, 2)))
        if (Distance < 2) {Distance = 2}
        a = 0.125
        Force = a*(P.mass*P2.mass)/Math.pow(Distance,2)*4
        Acceleration = Force / (P2.mass*2)
        XComponent = XDiff/Distance
        YComponent = YDiff/Distance
        v = new Vector(Acceleration * XComponent,Acceleration * YComponent)
        this.main.space_ship.speed.add(v)
    }
}
Planet.prototype.random = function(max,negative) {
    max = typeof max !== 'undefined' ? max : new Vector(1,1,1);
    negative = typeof negative !== 'undefined' ? negative : true;
    this.x = getRandomInt(0,max.x)
    this.y = getRandomInt(0,max.y)
    this.radius = 150 + getRandomInt(0,250)
    this.mass = this.radius*this.radius;

    if(negative) {
        this.x = this.x-(max.x/2);
        this.y = this.y-(max.y/2);
        this.z = this.z-(max.z/2);
    }
}



/**
 * A star object that has orbiting planets
 */
function Sun(main) {
    this.main = main
    this.radius = 540;
    this.mass = this.radius*this.radius;
    this.max_dist = 40000;
    this.max_gravity_dist = 3600;

    this.min_planets = 1
    this.max_planets = 4

    this.planets = []
    this.generate_planets();
}

Sun.prototype = new Particle( );

Sun.prototype.rand_int = function(min, max) {
  return Math.random() * (max - min) + min;
}

Sun.prototype.generate_planets = function() {
    amount = this.rand_int(this.min_planets, this.max_planets);
    i = 0;
    while (i < amount) {
        p = new Planet(this);
        // From endlessvoid.js
        p.random(new Vector(window.innerWidth*40, window.innerHeight*40, 99));
        planet = null;
        //p = new Vector();
        //p.random(new Vector(window.innerWidth*(50,window.innerHeight*50,99)));
        //angle = angle_to_target(this.main.space_ship.speed,{x:0,y:0})
        //distance = rotate_point(this.max_dist/2,0,0,0,angle)
        //// p.add(this.main.space_ship).add(distance) //.add(this.main.space_ship.speed.copy().mul(102)) // Planets vanish at high speeds
        //p.add(this.main.space_ship).add(distance).add(this.main.space_ship.speed.copy().mul(102)) // Planets vanish at high speeds
        //this.set(p)
        i += 1;
    }
}













/**
 * A bullet that the spaceship can fire
 */
function Bullet(x, y, z, radius) {
    this.x = typeof x !== 'undefined' ? x : 0;
    this.y = typeof y !== 'undefined' ? y : 0;
    this.z = typeof z !== 'undefined' ? z : 0;
    this.radius = typeof radius !== 'undefined' ? radius : 1;
}
Bullet.prototype = new Particle( );







/**
 * The space ship
 */
function SpaceShip(main) {
    this.main = main
    this.z = 0;

    this.color = "red"; // TODO: implement this
    this.angle = 180;
    this.angle = 0;
    this.turn_amount = 6.2;
    this.turn_amount = 8.2;
    this.turn_amount = 9.9;
    this.mass = 13*13;
    this.radius = 10;

    this.landed = false;
    this.acceleration = 0.35;
    this.acceleration = 0.45;
    this.accelerating = false;
    this.turbo_on = false;
    this.turbo_thrust = 2.45;
    this.speed_v = 0;
    this.speed_max = 50;

    this.weapons = [];
    this.weapons.push( new Minigun(this.main, this) );
    this.weapons.push( new Spreadgun(this.main, this) );
    this.weapons.push( new Cannon(this.main, this) );
    this.weapons.push( new Ring(this.main, this) );
    this.weapon_index = 0;
    this.weapon = this.weapons[0];


    this.shape = [
        {x:10, y:0},
        {x:-6,  y:7},
        {x:-2,  y:0},
        {x:-6, y:-7}
    ]
    
    //this.thrust = [{x:-3, y:-4}, {x:0,  y:-11}, {x:3, y:-4}]
    this.thrust = [{x:-4, y:-3}, {x:-11, y:0}, {x:-4, y:3}]
    this.shape_rot = self.shape;
    this.thrust_rot = self.thrust;
}

SpaceShip.prototype = new Particle( );

SpaceShip.prototype.update = function() {
    if(this.landed) {return;}
    this.x = this.x + this.speed.x;
    this.y = this.y + this.speed.y;
    screen_pos = this.main.bgTranslate(this.copy())

    if(screen_pos.x < this.main.edge_threshhold.x) {
        add = new Vector(this.main.edge_threshhold.x-screen_pos.x,0)
        this.main.origin.add(add)
        this.main.updateStars(add)
    }
    if(screen_pos.y < this.main.edge_threshhold.y) {
        add = new Vector(0,this.main.edge_threshhold.y-screen_pos.y)
        this.main.origin.add(add)
        this.main.updateStars(add)
    }
    if(screen_pos.x > window.innerWidth-this.main.edge_threshhold.x) {
        add = new Vector(window.innerWidth-this.main.edge_threshhold.x-screen_pos.x,0)
        this.main.origin.add(add)
        this.main.updateStars(add)
    }
    if(screen_pos.y > window.innerHeight-this.main.edge_threshhold.y) {
        add = new Vector(0,window.innerHeight-this.main.edge_threshhold.y-screen_pos.y)
        this.main.origin.add(add)
        this.main.updateStars(add)
    }
}
SpaceShip.prototype.switch_weapon = function() {
    this.weapon_index += 1;
    if(this.weapon_index >= this.weapons.length) {
        this.weapon_index = 0
    }
    this.weapon = this.weapons[this.weapon_index]
}
SpaceShip.prototype.shoot = function() {
    this.weapon._fire()
}
SpaceShip.prototype.explode = function() {
    for (var i = 0; i < 20; i++) {
        bullet = new Bullet(this.x, this.y);
        bullet.speed = new Vector()
        bullet.speed.add(rotate_point(2.5, 0, 0, 0, getRandomInt(0, 360)))
        this.main.bullets.push(bullet)
    };
    this.sub(this.speed.copy().mul(20))
    this.speed = new Vector()
    this.landed = false;
    this.main.resetStars()
}
SpaceShip.prototype.turn = function(amount) {
    this.angle = this.angle + (this.turn_amount*amount);
    if(this.angle > 360)
     {
        this.angle = this.angle-360;
    }
    if(this.angle < 0)
     {
        this.angle = 360-Math.abs(this.angle)
    }
    this.rotateShapes()
    this.landed = false;   
}
SpaceShip.prototype.rotateShapes = function() {
    this.shape_rot = rotate_points(this.shape,new Vector(),this.angle)
    this.thrust_rot = rotate_points(this.thrust,new Vector(),this.angle)
}
SpaceShip.prototype.accelerate = function(amount) {
    this.accelerating = true;
    v = (this.acceleration*amount)
    p = rotate_point(v, 0, 0, 0, this.angle)
    this.speed.x = this.speed.x + p.x
    this.speed.y = this.speed.y + p.y
    this.landed = false;
}
SpaceShip.prototype.turbo = function() {
    this.turbo_on = true;
    v = this.turbo_thrust
    rot = rotate_point(v, 0, 0, 0, this.angle)
    p = new Vector( rot.x, rot.y )
    this.speed.add(p)
}
SpaceShip.prototype.maxSpeed = function() {
    return this.speed.x+this.speed.y>this.speed_max
}
SpaceShip.prototype.land = function() {
    this.landed = true;
    this.speed.x = 0
    this.speed.y = 0
}

SpaceShip.prototype.render = function(ctx) {
    ctx.strokeStyle = "rgba(156,232,255,0.9)";
    ctx.beginPath();

    p = this.main.bgTranslate(this.copy().add(this.shape_rot[0]))
    ctx.lineTo(p.x,p.y)
    for (var i = this.shape_rot.length - 1; i >= 0; i--) {
        point = this.shape_rot[i]
        p = this.main.bgTranslate(this.copy().add(point))
        ctx.lineTo(p.x,p.y)
    };
    ctx.stroke();
    if(this.accelerating || this.turbo_on) {
        ctx.strokeStyle = "rgba(255,100,100, 0.9)";
        if(this.turbo_on) {
            ctx.strokeStyle = "rgba(100,100,255, 0.9)";
        }
        ctx.beginPath();
        p = this.main.bgTranslate(this.copy().add(this.thrust_rot[0]))
        ctx.lineTo(p.x,p.y)
        for (var i = this.thrust_rot.length - 1; i >= 0; i--) {
            p = this.main.bgTranslate(this.copy().add(this.thrust_rot[i]))
            ctx.lineTo(p.x,p.y)
        };
        ctx.stroke();
    }

    this.accelerating = false;
    this.turbo_on = false;
}