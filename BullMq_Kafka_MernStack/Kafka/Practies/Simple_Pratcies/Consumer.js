const kafka = require("./client"); // Import the Kafka client

async function init() {
  const consumer = kafka.consumer({ groupId: "user-1" }); // Create a new Kafka consumer with a unique groupId

  try {
    console.log("Connecting consumer...");
    await consumer.connect(); // Connect the consumer to Kafka
    console.log("Consumer connected successfully");

    // Subscribe to the Kafka topic "rider-updates"
    console.log("Subscribing to topic 'rider-updates'...");
    await consumer.subscribe({ topic: "rider-updates", fromBeginning: true }); // Fixed the subscription format

    // Start consuming messages
    console.log("Started consuming messages...");
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(
          `Received message from topic ${topic} [PART: ${partition}] at offset ${message.offset}: ${message.value.toString()}`
        );
        // Process the message here (e.g., update a database or perform actions)
      },
    });

  } catch (error) {
    console.error("Error occurred:", error); // Catch and log errors
  }
}

// Initialize the consumer
init().catch((error) => {
  console.error("Failed to initialize consumer:", error); // Log initialization errors
});
