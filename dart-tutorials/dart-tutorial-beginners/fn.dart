import 'dart:io';

double addNumbers(double num1, double num2) {
  return num1 + num2;
}

void sayHi(String name, int age) {
  print("Hi, ${name}! You are ${age}!");
}

void drawTriangle(color) {
  print("    /|");
  print("   / | ${color}");
  print("  /  |");
  print(" /   |");
  print("/____|");
}

void main() {
  print("Please insert color: ");
  String? color = stdin.readLineSync();
  drawTriangle(color);

  sayHi("Mike", 23);
  sayHi("Joe", 19);

  double answer = addNumbers(2, 3);

  print(answer);
}
