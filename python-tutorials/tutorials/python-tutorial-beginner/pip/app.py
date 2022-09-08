# import useful_tools

# print(useful_tools.roll_dice(10))

from student import Student

Student1 = Student("Jim", "Business", 3.1, False)
Student2 = Student("Pam", "Art", 2.5, True)

print(Student1.on_honor_roll())
print(Student2.on_honor_roll())
