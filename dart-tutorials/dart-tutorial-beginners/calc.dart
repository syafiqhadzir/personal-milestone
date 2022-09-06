import 'dart:io';

String? prompt(String promptText) {
  print(promptText);
  String? prompt = stdin.readLineSync();
  return prompt;
}

double? promptDouble() {
  print("Enter a number:");
  double? promptDouble = double.parse(stdin.readLineSync() ?? "");
  return promptDouble;
}

void main() {
  double? num1 = promptDouble();
  double? num2 = promptDouble();
  String? op = prompt("Enter an operation (+,-,/,*): ");

  switch (op) {
    case '+':
      print(num1! + num2!);
      break;
    case '-':
      print(num1! - num2!);
      break;
    case '/':
      print(num1! / num2!);
      break;
    case '*':
      print(num1! * num2!);
      break;
    default:
      print("Invalid operator");
  }
}

// void variant() {

// First Variant

//   prompt("Enter first number: ");
//   String? num1 = stdin.readLineSync();
//   prompt("Enter second number: ");
//   String? num2 = stdin.readLineSync();

//   print(double.parse(num1 ?? "") + double.parse(num2 ?? ""));

// ============================================================ //

// Second Variant

//   print("Enter first number: ");
//   double? num1 = double.tryParse(stdin.readLineSync() ?? "");
//   print("Enter second number: ");
//   double? num2 = double.tryParse(stdin.readLineSync() ?? "");

//   print(num1! + num2!);
// }
