const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'Afreen@2501',
});

let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password()
    ];
};


// Home route

app.get('/', (req, res) => {
    let q = `SELECT count(*) FROM users`;
    try {
        connection.query(q, (err, results) => {
            if (err) throw err;
            // console.log(results[0]['count(*)']);
            let count = results[0]['count(*)'];
            res.render('home', { count });
            // res.send("successfully fetched the data from database");
        });
    } catch (err) {
        console.log(err);
        res.send("some error occured in database");
    };
    // res.send('Welcome to home page');
});


// Show route

app.get('/users', (req, res) => {
    let q = `SELECT * FROM users`;
    try {
        connection.query(q, (err, users) => {
            if (err) throw err;
            res.render('showusers', { users });
        });
    } catch (err) {
        console.log(err);
        res.send("some error occured in database");
    };
});


// Edit route


app.get('/users/:id/edit', (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM users WHERE id = '${id}'`;
    try {
        connection.query(q, (err, results) => {
            if (err) throw err;
            // console.log(results);
            let users = results[0];
            res.render('edit', { users });        
        });
    }
    catch (err) {
        console.log(err);
        res.send("some error occured in database");
    }
});

// Update (DB) route

app.patch('/users/:id', (req, res) => {
    let { id } = req.params;
    let {password: formPass, username: newUsername} = req.body;
    let q = `SELECT * FROM users WHERE id = '${id}'`;
    try {
        connection.query(q, (err, results) => {
            if (err) throw err;
            let users = results[0];
            if (formPass != users.password) {
                res.send("Password is incorrect");
            } else {
                let q2 = `UPDATE users SET username = '${newUsername}' WHERE id = '${id}'`;
                connection.query(q2, (err, results) => {
                    if (err) throw err;
                    res.redirect('/users');
                });
            }

        });
    }
    catch (err) {
        console.log(err);
        res.send("some error occured in database");
    };
   
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

// homework: add delete route, add route to add new user, add route to update user data (username) with password verification
// add a new user route
// delete route

// app.post('/users/:id', (req, res) => {
//     let { id } = req.params;
//     let { username, email, password } = req.body;
//     let q = `UPDATE users SET username = '${username}', email = '${email}', password = '${password}' WHERE id = '${id}'`;
//     try {
//         connection.query(q, (err, results) => {
//             if (err) throw err;
//             res.redirect('/users');
//         });
//     }
//     catch (err) {
//         console.log(err);
//         res.send("some error occured in database");
//     }
// }); 




// inserting a new user into the database
// let q = "INSERT INTO users (id, username, email, password) VALUES ?";


// let data = [];

// for (let i = 1; i <= 100; i++) {
//     data.push(getRandomUser()); // 100 fake user data
// }

// let user = [
//     ["123b", "123_newuserb", "abc@gmail.comb", "abcb"],
//     ["123c", "123_newuserc", "abc@gmail.comc", "abcc"],

// ];


// try {
//     connection.query(q, [data], (err, results) => {
//     if (err) throw err;
//     console.log(results);
// });
// } catch (err) {
//     console.log(err);
// };

// connection.end();








// console.log(getRandomUser());


