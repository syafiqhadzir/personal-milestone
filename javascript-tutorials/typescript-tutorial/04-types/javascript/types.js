var a;
var b;
var c;
var d;
var e = [1, 2, 3];
var f = [1, true, 'a', false];
var colorRed = 0;
var colorGreen = 1;
var colorBlue = 2;
var color;
(function (color) {
    color[color["Red"] = 0] = "Red";
    color[color["Green"] = 1] = "Green";
    color[color["Blue"] = 2] = "Blue";
    color[color["Purple"] = 3] = "Purple";
})(color || (color = {}));
var backgroundColor = color.Red;