const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require("console.table");

const startMenu = () =>
  inquirer
    .prompt([
      {
        type: "list",
        name: "menuItem",
        message: "What would you like to do?",
        choices: [
          {
            name: "View All Employees",
            value: "VIEW_EMPLOYEES",
          },
          {
            name: "View All Roles",
            value: "VIEW_ROLES",
          },
          {
            name: "View All Departments",
            value: "VIEW_DEPARTMENTS",
          },
          {
            name: "Add Employee",
            value: "ADD_EMPLOYEE",
          },
          {
            name: "Update Employee Role",
            value: "UPDATE_EMPLOYEE",
          },
          {
            name: "Remove Employee",
            value: "REMOVE_EMPLOYEE",
          },
          {
            name: "Add Role",
            value: "ADD_ROLE",
          },
          {
            name: "Add Department",
            value: "ADD_DEPARTMENT",
          },
          {
            name: "EXIT MENU",
            value: "EXIT_MENU",
          },
        ],
      },
    ])
    .then((responses) => {
      responses.menuItem;
      switch (responses.menuItem) {
        case "VIEW_EMPLOYEES":
          viewEmployees().then(([rows, fields]) => {
            console.table(rows);
            exitMenu();
          });
          break;
        case "VIEW_ROLES":
          viewRoles().then(([rows, fields]) => {
            console.table(rows);
            exitMenu();
          });
          break;
        case "VIEW_DEPARTMENTS":
          viewDepts().then(([rows, fields]) => {
            console.table(rows);
            exitMenu();
          });
          break;
        case "ADD_EMPLOYEE":
          addEmployee();

          break;
        case "UPDATE_EMPLOYEE":
          updateEmployee();

          break;
        case "REMOVE_EMPLOYEE":
          removeEmployee();

          break;
        case "ADD_ROLE":
          addRoles();

          break;
        case "ADD_DEPARTMENT":
          addDept();

          break;
        default:
      }
    });

//view employees
function viewEmployees() {
  return db.promise().query("SELECT * FROM employees;");
}

//view roles
function viewRoles() {
  return db.promise().query("SELECT * FROM roles;");
}

//view departments
function viewDepts() {
  return db.promise().query("SELECT * FROM departments;");
}

startMenu();
