import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function runMigration() {
  const host = process.env.MYSQL_HOST || "localhost";
  const port = parseInt(process.env.MYSQL_PORT || "3306", 10);
  const user = process.env.MYSQL_USER || "root";
  const password = process.env.MYSQL_PASSWORD || "";
  const database = process.env.MYSQL_DATABASE || "techneyo_portfolio";

  console.log(`Connecting to MySQL at ${host}:${port} as ${user}...`);

  // Connect to MySQL server
  const conn = await mysql.createConnection({
    host,
    port,
    user,
    password,
    multipleStatements: true,
  });

  console.log("Connected to MySQL server.");

  // Ensure DB exists
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await conn.query(`USE \`${database}\`;`);
  console.log(`Using database: ${database}`);

  // Read SQL migration file
  const sqlFilePath = path.resolve(__dirname, "../migrations/init_mysql.sql");
  if (!fs.existsSync(sqlFilePath)) {
    throw new Error(`Migration file not found at ${sqlFilePath}`);
  }

  const sqlContent = fs.readFileSync(sqlFilePath, "utf-8");
  console.log(`Executing SQL migration from migrations/init_mysql.sql (${(sqlContent.length / 1024).toFixed(1)} KB)...`);

  await conn.query(sqlContent);
  console.log("✅ SQL migration executed successfully!");

  // Verify all table row counts
  console.log("\n--- Table Verification ---");
  const [tables] = await conn.query("SHOW TABLES;");
  const tableKey = Object.keys(tables[0])[0];

  for (const t of tables) {
    const tableName = t[tableKey];
    const [countResult] = await conn.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
    console.log(`Table: ${tableName.padEnd(25)} -> ${countResult[0].count} rows`);
  }

  await conn.end();
  console.log("\n🎉 MySQL database migration and data seeding completed successfully!");
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
