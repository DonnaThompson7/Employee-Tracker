INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 1),
       ("Software Engineer", 120000, 1),
       ("Account Manager", 160000, 2),
       ("Accountant", 125000, 2),
       ("Legal Team Lead", 250000, 3),
       ("Lawyer", 190000, 3),
       ("Sales Lead", 100000, 4),
       ("Salesperson", 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 7, NULL),
       ("Mike", "Chan", 8, 1),
       ("Ashley", "Rodriguez", 1, NULL),
       ("Kevin", "Tupik", 2, 3),
       ("Kunal", "Singh", 3, NULL),
       ("Malia", "Brown", 4, 5),
       ("Sarah", "Lourd", 5, NULL),
       ("Tom", "Allen", 6, 7);
       
