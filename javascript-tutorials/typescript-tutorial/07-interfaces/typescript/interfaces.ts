interface Point {
    x: number,
    y: number
}

let drawPoint = (point: Point) => {
    // ...
}

drawPoint({
    x: 1,
    y: 2,
    draw: function (): void {
        throw new Error("Function not implemented.")
    },
    getDistance: function (another: Point): void {
        throw new Error("Function not implemented.")
    }
})