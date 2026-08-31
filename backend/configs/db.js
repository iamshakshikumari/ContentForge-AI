import { neon } from "@neondatabase/serverless";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

let neonClient = null;
let localDb = null;
let useLocal = false;

if (process.env.DATABASE_URL && !process.env.FORCE_LOCAL_DB) {
  try {
    neonClient = neon(process.env.DATABASE_URL);
  } catch (e) {
    useLocal = true;
  }
} else {
  useLocal = true;
}

async function getLocalDb() {
  if (localDb) return localDb;
  try {
    const sqlite3Module = await import("sqlite3");
    const sqlite3 = sqlite3Module.default || sqlite3Module;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dbPath = path.resolve(__dirname, "../database.sqlite");

    localDb = new sqlite3.Database(dbPath);
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
    return localDb;
  } catch (err) {
    console.warn("Local SQLite not loaded:", err.message);
    return null;
  }
}

async function queryLocal(sqlText, params = []) {
  const db = await getLocalDb();
  if (!db) {
    throw new Error("No database connected and local fallback is unavailable.");
  }
  return new Promise((resolve, reject) => {
    const trimmed = sqlText.trim();
    const isSelect = /^SELECT/i.test(trimmed);
    const hasReturning = /RETURNING/i.test(trimmed);

    if (isSelect || hasReturning) {
      db.all(sqlText, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    } else {
      db.run(sqlText, params, function (err) {
        if (err) return reject(err);
        resolve([{ id: this.lastID, changes: this.changes }]);
      });
    }
  });
}

// Tagged template function `sql`
const sql = async (strings, ...values) => {
  if (!useLocal && neonClient) {
    try {
      return await neonClient(strings, ...values);
    } catch (neonErr) {
      console.warn("Neon DB error, falling back to local database:", neonErr.message);
      useLocal = true;
    }
  }

  // Construct parameterized query
  let sqlText = strings[0];
  const params = [];
  for (let i = 0; i < values.length; i++) {
    sqlText += "?" + strings[i + 1];
    params.push(values[i] === undefined ? null : values[i]);
  }

  return await queryLocal(sqlText, params);
};

export default sql;
