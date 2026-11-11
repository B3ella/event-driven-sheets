const express = require("express");

const app = express();
const PORT = 3000;


const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'CRM',
    user: 'user',
    password: 'password'
});

connection.connect(function(err) {
    if (err) {
        console.log("error occurred while connecting");
        console.log(err);
    } else {
        console.log("connection created with mysql successfully");
    }
});

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.get("/post", (req, res) => {
  res.send("Hello, Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
