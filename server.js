// const express = require("express");
const mysql = require("mysql");
const inquirer = require("inquirer");
const asTable = require("as-table");
const figlet = require("figlet");
const testArray = ["Ronnie", "Bobby", "Ricky", "Mike"];

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

  figlet(
    "Employee Manager",
    {
      verticalLayout: "full",
      horizontalLayout: "full",
      width: 80,
      whitespaceBreak: true,
    },
    (err, data) => {
      if (err) {
        console.log("Something when wrong with figlet");
        console.dir(err);
        return;
      }
      console.log(data);

      programStart();
      // promptUser().catch((err) => console.error(err));
    }
  );
});

// function to view all employees
function viewEmployees() {
  let sql = "SELECT * FROM V_VIEW_EMPLOYEES;";
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(asTable(res));
    programStart();
  });
}

// get manager list

function viewMgrs() {
  let sql =
    "SELECT Distinct manager_id, manager FROM V_VIEW_EMPLOYEES order by manager";
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(asTable(res));
    console.log(res);
    //return JSON.parse(res);
    promptUser();
  });
}

function viewDepts() {
  let sql = "Select * from tblDepartment order by name;";
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(asTable(res));
    promptUser();
  });
}

// function to view all Titles
function viewTitles() {
  let sql = "Select * from tblRole;";
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(asTable(res));
    promptUser();
  });
}

addEmp = () => {};

removeEmp = () => {};

updateEmpMgr = () => {
  let sql =
    "select employeename as name, employeeid as value from v_view_employees order by employeename;";
  connection.query(sql, (err, res) => {
    if (err) throw err;

    inquirer.prompt({
      type: "list",
      name: "employees",
      message: "Select Employee Whose Manager You Would Like To Update.",
      choices: () => {
        let choicesArray = [];
        for (let i = 0; i < res.length; i++) {
          choicesArray.push(res[i]);
        }
        return choicesArray;
      },
    });
  });
};

function programExit() {
  process.exit();
  connection.end();
}
programStart = () =>
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View Employees",
          "View Employees by Department",
          "View Employees My Manager",
          "View Departments",
          "View Managers",
          "View Titles",
          "Add Employee",
          "Remove Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case "View Employees":
          viewEmployees();
          break;
        case "View Employees By Department":
          viewEmpByDept();
          break;
        case "View Employees by Manager":
          viewEmpByDept();
          break;
        case "View Departments":
          viewDepts();
          break;
        case "View Managers":
          viewMgrs();
          break;
        case "View Titles":
          viewTitles();
          break;
        case "Add Employee":
          addEmp();
          break;
        case "Remove Employee":
          removeEmp();
          break;
        case "Update Employee Title":
          updateEmpTtl();
          break;
        case "Update Employee Manager":
          updateEmpMgr();
          break;
        case "Exit":
          programExit();
      }
    });
