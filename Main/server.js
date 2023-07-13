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
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee role do you want to update?",
            name: "empId",
            // TODO: does this work?
            choices: [viewAllEmployees()],
          },
          {
            type: "list",
            message:
              "Which role do you want to assign to the selected employee?",
            name: "roleId",
            // TODO: does this work?
            choices: [],
          },
        ])
        .then((response) => {
          updateEmployeeRole(data.empId, data.roleId);
          console.log("Updated employee role in the database");
        });
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
    console.log(departments);
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
  // let roles;
  // let employees;
  db.query("select id, title from role;", (err, data) => {
    if (err) {
      throw err;
    }
    let roles = data;
    console.log(roles);

    // db.query("select id, first_name, last_name from employee;", (err, data) => {
    //   if (err) {
    //     throw err;
    //   }
    //   employees = data;
    //   // TODO: add "None" to employees
    //   // employees.push({id: (employees.length++), first_name: "None"});
    //   console.log(employees);

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
            choices: roles,
          },
          // {
          //   type: "list",
          //   message: "Who is the employee manager?",
          //   name: "mgrEmpId",
          //   choices: employees,
          // },
        ])
        .then((response) => {
          //cut out:      , ${mgrEmpId}
          const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (${response.firstName}, ${response.lastName}, ${response.roleId});`;
          db.query(query, (err, data) => {
            if (err) {
              throw err;
            }
            console.log(
              "Added employee: " +
                data.first_name +
                " " +
                data.last_name +
                " to the database"
            );
            main();
          });
        });
    // });
  });
};

// // update an employee role - need to finish this...
//   const updateEmployeeRole = (employeeIdInput, roleIdInput) => {
//     const query = `update employee set role_id = ${roleIdInput} where id = ${employeeIdInput}`;
//   db.query(query, (err, data) => {
//     if (err) {
//       throw err;
//     }
//     console.log("Updated " + employeeIdInput + " in the database");
//     main();
//   });
// }

// Function call to initialize app
init();
