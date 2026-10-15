import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function run() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.MYSQL_HOST || "localhost",
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "techneyo_portfolio",
    });

    const [rows] = await conn.query("SELECT id, title, offer_type, status FROM offers LIMIT 5");
    console.log("Connected to MySQL! Sample offers:", rows);
    await conn.end();
  } catch (err) {
    console.error("MySQL check error:", err.message);
  }
}

run();
