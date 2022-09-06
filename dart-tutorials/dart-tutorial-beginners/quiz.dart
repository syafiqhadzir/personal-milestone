import 'dart:io';

String? prompt(String promptText) {
  print(promptText);
  String? answer = stdin.readLineSync();
  return answer;
}

double? promptDouble(String? question) {
  print("Enter a number: ");
  double myNum = double.parse(stdin.readLineSync() ?? "");
  return myNum;
}

class MathQuestion {
  String? question;
  double? answer;

  MathQuestion(String aQuestion, double aAnswer) {
    this.question = aQuestion;
    this.answer = aAnswer;
  }
}

void main() {
  List<MathQuestion> questions = [
    MathQuestion("3 + 5", 8.0),
    MathQuestion("10 - 7", 3.0),
    MathQuestion("100 * -", 900.0)
  ];

  int score = 0;

  for (MathQuestion mathQuestion in questions) {
    double? userAnswer = promptDouble(mathQuestion.question);
    if (userAnswer == mathQuestion.question) {
      score++;
    }
  }

  print("You got ${score / questions.length * 100}");
}
