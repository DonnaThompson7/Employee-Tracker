const mysql = require("mysql2");
require("dotenv").config();
const inquirer = require("inquirer");

// Connect to database company_db
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "company_db",
  },
  console.log(`Connected to the company_db database.`)
);

const init = () => {
  main();
};

const main = () => {
  // user input
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "action",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then((response) => {
      console.log(response);
      performAction(response.action);
    });
};

const performAction = (action) => {
  switch (action) {
    case "View All Employees":
      viewAllEmployees();
      return;
    case "Add Employee":
      addEmployee();
      return;
    case "Update Employee Role":
      updateEmployeeRole();
      return;
    case "View All Roles":
      viewAllRoles();
      return;
    case "Add Role":
      addRole();
      return;
    case "View All Departments":
      viewAllDepartments();
      return;
    case "Add Department":
      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the name of the department?",
            name: "deptName",
          },
        ])
        .then((response) => {
          addDepartment(response.deptName);
        });
      return;
    case "Quit":
      return;
    default:
      return;
  }
};

const viewAllDepartments = () => {
  const query = "select * from department;";
  db.query(query, (err, data) => {
    if (err) {
      throw err;
    }
    console.table(data);
    main();
  });
};

const viewAllRoles = () => {
  const query = "select * from role;";
  db.query(query, (err, data) => {
    if (err) {
      throw err;
    }
    console.table(data);
    main();
  });
};

const viewAllEmployees = () => {
  const query = "select * from employee;";
  db.query(query, (err, data) => {
    if (err) {
      throw err;
    }
    console.table(data);
    main();
  });
};

// add a department
const addDepartment = (nameInput) => {
  const query = `INSERT INTO department (name) VALUES ("${nameInput}");`;
  db.query(query, (err, data) => {
    if (err) {
      throw err;
    }
    //switch this to data.name
    console.log("Added department: " + nameInput + " to the database");
    main();
  });
};

// add a role
const addRole = () => {
  db.query("select * from department;", (err, data) => {
    if (err) {
      throw err;
    }
    const departments = data;
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the role?",
          name: "roleName",
        },
        {
          type: "input",
          message: "What is the salary of the role?",
          name: "salary",
        },
        {
          type: "list",
          message: "What department does the role belong to?",
          name: "departmentName",
          choices: departments,
        },
      ])
      .then((response) => {
        let departmentId;
        for (var i = 0; i < departments.length; i++) {
          if (departments[i].name === response.departmentName) {
            departmentId = departments[i].id;
          }
        }
        const query = `INSERT INTO role (title, salary, department_id) VALUES ("${response.roleName}", ${response.salary}, ${departmentId});`;
        db.query(query, (err, data) => {
          if (err) {
            throw err;
          }
          console.log("Added role: " + response.roleName + " to the database");
          main();
        });
      });
  });
};

// add an employee
const addEmployee = () => {
  let roles;
  let employees;
  db.query("select id, title from role;", (err, data) => {
    if (err) {
      throw err;
    }
    roles = data;
    db.query("select id, concat(first_name, ' ', last_name) as empName from employee;", (err, data) => {
      if (err) {
        throw err;
      }
      employees = data;
      // TODO: add "None" to employees
      // employees.push({id: (employees.length++), first_name: "None"});
      console.log(employees);
      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
      }));
      const employeeChoices = employees.map(({ id, empName }) => ({
        name: empName,
        value: id
      }));
      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the employee first name?",
            name: "firstName",
          },
          {
            type: "input",
            message: "What is the employee last name?",
            name: "lastName",
          },
          {
            type: "list",
            message: "What is the employee role?",
            name: "roleId",
            choices: roleChoices,
          },
          {
            type: "list",
            message: "Who is the employee manager?",
            name: "mgrEmpId",
            choices: employeeChoices,
          },
        ])
        .then((response) => {
          const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${response.firstName}", "${response.lastName}", ${response.roleId}, ${response.mgrEmpId});`;
          db.query(query, (err, data) => {
            if (err) {
              throw err;
            }
            console.log("Added employee to the database");
            main();
          });
        });
    });
  });
};

// update an employee role
const updateEmployeeRole = () => {
  let roles;
  let employees;
  db.query("select id, title from role;", (err, data) => {
    if (err) {
      throw err;
    }
    roles = data;
    db.query("select id, concat(first_name, ' ', last_name) as empName from employee;", (err, data) => {
      if (err) {
        throw err;
      }
      employees = data;
      console.log(employees);
      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
      }));
      const employeeChoices = employees.map(({ id, empName }) => ({
        name: empName,
        value: id
      }));
      inquirer
        .prompt([
          {
            type: "list",
            message: "For which employee do you want to update the role?",
            name: "empId",
            choices: employeeChoices,
          },
          {
            type: "list",
            message: "Which role do you want to assign to the selected employee?",
            name: "roleId",
            choices: roleChoices,
          },
        ])
        .then((response) => {
          const query = `UPDATE employee SET role_id = ${response.roleId} where id = ${response.empId};`;
          db.query(query, (err, data) => {
            if (err) {
              throw err;
            }
            console.log("Updated employee role in the database");
            main();
          });
        });
    });
  });
};

// Function call to initialize app
init();
