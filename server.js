const express = require('express');
const db = require('./db/connection');
const mysql = require('mysql2');
const inquirer = require ('inquirer');
const cTable = require("console.table");


const PORT = process.env.PORT || 3001;
const app = express();


// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//start of prompts
const promptUser = () => {
    inquirer.prompt([
        {
          name: 'choices',
          type: 'list',
          message: 'Select:',
          choices: [
            'View all departments',
            'View all roles',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update employee role',
            'Exit'
            ]
        }
      ])
      .then((answer) => {
        const { choices } = answer;

        if (choices === 'View all departments') {
            viewDepartments();
          }
      
          if (choices === 'View all roles') {
            viewRoles();
          }
          if (choices === 'View all employees') {
            viewEmployees();
          }
          if (choices === 'Add a role') {
            addRole();
          }
          if (choices === 'Add an employee') {
            addEmployee();
          }
          if (choices === 'Update an employee role') {
            updateEmployee();
          }

      if (choices === 'Exit') {
        console.log("Thank you, come again!")
        connection.end();
    }
});
};

//FUNCTIONS 

//DEPT
const viewDepartments =() => {
    const sql =`SELECT department.id AS id, department.name 
      AS department 
      FROM department`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
      })
}



//roles
viewRoles = () => {
    console.log('Showing roles.')
    const sql = `SELECT roles.id, roles.title, department.name AS department
    FROM roles
    INNER JOIN department ON roles.department_id = department.id`;
    
                  db.query(sql, (err, rows) => {
                    if (err) throw err;
                    console.table(rows);
                    promptUser();
                  })
  }
  

  //View the employees
viewEmployees = () => {
  console.log('Displaying Employees')
  const sql = ''
}
  








// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Employee Data Tracer');
    promptUser();
    app.listen(PORT, () => {
    });
  });