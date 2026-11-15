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

app.post('/clients', async (req, res, next) => {
    const { name, age, user_to_blame } = req.body;

    if (typeof name !== 'string' || name.length === 0 || name.length > 255)
      return res.status(400).json({ error: 'invalid name' });
    if (!Number.isInteger(age) || age < 0 || age > 150)
      return res.status(400).json({ error: 'invalid age' });
    if (typeof user_to_blame !== 'string' || user_to_blame.length === 0)
      return res.status(400).json({ error: 'invalid user_to_blame' });

    const [result] = await pool.execute(
      `INSERT INTO Clients
         (client_id, event_number, name, age, user_to_blame, event_type)
       SELECT COALESCE(MAX(client_id), 0) + 1, 0, ?, ?, ?, 'CREATE'
       FROM Clients`,
      [name, age, user_to_blame]
    );

    const [[row]] = await pool.execute(
      `SELECT client_id FROM Clients WHERE event_offset = ?`,
      [result.insertId]
    );
    return res.status(201).json({ client_id: row.client_id });
    throw lastErr;
    next(err);
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'internal error' });
});

const server = app.listen(PORT, () => console.log(`listening on :${PORT}`));
process.on('SIGTERM', async () => { server.close(); await pool.end(); });
