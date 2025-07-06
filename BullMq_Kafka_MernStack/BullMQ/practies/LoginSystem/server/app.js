const express = require('express');
const cors = require('cors');
const router = require('./routes/router');  // Assuming router handles your /form route
require("./conn/db");

const app = express();
const PORT = 9000;

const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from your React app
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true, // Allow cookies if needed
};

app.use(express.json());
app.use(cors(corsOptions)); // Enable CORS
app.use(router); // Router to handle API routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// First run the run redis server in docker  

// .. port :: 6379

// check workers running  

// nodemon works.js

// check Job id number and delete existing 

// nodemon job.js 