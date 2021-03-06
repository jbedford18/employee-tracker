INSERT INTO DEPARTMENT (title)
VALUES
    ('Legal'),
    ('Finance'),
    ('Sales');

INSERT INTO roles (title, salary, department_id)
VALUES 
    ('Sales lead', 60000, 3),
    ('Accountant', 75000, 2),
    ('Lawyer', 95000, 1),
    ('Legal Manager', 99000,1),
    ('Sales Agent', 35000, 3),
    ('Finance Assist', 80000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Money','Mac', 1, null),
    ('Stingey', 'Steve', 2, null),
    ('Larry', 'Law', 3, null),
    ('Big', 'Tom', 4, null),
    ('Bob', 'Smith', 6, null),
    ('Chad', 'Bucks', 5, null);