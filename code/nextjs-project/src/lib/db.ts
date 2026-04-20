import mysql from "mysql2/promise";

const databaseHost =
  process.env.DB_HOST ||
  process.env.DBHOST ||
  process.env.MYSQL_HOST ||
  process.env.FQDN ||
  "127.0.0.1";

const databasePort = Number(
  process.env.DB_PORT ||
  process.env.DBPORT ||
  process.env.MYSQL_PORT ||
  3306
);

const db = mysql.createPool({
  host: databaseHost,
  port: databasePort,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const query = db.query.bind(db);

export default db;
