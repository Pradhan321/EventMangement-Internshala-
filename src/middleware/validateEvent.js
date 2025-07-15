const validateEvent = (req, res, next) => {
  const { title, dateTime, location, capacity } = req.body;
  
  if (!title || !dateTime || !location || !capacity) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (typeof title !== 'string' || title.length < 3) {
    return res.status(400).json({ error: 'Title must be a string with at least 3 characters' });
  }

  if (isNaN(Date.parse(dateTime))) {
    return res.status(400).json({ error: 'Invalid date format. Use ISO format' });
  }

  if (typeof location !== 'string' || location.length < 3) {
    return res.status(400).json({ error: 'Location must be a string with at least 3 characters' });
  }

  if (!Number.isInteger(capacity) || capacity <= 0 || capacity > 1000) {
    return res.status(400).json({ error: 'Capacity must be a positive integer ≤ 1000' });
  }

  next();
};

export default validateEvent;