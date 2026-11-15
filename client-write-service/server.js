const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'CRM',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/create_client', async (req, res, next) => {
    const { name, user_to_blame } = req.body;
    const age = Number(req.body.age)

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

app.post('/update_client', async (req, res, next) => {
    const name = req.body.name ?? null
    const age = req.body.age ? Number(req.body.age) : null

    const client_id = Number(req.body.client_id)
    const { user_to_blame } = req.body;
    const event_number = Number(req.body.event_number)

    if (name && (typeof name !== 'string' || name.length === 0 || name.length > 255))
      return res.status(400).json({ error: 'invalid name' });
    if (age && (!Number.isInteger(age) || age < 0 || age > 150))
      return res.status(400).json({ error: 'invalid age' });
    if (typeof user_to_blame !== 'string' || user_to_blame.length === 0)
      return res.status(400).json({ error: 'invalid user_to_blame' });
    if (!Number.isInteger(client_id))
      return res.status(400).json({ error: 'invalid client id' });
    if (!Number.isInteger(event_number))
      return res.status(400).json({ error: 'invalid event number' });

    // To-do: check if the client exists on the db

    const [result] = await pool.execute(
      `INSERT INTO Clients
         (client_id, event_number, name, age, user_to_blame, event_type)
       VALUES
         (?, ?, ?, ?, ?, 'UPDATE')`,
      [client_id, event_number, name, age, user_to_blame]
    );

    return res.status(201).json({ client_id: client_id});
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'internal error' });
});

const server = app.listen(PORT, () => console.log(`listening on :${PORT}`));
process.on('SIGTERM', async () => { server.close(); await pool.end(); });
