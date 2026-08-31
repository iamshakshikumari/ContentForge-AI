import { neon } from "@neondatabase/serverless";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "../database.sqlite");

let useLocal = false;
let neonClient = null;

// Initialize SQLite database instance
const localDb = new sqlite3.Database(dbPath);

function queryLocal(sqlText, params = []) {
  return new Promise((resolve, reject) => {
    const trimmed = sqlText.trim();
    const isSelect = /^SELECT/i.test(trimmed);
    const hasReturning = /RETURNING/i.test(trimmed);

    if (isSelect || hasReturning) {
      localDb.all(sqlText, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    } else {
      localDb.run(sqlText, params, function (err) {
        if (err) return reject(err);
        resolve([{ id: this.lastID, changes: this.changes }]);
      });
    }
  });
}

// Ensure local tables exist
function setupLocalTables() {
  localDb.serialize(() => {
    localDb.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        google_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    localDb.run(`
      CREATE TABLE IF NOT EXISTS creations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        prompt TEXT,
        content TEXT,
        type TEXT,
        google_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
  });
}

setupLocalTables();

// Try initializing Neon if connection string is provided
if (process.env.DATABASE_URL && !process.env.FORCE_LOCAL_DB) {
  try {
    neonClient = neon(process.env.DATABASE_URL);
  } catch (e) {
    useLocal = true;
  }
} else {
  useLocal = true;
}

// Tagged template function `sql`
const sql = async (strings, ...values) => {
  if (!useLocal && neonClient) {
    try {
      return await neonClient(strings, ...values);
    } catch (neonErr) {
      console.warn("Neon DB error, falling back to local SQLite database:", neonErr.message);
      useLocal = true;
    }
  }

  // Construct parameterized SQLite query
  let sqlText = strings[0];
  const params = [];
  for (let i = 0; i < values.length; i++) {
    sqlText += "?" + strings[i + 1];
    params.push(values[i] === undefined ? null : values[i]);
  }

  return await queryLocal(sqlText, params);
};

export default sql;
