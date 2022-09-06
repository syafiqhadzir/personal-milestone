class Book {
  // Constructor
  Book(String title, String author, int numPages) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
  }

  String? title;
  String? author;
  int? numPages;
}

void main() {
  Book hp = Book("Sorcerer's Stone", "J. K. Rowling", 300);

  Book lotr = Book("Lord of The Ring", "Tolkien", 500);

  print(hp.title);
  print(lotr.title);
}
