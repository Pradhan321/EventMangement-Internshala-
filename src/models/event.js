import pool from '../config/database.js';

class Event {
  static async create({ title, dateTime, location, capacity }) {
    const query = `
      INSERT INTO events (title, date_time, location, capacity)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    const result = await pool.query(query, [title, dateTime, location, capacity]);
    return result.rows[0].id;
  }

  static async findById(id) {
    const query = `
      SELECT e.*, 
             COALESCE(ARRAY_AGG(JSON_BUILD_OBJECT('id', u.id, 'name', u.name, 'email', u.email)) 
                      FILTER (WHERE u.id IS NOT NULL), '{}') as registered_users
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE e.id = $1
      GROUP BY e.id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findUpcoming() {
    const query = `
      SELECT * FROM events 
      WHERE date_time > NOW()
      ORDER BY date_time ASC, location ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

 static async getStats(id) {
  const query = `
    SELECT 
      e.capacity,
      COUNT(r.user_id) as total_registrations,
      e.capacity - COUNT(r.user_id) as remaining_capacity,
      ROUND(((COUNT(r.user_id)::FLOAT / e.capacity) * 100)::numeric, 2) as percentage_used
    FROM events e
    LEFT JOIN registrations r ON e.id = r.event_id
    WHERE e.id = $1
    GROUP BY e.id
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}
}

export default Event;