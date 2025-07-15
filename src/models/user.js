import pool from '../config/database.js';

class User {
  static async create({ name, email }) {
    const query = `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      ON CONFLICT (email) DO UPDATE 
      SET name = EXCLUDED.name
      RETURNING id
    `;
    const result = await pool.query(query, [name, email]);
    return result.rows[0].id;
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export default User;