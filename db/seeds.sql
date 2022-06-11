INSERT INTO departments (name)
VALUES
('Marketing'),
('Sales'),
('Finance'),
('Management'),
('Engineering');

INSERT INTO roles (title, salary, department_id)
VALUES
('Marketing Director', 80000.00, 1),
('Salesperson', 48000.00, 1),
('Accountant', 60000.00, 2),
('Manager', 75000.00, 3),
('Engineer', 85000.00, 4),
('Branding Consultant', 70000.00, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Jane', 'Doe', 1, 2),
('John', 'Smith', 2, 3),
('Harry', 'Potter', 3, 4),
('Ebony', 'Ivory', 4, 3),
('Lionel', 'Linen', 5, 1),
('Joe', 'Jackson', 6, 3);