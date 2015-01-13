/*
Canvas 2D Space
Richard Lewis 2014
bittemple.net
*/


/**
 * Rotate 2d coordinates around a point and get new coordinates
 */
function rotate_point(pointX, pointY, originX, originY, angle) {
    angle = angle * Math.PI / 180.0;
    return {
        x: Math.cos(angle) * (pointX-originX) - Math.sin(angle) * (pointY-originY) + originX,
        y: Math.sin(angle) * (pointX-originX) + Math.cos(angle) * (pointY-originY) + originY
    };

}


/**
 * Rotate each cordinate in an array and return a new array
 */
function rotate_points(points,origin,angle) {
    new_p = [];
    for (var i = points.length - 1; i >= 0; i--) {
        point = points[i]
        r = rotate_point(point.x,point.y,origin.x,origin.y,angle)
        new_p.push(r)
    }
    new_p.reverse();
    return new_p;
}


/**
 * Check if a point is within the browser window
 */
function isOnScreen(v) {
    if(v.x>0 && v.x < window.innerWidth)
    {
        if(v.y>0 && v.y < window.innerHeight)
        {
            return true;
        }   
    }
    return false;
}



/**
 * Get a ranom intiger within a range
 */
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * Calculate the angle between two cordinates TODO: incorrect results, fix it
 */
function angle_to_target(pos1, pos2) {
    // x = pos2.x - pos1.x
    // y = pos2.y - pos1.y
    // angle = Math.atan2(y, x)
    // // return parseInt(270.0 - (angle * 180.0)/Math.PI)
    // return parseInt(180 - (angle * 180.0)/Math.PI)
    dx = pos1.x - pos2.x;
    dy = pos1.y - pos2.y;
    theta = Math.atan2(dy, dx);
    theta *= 180/Math.PI // rads to degs
    if(theta<0) {
        theta = 360+theta
    }
    return theta
}


/**
 * An object representing a a point, with methods for common transformations
 */
function Vector(x,y,z) {
    this.x = typeof x !== 'undefined' ? x : 0;
    this.y = typeof y !== 'undefined' ? y : 0;
    this.z = typeof z !== 'undefined' ? z : 0;
}
Vector.prototype.set = function(v) {
    this.x=v.x
    this.y=v.y
    this.z=v.z
}
Vector.prototype.copy = function() {
    v = new Vector(this.x,this.y,this.z)
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
    xd = this.x-v.x
    yd = this.y-v.y
    return Math.sqrt(   Math.pow(Math.abs(xd),2) + Math.pow(Math.abs(yd),2)   );
}
Vector.prototype.invert = function() {
    this.x = this.x*-1
    this.y = this.y*-1
    this.z = this.z*-1
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
    this.speed = new Vector(0,0);
}
Particle.prototype = new Vector( );
Particle.prototype.update = function() {
    this.x = this.x + this.speed.x;
    this.y = this.y + this.speed.y;

}


/**
 * A star object
 */
function Star() {
    this.twinkle = false;
}
Star.prototype = new Particle( );
// Vector.prototype.add = function(v) {
//     this.x = this.x + v.x
//     this.y = this.y + v.y
//     return this
// }
// Vector.prototype.sub = function(v) {
//     this.x = this.x - v.x
//     this.y = this.y - v.y
//     return this
// }
Star.prototype.warp = function() {
    this.twinkle = false;
    if(getRandomInt(0,10)==5) {
        this.twinkle = true;
    }
    else {
        this.z = getRandomInt(0,99)
    }
}
Star.prototype.move = function(add) {
    this.add(add)
    // if(this.x < 0) {
    //     this.x = window.innerWidth
    //     this.y = getRandomInt(0,window.innerHeight)
    //     this.warp()
    // }
    // if(this.x > window.innerWidth) {
    //     this.x = 0
    //     this.y = getRandomInt(0,window.innerHeight)
    //     this.warp()
    // }
    // if(this.y < 0) {
    //     this.y = window.innerHeight
    //     this.x = getRandomInt(0,window.innerWidth)
    //     this.warp()
    // }
    // if(this.y > window.innerHeight) {
    //     this.y = 0
    //     this.x = getRandomInt(0,window.innerWidth)
    //     this.warp()
    // }
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
Star.prototype.update = function() {
    if(this.twinkle) {
        this.z = getRandomInt(0,99)
    }
}


/**
 * A planet object that has gravity
 */
function Planet() {
    this.radius = 240;
    this.mass = this.radius*this.radius;
    this.max_dist = 40000;
    this.max_gravity_dist = 3600;
}
Planet.prototype = new Particle( );

Planet.prototype.warp = function() {
    p = new Vector();
    p.random(new Vector(window.innerWidth*(50,window.innerHeight*50,99)));
    angle = angle_to_target(bg_space_ship.speed,{x:0,y:0})
    distance = rotate_point(this.max_dist/2,0,0,0,angle)
    p.add(bg_space_ship).add(distance) //.add(bg_space_ship.speed.copy().mul(102)) // Planets vanish at high speeds
    this.set(p)
}
Planet.prototype.update = function() {
    if(bg_space_ship.dist(this)>this.max_dist) {
        this.warp()
    }
    if(bg_space_ship.landed) {return}
    dist = this.dist(bg_space_ship)

    // Handle Gravity
    if(dist<this.max_gravity_dist) {
        if(dist<bg_space_ship.radius+this.radius) {
            if(Math.abs(bg_space_ship.speed.x)+Math.abs(bg_space_ship.speed.y)>2.4){
                bg_space_ship.explode()
            }
            else {
                bg_space_ship.land();
            }
        }
        P2=bg_space_ship
        P = this
        XDiff = P.x - P2.x
        YDiff = P.y - P2.y
        Distance = Math.sqrt((Math.pow(XDiff,2))+(Math.pow(YDiff,2)))
        if (Distance < 2) {Distance = 2}
        a=0.125
        Force = a*(P.mass*P2.mass)/Math.pow(Distance,2)*4
        Acceleration = Force / (P2.mass*2)
        XComponent = XDiff/Distance
        YComponent = YDiff/Distance
        v = new Vector(Acceleration * XComponent,Acceleration * YComponent)
        bg_space_ship.speed.add(v)
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
 * A bullet that the spaceship can fire
 */
function Bullet(x,y,z) {
    this.x = typeof x !== 'undefined' ? x : 0;
    this.y = typeof y !== 'undefined' ? y : 0;
    this.z = typeof z !== 'undefined' ? z : 0;
}
Bullet.prototype = new Particle( );


/**
 * The space ship
 */
function SpaceShip() {
    this.z = 0;

    this.color = "red";
    this.angle = 180;
    this.angle = 0;
    this.turn_amount = 6.2
    this.turn_amount = 8.2
    this.turn_amount = 9.9
    this.mass = 13*13;
    this.radius = 10

    this.landed = false;
    this.acceleration = 0.35
    this.acceleration = 0.45
    this.accelerating = false;
    this.turbo_on = false;
    this.turbo_thrust = 2.45
    this.speed_v = 0;
    this.speed_max = 50

    this.shape = [{x:10,  y:0},{x:-6,  y:7},{x:-2,  y:0},{x:-6, y:-7}]
 
    this.thrust = [{x:-3, y:-4},{x:0,  y:-11},{x:3,  y:-4}]
    this.thrust = [{x:-4, y:-3},{x:-11,  y:0},{x:-4,  y:3}]
    this.shape_rot = self.shape;
    this.thrust_rot = self.thrust;

}
SpaceShip.prototype = new Particle( );

SpaceShip.prototype.update = function() {
    if(this.landed) {return;}
    this.x = this.x + this.speed.x;
    this.y = this.y + this.speed.y;
    screen_pos = bgTranslate(this.copy())

    if(screen_pos.x < bg_edge_threshhold.x) {
        add = new Vector(bg_edge_threshhold.x-screen_pos.x,0)
        bg_origin.add(add)
        updateStars(add)
    }
    if(screen_pos.y < bg_edge_threshhold.y) {
        add = new Vector(0,bg_edge_threshhold.y-screen_pos.y)
        bg_origin.add(add)
        updateStars(add)
    }
    if(screen_pos.x > window.innerWidth-bg_edge_threshhold.x) {
        add = new Vector(window.innerWidth-bg_edge_threshhold.x-screen_pos.x,0)
        bg_origin.add(add)
        updateStars(add)
    }
    if(screen_pos.y > window.innerHeight-bg_edge_threshhold.y) {
        add = new Vector(0,window.innerHeight-bg_edge_threshhold.y-screen_pos.y)
        bg_origin.add(add)
        updateStars(add)
    }
}
SpaceShip.prototype.shoot = function() {
    bullet = new Bullet(this.x,this.y);
    bullet.speed=this.speed.copy()
    bullet.speed.add(rotate_point(20.5,0,0,0,this.angle))
    bg_bullets.push(bullet)
}
SpaceShip.prototype.explode = function() {
    for (var i = 0; i < 20; i++) {
        bullet = new Bullet(this.x,this.y);
        bullet.speed=new Vector()
        bullet.speed.add(rotate_point(2.5,0,0,0,getRandomInt(0,360)))
        bg_bullets.push(bullet)
    };    
    this.sub(this.speed.copy().mul(20))
    this.speed = new Vector()
    // resetStars()
    this.landed = false;
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
    p = rotate_point(v,0,0,0,this.angle)
    this.speed.x = this.speed.x+p.x
    this.speed.y = this.speed.y+p.y
    this.landed = false;
}
SpaceShip.prototype.turbo = function() {
    this.turbo_on = true;
    v = this.turbo_thrust
    rot = rotate_point(v,0,0,0,this.angle)
    p = new Vector( rot.x,rot.y )
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
    ctx.strokeStyle = "rgba(156,232,255, 0.9)";
    ctx.beginPath();

    p = bgTranslate(this.copy().add(this.shape_rot[0]))
    ctx.lineTo(p.x,p.y)
    for (var i = this.shape_rot.length - 1; i >= 0; i--) {
        point = this.shape_rot[i]
        p = bgTranslate(this.copy().add(point))
        ctx.lineTo(p.x,p.y)
    };
    ctx.stroke();
    if(this.accelerating || this.turbo_on) {
        ctx.strokeStyle = "rgba(255,100,100, 0.9)";
        if(this.turbo_on) {
            ctx.strokeStyle = "rgba(100,100,255, 0.9)";
        }
        ctx.beginPath();
        p = bgTranslate(this.copy().add(this.thrust_rot[0]))
        ctx.lineTo(p.x,p.y)
        for (var i = this.thrust_rot.length - 1; i >= 0; i--) {
            p = bgTranslate(this.copy().add(this.thrust_rot[i]))
            ctx.lineTo(p.x,p.y)
        };
        ctx.stroke();
    }

    this.accelerating = false;
    this.turbo_on = false;
}















var bg_canvas_id = "#bg-canvas"
var bg_pressed_keys = [];

var bg_interval_ms = 40;
var bg_interval_id = null;

var bg_origin = new Vector();
var bg_space_ship = new SpaceShip();
var bg_edge_threshhold = new Vector(window.innerWidth*.2,window.innerHeight*.2);


var bg_minimap_scale = .0125
var bg_minimap_scale = .0100
var bg_minimap_center = new Vector(130,130);
var bg_minimap_radius = 60
var bg_minimap_radius = 90
// var bg_minimap_radius = 400
// var bg_minimap_radius = 500

var bg_stars = [];
var bg_star_amount = 100;

var bg_planets = [];
var bg_planet_amount = 150;

var bg_bullets = [];
var bg_bullets_max = 100;

function updateStars(add) {
    for (var i = bg_stars.length - 1; i >= 0; i--) {
        star = bg_stars[i]
        star.move(add)
    };
}

function resetStars() {
    console.log("resetStars")
    for (var i = bg_stars.length - 1; i >= 0; i--) {
        new_pos = new Vector()
        new_pos.random(new Vector(window.innerWidth,window.innerHeight,99),false);
        star = bg_stars[i]
        star.set(new_pos)
    };
}




function bgLoad() {
    // Create stars.
    for (var i = 0; i < bg_star_amount; i++) {
        p = new Star();
        p.random(new Vector(window.innerWidth,window.innerHeight,99),false);
        p.warp()
        bg_stars.push(p)
    };
    // Create planets.
    for (var i = 0; i < bg_planet_amount; i++) {
        p = new Planet();
        p.random(new Vector(window.innerWidth*40,window.innerHeight*40,99));
        bg_planets.push(p)
    };


    bg_space_ship.rotateShapes();
    bg_space_ship.speed.random(new Vector(.05,.05,.05));

    if(window.innerWidth+window.innerHeight>1400) {
        $("#bg-toggle").addClass("show");
        return true;
    }
    else {
        return false;
    }
}

function minimapTranslate(v) {
    // center = new Vector(130,130);
    center = new Vector(window.innerWidth/2,window.innerHeight/2);

    return v.copy().add(bg_space_ship.copy().invert()).mul(bg_minimap_scale).add(bg_minimap_center);
}
function bgTranslate(v) {
    center = new Vector(window.innerWidth/2,window.innerHeight/2);
    return v.copy().add(center).add(bg_origin);
}



function renderMinimap(ctx) {
    ctx.strokeStyle = "rgba(180,220,255, .3)";
    ctx.fillStyle = "rgba(180,220,255, .05)";

    ctx.beginPath();
    // center = new Vector(130,130);
    // center = new Vector(window.innerWidth/2,window.innerHeight/2);
    // p = bgTranslate(new Vector());

    ctx.arc(bg_minimap_center.x,bg_minimap_center.y,bg_minimap_radius,0,Math.PI*2,true);
    ctx.stroke();
    ctx.fill()
    ctx.beginPath()
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.arc(bg_minimap_center.x,bg_minimap_center.y,2,0,Math.PI*2,true);
    ctx.fill()


    d1 = rotate_point(bg_minimap_radius,0,0,0,bg_space_ship.angle)
    d1 = new Vector(d1.x,d1.y)
    d1.add(bg_minimap_center)
    // d1.x-=bg_minimap_radius

    d2 = rotate_point(bg_minimap_radius-(bg_minimap_radius*.1),0,0,0,bg_space_ship.angle)
    d2 = new Vector(d2.x,d2.y)
    d2.add(bg_minimap_center)
    // d2.x-=bg_minimap_radius

    ctx.arc(d2.x,d2.y,2,0,Math.PI*2,true);
    ctx.strokeStyle = "rgba(255,255,255, 1)";
    ctx.beginPath();
    ctx.moveTo(d2.x,d2.y)
    ctx.lineTo(d1.x,d1.y)
    // ctx.arc(p.x,p.y,bg_planets[i].radius*bg_minimap_scale,0,Math.PI*2,true);
    ctx.stroke();
    ctx.strokeStyle = "rgba(180,220,255, .3)";


    ctx.strokeStyle = "rgba(180,255,180, .4)";
    ctx.fillStyle = "rgba(180,255,180, .4)";
    for (var i = bg_planets.length - 1; i >= 0; i--) {
        p = minimapTranslate(bg_planets[i])
        if(bg_minimap_center.dist(p)>bg_minimap_radius) {continue}
        ctx.beginPath();
        ctx.arc(p.x,p.y,bg_planets[i].radius*bg_minimap_scale,0,Math.PI*2,true);
        ctx.stroke();
        ctx.fill()
    };

}

function bgRender() {
    if(window.innerWidth+window.innerHeight<1400) {return;}

    bgHandleKeys()

    bg_edge_threshhold.x = window.innerWidth*.4
    bg_edge_threshhold.y = window.innerHeight*.4

    var ctx = $(bg_canvas_id)[0].getContext('2d');

    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    center = new Vector(window.innerWidth/2,window.innerHeight/2);


    ctx.font="20px Georgia";
    ctx.fillStyle="rgb(255,255,255)";

    ctx.lineWidth = "1.5";

    bg_space_ship.update()

    // ctx.fillText("ship: "+parseInt(bg_space_ship.x)+","+parseInt(bg_space_ship.y),10,50);
    // ctx.fillText("orig ang: "+angle_to_target(bg_space_ship,new Vector()),10,75);
    // ctx.fillText("ship ang: "+bg_space_ship.angle,10,100);
    for (var i = bg_planets.length - 1; i >= 0; i--) {
        planet = bg_planets[i]
        planet.update()
    }


    ctx.strokeStyle = "rgba(240,240,210, .98)";
    for (var i = bg_stars.length - 1; i >= 0; i--) {
        star = bg_stars[i]
        // star.warp()
        star.update()
        value = .4+(star.z-1)/2/100.0;
        ctx.strokeStyle = "rgba(255,255,255, "+value+")";
        ctx.beginPath();
        ctx.arc(star.x,star.y,.2+value,0,Math.PI*2,true);
        ctx.stroke();
    };

    ctx.strokeStyle = "rgba(200,255,255, 1)";
    // console.log(bg_bullets)
    for (var i = bg_bullets.length - 1; i >= 0; i--) {
        bullet = bg_bullets[i]
        bullet.update()
        ctx.beginPath();
        p = bgTranslate(bullet)

        ctx.arc(p.x,p.y,1,0,Math.PI*2,true);
        ctx.stroke();
        if(!isOnScreen(p))
        {
            bg_bullets.splice(i,1)
            // i=i+1
            // continue;
        }
    };

    ctx.strokeStyle = "rgba(180,255,180, 1)";
    ctx.fillStyle = "rgba(0,10,0, 1)";
    for (var i = bg_planets.length - 1; i >= 0; i--) {
        planet = bg_planets[i]
        ctx.beginPath();
        p = bgTranslate(planet)
        // if(!isOnScreen(p)) {continue;}
        ctx.arc(p.x,p.y,planet.radius,0,Math.PI*2,true);
        ctx.fill();
        ctx.stroke();
        ang = angle_to_target(planet,bg_space_ship)
        // console.log(ang)
        rot = rotate_point(planet.radius,0,0,0,ang)
        v = planet.copy().add(new Vector(rot.x,rot.y))
        v = bgTranslate(v)
        // console.log(v)
        ctx.beginPath();
        ctx.moveTo(p.x,p.y);
        ctx.moveTo(v.x,v.y);
        ctx.stroke()

    };

    ctx.strokeStyle = "rgba(180,180,255, .5)";
    ctx.beginPath();
    p = bgTranslate(new Vector());
    ctx.arc(p.x,p.y,20,0,Math.PI*2,true);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(p.x,p.y,2,0,Math.PI*2,true);
    ctx.stroke();

    bg_space_ship.render(ctx)
    renderMinimap(ctx)

}
function bgHandleKeys() {
    // Handle keys.
    if(bg_pressed_keys[37]) {
        bg_space_ship.turn(-1)
    }
    if(bg_pressed_keys[39]) {
        bg_space_ship.turn(1)
    }
    if(bg_pressed_keys[38]) {
        bg_space_ship.accelerate(1)
    }
    if(bg_pressed_keys[40]) {
        bg_space_ship.accelerate(-1)
    }
    if(bg_pressed_keys[32]) {
        bg_space_ship.shoot()
    }
    if(bg_pressed_keys[90]) {
        bg_space_ship.turbo()
    }

    if(bg_pressed_keys[48]) {
        bg_space_ship.x=0
        bg_space_ship.y=0
        bg_space_ship.speed = new Vector();
    }

}


function toggleBackground() {
    if(window.bg_interval_id != null) {
        $("#background").fadeOut()
        clearInterval(window.bg_interval_id);
        window.bg_interval_id = null;
    }
    else {
        window.bg_interval_id = setInterval("bgRender()",60);
        $("#background").fadeIn()
    }
}

$(function () {
    $(document).bind('keydown','alt+space',function() {$("#background").toggleClass("show")});
    $(document.body).keydown(function (evt) {
        if(!bg_pressed_keys[evt.keyCode]) {
            bg_pressed_keys[evt.keyCode] = true;
        }
    });

    $(document.body).keyup(function (evt) {
        var val = bg_pressed_keys[evt.keyCode];
        if (val) {
            bg_pressed_keys[evt.keyCode]=false;
        }
    });

    $("#background").click(function() {$("#background").toggleClass("show")});

    if(bgLoad()) {
        bgRender();
    }
    window.bg_interval_id = setInterval("bgRender()",bg_interval_ms);
});

