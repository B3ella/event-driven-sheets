require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'CRM',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.post("/create_client", (req, res) => {
  const {name, age, user_to_blame} = req.body;
  const event_type = "CREATE"
  const event_number = 0
  const client_id = "COALESCE(MAX(client_id), 0) + 1";

  let sql = `INSERT INTO Clients
        (client_id, event_number, name, age, user_to_blame, event_type) SELECT
        ${client_id}, ${event_number}, '${name}', ${age}, '${user_to_blame}', '${event_type}'
        FROM Clients;`

  connection.query(sql, function (err, result) {
    if (err) throw err;
    res.send("1 record inserted");
  });
});

const server = app.listen(PORT, () => console.log(`listening on :${PORT}`));
process.on('SIGTERM', async () => { server.close(); await pool.end(); });
