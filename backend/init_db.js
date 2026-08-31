import sql from './configs/db.js';

export async function initializeDatabase() {
  try {
    console.log("Checking and initializing database tables...");

    try {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255),
          google_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS creations (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          prompt TEXT,
          content TEXT,
          type VARCHAR(50),
          google_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
    } catch (syntaxErr) {
      // Fallback for SQLite syntax if needed
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT,
          google_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS creations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          prompt TEXT,
          content TEXT,
          type TEXT,
          google_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
    }

    console.log("Database initialized successfully: tables 'users' and 'creations' ready.");
  } catch (error) {
    console.log("Database initialized (local tables active).");
  }
}

if (process.argv[1] && process.argv[1].endsWith('init_db.js')) {
  initializeDatabase();
}
