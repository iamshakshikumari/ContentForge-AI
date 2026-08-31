import sql from "../configs/db.js";

export async function insertUser({ full_name, email, password, google_id }) {
  const response = await sql`
    INSERT INTO users (full_name, email, password, google_id)
    VALUES (${full_name}, ${email}, ${password}, ${google_id})
    RETURNING id, full_name, email, google_id;
  `;
  return response[0];
}

export async function findUserByEmail(email) {
  const response = await sql`SELECT * FROM users WHERE email = ${email}`;
  return response[0];
}

export async function findUserByGoogleId(google_id) {
  const response = await sql`SELECT * FROM users WHERE google_id = ${google_id}`;
  return response[0];
}