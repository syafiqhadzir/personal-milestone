class Student {
  String? name;
  double? gpa;

  Student(String aName, double aGpa) {
    this.name = aName;
    this.gpa = aGpa;
  }

  bool hasHonours() {
    return this.gpa! >= 3.5;
  }
}

void main() {
  Student jim = Student("Jim", 2.5);
  Student pam = Student("Pam", 3.7);

  print(jim.hasHonours());
  print(pam.hasHonours());
}
