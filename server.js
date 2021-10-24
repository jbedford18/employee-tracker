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
            'View all employees',
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
          if (choices === 'Add a Department') {
            addDept();
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

//Add Department
addDept = () => {

  inquirer.prompt([
    {
      type: 'input',
      name: 'typeDept',
      message: 'Please type the name of the Department.'
    }
  ])

  .then(answer => {
    const params = [answer.typeDept]
    console.log(params);


        //prepared statements for values
        const sql = `INSERT INTO department (name)
                     VALUES (?)`;

        db.query(sql, params, (err, result) => {
          if (err) throw err;
          console.log('You added ' + answer.typeDept + ' to Departments!.');

          viewDepartments();
        })
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

  //add a role
addRole = () => {

  inquirer.prompt([
    {
      type: 'input',
      name: 'inputRole',
      message: 'Type the role being added below.'
  
    },
    {
      type: 'input',
      name: 'inputSal',
      message: 'What is the salary??'
      }
     
  
    ])
    .then(answer => {
      const params = [answer.inputRole, answer.inputSal]
      console.log(params);
  
  //get depts from table
  const deptGet = `SELECT name, id FROM department`;
    console.log(deptGet);
    db.query(deptGet, (err, data) => {
    if (err) throw err;
  
  //displays depts to select
    const depts = data.map(({ name, id }) => ({ name: name, value: id }));
    inquirer.prompt([
      {
        type: 'list',
        name: 'dept',
        message: 'What department is this role in?',
        choices: depts
         }
       ])
  
        .then(userChoice => {
          const dept = userChoice.dept;
          console.log(dept);
          params.push(dept);
  
  //prepared statements for values
  const sql = `INSERT INTO roles (title, salary, department_id)
                VALUES (?, ?, ?)`;
            db.query(sql, params, (err, result) => {
            if (err) throw err;
            console.log('You have succesfully added ' + answer.inputRole + ' to roles.');
  
            viewRoles();
          })
  
  
        })
      })
    })
  }

  //View the employees
viewEmployees = () => {
  console.log('Displaying Employees')
  const sql = `SELECT employee.id, employee.first_name, employee.last_name,
  roles.title, department.name AS department, roles.salary,
  CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee
  LEFT JOIN roles ON employee.role_id = roles.id
  LEFT JOIN department ON roles.department_id = department.id
  LEFT JOIN employee manager ON employee.manager_id = manager.id`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  })
}

  
//Add an employee
addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstsName',
      message: 'What is this Employees first name?'
  
      },
      {
        type: 'input',
        name: 'secName',
        message: 'What is their last name?'
      }
    ])
    .then(answer => {
      const picks = [answer.firstsName, answer.secName]
      console.log(picks);
  
//selecting the new employees role
const rolesGet = `SELECT title, id FROM roles`;
console.log(rolesGet);
  db.query(rolesGet, (err, data) => {
  if (err) throw err;
  
const emproles = data.map(({ title, id }) => ({ name: title, value: id }));
  
        
  inquirer.prompt([
          {
            type: 'list',
            name: 'role',
            message: "Please choose what the employee's role is.",
            choices: emproles
          }
        ])
        .then(userChoice => {
          const role = userChoice.role;
          picks.push(role);
  
    const manSql = 'SELECT * FROM employee';
    db.query(manSql, (err, data) => {
    if (err) throw err;
  
//select manager
const manage = data.map(({ id, first_name, last_name}) => ({ name: first_name + " " + last_name, value: id }));
  inquirer.prompt([
    {
      type: 'list',
      name: 'manager',
      message: "Who is the employee's manager?",
      choices: manage
    }
  ])
  .then(mgrChoice => {
const manager = mgrChoice.manager;
  picks.push(manager);
  
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
              VALUES (?, ?, ?, ?)`;
  
    db.query(sql, picks, (err, result) => {
    if (err) throw err;
    console.log('You have succesfully added ' + answer.firstsName + ' ' + answer.secName + ' to the employees list!.')
    viewEmployees();
              })
              })
          })  
        }) 
      })
    })
  }

 //Update an employee role
 updateEmployee = () => {
   
const employeeGet = `SELECT employee.first_name, employee.last_name From employee`;
  console.log(employeeGet);

//list of updatable employees 
  db.query(empployeeGet, (err, data) => {
    if (err) throw err;

const updateE = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
 inquirer.prompt([
      {
        type: 'list',
        name: 'employees',
        message: 'Which employee would you like to update?',
        choices: updateE
      }
    ])
  .then(selectedE => {
  const selected = selectedE.employees;
    console.log(selected);
     const params = [];
     params.push(selected);
  const roleGet = `SELECT * FROM roles`;

    db.query(roleGet, (err, data) => {
     if (err) throw err;

    const roleList = data.map(({ title, id }) => ({ name: title, value: id }));
     
    inquirer.prompt([
        {
         type: 'list',
         name: 'role',
         message: "Which role is the employees new role?",
         choices: roleList
         }
       ])

    .then(userChoice => {
    const userRole = userChoice.role;
      params.push(userRole);
      })

     .then(_ => {
       const updatedEMP = `UPDATE employee SET role_id = ${ params[1]} WHERE id = ${params[0]}`

       db.query(updatedEMP, (err, data) => {
         if (err) throw err;
         console.log('You have succesfully updated the employees role!')

            viewEmployees();
            })
          })
        })
      })
  })
}; 







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

