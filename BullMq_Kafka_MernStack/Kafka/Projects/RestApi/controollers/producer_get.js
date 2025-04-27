const kafka = require("../Clients/client");
const shortid = require('shortid'); // Import shortid library

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

exports.Get = async (req, res) => {
  const { name, email, password } = req.body;


  // Create user object
  const user = { name, email, password };

  try {
    // Send user data to Kafka topic
    console.log('json one')
    const serializedUser = JSON.stringify(user);
    await producer.send({
      topic: "rider-updates",
      messages: [
        {
          key: email, // Key for message partitioning
          value: serializedUser, // Serialize user object to JSON string
        },
      ],
    });
    console.log('json to')

    console.log("Message sent successfully:", user);
    res.status(201).json({
      message: "User created and sent to Kafka successfully",
      user,
    });
  } catch (error) {
    console.error("Error sending user data to Kafka:", error);
    res.status(500).json({ error: "Failed to send user data to Kafka with get data" });
  }
};

// Initialize Kafka producer when the server starts
initProducer();

// Gracefully disconnect the producer when the server shuts down
process.on('SIGINT', async () => {
  console.log("Shutting down server...");
  if (producer) await producer.disconnect();
  process.exit(0);
});
