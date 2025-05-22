const express = require('express');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Register routes
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
