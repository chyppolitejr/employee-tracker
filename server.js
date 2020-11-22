// const express = require("express");
const mysql = require("mysql");
const inquirer = require("inquirer");
const asTable = require("as-table");
const figlet = require("figlet");

// const app = express();
// const PORT = process.env.PORT || 8080;

//  mysql connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Toofy471",
  database: "employees_db",
});

// initiate MySQL connection
connection.connect((err) => {
  if (err) {
    console.log("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id: " + connection.threadId);
  //   queryAllEmployees();

  figlet("Employee Manager", (err, data) => {
    if (err) {
      console.log("Something when wrong with figlet");
      console.dir(err);
      return;
    }
    console.log(data);

    promptUser().catch((err) => console.error(err));
  });

  //   queryAllDepartments();
  //   queryAllTitles();
});

// function to view all employees
function queryAllEmployees() {
  const sqlAllEmp = "SELECT * FROM V_VIEW_EMPLOYEES;";
  connection.query(sqlAllEmp, (err, res) => {
    if (err) throw err;
    console.table(asTable(res));
    promptUser();
  });
}

// function to view all departments
function queryAllDepartments() {
  const qryAllDepartments = "Select * from tblDepartment;";
  connection.query(qryAllDepartments, (err, res) => {
    if (err) throw err;
    console.table(asTable(res));
    promptUser();
  });
}

// function to view all Titles
function queryAllTitles() {
  const qryAllTitles = "Select * from tblRole;";
  connection.query(qryAllTitles, (err, res) => {
    if (err) throw err;
    console.table(asTable(res));
    promptUser();
  });
}

//function add new roles
// function sqlInsertRole() {
//     strSql =
// }

function exitProgram() {
  process.exit();
  connection.end();
}
const promptUser = () =>
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View All Employees by Department",
          "View All Employees My Manager",
          "View All Roles",
          "View All Departments",
          "Add Employee",
          "Remove Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      console.log(answers);
      // if (answers.action === "View All Employees"){
      //     queryAllEmployees()
      // } else
      switch (answers.action) {
        case "View All Employees":
          queryAllEmployees();
          break;
        case "View All Departments":
          queryAllDepartments();
          break;
        case "View All Titles":
          queryAllTitles();
          break;
        case "Exit":
          exitProgram();
      }
    });
