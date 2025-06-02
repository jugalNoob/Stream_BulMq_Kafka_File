const express = require("express");
const router = express.Router();
const kafka = require("../client/client"); // Import the Kafka client

// Kafka Producer setup
let producer;

async function initProducer() {
  try {
    console.log("Connecting Kafka Producer...");
    producer = kafka.producer();
    await producer.connect();
    console.log("Kafka Producer connected successfully");
  } catch (error) {
    console.error("Error initializing Kafka Producer:", error);
  }
}

// Disconnect the producer gracefully when the server shuts down
async function disconnectProducer() {
  try {
    if (producer) {
      await producer.disconnect();
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
    // Ensure producer is ready
    if (!producer) {
      return res.status(500).json({ error: "Kafka Producer is not initialized yet" });
    }

    // Create user object
    const user = { name, email, password };

    // Send user data to Kafka topic
    await producer.send({
      topic: "UserRestapi",
      messages: [
        {
          partition:0,
          key: email, // Fix: Use email as a string key
          value: JSON.stringify(user),
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

router.get("/user-get", async (req, res) => {
  try {
    console.log("Fetching data from API...");
    const response = await fetch("https://jsonplaceholder.typicode.com/comments");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const apishow = await response.json();

    res.status(200).json({
      message: "Data fetched successfully",
      data: apishow,
    });

  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Initialize Kafka producer when the server starts
initProducer();







// Gracefully disconnect the producer when the server shuts down
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await disconnectProducer();
  process.exit(0);
});

module.exports = router;
