
is_male = True

if is_male:  # if is_male is true.
    print("You are a male")
else:
    print("You are a female")

is_tall = True

if is_male or is_tall:  # or
    print("You are a male or tall")
else:
    print("You are neither a male nor tall")

if is_male and is_tall:  # and
    print("You are a tall male")
elif is_male and not(is_tall):
    print("You are short male")
elif not(is_male) and is_tall:
    print("You are short female")
else:
    print("You are neither short nor male")
