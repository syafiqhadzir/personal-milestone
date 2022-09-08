from math import *

# Setup & Hello World

print("Hello World!")


# Drawing a Shape

print("   /|")
print("  / |")
print(" /  |")
print("/___|")


# Variables & Data Types

character_name = "Tom"
character_age = "30"  # 30.123456789 Numbers
is_male = True

print("There once was a man named " + character_name + ".")
print("He was " + character_age + " years old.")

character_name = "John"
print("He really liked the name " + character_name + ".")
print("But didn't like being " + character_age + ".")


# Working with Strings

phrase = "Giraffe Academy"
print(phrase + " is cool")
print(phrase.upper().isupper())
print(len(phrase))
print(phrase[0])
print(phrase.index("A"))
print(phrase.replace("Giraffe", "Elephant"))


# Working with Numbers

my_num = -1.2345 + (4 % 3) / ((2 - 3) * 9)
print(my_num)
print(str(my_num) + " is the answer")
print(abs(my_num))  # absolute value
print(pow(my_num, 2))  # power
print(max(round(my_num), 0))
print(max(round(abs(my_num)), 0))
print(round(my_num))
print(floor(3.7))
print(ceil(3.7))
print(sqrt(36))


# Getting Input from Users

name_input = input("Enter your name: ")
person_age = input("Enter your age: ")
print("Hello " + name_input + "! You are " + person_age)


# Tuples

coordinates_list = [(1, 3), (6, 5), (8, 9)]
coordinates = (4, 5)    # tupled values are immutable

print(coordinates[0])


# Function

def say_hi(fn_name, fn_age):
    print("Hello " + fn_name + fn_age)


say_hi("John", "12")
say_hi("Mike", "53")


# While

i = 1
while i < 10:
    print(i)
    i += 1

print("Done with loop.")

# Comments

# This program is cool
# print("Comments are fun")

'''
Hello world!
This is multiple line comment!
But # is the official Python syntax for comment.
'''

# This is
# for the
# example.

# Try / Except

try:
    number = int(input("Insert a number: "))
    print(number)
except:
    print("Invalid input")