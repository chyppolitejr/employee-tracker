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
  });
  queryAllDepartments();
  queryAllTitles();
});

// function to view all employees
function queryAllEmployees() {
  const sqlAllEmp = "SELECT * FROM V_VIEW_EMPLOYEES;";
  connection.query(sqlAllEmp, (err, res) => {
    if (err) throw err;
    console.table(asTable(res));
  });
}

// function to view all departments
function queryAllDepartments() {
  const qryAllDepartments = "Select * from tblDepartment;";
  connection.query(qryAllDepartments, (err, res) => {
    if (err) throw err;
    console.table(asTable(res));
  });
}

// function to view all Titles
function queryAllTitles() {
  const qryAllTitles = "Select * from tblRole;";
  connection.query(qryAllTitles, (err, res) => {
    if (err) throw err;
    console.table(asTable(res));
  });
}

//function add new roles
// function sqlInsertRole() {
//     strSql =
// }
