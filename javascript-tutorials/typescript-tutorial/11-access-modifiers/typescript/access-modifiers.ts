class Point {
    private x: number
    private y: number

    constructor(x?: number, y?: number) {
        this.x = y
        this.y = y
    }

    draw() {
        console.log('x: ' + this.x + ', Y: ' + this.y)
    }
}

let point = new Point(1, 2);
point.draw()

// Access Modifiers
//
// 1. private
// 2. public
// 3. protected
