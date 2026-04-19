import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.FQDN,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
