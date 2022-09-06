import 'dart:io';

String prompt(String promptText) {
  print(promptText);
  String? answer = stdin.readLineSync();
  return answer ?? "";
}

void main() {
  String colour = prompt("Enter a colour: ");
  String pluralNoun = prompt("Enter a plural noun: ");
  String celebrity = prompt("Enter a celebrity: ");

  print("Roses are ${colour}.");
  print("${pluralNoun} are blue.");
  print("I love ${celebrity}.");
}

// Madlibs

// void madlib() {
//   // Variable declaration
//   String characterName;
//   String characterAge = "70";

//   // Variable assignment
//   characterName = "Stanley";

//   print("There once was a man named ${characterName},");
//   print("He was ${characterAge} years old;");
//   print("He really liked the name ${characterName},");
//   print("But he didn't like being ${characterAge}.");
// }
