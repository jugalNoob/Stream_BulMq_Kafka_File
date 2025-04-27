const kafka = require("../client/client") // Import Kafka client

async function initConsumer() {
  const consumer = kafka.consumer({ groupId: "user-1" });

  try {
    console.log("Connecting Kafka Consumer...");
    await consumer.connect();
    console.log("Consumer connected successfully");

    await consumer.subscribe({ topic: "UserRestapi", fromBeginning: true });

    console.log("Started consuming messages...");
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          console.log(
            `Received message from ${topic} [PART: ${partition}] at offset ${message.offset}: ${message.value.toString()}`
          );
        } catch (err) {
          console.error("Error processing message:", err);
        }
      },
    });

    // Handle graceful shutdown
    process.on("SIGINT", async () => {
      console.log("Shutting down consumer...");
      await consumer.disconnect();
      console.log("Consumer disconnected");
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("Consumer shutting down...");
      await consumer.disconnect();
      process.exit(0);
    });

  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// Start the Kafka consumer
initConsumer().catch((error) => {
  console.error("Failed to initialize consumer:", error);
});
