var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.draw = function () {
        console.log('x: ' + this.x + ', Y: ' + this.y);
    };
    return Point;
}());
var point = new Point(1, 2);
this.x = 1;
this.y = 2;
point.draw();
// Access Modifiers
//
// 1. private
// 2. public
// 3. protected
