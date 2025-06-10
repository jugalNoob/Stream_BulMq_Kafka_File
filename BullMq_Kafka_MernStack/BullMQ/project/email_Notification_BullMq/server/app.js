const express = require('express');
const router = require('./routes/router');
require("./db/conn");

const app = express();

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Parse JSON
app.use(express.json({ strict: true, limit: '10kb' }));

// Routes
app.use(router);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
