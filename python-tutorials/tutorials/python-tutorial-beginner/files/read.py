employee_file = open("employees.txt", "r") # read
for employee in employee_file.readlines():
    print(employee)

# print(employee_file.readlines()[1])
employee_file.close()
