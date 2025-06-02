const express = require('express');
const router = require('./routes/router');

require("./db/conn")
const app = express();
app.use(express.json());

// Use job routes

app.use(router)

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


//command  run only app.js and workers  emailQueue.js
// node app.js
// node workers/emailWorker.js