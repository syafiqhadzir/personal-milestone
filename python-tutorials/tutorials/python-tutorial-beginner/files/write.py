employee_file = open("employees.txt", "a")  # append / w write, r+ read-write
employee_file.writelines("\nToby - Human Resources\nKelly - Customer Service")
employee_file.close()
