class Point {
    constructor(public x?: number, public y?: number) { }

    draw() {
        console.log('x: ' + this.x + ', Y: ' + this.y)
    }
}

let point = new Point(1, 2);
this.x = 1
this.y = 2
point.draw()

// Access Modifiers
//
// 1. private
// 2. public
// 3. protected
