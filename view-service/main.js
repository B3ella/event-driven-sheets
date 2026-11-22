const mysql = require('mysql2/promise');

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

async function main(){
  last_offset = await get_last_processed_offset("Clients");
  console.log(last_offset)
}

async function get_last_processed_offset(table){
  const [rows] = await pool.execute(
    `SELECT last_processed_offset FROM view_metadata WHERE table_name='?'`,
    [table]
  );
  if (rows[0]){
    return rows[0].get("last_processed_offset")
  }
  return -1
}

main()
