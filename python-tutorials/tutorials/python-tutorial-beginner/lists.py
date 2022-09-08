lucky_numbers = [4, 8, 15, 16, 23, 42]
friends = ["Kevin", "Karen", "Jim", "Oscar", "Toby", "Jim"]

print(friends.index("Jim"))
print(friends.count("Jim"))
# friends.extend(lucky_numbers)
friends.append("Creed")
friends.insert(1, "Kelly")
friends.remove("Jim")  # friends.pop() removes last element.
friends.sort()
print(friends)

print(friends[1])
print(friends[-1])
print(friends[1:3])

friends[1] = "Mike"

print(friends[1])

friends.clear()
print(friends)
lucky_numbers.sort()
print(lucky_numbers)
lucky_numbers.reverse()
print(lucky_numbers)


friends2 = friends.copy()

print(friends2)