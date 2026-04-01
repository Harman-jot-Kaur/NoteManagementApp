"use strict";

require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "notes_management_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verify connection at start-up
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Connected to MySQL database.");
    conn.release();
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
    process.exit(1);
  }
})();

module.exports = pool;
