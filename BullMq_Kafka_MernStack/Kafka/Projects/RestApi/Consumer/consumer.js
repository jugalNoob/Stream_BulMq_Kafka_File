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
          const orderData = JSON.parse(message.value.toString());
          console.log(`Received order data: ${JSON.stringify(orderData)}`);

          // Handle single or multiple documents
          if (Array.isArray(orderData)) {
            // Bulk insert
            await Register.insertMany(orderData);
            console.log('Bulk orders saved to MongoDB:', orderData);
          } else {
            // Single insert
            const order = new Register(orderData);
            await order.save();
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
    console.error("Error occurred:", error); // Log errors
  }
}

// Initialize the consumer
(async () => {
  // Ensure database connection is established first
  await connectDB();

  // Start Kafka consumer after DB is connected
  init();
})();

// {"name":"kanika sharma ",
//   "email":"kanika@gmail.com",
//   "password":"fuckionknaika",
//   "shortId":"8ZA1P3lFT"}