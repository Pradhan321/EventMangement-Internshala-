import pool from '../config/database.js';

class Registration {
  static async create(eventId, userId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check if event exists and is not in the past
      const eventQuery = `
        SELECT date_time, capacity, (SELECT COUNT(*) FROM registrations WHERE event_id = $1) as current_registrations
        FROM events 
        WHERE id = $1
      `;
      const eventResult = await client.query(eventQuery, [eventId]);
      
      if (eventResult.rows.length === 0) {
        throw new Error('Event not found');
      }

      const event = eventResult.rows[0];
      if (new Date(event.date_time) < new Date()) {
        throw new Error('Cannot register for past events');
      }

      if (event.current_registrations >= event.capacity) {
        throw new Error('Event is full');
      }

      // Check for existing registration
      const checkQuery = 'SELECT * FROM registrations WHERE event_id = $1 AND user_id = $2';
      const checkResult = await client.query(checkQuery, [eventId, userId]);
      
      if (checkResult.rows.length > 0) {
        throw new Error('User already registered for this event');
      }

      // Create registration
      const insertQuery = 'INSERT INTO registrations (event_id, user_id) VALUES ($1, $2)';
      await client.query(insertQuery, [eventId, userId]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(eventId, userId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const checkQuery = 'SELECT * FROM registrations WHERE event_id = $1 AND user_id = $2';
      const checkResult = await client.query(checkQuery, [eventId, userId]);

      if (checkResult.rows.length === 0) {
        throw new Error('User not registered for this event');
      }

      const deleteQuery = 'DELETE FROM registrations WHERE event_id = $1 AND user_id = $2';
      await client.query(deleteQuery, [eventId, userId]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export default Registration;