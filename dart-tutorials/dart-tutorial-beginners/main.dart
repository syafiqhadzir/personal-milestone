import 'dart:io';

void main() {
  List<String> friends = ["Stanley", "Pam", "Karen"];

  print(friends[0]);

  // Array technique
  for (String friends in friends) print(friends.toUpperCase());

  // Counter technique
  for (int i = 0; i < friends.length; i++) print(friends[i].toUpperCase());

  // Statement technique
  drawTriangle(3);
}

// While technique

// int i = 0;
//   while (i < 5) {
//     print(i);
//     i++;
//   }

void drawTriangle(int numTriangles) {
  for (int i = 0; i < numTriangles; i++) {
    print("    /|");
    print("   / |");
    print("  /  |");
    print(" /   |");
    print("/____|");
  }
}

// Single line comment

/*
  Multi
  Line
  Comment
*/

// Boolean

void boolean() {
  print(3 > 2);
  print(3 < 2);
  print(3 == 2);
  print(3 == 3);
}

// Input

void input() {
  print("What is your name?:");
  String? username = stdin.readLineSync();
  print("Hello, ${username}");
}
