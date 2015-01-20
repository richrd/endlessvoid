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