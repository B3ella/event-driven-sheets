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
  const table = "Clients"
  const last_offset = await get_last_processed_offset(table);
  const result = await read_from_offset(table, last_offset);
  const clients = project_clients(result);
  const queries = generate_queries(clients)
  console.log(clients)
  console.log(queries)
}

async function get_last_processed_offset(table){
  const [rows] = await pool.execute(
    `SELECT last_processed_offset FROM view_metadata WHERE table_name='?'`,
    [table]
  );
  if (rows[0]){
    return rows[0].last_processed_offset
  }
  return "-1"
}

async function read_from_offset(table, offset){
  const query = `SELECT * FROM ${table} WHERE event_offset > ? ORDER BY event_offset;`;
  const [rows] = await pool.execute(
    query,
    [offset]
  );
  return rows
}

function project_clients(events) {
  clients = {};
  for (let i = 0; i < events.length; i++){
    console.log(events[i])
    const {event_type, client_id, name, age} = events[i];
    if (event_type == "CREATE"){
        clients[client_id] = {name, age, command: "_CREATE"};
        continue
    }
    if (event_type == "DELETE"){
        clients[client_id] = {command: "_DELETE"};
        continue
    }
    if (event_type == "UPDATE" ){
        if (age){
            clients[client_id].age = age;
        }
        if (name){
            clients[client_id].name = name;
        }
        if (!clients[client_id]){
            clients[client_id].command = "_UPDATE";
        }
        continue
    }
  }
  return clients
}

function generate_queries(clients) {
  queries = []
  for (const [client_id, client] of Object.entries(clients)) {
    if (client.command == "_DELETE") {
        queries.push(`DELETE FROM CLIENTS WHERE client_id=${client_id}`)
    }
  }
  return queries
}

main()
