import express, { json } from 'express';
import eventRoutes from './routes/events.js';

const app = express();

app.use(json());
app.use('/api/events', eventRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;