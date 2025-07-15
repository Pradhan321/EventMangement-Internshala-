import { Router } from 'express';
const router = Router();
import Event from '../models/event.js';
import User from '../models/user.js';
import Registration from '../models/registration.js';
import validateEvent from '../middleware/validateEvent.js';
import validateUser from '../middleware/validateUser.js';
import handleError from '../utils/errorHandler.js';

// Create event
router.post('/', validateEvent, async (req, res) => {
  try {
    const eventId = await Event.create(req.body);
    res.status(201).json({ id: eventId });
  } catch (error) {
    handleError(res, error);
  }
});

// Get event details
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    handleError(res, error);
  }
});

// Register for event
router.post('/:id/register', validateUser, async (req, res) => {
  try {
    const userId = await User.create(req.body);
    await Registration.create(req.params.id, userId);
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    handleError(res, error);
  }
});

// Cancel registration
router.delete('/:id/register', validateUser, async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await Registration.delete(req.params.id, req.body.id);
    res.json({ message: 'Registration cancelled' });
  } catch (error) {
    handleError(res, error);
  }
});

// List upcoming events
router.get('/', async (req, res) => {
  try {
    const events = await Event.findUpcoming();
    res.json(events);
  } catch (error) {
    handleError(res, error);
  }
});

// Get event stats
router.get('/:id/stats', async (req, res) => {
  try {
    const stats = await Event.getStats(req.params.id);
    if (!stats) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(stats);
  } catch (error) {
    handleError(res, error);
  }
});

export default router;