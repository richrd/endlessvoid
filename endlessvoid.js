/*
 * Canvas 2D Space
 * Richard Lewis 2015
 * http://bittemple.net
 */

function EndlessVoid() {
    this.canvas_id = "#bg-canvas"
    this.pressed_keys = [];

    this.interval_ms = 40;
    this.interval_id = null;
    this.paused = false;

    this.origin = new Vector();
    this.space_ship = new SpaceShip(this);
    this.edge_threshhold = new Vector(window.innerWidth*.2, window.innerHeight*.2);

    this.minimap_scale = .0100
    this.minimap_center = new Vector(130, 130);
    this.minimap_radius = 90

    this.stars = [];
    this.star_amount = 100;

    this.planets = [];
    this.planet_amount = 150;

    this.bullets = [];
    this.bullets_max = 100;
}

EndlessVoid.prototype.load = function() {
    $(document.body).keydown($.proxy(function (evt) {
        var key = evt.keyCode;
        if(!this.pressed_keys[key]) {
            this.pressed_keys[key] = true;
        }
    }, this));

    $(document.body).keyup($.proxy(function (evt) {
        var key = evt.keyCode;
        var val = this.pressed_keys[key];
        if (val) {
            this.pressed_keys[evt.keyCode] = false;
        }
        if (key == 19) {
            this.pause();
        }
    }, this));

    // Detect key
    $(document.body).keyup($.proxy(function (evt) {
    }, this));
}

EndlessVoid.prototype.tick = function() {
    this.handleKeys()
    if (!this.paused) {
        this.update()
        this.render();
    }
}

EndlessVoid.prototype.start = function() {
    if(this.bgLoad()) {
        this.bgRender();
    }
    this.interval_id = setInterval($.proxy(this.tick, this), this.interval_ms);
}

EndlessVoid.prototype.pause = function() {
    if(!this.paused) {
        this.paused = 1
        return
    }
    this.paused = 0
}

EndlessVoid.prototype.updateStars = function(add) {
    for (var i = this.stars.length - 1; i >= 0; i--) {
        star = this.stars[i]
        star.move(add.mul(star.z_multiplier))
    };
}

EndlessVoid.prototype.resetStars = function() {
    for (var i = this.stars.length - 1; i >= 0; i--) {
        new_pos = new Vector()
        new_pos.random(new Vector(window.innerWidth, window.innerHeight, 99), false);
        star = this.stars[i]
        star.set(new_pos)
    };
}

EndlessVoid.prototype.bgLoad = function() {
    // Create stars.
    for (var i = 0; i < this.star_amount; i++) {
        mul = 1
        if (i > this.star_amount/2) {
            //x=1
            mul = 0.98
        }
        p = new BgStar();
        p.random(new Vector(window.innerWidth, window.innerHeight, 99), false);
        p.z_multiplier = mul
        this.stars.push(p)
    };

    // Create planets.
    for (var i = 0; i < this.planet_amount; i++) {
        p = new Planet(this);
        p.random(new Vector(window.innerWidth*40, window.innerHeight*40, 99));
        this.planets.push(p)
    };

    this.space_ship.rotateShapes();
    this.space_ship.speed.random(new Vector(.05,.05,.05));
}

EndlessVoid.prototype.minimapTranslate = function(v) {
    center = new Vector(window.innerWidth/2, window.innerHeight/2);
    // WTF?
    return v.copy().add(this.space_ship.copy().invert()).mul(this.minimap_scale).add(this.minimap_center);
}

EndlessVoid.prototype.bgTranslate = function(v) {
    center = new Vector(window.innerWidth/2, window.innerHeight/2);
    return v.copy().add(center).add(this.origin);
}

EndlessVoid.prototype.renderMinimap = function(ctx) {
    ctx.strokeStyle = "rgba(180,220,255, .3)";
    ctx.fillStyle = "rgba(180,220,255, .05)";

    ctx.beginPath();
    ctx.arc(this.minimap_center.x, this.minimap_center.y, this.minimap_radius, 0, Math.PI*2, true);
    ctx.stroke();
    ctx.fill()
    ctx.beginPath()
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.arc(this.minimap_center.x, this.minimap_center.y, 2, 0, Math.PI*2, true);
    ctx.fill()

    d1 = rotate_point(this.minimap_radius, 0, 0, 0, this.space_ship.angle)
    d1 = new Vector(d1.x, d1.y)
    d1.add(this.minimap_center)

    d2 = rotate_point(this.minimap_radius-(this.minimap_radius*.1), 0, 0, 0, this.space_ship.angle)
    d2 = new Vector(d2.x, d2.y)
    d2.add(this.minimap_center)

    ctx.arc(d2.x, d2.y, 2, 0, Math.PI*2, true);
    ctx.strokeStyle = "rgba(255,255,255, 1)";
    ctx.beginPath();
    ctx.moveTo(d2.x, d2.y)
    ctx.lineTo(d1.x, d1.y)

    ctx.stroke();
    //ctx.strokeStyle = "rgba(180, 220, 255, .3)";

    ctx.strokeStyle = "rgba(180, 255, 180, .4)";
    ctx.fillStyle = "rgba(180, 255, 180, .4)";
    for (var i = this.planets.length - 1; i >= 0; i--) {
        p = this.minimapTranslate(this.planets[i])
        if(this.minimap_center.dist(p) > this.minimap_radius) {continue}
        ctx.beginPath();
        ctx.arc(p.x, p.y, this.planets[i].radius*this.minimap_scale,0,Math.PI*2,true);
        ctx.stroke();
        ctx.fill()
    };
}

EndlessVoid.prototype.update = function() {
    // Update spaceship
    this.space_ship.update()
    // Update planets (and gravity effect on space ship)
    for (var i = this.planets.length - 1; i >= 0; i--) {
        this.planets[i].update()
    }
    // Update bullets
    for (var i = this.bullets.length - 1; i >= 0; i--) {
        this.bullets[i].update()
    }
}

EndlessVoid.prototype.render = function() {
    if(window.innerWidth+window.innerHeight < 1400) {return;}

    this.edge_threshhold.x = window.innerWidth * .4
    this.edge_threshhold.y = window.innerHeight * .4

    var ctx = $(this.canvas_id)[0].getContext('2d');
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    center = new Vector(window.innerWidth/2, window.innerHeight/2);

    ctx.font = "20px Georgia";
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.lineWidth = "1.5";

    // ctx.fillText("ship: "+parseInt(space_ship.x)+","+parseInt(space_ship.y),10,50);
    // ctx.fillText("orig ang: "+angle_to_target(space_ship,new Vector()),10,75);
    // ctx.fillText("ship ang: "+space_ship.angle,10,100);

    ctx.strokeStyle = "rgba(240,240,210, .98)";
    for (var i = this.stars.length - 1; i >= 0; i--) {
        star = this.stars[i]
        star.update()
        value = .4 + (star.z-1) / 2 / 100.0;
        ctx.strokeStyle = "rgba("+star.color[0]+","+star.color[1]+","+star.color[2]+","+value+")";
        ctx.beginPath();
        ctx.arc(star.x, star.y, .2+value, 0, Math.PI*2, true);
        ctx.stroke();
    };

    ctx.strokeStyle = "rgba(200,255,255, 1)";
    for (var i = this.bullets.length - 1; i >= 0; i--) {
        bullet = this.bullets[i]
        ctx.beginPath();
        p = this.bgTranslate(bullet)

        ctx.arc(p.x,p.y,1,0,Math.PI*2,true);
        ctx.stroke();
        if(!isOnScreen(p))
        {
            this.bullets.splice(i,1)
        }
    };

    ctx.strokeStyle = "rgba(180,255,180, 1)";
    ctx.fillStyle = "rgba(0,10,0, 1)";
    for (var i = this.planets.length - 1; i >= 0; i--) {
        planet = this.planets[i]
        ctx.beginPath();
        p = this.bgTranslate(planet)
        // Replace checking center coordinates 
        // with checking the bounding rects  
        // if(!isOnScreen(p)) {continue;}
        ctx.arc(p.x, p.y, planet.radius, 0, Math.PI*2, true);
        ctx.fill();
        ctx.stroke();
        ang = angle_to_target(planet,this.space_ship)
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

    this.space_ship.render(ctx)
    this.renderMinimap(ctx)
}

EndlessVoid.prototype.handleKeys = function() {
    // Handle keys.
    if(this.pressed_keys[37]) {
        this.space_ship.turn(-1)
    }
    if(this.pressed_keys[39]) {
        this.space_ship.turn(1)
    }
    if(this.pressed_keys[38]) {
        this.space_ship.accelerate(1)
    }
    if(this.pressed_keys[40]) {
        this.space_ship.accelerate(-1)
    }
    if(this.pressed_keys[32]) {
        this.space_ship.shoot()
    }
    if(this.pressed_keys[90]) {
        this.space_ship.turbo()
    }

    if(this.pressed_keys[48]) {
        this.space_ship.x = 0
        this.space_ship.y = 0
        this.space_ship.speed = new Vector();
    }
}

$(function () {
    app = new EndlessVoid();
    app.load()
    app.start()
});
