// const express = require("express");
const mysql = require("mysql");
const inquirer = require("inquirer");
const asTable = require("as-table").configure({
  titel: (x) => x.bright,
  delimiter: " | ",
});
const figlet = require("figlet");
const asyncWait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

  //ASCII ART for fanciness
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
      console.log("\n");
      programStart();
    }
  );
});

// function to view all employees
function viewEmployees() {
  let sql = "SELECT * FROM V_VIEW_EMPLOYEES;";
  connection.query(sql, (err, res) => {
    if (err) throw err;
    //line break to keep things spaced out
    console.log("\n");
    //results
    console.table(asTable(res));
    // line break
    console.log("\n");
    programStart();
  });
}

// get manager list

function viewMgrs() {
  let sql =
    "SELECT Distinct manager_id, manager FROM V_VIEW_EMPLOYEES order by manager";
  connection.query(sql, (err, res) => {
    if (err) throw err;
    //line break to keep things spaced out
    console.log("\n");

    console.table(asTable(res));

    //line break to keep things spaced out
    console.log("\n");
    programStart();
  });
}

viewDepts = () => {
  let sql = "Select * from tblDepartment order by name;";
  connection.query(sql, (err, res) => {
    if (err) throw err;
    //line break to keep things spaced out
    console.log("\n");

    console.table(asTable(res));
    //line break to keep things spaced out
    console.log("\n");
    programStart();
  });
};

// function to view all Titles
function viewTitles() {
  let sql = "Select * from tblRole;";
  connection.query(sql, (err, res) => {
    if (err) throw err;
    //line break to keep things spaced out
    console.log("\n");
    console.table(asTable(res));
    //line break to keep things spaced out
    console.log("\n");
    programStart();
  });
}

//  view employees by selected department
viewEmpByDept = () => {
  let sqlDeptList =
    "Select distinct department_id as value, department as name from v_view_employees order by name;";
  let deptArray = [];
  connection.query(sqlDeptList, (err, res) => {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      deptArray.push(res[i]);
    }
    inquirer
      .prompt({
        type: "list",
        name: "department",
        message: "Select department you would like to view",
        choices: deptArray,
      })
      .then((answers) => {
        let sqlSelect = "select * from v_view_employees where ?;";
        connection.query(
          sqlSelect,
          [
            {
              department_id: answers.department,
            },
          ],
          (err, res) => {
            if (err) throw err;
            //line break to keep things spaced out
            console.log("\n");
            console.table(asTable(res));
            console.log("\n");
            programStart();
          }
        );
      });
  });
};
// functions for adding new employees
insertNewEmp = () => {
  let sqlTitle =
    "select id as value, title as name from tblRole order by name;";
  let sqlMgrs =
    "select distinct manager_id as value, manager as name from v_view_employees  order by name;";
  let titleArray = [];
  let mgrArray = [];

  //   get list of titles
  connection.query(sqlTitle, (err, res) => {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      titleArray.push(res[i]);
    }
  });
  //   get list of managers
  connection.query(sqlMgrs, (err, res) => {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      mgrArray.push(res[i]);
    }
  });
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter Employee First Name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter Employee Last Name",
      },
      {
        type: "list",
        name: "title",
        message: "Select Employees Title:",
        choices: titleArray,
      },
      {
        type: "list",
        name: "manager",
        message: "Select Employee Manager",
        choices: mgrArray,
      },
    ])
    .then((answers) => {
      let sqlInsert = "Insert tblEmployees SET ?;";
      connection.query(
        sqlInsert,
        [
          {
            first_name: answers.firstName,
            last_name: answers.lastName,
            role_id: answers.title,
            manager_id: answers.manager,
          },
        ],
        (err) => {
          if (err) throw err;
          console.log("\n");
          console.log("New Employee Has Been Added!");
          console.log("\n");
          programStart();
        }
      );
    });
};

// function to delete selected employee
removeEmp = () => {
  let sqlEmpList =
    "Select employeeid as value , employeename as name from v_view_employees order by name;";
  let empArray = [];

  connection.query(sqlEmpList, (err, res) => {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      empArray.push(res[i]);
    }
    inquirer
      .prompt({
        type: "list",
        name: "employees",
        message: "Which employee would you like to delete?",
        choices: empArray,
      })
      .then((answers) => {
        let sqlDel = "DELETE From tblEmployees WHERE ?;";
        connection.query(
          sqlDel,
          [
            {
              id: answers.employees,
            },
          ],
          (err) => {
            if (err) throw err;
            console.log("Employee Has Deleted!");
            programStart();
          }
        );
      });
  });
};

// function that responds to select "Update Employee Manager" from initial drop down
updateEmpMgr = () => {
  let sql =
    "select employeename as name, employeeid as value from v_view_employees order by employeename;";
  connection.query(sql, (err, res) => {
    if (err) throw err;

    inquirer
      .prompt({
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
      })
      .then((answer) => {
        const empId = answer.employees;
        console.log("EmployeeID select = " + empId);
        selectManager(empId);
      });
  });
};

updateEmployeeTitle = () => {
  let sqlTitle =
    "select id as value , title as name from tblRole order by name;";
  let sqlEmpList =
    "select employeeid as value, employeename as name from v_view_employees order by name;";
  let titleArray = [];
  let empArray = [];

  //get list of titles for choice list and populate title array
  connection.query(sqlTitle, (err, res) => {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      titleArray.push(res[i]);
    }
  });
  // get employee list
  connection.query(sqlEmpList, (err, res) => {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      empArray.push(res[i]);
    }
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Select employee whose title needs to change",
          choices: empArray,
        },
        {
          type: "list",
          name: "title",
          message: "Select employee's new title.",
          choices: titleArray,
        },
      ])
      .then((answers) => {
        let sqlUpdate = "UPDATE tblEmployees SET ? WHERE ?;";
        connection.query(
          sqlUpdate,
          [
            {
              role_id: answers.title,
            },
            {
              id: answers.employee,
            },
          ],
          (err) => {
            if (err) throw err;
            console.log("Title Successfully Updated!");
            console.log("\n");
            programStart();
          }
        );
      });
  });
};

// function to populate the list of managers to select from when updating an employee
function selectManager(empId) {
  let sql =
    "select distinct employeename as name , employeeid as value from employees_db.v_view_employees where title like '%manager%' order by name;";
  connection.query(sql, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt({
        type: "list",
        name: "manager",
        message: "Select New Manager",
        choices: () => {
          let choicesArray = [];
          for (let i = 0; i < res.length; i++) {
            choicesArray.push(res[i]);
          }
          return choicesArray;
        },
      })
      .then((answer) => {
        let mgrId = answer.manager;
        console.log("Manager selected = " + mgrId);
        setEmpMgr(empId, mgrId);
      });
  });
}

// runs final update statement to change the selected employees manager
function setEmpMgr(empId, mgrId) {
  let sql = "Update tblEmployees Set ? Where ?;";
  connection.query(
    sql,
    [
      {
        manager_id: mgrId,
      },
      {
        id: empId,
      },
    ],
    (err) => {
      if (err) throw err;
      console.log("Employee Manager Updated Successfully!");
      programStart();
    }
  );
}

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
          "View Department Employees",
          "View Employees by Manager",
          "View Departments",
          "View Managers",
          "View Titles",
          "Add Employee",
          "Remove Employee",
          "Update Employee Title", //todo
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
        case "View Department Employees":
          viewEmpByDept();
          //console.log("this case was reached");
          break;
        case "View Employees by Manager":
          viewEmpByMgr();
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
          insertNewEmp();
          break;
        case "Remove Employee":
          removeEmp();
          break;
        case "Update Employee Title":
          updateEmployeeTitle();
          break;
        case "Update Employee Manager":
          updateEmpMgr();
          break;
        case "Exit":
          programExit();
      }
    });
