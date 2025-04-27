const express = require("express");
const router = new express.Router();
const mongoose = require("mongoose");
const kafka = require("../client"); // Import the Kafka client

// MongoDB User model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", userSchema);

// Kafka Producer setup
let producer;

async function initProducer() {
  try {
    console.log("Connecting Kafka Producer...");
    producer = kafka.producer(); // Create a Kafka producer
    await producer.connect(); // Connect the producer
    console.log("Kafka Producer connected successfully");
  } catch (error) {
    console.error("Error initializing Kafka Producer:", error);
  }
}

// MongoDB Connection
async function connectMongoDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/mydb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Disconnect MongoDB gracefully
async function disconnectMongoDB() {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
}

// REST API to create a user, store in MongoDB, and send data to Kafka
router.post("/create-user", async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  try {
    // Create user object
    const user = new User({ name, email, password });

    // Save user data to MongoDB
    await user.save();
    console.log("User saved to MongoDB:", user);

    // Send user data to Kafka topic
    await producer.send({
      topic: "rider-updates", // Kafka topic name
      messages: [
        {
          key: email, // Using email as the key for ordering
          value: JSON.stringify(user), // Serialize user object
        },
      ],
    });

    console.log("Message sent successfully:", user);
    res.status(201).json({
      message: "User created, stored in MongoDB, and sent to Kafka successfully",
      user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Initialize Kafka producer and MongoDB connection when the server starts
initProducer();
connectMongoDB();

// Gracefully disconnect both producer and MongoDB when the server shuts down
process.on('SIGINT', async () => {
  console.log("Shutting down server...");
  await disconnectProducer();
  await disconnectMongoDB();
  process.exit(0);
});

module.exports = router;
