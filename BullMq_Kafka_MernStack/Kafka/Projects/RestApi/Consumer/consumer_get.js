const kafka = require("../Clients/client");
const Register = require("../models/student");
require('dotenv').config();

const connectDB = require("../db/conn");

async function init() {
  const consumer = kafka.consumer({ groupId: "user-1" }); // Kafka consumer with a unique groupId

  try {
    console.log("Connecting consumer...");
    await consumer.connect(); // Connect to Kafka
    console.log("Consumer connected successfully");

    console.log("Subscribing to topic 'rider-updates'...");
    await consumer.subscribe({ topic: "rider-updates", fromBeginning: true });

    console.log("Started consuming messages...");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const messageString = message.value.toString(); // Convert message value to string

          // Check if the message is empty
          if (!messageString || messageString.trim() === "") {
            console.warn("Received empty message, skipping...");
            return; // Skip processing if the message is empty
          }

          let orderData;
          try {
            orderData = JSON.parse(messageString); // Parse JSON string into object
          } catch (err) {
            console.error("Error parsing JSON:", err.message);
            return; // Skip processing if JSON is invalid
          }

          console.log(`Received order data: ${JSON.stringify(orderData)}`);

          if (Array.isArray(orderData)) {
            // Bulk insert for array of orders
            await Register.insertMany(orderData);
            console.log('Bulk orders saved to MongoDB:', orderData);
          } else {
            // Single document insert
            const order = await Register.find(orderData);
            console.log('Order saved to MongoDB:', order);
          }
        } catch (err) {
          if (err.code === 11000) {
            console.error('Duplicate key error:', err.message);
          } else {
            console.error('Error processing message:', err);
          }
        }
      },
    });
  } catch (error) {
    console.error("Error occurred during consumer initialization:", error);
  }
}

// Initialize the consumer
(async () => {
  try {
    await connectDB(); // Ensure database connection is established first
    await init(); // Start Kafka consumer after DB is connected
  } catch (error) {
    console.error("Error starting consumer:", error);
  }
})();
