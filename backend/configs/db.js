import { neon } from "@neondatabase/serverless";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

function getDbUrl() {
  const raw = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || "";
  return raw.trim().replace(/^["']|["']$/g, '');
}

function getNeonClient() {
  const dbUrl = getDbUrl();
  if (!dbUrl || process.env.FORCE_LOCAL_DB) {
    return null;
  }
  try {
    return neon(dbUrl);
  } catch (err) {
    console.error("Failed to initialize Neon client:", err.message);
    return null;
  }
}

let localDb = null;

async function getLocalDb() {
  if (localDb) return localDb;
  try {
    const sqlite3Module = await import("sqlite3");
    const sqlite3 = sqlite3Module.default || sqlite3Module;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dbPath = path.resolve(__dirname, "../database.sqlite");

    localDb = new sqlite3.Database(dbPath);
    return localDb;
  } catch (err) {
    console.warn("Local SQLite not loaded:", err.message);
    return null;
  }
}

async function queryLocal(sqlText, params = []) {
  const db = await getLocalDb();
  if (!db) {
    throw new Error("No database connected and local SQLite fallback is unavailable on this system.");
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
  const neonClient = getNeonClient();

  if (neonClient) {
    try {
      return await neonClient(strings, ...values);
    } catch (neonErr) {
      const dbUrl = getDbUrl();
      const masked = dbUrl.replace(/:([^:@]+)@/, (match, pwd) => {
        if (pwd.length <= 6) return ':***@';
        return `:${pwd.slice(0, 5)}...${pwd.slice(-3)}@`;
      });
      console.warn(`Neon DB error connecting with user [${masked}]:`, neonErr.message);
    }
  }

  // Construct parameterized SQLite query fallback
  let sqlText = strings[0];
  const params = [];
  for (let i = 0; i < values.length; i++) {
    sqlText += "?" + strings[i + 1];
    params.push(values[i] === undefined ? null : values[i]);
  }

  return await queryLocal(sqlText, params);
};

export default sql;
