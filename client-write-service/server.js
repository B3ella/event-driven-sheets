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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.post("/create_client", (req, res) => {
  const {client_id, event_number, name, age, user_to_blame, event_type} = req.body;

  let sql = `INSERT INTO Clients
        (client_id, event_number, name, age, user_to_blame, event_type) VALUES
        (${client_id}, ${event_number}, '${name}', ${age}, '${user_to_blame}', '${event_type}')`;

  connection.query(sql, function (err, result) {
    if (err) throw err;
    res.send("1 record inserted");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
