import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env.local first, then .env
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const poolConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  port: parseInt(process.env.MYSQL_PORT || "3306", 10),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "techneyo",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
};

let pool = null;

try {
  pool = mysql.createPool(poolConfig);
} catch (err) {
  console.error("Failed to initialize MySQL connection pool:", err.message);
}

export const query = async (sql, params = []) => {
  if (!pool) {
    throw new Error("MySQL connection pool is not configured.");
  }
  const [rows] = await pool.execute(sql, params);
  return rows;
};

export const testConnection = async () => {
  try {
    if (!pool) return { connected: false, error: "MySQL pool not initialized" };
    const [result] = await pool.query("SELECT 1 as connected");
    return { connected: true, result };
  } catch (err) {
    return { connected: false, error: err.message };
  }
};

export default pool;
