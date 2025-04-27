const express = require("express");
const connectDB = require("./db/conn"); // Ensure DB connection is imported
const router = require("./routes/router");

const app = express();
const port = 9000;

app.use(express.json());  // ✅ Add this line before using routes

app.use(router);

// Connect to MongoDB before starting the server
(async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`🚀 Server running on http://localhost:${port}`);
    });
})();

// Gracefully shut down server
process.on("SIGINT", async () => {
    console.log("Shutting down server...");
    process.exit(0);
});
