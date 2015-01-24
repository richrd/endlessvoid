/**
 * Helper functions
 *
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
function rotate_points(points, origin, angle) {
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
    dx = pos1.x - pos2.x;
    dy = pos1.y - pos2.y;
    theta = Math.atan2(dy, dx);
    theta *= 180 / Math.PI // rads to degs
    if(theta < 0) {
        theta = 360 + theta
    }
    return theta
}

/**
 * Convert HSV to RGB
 */
 
function hsv_to_rgb(color) {
    h = color[0] / 255
    s = color[1] / 255
    v = color[2] / 255
    //console.log(h,s,v);
    h_i = parseInt(h*6)
    f = h*6 - h_i
    p = v * (1 - s)
    q = v * (1 - f*s)
    t = v * (1 - (1 - f) * s)
    //console.log(h_i);
    if (h_i == 0) {
        r = v
        g = t
        b = p
    }
    if (h_i == 1) {
        r = q
        g = v
        b = p
    }
    if (h_i == 2) {
        r = p
        g = v
        b = t
    }
    if (h_i == 3) {
        r = p
        g = q
        b = v
    }
    if (h_i == 4) {
        r = t
        g = p
        b = v
    }
    if (h_i == 5) {
        r = v
        g = p
        b = q
    }
    
    rgb = [parseInt(r*256), parseInt(g*256), parseInt(b*256)]
    //console.log(rgb)
    return rgb
}
 
 
 