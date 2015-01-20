/*
Canvas 2D Space
Richard Lewis 2015
http://bittemple.net
*/

/*
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

*/


/**
 * An object representing a a point, with methods for common transformations
 */
function EndlessVoid() {
    this.bg_canvas_id = "#bg-canvas"
    this.bg_pressed_keys = [];

    this.bg_interval_ms = 40;
    this.bg_interval_id = null;

    this.bg_origin = new Vector();
    this.bg_space_ship = new SpaceShip(this);
    this.bg_edge_threshhold = new Vector(window.innerWidth*.2,window.innerHeight*.2);


    this.bg_minimap_scale = .0125
    this.bg_minimap_scale = .0100
    this.bg_minimap_center = new Vector(130,130);
    this.bg_minimap_radius = 90

    this.bg_stars = [];
    this.bg_star_amount = 100;

    this.bg_planets = [];
    this.bg_planet_amount = 150;

    this.bg_bullets = [];
    this.bg_bullets_max = 100;
}

EndlessVoid.prototype.load = function() {
    // $(document).bind('keydown','alt+space',function() {$("#background").toggleClass("show")});
    $(document.body).keydown($.proxy(function (evt) {
        if(!this.bg_pressed_keys[evt.keyCode]) {
            this.bg_pressed_keys[evt.keyCode] = true;
        }
    }, this));

    $(document.body).keyup($.proxy(function (evt) {
        var val = this.bg_pressed_keys[evt.keyCode];
        if (val) {
            this.bg_pressed_keys[evt.keyCode] = false;
        }
    }, this));

    // $("#background").click(function() {$("#background").toggleClass("show")});
}

EndlessVoid.prototype.start = function() {
    if(this.bgLoad()) {
        this.bgRender();
    }
    // this.bg_interval_id = setInterval("bgRender()", this.bg_interval_ms);
    this.bg_interval_id = setInterval($.proxy(this.bgRender, this), this.bg_interval_ms);
}


EndlessVoid.prototype.updateStars = function(add) {
    for (var i = this.bg_stars.length - 1; i >= 0; i--) {
        star = this.bg_stars[i]
        star.move(add)
    };
}

EndlessVoid.prototype.resetStars = function() {
    console.log("resetStars")
    for (var i = this.bg_stars.length - 1; i >= 0; i--) {
        new_pos = new Vector()
        new_pos.random(new Vector(window.innerWidth, window.innerHeight, 99), false);
        star = this.bg_stars[i]
        star.set(new_pos)
    };
}


EndlessVoid.prototype.bgLoad = function() {
    // Create stars.
    for (var i = 0; i < this.bg_star_amount; i++) {
        p = new Star();
        p.random(new Vector(window.innerWidth, window.innerHeight, 99), false);
        p.warp()
        this.bg_stars.push(p)
    };

    // Create planets.
    for (var i = 0; i < this.bg_planet_amount; i++) {
        p = new Planet(this);
        p.random(new Vector(window.innerWidth*40, window.innerHeight*40, 99));
        this.bg_planets.push(p)
    };


    this.bg_space_ship.rotateShapes();
    this.bg_space_ship.speed.random(new Vector(.05,.05,.05));

    // WTF?
    if(window.innerWidth+window.innerHeight > 1400) {
        $("#bg-toggle").addClass("show");
        return true;
    } else {
        return false;
    }
}

EndlessVoid.prototype.minimapTranslate = function(v) {
    center = new Vector(window.innerWidth/2, window.innerHeight/2);
    // WTF?
    return v.copy().add(this.bg_space_ship.copy().invert()).mul(this.bg_minimap_scale).add(this.bg_minimap_center);
}

EndlessVoid.prototype.bgTranslate = function(v) {
    center = new Vector(window.innerWidth/2, window.innerHeight/2);
    return v.copy().add(center).add(this.bg_origin);
}

EndlessVoid.prototype.renderMinimap = function(ctx) {
    ctx.strokeStyle = "rgba(180,220,255, .3)";
    ctx.fillStyle = "rgba(180,220,255, .05)";

    ctx.beginPath();
    ctx.arc(this.bg_minimap_center.x, this.bg_minimap_center.y, this.bg_minimap_radius, 0, Math.PI*2, true);
    ctx.stroke();
    ctx.fill()
    ctx.beginPath()
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.arc(this.bg_minimap_center.x, this.bg_minimap_center.y, 2, 0, Math.PI*2, true);
    ctx.fill()

    d1 = rotate_point(this.bg_minimap_radius, 0, 0, 0, this.bg_space_ship.angle)
    d1 = new Vector(d1.x, d1.y)
    d1.add(this.bg_minimap_center)

    d2 = rotate_point(this.bg_minimap_radius-(this.bg_minimap_radius*.1), 0, 0, 0, this.bg_space_ship.angle)
    d2 = new Vector(d2.x, d2.y)
    d2.add(this.bg_minimap_center)

    ctx.arc(d2.x, d2.y, 2, 0, Math.PI*2, true);
    ctx.strokeStyle = "rgba(255,255,255, 1)";
    ctx.beginPath();
    ctx.moveTo(d2.x, d2.y)
    ctx.lineTo(d1.x, d1.y)
    // ctx.arc(p.x,p.y,bg_planets[i].radius*bg_minimap_scale,0,Math.PI*2,true); ???
    ctx.stroke();
    ctx.strokeStyle = "rgba(180,220,255, .3)";

    ctx.strokeStyle = "rgba(180,255,180, .4)";
    ctx.fillStyle = "rgba(180,255,180, .4)";
    for (var i = this.bg_planets.length - 1; i >= 0; i--) {
        p = this.minimapTranslate(this.bg_planets[i])
        if(this.bg_minimap_center.dist(p) > this.bg_minimap_radius) {continue}
        ctx.beginPath();
        ctx.arc(p.x, p.y, this.bg_planets[i].radius*this.bg_minimap_scale,0,Math.PI*2,true);
        ctx.stroke();
        ctx.fill()
    };
}

EndlessVoid.prototype.bgRender = function() {
    if(window.innerWidth+window.innerHeight < 1400) {return;}

    this.bgHandleKeys()

    this.bg_edge_threshhold.x = window.innerWidth * .4
    this.bg_edge_threshhold.y = window.innerHeight * .4

    var ctx = $(this.bg_canvas_id)[0].getContext('2d');

    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    center = new Vector(window.innerWidth/2, window.innerHeight/2);


    ctx.font = "20px Georgia";
    ctx.fillStyle = "rgb(255,255,255)";

    ctx.lineWidth = "1.5";
    this.bg_space_ship.update()

    // ctx.fillText("ship: "+parseInt(bg_space_ship.x)+","+parseInt(bg_space_ship.y),10,50);
    // ctx.fillText("orig ang: "+angle_to_target(bg_space_ship,new Vector()),10,75);
    // ctx.fillText("ship ang: "+bg_space_ship.angle,10,100);
    for (var i = this.bg_planets.length - 1; i >= 0; i--) {
        planet = this.bg_planets[i]
        planet.update()
    }


    ctx.strokeStyle = "rgba(240,240,210, .98)";
    for (var i = this.bg_stars.length - 1; i >= 0; i--) {
        star = this.bg_stars[i]
        // star.warp()
        star.update()
        value = .4 + (star.z-1) / 2 / 100.0;
        ctx.strokeStyle = "rgba(255,255,255, "+value+")";
        ctx.beginPath();
        ctx.arc(star.x, star.y, .2+value, 0, Math.PI*2, true);
        ctx.stroke();
    };

    ctx.strokeStyle = "rgba(200,255,255, 1)";
    // console.log(this.bg_bullets)
    for (var i = this.bg_bullets.length - 1; i >= 0; i--) {
        bullet = this.bg_bullets[i]
        bullet.update()
        ctx.beginPath();
        p = this.bgTranslate(bullet)

        ctx.arc(p.x,p.y,1,0,Math.PI*2,true);
        ctx.stroke();
        if(!isOnScreen(p))
        {
            this.bg_bullets.splice(i,1)
        }
    };

    ctx.strokeStyle = "rgba(180,255,180, 1)";
    ctx.fillStyle = "rgba(0,10,0, 1)";
    for (var i = this.bg_planets.length - 1; i >= 0; i--) {
        planet = this.bg_planets[i]
        ctx.beginPath();
        p = this.bgTranslate(planet)
        // if(!isOnScreen(p)) {continue;}
        ctx.arc(p.x, p.y, planet.radius, 0, Math.PI*2, true);
        ctx.fill();
        ctx.stroke();
        ang = angle_to_target(planet,this.bg_space_ship)
        rot = rotate_point(planet.radius, 0, 0, 0, ang)
        v = planet.copy().add(new Vector(rot.x, rot.y))
        v = this.bgTranslate(v)
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.moveTo(v.x, v.y);
        ctx.stroke()
    };

    ctx.strokeStyle = "rgba(180,180,255, .5)";
    ctx.beginPath();
    p = this.bgTranslate(new Vector());
    ctx.arc(p.x, p.y, 20, 0, Math.PI*2, true);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI*2, true);
    ctx.stroke();

    this.bg_space_ship.render(ctx)
    this.renderMinimap(ctx)
}

EndlessVoid.prototype.bgHandleKeys = function() {
    // Handle keys.
    if(this.bg_pressed_keys[37]) {
        this.bg_space_ship.turn(-1)
    }
    if(this.bg_pressed_keys[39]) {
        this.bg_space_ship.turn(1)
    }
    if(this.bg_pressed_keys[38]) {
        this.bg_space_ship.accelerate(1)
    }
    if(this.bg_pressed_keys[40]) {
        this.bg_space_ship.accelerate(-1)
    }
    if(this.bg_pressed_keys[32]) {
        this.bg_space_ship.shoot()
    }
    if(this.bg_pressed_keys[90]) {
        this.bg_space_ship.turbo()
    }

    if(this.bg_pressed_keys[48]) {
        this.bg_space_ship.x=0
        this.bg_space_ship.y=0
        this.bg_space_ship.speed = new Vector();
    }

}

// function toggleBackground() {
//     if(window.bg_interval_id != null) {
//         $("#background").fadeOut()
//         clearInterval(window.bg_interval_id);
//         window.bg_interval_id = null;
//     }
//     else {
//         window.bg_interval_id = setInterval("bgRender()",60);
//         $("#background").fadeIn()
//     }
// }

$(function () {
    // $(document).bind('keydown','alt+space',function() {$("#background").toggleClass("show")});
    // $(document.body).keydown(function (evt) {
    //     if(!bg_pressed_keys[evt.keyCode]) {
    //         bg_pressed_keys[evt.keyCode] = true;
    //     }
    // });

    // $(document.body).keyup(function (evt) {
    //     var val = bg_pressed_keys[evt.keyCode];
    //     if (val) {
    //         bg_pressed_keys[evt.keyCode] = false;
    //     }
    // });

    // $("#background").click(function() {$("#background").toggleClass("show")});

    // if(bgLoad()) {
    //     bgRender();
    // }
    // window.bg_interval_id = setInterval("bgRender()",bg_interval_ms);
    app = new EndlessVoid();
    app.load()
    app.start()
});

