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
      // responses.menuItem;
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
          addRole();

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

// add an employee
const addEmployee = () => {
  Promise.all([viewEmployees(), viewRoles()]).then(([employees, roles]) => {
    const [employeeRows] = employees;
    const [roleRows] = roles;
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the employee's first name?",
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the employee's last name?",
        },
        {
          type: "list",
          name: "empRole",
          message: "What is the employee's role?",
          choices: roleRows.map((row) => {
            return { name: row.title, value: row.id };
          }),
        },
        {
          type: "list",
          name: "manager",
          message: "Select the employee's manager",
          choices: employeeRows.map((row) => {
            return {
              name: `${row.first_name} ${row.last_name}`,
              value: row.id,
            };
          }),
        },
      ])
      .then((responses) => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;
        db.query(
          sql,
          [
            responses.firstName,
            responses.lastName,
            responses.role,
            responses.manager,
          ],
          (err, results, fields) => {
            if (err) {
              console.log(`Error! Could not add ${responses.firstName}`);
            } else {
              console.log(
                `${(responses.firstName, results.employeeId)} was added`
              );
            }
          }
        );
        startMenu();
      })
      .catch((error) => {
        console.log("Error! Could not add employee");
      });
  });
};

// update an employee
const updateEmployee = () => {
  Promise.all([viewEmployees(), viewRoles()]).then(([employees, roles]) => {
    const [employeeRows] = employees;
    const [roleRows] = roles;

    inquirer
      .prompt([
        {
          type: "list",
          name: "updateEmp",
          message: "Update role? Which employee?",
          choices: employeeRows.map((row) => {
            return {
              name: `${row.first_name} ${row.last_name}`,
              value: row.id,
            };
          }),
        },
        {
          type: "list",
          name: "newRole",
          message: "What is the employee's new role?",
          choices: roleRows.map((row) => {
            return { name: row.title, value: row.id };
          }),
        },
      ])
      .then((responses) => {
        const sql = `UPDATE employees
                    SET role_id = ${responses.newRole}
                    WHERE id = ${responses.updateEmp}`;
        db.query(sql, (err, results, fields) => {
          if (err) {
            console.log(`Error! Could not update ${responses.updateEmp}.`);
          } else {
            console.log("Role was updated!");
          }
        });
        startMenu();
      })
      .catch((error) => {
        console.log("Error! Something is wrong!");
      });
  });
};

// delete an employee
const removeEmployee = () => {
  Promise.all([viewEmployees(), viewRoles()]).then(([employees, roles]) => {
    const [employeeRows] = employees;
    const [roleRows] = roles;

    inquirer
      .prompt([
        {
          type: "list",
          name: "removeEmp",
          message: "Selected the employee you want to remove",
          choices: employeeRows.map((row) => {
            return {
              name: `${row.first_name} ${row.last_name}`,
              value: row.id,
            };
          }),
        },
      ])
      .then((responses) => {
        const sql = `DELETE FROM employees
                     WHERE id = ${responses.removeEmp};`;
        db.query(sql, (err, results, fields) => {
          if (err) {
            console.log(`Error! Could not remove ${responses.removeEmp}.`);
          } else {
            console.log("Removed!");
          }
        });
        startMenu();
      })
      .catch((error) => {
        console.log("Error! Could not remove employee!");
      });
  });
};

// add role
const addRole = () => {
  viewDepts().then(([rows, fields]) => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "roleTitle",
          message: "What is the title of the role?",
        },
        {
          type: "input",
          name: "roleSalary",
          message: "What is the salary for the role?",
          validate: (input) => {
            if (input.length == 0 || input.length < 5) {
              return "Please enter a min of 5 numeric characters";
            } else {
              return true;
            }
          },
        },
        {
          type: "list",
          name: "deptRole",
          message: "What department has that role?",
          choices: rows.map((row) => {
            return { name: row.name, value: row.id };
          }),
        },
      ])
      .then((responses) => {
        const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);`;
        [responses.roleTitle, responses.salary, responses.deptRole],
          db.query(sql, (err, results, fields) => {
            if (err) {
              console.log(`Error! Could not add ${responses.roleTitle}`);
            } else {
              console.log(`${responses.roleTitle} was added!`);
            }
          });
        startMenu();
      })
      .catch((error) => {
        console.log(`Error! Could not add ${responses.roleTitle}`);
      });
  });
};

// add dept
const addDept = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "dept",
        message: "What is the department?",
      },
    ])
    .then((responses) => {
      const sql = `INSERT INTO departments (name) VALUES (?);`;
      responses.dept,
        db.query(sql, (err, results, fields) => {
          if (err) {
            console.log(`Error! Could not add ${responses.dept}`);
          } else {
            console.log(`${responses.dept} was added!`);
          }
        });
      startMenu();
    })
    .catch((error) => {
      console.log(`Error! Could not add ${responses.dept}`);
    });
};

const exitMenu = () =>
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "value",
        message: "Would you like to select more?",
      },
    ])
    .then((response) => {
      if (response.confirm) {
        return startMenu();
      } else {
        process.exit();
      }
    });
startMenu();
