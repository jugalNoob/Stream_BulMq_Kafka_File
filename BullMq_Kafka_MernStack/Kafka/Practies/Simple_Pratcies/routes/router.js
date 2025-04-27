const express = require("express");
const router = new express.Router();
const kafka = require("../client"); // Import the Kafka client

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

// Disconnect the producer gracefully when the server shuts down
async function disconnectProducer() {
  try {
    if (producer) {
      await producer.disconnect(); // Disconnect the producer
      console.log("Kafka Producer disconnected successfully");
    }
  } catch (error) {
    console.error("Error disconnecting Kafka Producer:", error);
  }
}

// REST API to create a user and send data to Kafka
router.post("/create-user", async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  try {
    // Create user object
    const user = { name, email, password };

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
      message: "User created and sent to Kafka successfully",
      user,
    });
  } catch (error) {
    console.error("Error sending user data to Kafka:", error);
    res.status(500).json({ error: "Failed to send user data to Kafka" });
  }
});

// Initialize Kafka producer when the server starts
initProducer();

// Gracefully disconnect the producer when the server shuts down
process.on('SIGINT', async () => {
  console.log("Shutting down server...");
  await disconnectProducer();
  process.exit(0);
});

module.exports = router;
